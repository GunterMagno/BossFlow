import { FiFileText, FiClock } from 'react-icons/fi';
import './TemplateCard.css';

function TemplateCard({ template, onUseTemplate }) {
  // Función para formatear fecha relativa
  const formatRelativeDate = (date) => {
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

  const handleUseTemplate = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onUseTemplate) {
      onUseTemplate(template);
    }
  };

  return (
    <div className="template-card-wrapper">
      <div className="template-card" onClick={handleUseTemplate}>
        <div className="template-card__icon">
          <FiFileText />
        </div>

        <div className="template-card__content">
          <h3 className="template-card__title">{template.title}</h3>
          {template.description && (
            <p className="template-card__description">{template.description}</p>
          )}

          <div className="template-card__footer">
            <div className="template-card__info">
              <span className="template-card__date">
                <FiClock className="template-card__date-icon" />
                {formatRelativeDate(template.updatedAt)}
              </span>

              <div className="template-card__stats">
                <span className="template-card__stat">
                  {template.nodes?.length || 0} nodos
                </span>
                <span className="template-card__stat-separator">•</span>
                <span className="template-card__stat">
                  {template.edges?.length || 0} conexiones
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TemplateCard;
