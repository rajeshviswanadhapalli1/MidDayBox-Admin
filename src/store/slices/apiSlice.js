import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  error: null,
  stats: {
    orders: 0,
    users: 0,
    schools: 0,
    activeOrders: 0,
    completedOrders: 0,
    todayOrders: 0,
  },
  users: {
    parents: [],
    deliveryBoys: [],
    totalParents: 0,
    totalDeliveryBoys: 0,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
      totalItems: 0,
      itemsPerPage: 10,
      showingFrom: 1,
      showingTo: 10,
    },
    loading: false,
    error: null,
  },
  orders: {
    orders: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalOrders: 0,
      hasNextPage: false,
      hasPrevPage: false,
      itemsPerPage: 10,
      showingFrom: 1,
      showingTo: 10,
    },
    loading: false,
    error: null,
  },
  prices: [],
};

const apiSlice = createSlice({
  name: 'api',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload };
    },
    setUsers: (state, action) => {
      state.users = { ...state.users, ...action.payload };
    },
    setUsersLoading: (state, action) => {
      state.users.loading = action.payload;
    },
    setUsersError: (state, action) => {
      state.users.error = action.payload;
    },
    clearUsersError: (state) => {
      state.users.error = null;
    },
    setOrders: (state, action) => {
      state.orders = { ...state.orders, ...action.payload };
    },
    setOrdersLoading: (state, action) => {
      state.orders.loading = action.payload;
    },
    setOrdersError: (state, action) => {
      state.orders.error = action.payload;
    },
    clearOrdersError: (state) => {
      state.orders.error = null;
    },
    setPrices: (state, action) => {
      state.prices = action.payload;
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setStats,
  setUsers,
  setUsersLoading,
  setUsersError,
  clearUsersError,
  setOrders,
  setOrdersLoading,
  setOrdersError,
  clearOrdersError,
  setPrices,
} = apiSlice.actions;

export default apiSlice.reducer; 