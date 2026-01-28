import api from './api';

/**
 * Retrieves the authenticated user's profile.
 * @async
 * @returns {Promise<Object>} Response with the user profile data.
 * @throws {Error} If the request fails.
 */
export const getProfile = async () => {
  try {
    const response = await api.get('/profile');
    return response.data;
  } catch (error) {
    console.error('Error retrieving profile:', error);
    throw error;
  }
};

/**
 * Updates the authenticated user's profile.
 * @async
 * @param {Object} profileData - New profile data.
 * @returns {Promise<Object>} Response with the updated profile data.
 * @throws {Error} If the request fails.
 */
export const updateProfile = async (profileData) => {
  try {
    const response = await api.put('/profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

/**
 * Retrieves the authenticated user's statistics.
 * @async
 * @returns {Promise<Object>} Response with the user's statistics.
 * @throws {Error} If the request fails.
 */
export const getStats = async () => {
  try {
    const response = await api.get('/profile/stats');
    return response.data;
  } catch (error) {
    console.error('Error retrieving statistics:', error);
    throw error;
  }
};

/**
 * Exports all the user's personal data in JSON format.
 * @async
 * @returns {Promise<Blob>} JSON file with the user's data.
 * @throws {Error} If the request fails.
 */
export const exportUserData = async () => {
  try {
    const response = await api.get('/profile/data-export', {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting data:', error);
    throw error;
  }
};

/**
 * Permanently deletes the user's account.
 * @async
 * @param {string} confirmPassword - Password to confirm deletion.
 * @returns {Promise<Object>} Response with deletion confirmation.
 * @throws {Error} If the request fails.
 */
export const deleteAccount = async (confirmPassword) => {
  try {
    const response = await api.delete('/profile/account', {
      data: { confirmPassword },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting account:', error);
    throw error;
  }
};
