"use client";

import { Provider } from 'react-redux';
import { store } from './store';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <Toaster position="top-right" toastOptions={{
        duration: 3000,
        style: { fontSize: '14px' },
        success: { iconTheme: { primary: '#16a34a', secondary: 'white' } },
        error: { iconTheme: { primary: '#dc2626', secondary: 'white' } },
      }} />
      {children}
    </Provider>
  );
} 