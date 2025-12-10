import { useState, useEffect } from 'react';
import { healthCheck } from '../services/api';

/**
 * Hook personalizado para verificar la salud de la conexión con el backend
 * Realiza un chequeo de disponibilidad al montarse el componente
 * @returns {Object} Objeto con el estado de la conexión (loading, data, error, isConnected)
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