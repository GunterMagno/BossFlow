import axios from 'axios';

// En desarrollo: si defines VITE_API_URL (por ejemplo http://localhost:5000)
// se usará como base absoluta. En producción queremos rutas relativas
// para que el proxy (Nginx) maneje /api. Por eso la convención:
// - VITE_API_URL= (no definido)  -> base '/api' (rutas relativas al host)
// - VITE_API_URL=http://host:port -> base absoluta hacia el backend
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
    // Agregar token de autenticación si existe
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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Detectar si el token ha expirado (401 Unauthorized)
    if (error.response && error.response.status === 401) {
      const errorMessage = error.response.data?.error || '';

      // Si el error indica que el token es inválido o expirado
      if (errorMessage.includes('Token inválido') || errorMessage.includes('expirado')) {
        // Limpiar localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Emitir evento personalizado para que AuthContext lo detecte
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

export const healthCheck = async () => {
  try {
    // Si baseURL ya apunta a '/api', solicitamos solo '/health' para
    // evitar '/api/api/health'. Si baseURL es absoluto (ej. http://host:5000)
    // esto hará petición a http://host:5000/health.
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;
