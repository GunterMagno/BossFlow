import { useState, useEffect } from 'react';
import TemplateCard from '../TemplateCard/TemplateCard';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import { FiFileText, FiAlertCircle } from 'react-icons/fi';
import './TemplateList.css';

function TemplateList({ 
  templates, 
  loading, 
  error, 
  onUseTemplate, 
  onEditTemplate,
  onDeleteTemplate,
  onRetry, 
  onCreateTemplate, 
  showCreateButton,
  isSystemTemplates = false
}) {
  const [templateToUse, setTemplateToUse] = useState(null);

  // Función para manejar clic en plantilla
  const handleTemplateClick = (template) => {
    setTemplateToUse(template);
  };

  // Función para confirmar uso de plantilla
  const handleConfirmUse = () => {
    if (!templateToUse) return;
    
    if (onUseTemplate) {
      onUseTemplate(templateToUse);
    }
    
    setTemplateToUse(null);
  };

  // Función para cancelar
  const handleCancelUse = () => {
    setTemplateToUse(null);
  };

  // Estado de carga
  if (loading) {
    return (
      <section className="template-list">
        <aside className="template-list__loading">
          <figure className="template-list__spinner"></figure>
          <p>Cargando plantillas...</p>
        </aside>
      </section>
    );
  }

  // Estado de error
  if (error) {
    return (
      <section className="template-list">
        <aside className="template-list__error">
          <FiAlertCircle className="template-list__error-icon" />
          <p className="template-list__error-message">{error}</p>
          {onRetry && (
            <button
              className="template-list__retry-button"
              onClick={onRetry}
            >
              Reintentar
            </button>
          )}
        </aside>
      </section>
    );
  }

  // Estado vacío
  if (!templates || templates.length === 0) {
    return (
      <section className="template-list">
        <aside className="template-list__empty">
          <FiFileText className="template-list__empty-icon" />
          <h3 className="template-list__empty-title">No hay plantillas disponibles</h3>
          <p className="template-list__empty-message">
            Las plantillas te permiten crear diagramas rápidamente con estructuras predefinidas
          </p>
          {showCreateButton && onCreateTemplate && (
            <button onClick={onCreateTemplate} className="template-list__create-button">
              Crear plantilla
            </button>
          )}
        </aside>
      </section>
    );
  }

  // Lista de plantillas
  return (
    <>
      <section className="template-list">
        <section className="template-list__grid">
          {templates.map((template) => (
            <TemplateCard
              key={template.id || template._id}
              template={template}
              onUseTemplate={handleTemplateClick}
              onEditTemplate={onEditTemplate}
              onDeleteTemplate={onDeleteTemplate}
              isSystemTemplate={isSystemTemplates}
            />
          ))}
        </section>
      </section>

      <ConfirmModal
        isOpen={!!templateToUse}
        onClose={handleCancelUse}
        onConfirm={handleConfirmUse}
        title="¿Crear diagrama desde plantilla?"
        message={`¿Quieres crear un nuevo diagrama basado en la plantilla "${templateToUse?.title}"?`}
        confirmText="Crear"
        cancelText="Cancelar"
        type="success"
      />
    </>
  );
}

export default TemplateList;
