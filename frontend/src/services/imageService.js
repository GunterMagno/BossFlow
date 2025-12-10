import api from './api';

/**
 * Elimina una imagen del servidor.
 * Solo elimina imágenes locales (URLs que comienzan con /uploads/).
 * @async
 * @param {string} imageUrl - URL de la imagen a eliminar (relativa o absoluta).
 * @returns {Promise<Object>} Respuesta de confirmación de eliminación.
 * @throws {Error} Si falla la solicitud.
 */
export const deleteImage = async (imageUrl) => {
  try {
    if (imageUrl.startsWith('/uploads/')) {
      const response = await api.delete('/images', {
        data: { url: imageUrl }
      });
      return response.data;
    }
    return { message: 'URL externa, no se elimina del servidor' };
  } catch (error) {
    console.error('Error al eliminar imagen:', error);
    throw error;
  }
};
