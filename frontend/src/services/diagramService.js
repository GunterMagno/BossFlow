import api from './api';

/**
 * Obtiene todos los diagramas del usuario autenticado.
 * @async
 * @returns {Promise<Object>} Respuesta con la lista de diagramas.
 * @throws {Error} Si falla la solicitud.
 */
export const getDiagrams = async () => {
  try {
    const response = await api.get('/diagrams');
    return response.data;
  } catch (error) {
    console.error('Error al obtener diagramas:', error);
    throw error;
  }
};

/**
 * Crea un nuevo diagrama.
 * @async
 * @param {Object} diagramData - Datos del nuevo diagrama.
 * @returns {Promise<Object>} Respuesta con los datos del diagrama creado.
 * @throws {Error} Si falla la solicitud.
 */
export const createDiagram = async (diagramData) => {
  try {
    const response = await api.post('/diagrams', diagramData);
    return response.data;
  } catch (error) {
    console.error('Error al crear diagrama:', error);
    throw error;
  }
};

/**
 * Obtiene un diagrama específico por su ID.
 * @async
 * @param {string} id - ID del diagrama a obtener.
 * @returns {Promise<Object>} Respuesta con los datos del diagrama.
 * @throws {Error} Si falla la solicitud.
 */
export const getDiagramById = async (id) => {
  try {
    const response = await api.get(`/diagrams/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener diagrama:', error);
    throw error;
  }
};

/**
 * Actualiza un diagrama existente.
 * @async
 * @param {string} id - ID del diagrama a actualizar.
 * @param {Object} diagramData - Nuevos datos del diagrama.
 * @returns {Promise<Object>} Respuesta con los datos del diagrama actualizado.
 * @throws {Error} Si falla la solicitud.
 */
export const updateDiagram = async (id, diagramData) => {
  try {
    const response = await api.put(`/diagrams/${id}`, diagramData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar diagrama:', error);
    throw error;
  }
};

/**
 * Elimina un diagrama.
 * @async
 * @param {string} id - ID del diagrama a eliminar.
 * @returns {Promise<Object>} Respuesta de confirmación de eliminación.
 * @throws {Error} Si falla la solicitud.
 */
export const deleteDiagram = async (id) => {
  try {
    const response = await api.delete(`/diagrams/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar diagrama:', error);
    throw error;
  }
};

/**
 * Obtiene todas las plantillas del usuario autenticado.
 * @async
 * @returns {Promise<Object>} Respuesta con la lista de plantillas.
 * @throws {Error} Si falla la solicitud.
 */
export const getTemplates = async () => {
  try {
    const response = await api.get('/templates');
    return response.data;
  } catch (error) {
    console.error('Error al obtener plantillas:', error);
    throw error;
  }
};

/**
 * Elimina una plantilla.
 * @async
 * @param {string} id - ID de la plantilla a eliminar.
 * @returns {Promise<Object>} Respuesta de confirmación de eliminación.
 * @throws {Error} Si falla la solicitud.
 */
export const deleteTemplate = async (id) => {
  try {
    const response = await api.delete(`/diagrams/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar plantilla:', error);
    throw error;
  }
};
