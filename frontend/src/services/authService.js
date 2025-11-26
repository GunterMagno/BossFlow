import api from './api';

/**
 * Servicio de autenticación
 * Maneja las peticiones HTTP relacionadas con login y registro
 */
export const authService = {
  /**
   * Iniciar sesión
   * @param {string} email - Correo electrónico del usuario
   * @param {string} password - Contraseña del usuario
   * @param {boolean} rememberMe - Si se debe mantener la sesión por más tiempo
   * @returns {Promise<Object>} Datos del usuario y token
   */
  login: async (email, password, rememberMe = false) => {
    const response = await api.post('/auth/login', { email, password, rememberMe });
    return response.data;
  },

  /**
   * Registrar nuevo usuario
   * @param {string} username - Nombre de usuario
   * @param {string} email - Correo electrónico
   * @param {string} password - Contraseña
   * @param {boolean} rememberMe - Si se debe mantener la sesión por más tiempo
   * @returns {Promise<Object>} Datos del usuario y token
   */
  register: async (username, email, password, rememberMe = false) => {
    const response = await api.post('/auth/register', {
      username,
      email,
      password,
      rememberMe,
    });
    return response.data;
  },
};

export default authService;
