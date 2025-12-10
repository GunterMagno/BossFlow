import { useState, useEffect } from 'react';
import TemplateCard from '../TemplateCard/TemplateCard';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import { FiFileText, FiAlertCircle } from 'react-icons/fi';
import './TemplateList.css';

/**
 * Componente que muestra una lista de plantillas de diagramas.
 * Gestiona diferentes estados: carga, error, vacío y lista con plantillas.
 * Incluye confirmación modal antes de usar una plantilla.
 *
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.templates - Array de plantillas a mostrar
 * @param {boolean} props.loading - Indica si las plantillas están cargando
 * @param {string} props.error - Mensaje de error si ocurre algún problema
 * @param {Function} props.onUseTemplate - Callback al usar una plantilla
 * @param {Function} props.onEditTemplate - Callback al editar una plantilla
 * @param {Function} props.onDeleteTemplate - Callback al eliminar una plantilla
 * @param {Function} props.onRetry - Callback para reintentar la carga tras un error
 * @param {Function} props.onCreateTemplate - Callback para crear una nueva plantilla
 * @param {boolean} props.showCreateButton - Indica si mostrar el botón de crear plantilla
 * @param {boolean} props.isSystemTemplates - Indica si son plantillas del sistema
 * @returns {JSX.Element} Elemento de lista de plantillas
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
   * Maneja el clic en una plantilla para iniciar el proceso de uso.
   * Almacena la plantilla seleccionada para mostrar el modal de confirmación.
   *
   * @param {Object} template - Plantilla seleccionada por el usuario
   */
  const handleTemplateClick = (template) => {
    setTemplateToUse(template);
  };

  /**
   * Confirma el uso de la plantilla seleccionada.
   * Ejecuta el callback de uso y cierra el modal de confirmación.
   */
  const handleConfirmUse = () => {
    if (!templateToUse) return;
    
    if (onUseTemplate) {
      onUseTemplate(templateToUse);
    }
    
    setTemplateToUse(null);
  };

  /**
   * Cancela el uso de la plantilla.
   * Cierra el modal de confirmación sin ejecutar ninguna acción.
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
