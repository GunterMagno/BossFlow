import { useState, useEffect } from 'react';
import TemplateCard from '../TemplateCard/TemplateCard';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import { FiFileText, FiAlertCircle } from 'react-icons/fi';
import './TemplateList.css';

/**
 * Component that displays a list of diagram templates.
 * Manages different states: loading, error, empty and list with templates.
 * Includes modal confirmation before using a template.
 *
 * @param {Object} props - Component properties
 * @param {Array} props.templates - Array of templates to display
 * @param {boolean} props.loading - Indicates if templates are loading
 * @param {string} props.error - Error message if any problem occurs
 * @param {Function} props.onUseTemplate - Callback when using a template
 * @param {Function} props.onEditTemplate - Callback when editing a template
 * @param {Function} props.onDeleteTemplate - Callback when deleting a template
 * @param {Function} props.onRetry - Callback to retry loading after an error
 * @param {Function} props.onCreateTemplate - Callback to create a new template
 * @param {boolean} props.showCreateButton - Indicates if the create template button should be shown
 * @param {boolean} props.isSystemTemplates - Indicates if they are system templates
 * @returns {JSX.Element} Template list element
 */
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

  /**
   * Handles the click on a template to start the usage process.
   * Stores the selected template to display the confirmation modal.
   *
   * @param {Object} template - Template selected by the user
   */
  const handleTemplateClick = (template) => {
    setTemplateToUse(template);
  };

  /**
   * Confirms the use of the selected template.
   * Executes the usage callback and closes the confirmation modal.
   */
  const handleConfirmUse = () => {
    if (!templateToUse) return;
    
    if (onUseTemplate) {
      onUseTemplate(templateToUse);
    }
    
    setTemplateToUse(null);
  };

  /**
   * Cancels the use of the template.
   * Closes the confirmation modal without executing any action.
   */
  const handleCancelUse = () => {
    setTemplateToUse(null);
  };

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
