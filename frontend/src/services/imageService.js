import api from './api';

/**
 * Deletes an image from the server.
 * Only deletes local images (URLs starting with /uploads/).
 * @async
 * @param {string} imageUrl - URL of the image to delete (relative or absolute).
 * @returns {Promise<Object>} Deletion confirmation response.
 * @throws {Error} If the request fails.
 */
export const deleteImage = async (imageUrl) => {
  try {
    if (imageUrl.startsWith('/uploads/')) {
      const response = await api.delete('/images', {
        data: { url: imageUrl }
      });
      return response.data;
    }
    return { message: 'External URL, not deleted from server' };
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};
