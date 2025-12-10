import axios from 'axios';

/**
 * Configuración de la URL base para las solicitudes de la API.
 * En desarrollo se puede usar VITE_API_URL para una URL absoluta.
 * En producción se usa rutas relativas para que el proxy (Nginx) maneje /api.
 */
const baseURL = import.meta.env.VITE_API_URL || '/api';

/**
 * Instancia de Axios con configuración por defecto.
 */
const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor de solicitudes para agregar el token de autenticación.
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
 * Interceptor de respuestas para manejar errores de autenticación.
 * Si el token expira (401), se emite un evento y se limpia localStorage.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const errorMessage = error.response.data?.error || '';

      if (errorMessage.includes('Token inválido') || errorMessage.includes('expirado')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        window.dispatchEvent(new Event('token-expired'));

        console.warn('Token expirado. Sesión cerrada automáticamente.');
      }
    }

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
