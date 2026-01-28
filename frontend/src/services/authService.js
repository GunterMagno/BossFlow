import api from './api';

/**
 * Authentication service
 * Handles HTTP requests related to login and registration
 */
export const authService = {
  /**
   * Log in
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @param {boolean} rememberMe - Whether to keep the session for a longer time
   * @returns {Promise<Object>} User data and token
   */
  login: async (email, password, rememberMe = false) => {
    const response = await api.post('/auth/login', { email, password, rememberMe });
    return response.data;
  },

  /**
   * Register new user
   * @param {string} username - Username
   * @param {string} email - Email address
   * @param {string} password - Password
   * @param {boolean} rememberMe - Whether to keep the session for a longer time
   * @returns {Promise<Object>} User data and token
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
