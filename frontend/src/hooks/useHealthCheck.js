import { useState, useEffect } from 'react';
import { healthCheck } from '../services/api';

/**
 * Custom hook to check backend connection health.
 * Performs an availability check when the component mounts.
 * @returns {Object} Object with connection status (loading, data, error, isConnected)
 */
export const useHealthCheck = () => {
  const [status, setStatus] = useState({
    loading: true,
    data: null,
    error: null,
    isConnected: false,
  });

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const data = await healthCheck();
        setStatus({
          loading: false,
          data,
          error: null,
          isConnected: true,
        });
      } catch (error) {
        setStatus({
          loading: false,
          data: null,
          error: error.message || 'Error al conectar con el backend',
          isConnected: false,
        });
      }
    };

    checkHealth();
  }, []);

  return status;
};