import axios from 'axios';
import * as tokenStorage from './tokenStorage';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://api.middaybox.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

function applyRefreshedTokens(response) {
  const headers = response?.headers || {};
  const data = response?.data || {};

  const refreshed =
    headers['x-token-refreshed'] === 'true' || data.tokenRefreshed === true;

  if (!refreshed) return;

  const accessToken =
    headers['x-access-token'] || data.accessToken || data.token;
  const refreshToken = headers['x-refresh-token'] || data.refreshToken;

  if (accessToken || refreshToken) {
    tokenStorage.saveTokens({ accessToken, refreshToken });
  }
}

function shouldForceLogout(error) {
  const code = error.response?.data?.code;
  return code === 'INVALID_REFRESH_TOKEN' || code === 'REFRESH_TOKEN_EXPIRED';
}

function redirectToLogin() {
  if (typeof window === 'undefined') return;
  if (window.location.pathname.includes('/login')) return;
  window.location.href = '/login';
}

api.interceptors.request.use(
  (config) => {
    const accessToken = tokenStorage.getAccessToken();
    const refreshToken = tokenStorage.getRefreshToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    if (refreshToken) {
      config.headers['X-Refresh-Token'] = refreshToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    applyRefreshedTokens(response);
    return response;
  },
  async (error) => {
    const original = error.config;

    if (!original) {
      return Promise.reject(error);
    }

    if (shouldForceLogout(error)) {
      tokenStorage.clearSession();
      redirectToLogin();
      return Promise.reject(error);
    }

    const code = error.response?.data?.code;

    if (code === 'TOKEN_EXPIRED' && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((accessToken) => {
          original.headers.Authorization = `Bearer ${accessToken}`;
          const refreshToken = tokenStorage.getRefreshToken();
          if (refreshToken) {
            original.headers['X-Refresh-Token'] = refreshToken;
          }
          return api(original);
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const storedRefresh = tokenStorage.getRefreshToken();
        if (!storedRefresh) {
          throw error;
        }

        const { data } = await refreshClient.post('/admin/refresh', {
          refreshToken: storedRefresh,
        });

        const accessToken = data.accessToken || data.token;
        tokenStorage.saveTokens({
          accessToken,
          refreshToken: data.refreshToken,
        });

        processQueue(null, accessToken);
        original.headers.Authorization = `Bearer ${accessToken}`;
        if (data.refreshToken) {
          original.headers['X-Refresh-Token'] = data.refreshToken;
        }
        return api(original);
      } catch (refreshError) {
        processQueue(refreshError, null);
        tokenStorage.clearSession();
        redirectToLogin();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const status = error.response?.status;
    const isAuthRoute =
      original.url?.includes('/admin/login') ||
      original.url?.includes('/admin/refresh');

    if (
      status === 401 &&
      !isAuthRoute &&
      code !== 'TOKEN_EXPIRED' &&
      !tokenStorage.getRefreshToken()
    ) {
      tokenStorage.clearSession();
      redirectToLogin();
    }

    return Promise.reject(error);
  }
);

export default api;
