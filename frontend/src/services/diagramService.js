import api from './api';

// Obtener todos los diagramas del usuario autenticado
export const getDiagrams = async () => {
  try {
    const response = await api.get('/diagrams');
    return response.data;
  } catch (error) {
    console.error('Error al obtener diagramas:', error);
    throw error;
  }
};

// Crear un nuevo diagrama
export const createDiagram = async (diagramData) => {
  try {
    const response = await api.post('/diagrams', diagramData);
    return response.data;
  } catch (error) {
    console.error('Error al crear diagrama:', error);
    throw error;
  }
};

// Obtener un diagrama específico por ID
export const getDiagramById = async (id) => {
  try {
    const response = await api.get(`/diagrams/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener diagrama:', error);
    throw error;
  }
};

// Actualizar un diagrama
export const updateDiagram = async (id, diagramData) => {
  try {
    const response = await api.put(`/diagrams/${id}`, diagramData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar diagrama:', error);
    throw error;
  }
};

// Eliminar un diagrama
export const deleteDiagram = async (id) => {
  try {
    const response = await api.delete(`/diagrams/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar diagrama:', error);
    throw error;
  }
};

// Obtener todas las plantillas del usuario autenticado
export const getTemplates = async () => {
  try {
    const response = await api.get('/templates');
    return response.data;
  } catch (error) {
    console.error('Error al obtener plantillas:', error);
    throw error;
  }
};

// Eliminar una plantilla
export const deleteTemplate = async (id) => {
  try {
    const response = await api.delete(`/diagrams/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar plantilla:', error);
    throw error;
  }
};
