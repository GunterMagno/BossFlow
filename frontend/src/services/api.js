import axios from 'axios';

/**
 * Configuration of the base URL for API requests.
 * In development, VITE_API_URL can be used for an absolute URL.
 * In production, relative paths are used so that the proxy (Nginx) handles /api.
 */
const baseURL = import.meta.env.VITE_API_URL || '/api';

/**
 * Axios instance with default configuration.
 */
const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor to add authentication token.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor to handle authentication errors.
 * If the token expires (401), an event is emitted and localStorage is cleared.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const errorMessage = error.response.data?.error || '';

      if (errorMessage.includes('Invalid token') || errorMessage.includes('expired')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        window.dispatchEvent(new Event('token-expired'));

        console.warn('Token expired. Session closed automatically.');
      }
    }

    if (error.response) {
      console.error('Server error:', error.response.data);
    } else if (error.request) {
      console.error('No response from server');
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * Realiza una verificación de salud del servidor.
 * @async
 * @returns {Promise<Object>} Datos de salud del servidor.
 * @throws {Error} Si falla la conexión al servidor.
 */
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;
