import api from '../utils/axios';

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/admin/login', credentials),
  logout: () => api.post('/admin/logout'),
  getProfile: () => api.get('/admin/profile'),
};

// Stats API
export const statsAPI = {
  getStats: () => api.get('/admin/stats'),
  getDashboardData: () => api.get('/admin/dashboard'),
};

// Users API
export const usersAPI = {
  getDeliveryBoys: (params) => api.get('/admin/delivery-boys', { params }),
  getParents: (params) => api.get('/admin/parents', { params }),
  createDeliveryBoy: (data) => api.post('/admin/delivery-boys', data),
  createParent: (data) => api.post('/admin/parents', data),
  updateDeliveryBoy: (id, data) => api.put(`/admin/delivery-boys/${id}`, data),
  updateParent: (id, data) => api.put(`/admin/parents/${id}`, data),
  deleteDeliveryBoy: (id) => api.delete(`/admin/delivery-boys/${id}`),
  deleteParent: (id) => api.delete(`/admin/parents/${id}`),
};

// Orders API
export const ordersAPI = {
  getOrders: (params) => api.get('/admin/orders', { params }),
  getOrder: (id) => api.get(`/admin/orders/${id}`),
  updateOrderStatus: (id, status) => api.patch(`/admin/orders/${id}/status`, { status }),
  exportOrders: (params) => api.get('/admin/orders/export', { 
    params,
    responseType: 'blob'
  }),
};

// Pricing API
export const pricingAPI = {
  getPricing: () => api.get('/admin/pricing'),
  updatePricing: (data) => api.patch('/admin/pricing', data),
  calculatePrice: (distance) => api.post('/admin/pricing/calculate', { distance }),
};

// Schools API
export const schoolsAPI = {
  getSchools: () => api.get('/admin/schools'),
  createSchool: (data) => api.post('/admin/schools', data),
  updateSchool: (id, data) => api.put(`/admin/schools/${id}`, data),
  deleteSchool: (id) => api.delete(`/admin/schools/${id}`),
};

// School payment API – admin (schoolPaymentPercent from pricing)
export const schoolPaymentAPI = {
  getPendingSchoolPayments: (params) =>
    api.get('/admin/pending-school-payments', { params }),
  recordSchoolPayment: (payload) =>
    api.post('/admin/record-school-payment', payload),
};

// Admin transactions (parent + school)
export const transactionsAPI = {
  getTransactions: (params) =>
    api.get('/admin/transactions', { params }),
};

// Generic API helper
export const apiHelper = {
  handleResponse: (response) => response.data,
  handleError: (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    }
    throw error;
  },
}; 