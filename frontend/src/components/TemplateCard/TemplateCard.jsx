import { FiFileText, FiClock, FiEdit2, FiTrash2, FiCopy } from 'react-icons/fi';
import './TemplateCard.css';

/**
 * Componente de tarjeta de plantilla de diagrama.
 * Muestra información de una plantilla con opciones para usarla, editarla o eliminarla.
 * Diferencia entre plantillas del sistema y plantillas de usuario.
 *
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.template - Datos de la plantilla a mostrar
 * @param {Function} props.onUseTemplate - Callback al usar la plantilla
 * @param {Function} props.onEditTemplate - Callback al editar la plantilla
 * @param {Function} props.onDeleteTemplate - Callback al eliminar la plantilla
 * @param {boolean} props.isSystemTemplate - Indica si es una plantilla del sistema
 * @returns {JSX.Element} Elemento de tarjeta de plantilla
 */
function TemplateCard({
  template,
  onUseTemplate,
  onEditTemplate,
  onDeleteTemplate,
  isSystemTemplate = false
}) {
  /**
   * Formatea una fecha a formato relativo en español.
   * Muestra tiempo relativo (minutos, horas, días) o fecha absoluta según antigüedad.
   *
   * @param {Date|string} date - Fecha a formatear
   * @returns {string} Texto con la fecha formateada relativamente
   */
  const formatRelativeDate = (date) => {
    if (!date) return 'Plantilla del sistema';
    
    const now = new Date();
    const templateDate = new Date(date);
    const diffMs = now - templateDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `Hace ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`;
    } else if (diffHours < 24) {
      return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
    } else if (diffDays < 7) {
      return `Hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
    } else {
      return templateDate.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
  };

  /**
   * Maneja el evento de usar la plantilla.
   * Previene el comportamiento por defecto y la propagación del evento.
   *
   * @param {Event} e - Evento de clic del ratón
   */
  const handleUseTemplate = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onUseTemplate) {
      onUseTemplate(template);
    }
  };

  /**
   * Maneja el evento de editar la plantilla.
   * Previene el comportamiento por defecto y la propagación del evento.
   *
   * @param {Event} e - Evento de clic del ratón
   */
  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEditTemplate) {
      onEditTemplate(template);
    }
  };

  /**
   * Maneja el evento de eliminar la plantilla.
   * Previene el comportamiento por defecto y la propagación del evento.
   *
   * @param {Event} e - Evento de clic del ratón
   */
  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDeleteTemplate) {
      onDeleteTemplate(template);
    }
  };

  return (
    <article className="template-card-wrapper">
      <article className="template-card">

        {!isSystemTemplate && (
          <button
            className="template-card__delete-button"
            onClick={handleDelete}
            aria-label="Eliminar plantilla"
            title="Eliminar plantilla"
          >
            <FiTrash2 />
          </button>
        )}

        <figure className="template-card__icon">
          <FiFileText />
        </figure>

        <section className="template-card__content">
          <h3 className="template-card__title">{template.title}</h3>
          {template.description && (
            <p className="template-card__description">{template.description}</p>
          )}
        </section>

        <nav className="template-card__actions">
          <button
            className="template-card__action-button template-card__action-button--use"
            onClick={handleUseTemplate}
            title="Crear diagrama desde plantilla"
          >
            <FiFileText />
            <span>Usar</span>
          </button>
          
          {isSystemTemplate ? (
            <button
              className="template-card__action-button template-card__action-button--copy"
              onClick={handleEdit}
              title="Crear plantilla basada en esta"
            >
              <FiCopy />
              <span>Copiar</span>
            </button>
          ) : (
            <button
              className="template-card__action-button template-card__action-button--edit"
              onClick={handleEdit}
              title="Editar plantilla"
            >
              <FiEdit2 />
              <span>Editar</span>
            </button>
          )}
        </nav>
      </article>
    </article>
  );
}

export default TemplateCard;
