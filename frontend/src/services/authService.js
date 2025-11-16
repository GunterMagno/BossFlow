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
   * @returns {Promise<Object>} Datos del usuario y token
   */
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },

  /**
   * Registrar nuevo usuario
   * @param {string} username - Nombre de usuario
   * @param {string} email - Correo electrónico
   * @param {string} password - Contraseña
   * @returns {Promise<Object>} Datos del usuario y token
   */
  register: async (username, email, password) => {
    const response = await api.post('/api/auth/register', {
      username,
      email,
      password,
    });
    return response.data;
  },
};

export default authService;
