import api from './api';

/**
 * Retrieves all diagrams of the authenticated user.
 * @async
 * @returns {Promise<Object>} Response with the list of diagrams.
 * @throws {Error} If the request fails.
 */
export const getDiagrams = async () => {
  try {
    const response = await api.get('/diagrams');
    return response.data;
  } catch (error) {
    console.error('Error retrieving diagrams:', error);
    throw error;
  }
};

/**
 * Creates a new diagram.
 * @async
 * @param {Object} diagramData - Data for the new diagram.
 * @returns {Promise<Object>} Response with the created diagram data.
 * @throws {Error} If the request fails.
 */
export const createDiagram = async (diagramData) => {
  try {
    const response = await api.post('/diagrams', diagramData);
    return response.data;
  } catch (error) {
    console.error('Error creating diagram:', error);
    throw error;
  }
};

/**
 * Retrieves a specific diagram by its ID.
 * @async
 * @param {string} id - ID of the diagram to retrieve.
 * @returns {Promise<Object>} Response with the diagram data.
 * @throws {Error} If the request fails.
 */
export const getDiagramById = async (id) => {
  try {
    const response = await api.get(`/diagrams/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error retrieving diagram:', error);
    throw error;
  }
};

/**
 * Updates an existing diagram.
 * @async
 * @param {string} id - ID of the diagram to update.
 * @param {Object} diagramData - New data for the diagram.
 * @returns {Promise<Object>} Response with the updated diagram data.
 * @throws {Error} If the request fails.
 */
export const updateDiagram = async (id, diagramData) => {
  try {
    const response = await api.put(`/diagrams/${id}`, diagramData);
    return response.data;
  } catch (error) {
    console.error('Error updating diagram:', error);
    throw error;
  }
};

/**
 * Deletes a diagram.
 * @async
 * @param {string} id - ID of the diagram to delete.
 * @returns {Promise<Object>} Deletion confirmation response.
 * @throws {Error} If the request fails.
 */
export const deleteDiagram = async (id) => {
  try {
    const response = await api.delete(`/diagrams/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting diagram:', error);
    throw error;
  }
};

/**
 * Retrieves all templates of the authenticated user.
 * @async
 * @returns {Promise<Object>} Response with the list of templates.
 * @throws {Error} If the request fails.
 */
export const getTemplates = async () => {
  try {
    const response = await api.get('/templates');
    return response.data;
  } catch (error) {
    console.error('Error retrieving templates:', error);
    throw error;
  }
};

/**
 * Deletes a template.
 * @async
 * @param {string} id - ID of the template to delete.
 * @returns {Promise<Object>} Deletion confirmation response.
 * @throws {Error} If the request fails.
 */
export const deleteTemplate = async (id) => {
  try {
    const response = await api.delete(`/diagrams/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting template:', error);
    throw error;
  }
};
