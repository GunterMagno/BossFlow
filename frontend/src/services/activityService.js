/**
 * Servicio para gestionar el registro de actividad del usuario
 * Almacena las actividades en localStorage por usuario
 */

const ACTIVITY_STORAGE_KEY = 'bossflow_activities';
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
 * Obtener todas las actividades del usuario actual
 * @returns {Array} Array de actividades ordenadas por fecha (más recientes primero)
 */
export const getActivities = () => {
  try {
    const activities = localStorage.getItem(ACTIVITY_STORAGE_KEY);
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
 * @param {string} diagramaTitle - Título del diagrama
 * @param {string} diagramaId - ID del diagrama
 */
export const registerActivity = (tipo, diagramaTitle, diagramaId) => {
  try {
    const activities = getActivities();

    // Crear nueva actividad
    const newActivity = {
      id: Date.now(), // Usar timestamp como ID único
      tipo,
      diagrama: diagramaTitle,
      diagramaId,
      fecha: new Date().toISOString(),
    };

    // Agregar al inicio del array (más reciente primero)
    activities.unshift(newActivity);

    // Mantener solo las últimas MAX_ACTIVITIES actividades
    const trimmedActivities = activities.slice(0, MAX_ACTIVITIES);

    // Guardar en localStorage
    localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(trimmedActivities));

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
 * Limpiar todas las actividades
 */
export const clearActivities = () => {
  try {
    localStorage.removeItem(ACTIVITY_STORAGE_KEY);
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
