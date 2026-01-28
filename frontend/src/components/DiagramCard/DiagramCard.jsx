import { Link } from 'react-router-dom';
import { FiFileText, FiClock, FiTrash2, FiEdit2 } from 'react-icons/fi';
import './DiagramCard.css';

/**
 * Tarjeta que muestra la información resumida de un diagrama
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.diagram - Objeto con los datos del diagrama
 * @param {Function} props.onDelete - Callback ejecutado al eliminar el diagrama
 * @param {Function} props.onEdit - Callback ejecutado al editar el diagrama
 * @returns {JSX.Element} Interactive card with diagram information
 */
function DiagramCard({ diagram, onDelete, onEdit }) {
  /**
   * Formatea una fecha en formato relativo (hace X minutos/horas/días)
   * @param {string|Date} date - Fecha a formatear
   * @returns {string} Fecha formateada en formato relativo o fecha absoluta
   */
  const formatRelativeDate = (date) => {
    const now = new Date();
    const diagramDate = new Date(date);
    const diffMs = now - diagramDate;
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
      return diagramDate.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
  };

  /**
   * Gestiona el clic en el botón de eliminar
   * @param {Event} e - Evento del clic
   */
  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(diagram);
    }
  };

  /**
   * Gestiona el clic en el botón de editar
   * @param {Event} e - Evento del clic
   */
  const handleEditClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit) {
      onEdit(diagram);
    }
  };

  return (
    <article className="diagram-card-wrapper">
      <Link to={`/editor/${diagram.id}`} className="diagram-card">
        <figure className="diagram-card__icon">
          <FiFileText />
        </figure>

        <section className="diagram-card__content">
          <h3 className="diagram-card__title">{diagram.title}</h3>
          {diagram.description && (
            <p className="diagram-card__description">{diagram.description}</p>
          )}

          <footer className="diagram-card__footer">
            <section className="diagram-card__info">
              <span className="diagram-card__date">
                <FiClock className="diagram-card__date-icon" />
                {formatRelativeDate(diagram.updatedAt)}
              </span>

              <section className="diagram-card__stats">
                <span className="diagram-card__stat">
                  {(diagram.nodes ? diagram.nodes.length : 0)} nodos
                </span>
                <span className="diagram-card__stat-separator">•</span>
                <span className="diagram-card__stat">
                  {(diagram.edges ? diagram.edges.length : 0)} conexiones
                </span>
              </section>
            </section>
          </footer>
        </section>
      </Link>

      <nav className="diagram-card__actions">
        <button
          className="diagram-card__action-button diagram-card__action-button--edit"
          onClick={handleEditClick}
          aria-label="Editar diagrama"
          title="Editar diagrama"
        >
          <FiEdit2 />
        </button>

        <button
          className="diagram-card__action-button diagram-card__action-button--delete"
          onClick={handleDeleteClick}
          aria-label="Eliminar diagrama"
          title="Eliminar diagrama"
        >
          <FiTrash2 />
        </button>
      </nav>
    </article>
  );
}

export default DiagramCard;
