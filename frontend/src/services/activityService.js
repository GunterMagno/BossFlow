/**
 * Servicio para gestionar el registro de actividad del usuario
 * Almacena las actividades en localStorage por usuario
 */

const ACTIVITY_STORAGE_PREFIX = 'bossflow_activities_';
const MAX_ACTIVITIES = 10; // Máximo número de actividades a mantener

/**
 * Tipos de actividad
 */
export const ACTIVITY_TYPES = {
  CREATE: 'creacion',
  EDIT: 'edicion',
  DELETE: 'eliminacion',
  VIEW: 'visualizacion',
};

/**
 * Gets current user's ID from JWT token.
 * @returns {string|null} User ID or null if no session.
 */
const getCurrentUserId = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded.userId;
  } catch (error) {
    console.error('Error al obtener userId del token:', error);
    return null;
  }
};

/**
 * Obtener la clave de storage para el usuario actual
 * @returns {string|null} Clave de storage o null si no hay usuario
 */
const getStorageKey = () => {
  const userId = getCurrentUserId();
  if (!userId) return null;
  return `${ACTIVITY_STORAGE_PREFIX}${userId}`;
};

/**
 * Obtener todas las actividades del usuario actual
 * @returns {Array} Array of activities sorted by date (most recent first)
 */
export const getActivities = () => {
  try {
    const storageKey = getStorageKey();
    if (!storageKey) return [];

    const activities = localStorage.getItem(storageKey);
    if (!activities) {
      return [];
    }
    return JSON.parse(activities);
  } catch (error) {
    console.error('Error al obtener actividades:', error);
    return [];
  }
};

/**
 * Registrar una nueva actividad
 * @param {string} tipo - Tipo de actividad (CREATE, EDIT, DELETE, VIEW)
 * @param {string} diagramaTitle - Diagram title
 * @param {string} diagramaId - Diagram ID
 */
export const registerActivity = (tipo, diagramaTitle, diagramaId) => {
  try {
    const storageKey = getStorageKey();
    if (!storageKey) return null;

    const activities = getActivities();

    const newActivity = {
      id: Date.now(),
      tipo,
      diagrama: diagramaTitle,
      diagramaId,
      fecha: new Date().toISOString(),
    };

    activities.unshift(newActivity);

    const trimmedActivities = activities.slice(0, MAX_ACTIVITIES);

    localStorage.setItem(storageKey, JSON.stringify(trimmedActivities));

    return newActivity;
  } catch (error) {
    console.error('Error al registrar actividad:', error);
    return null;
  }
};

/**
 * Formatear fecha relativa
 * @param {string} isoDate - Fecha en formato ISO
 * @returns {string} Fecha formateada de forma relativa
 */
export const formatRelativeDate = (isoDate) => {
  const now = new Date();
  const activityDate = new Date(isoDate);
  const diffMs = now - activityDate;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return 'Hace un momento';
  } else if (diffMins < 60) {
    return `Hace ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`;
  } else if (diffHours < 24) {
    return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
  } else if (diffDays < 7) {
    return `Hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
  } else {
    return activityDate.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
};

/**
 * Limpiar todas las actividades del usuario actual
 */
export const clearActivities = () => {
  try {
    const storageKey = getStorageKey();
    if (!storageKey) return;
    localStorage.removeItem(storageKey);
  } catch (error) {
    console.error('Error al limpiar actividades:', error);
  }
};

/**
 * Obtener actividades formateadas para mostrar
 * @returns {Array} Array de actividades con fechas formateadas
 */
export const getFormattedActivities = () => {
  const activities = getActivities();
  return activities.map((activity) => ({
    ...activity,
    fechaFormateada: formatRelativeDate(activity.fecha),
  }));
};

export default {
  getActivities,
  registerActivity,
  formatRelativeDate,
  clearActivities,
  getFormattedActivities,
  ACTIVITY_TYPES,
};
