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

/**
 * Exporta todos los datos personales del usuario en formato JSON.
 * @async
 * @returns {Promise<Blob>} Archivo JSON con los datos del usuario.
 * @throws {Error} Si falla la solicitud.
 */
export const exportUserData = async () => {
  try {
    const response = await api.get('/profile/data-export', {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error('Error al exportar datos:', error);
    throw error;
  }
};

/**
 * Elimina permanentemente la cuenta del usuario.
 * @async
 * @param {string} confirmPassword - Contraseña para confirmar la eliminación.
 * @returns {Promise<Object>} Respuesta con confirmación de eliminación.
 * @throws {Error} Si falla la solicitud.
 */
export const deleteAccount = async (confirmPassword) => {
  try {
    const response = await api.delete('/profile/account', {
      data: { confirmPassword },
    });
    return response.data;
  } catch (error) {
    console.error('Error al eliminar cuenta:', error);
    throw error;
  }
};
