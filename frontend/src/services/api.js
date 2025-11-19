import axios from 'axios';

// En desarrollo: usa variable de entorno o localhost:5000
// En producción (Docker): usa /api (proxy de Nginx)
const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('Error del servidor:', error.response.data);
    } else if (error.request) {
      console.error('Sin respuesta del servidor');
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const healthCheck = async () => {
  try {
    const response = await api.get('/api/health');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;