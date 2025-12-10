import api from './api';

/**
 * Obtiene el perfil del usuario autenticado.
 * @async
 * @returns {Promise<Object>} Respuesta con los datos del perfil del usuario.
 * @throws {Error} Si falla la solicitud.
 */
export const getProfile = async () => {
  try {
    const response = await api.get('/profile');
    return response.data;
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    throw error;
  }
};

/**
 * Actualiza el perfil del usuario autenticado.
 * @async
 * @param {Object} profileData - Nuevos datos del perfil.
 * @returns {Promise<Object>} Respuesta con los datos del perfil actualizado.
 * @throws {Error} Si falla la solicitud.
 */
export const updateProfile = async (profileData) => {
  try {
    const response = await api.put('/profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    throw error;
  }
};

/**
 * Obtiene las estadísticas del usuario autenticado.
 * @async
 * @returns {Promise<Object>} Respuesta con las estadísticas del usuario.
 * @throws {Error} Si falla la solicitud.
 */
export const getStats = async () => {
  try {
    const response = await api.get('/profile/stats');
    return response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    throw error;
  }
};
