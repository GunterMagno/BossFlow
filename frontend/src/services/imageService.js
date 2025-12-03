import api from './api';

/**
 * Eliminar una imagen del servidor
 * @param {string} imageUrl - URL de la imagen a eliminar (puede ser relativa o absoluta)
 */
export const deleteImage = async (imageUrl) => {
  try {
    // Solo eliminar si es una imagen local (no URL externa)
    if (imageUrl.startsWith('/uploads/')) {
      const response = await api.delete('/images', {
        data: { url: imageUrl }
      });
      return response.data;
    }
    // Si es URL externa, no hacer nada
    return { message: 'URL externa, no se elimina del servidor' };
  } catch (error) {
    console.error('Error al eliminar imagen:', error);
    throw error;
  }
};
