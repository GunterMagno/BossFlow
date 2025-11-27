import api from './api';

// Obtener perfil del usuario autenticado
export const getProfile = async () => {
  try {
    const response = await api.get('/profile');
    return response.data;
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    throw error;
  }
};

// Actualizar perfil del usuario
export const updateProfile = async (profileData) => {
  try {
    const response = await api.put('/profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    throw error;
  }
};

// Obtener estadísticas del usuario
export const getStats = async () => {
  try {
    const response = await api.get('/profile/stats');
    return response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    throw error;
  }
};
