import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import api, { API_BASE_URL } from '../../utils/axios';
import * as tokenStorage from '../../utils/tokenStorage';

const getInitialAuth = () => {
  const user = tokenStorage.getUser();
  const token = tokenStorage.getAccessToken();
  const hasSession = tokenStorage.hasSession();
  return {
    user,
    token,
    isAuthenticated: hasSession,
  };
};

const initialAuth = getInitialAuth();

// Restore session on app load using refresh token
export const initializeAuth = createAsyncThunk(
  'auth/initializeAuth',
  async (_, { rejectWithValue }) => {
    const refreshToken = tokenStorage.getRefreshToken();
    const accessToken = tokenStorage.getAccessToken();

    if (!refreshToken && !accessToken) {
      return { user: null, token: null, authenticated: false };
    }

    if (refreshToken) {
      try {
        const response = await axios.post(`${API_BASE_URL}/admin/refresh`, {
          refreshToken,
        });
        const data = response.data;
        const newAccess = data.accessToken || data.token;
        tokenStorage.saveTokens({
          accessToken: newAccess,
          refreshToken: data.refreshToken,
        });
        if (data.user) {
          tokenStorage.saveUser(data.user);
        }
        return {
          user: data.user || tokenStorage.getUser(),
          token: newAccess,
          authenticated: true,
        };
      } catch (error) {
        tokenStorage.clearSession();
        return rejectWithValue(
          error.response?.data?.message || 'Session expired'
        );
      }
    }

    return {
      user: tokenStorage.getUser(),
      token: accessToken,
      authenticated: true,
    };
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/admin/login', credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed'
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    const refreshToken = tokenStorage.getRefreshToken();
    try {
      if (refreshToken) {
        await api.post('/admin/logout', { refreshToken });
      }
    } catch (error) {
      // Still clear local session even if server logout fails
      if (!refreshToken) {
        return rejectWithValue('Logout failed');
      }
    } finally {
      tokenStorage.clearSession();
    }
    return null;
  }
);

export const getUserProfile = createAsyncThunk(
  'auth/getUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/profile');
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to get user profile');
    }
  }
);

const initialState = {
  user: initialAuth.user,
  token: initialAuth.token,
  isAuthenticated: initialAuth.isAuthenticated,
  sessionReady: false,
  loading: true,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload || !!tokenStorage.getRefreshToken();

      if (!action.payload) {
        state.user = null;
        state.isAuthenticated = false;
        tokenStorage.clearSession();
      } else {
        tokenStorage.saveTokens({ accessToken: action.payload });
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.sessionReady = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = action.payload.authenticated;
        state.error = null;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.loading = false;
        state.sessionReady = true;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.sessionReady = true;
        const payload = action.payload;
        const accessToken = payload.accessToken || payload.token;
        const refreshToken = payload.refreshToken;

        state.user = payload.user;
        state.token = accessToken;
        state.isAuthenticated = true;
        state.error = null;

        tokenStorage.saveTokens({ accessToken, refreshToken });
        tokenStorage.saveUser(payload.user);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        const profile = action.payload?.user || action.payload;
        state.user = profile;
        if (profile) {
          tokenStorage.saveUser(profile);
        }
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setToken } = authSlice.actions;
export default authSlice.reducer;
