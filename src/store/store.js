import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import apiReducer from './slices/apiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    api: apiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
}); 