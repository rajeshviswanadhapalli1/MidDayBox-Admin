import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import api from '../utils/axios';
import { setLoading, setError, clearError } from '../store/slices/apiSlice';

export const useApi = () => {
  const [localLoading, setLocalLoading] = useState(false);
  const dispatch = useDispatch();

  const makeRequest = useCallback(async (config, showGlobalLoading = false) => {
    try {
      if (showGlobalLoading) {
        dispatch(setLoading(true));
      } else {
        setLocalLoading(true);
      }
      dispatch(clearError());

      const response = await api(config);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      if (showGlobalLoading) {
        dispatch(setLoading(false));
      } else {
        setLocalLoading(false);
      }
    }
  }, [dispatch]);

  return {
    makeRequest,
    loading: localLoading,
  };
}; 