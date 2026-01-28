import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiX, FiFileText, FiAlignLeft, FiUpload } from 'react-icons/fi';
import { createDiagram } from '../../services/diagramService';
import { registerActivity, ACTIVITY_TYPES } from '../../services/activityService';
import { useToast } from '../../context/ToastContext';
import ImportJSON from '../ImportJSON/ImportJSON';
import './NewDiagramModal.css';

/**
 * Modal component for creating a new diagram.
 * Allows creating diagrams from scratch, from templates, or by importing JSON data.
 *
 * @param {Object} props - Component properties
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Callback function to close the modal
 * @param {Function} props.onDiagramCreated - Callback function executed when a diagram is created
 * @param {Array|null} props.initialNodes - Initial nodes for creating from template
 * @param {Array|null} props.initialEdges - Initial connections for creating from template
 * @returns {JSX.Element|null} Modal element or null if closed
 */
function NewDiagramModal({ isOpen, onClose, onDiagramCreated, initialNodes = null, initialEdges = null }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importedData, setImportedData] = useState(null);

  /**
   * Handles changes in form input fields.
   * Updates the form state and clears errors for the modified field.
   *
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  /**
   * Validates form fields before submission.
   * Checks that the title is present and has at least 3 characters.
   *
   * @returns {boolean} true if form is valid, false otherwise
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'El título debe tener al menos 3 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles importing data from a JSON file.
   * Stores imported data and pre-fills the title if available.
   *
   * @param {Object} data - Diagram data imported from JSON
   * @param {Array} data.nodes - Diagram nodes
   * @param {Array} data.edges - Diagram connections
   * @param {Object} data.metadata - Diagram metadata
   */
  const handleImport = (data) => {
    setImportedData(data);
    setIsImportModalOpen(false);

    if (!formData.title && data.metadata?.title) {
      setFormData(prev => ({
        ...prev,
        title: data.metadata.title
      }));
    }

    toast.success('Datos importados. Completa el formulario para crear el diagrama.');
  };

  /**
   * Handles form submission to create a new diagram.
   * Validates data, creates the diagram on the backend, registers activity,
   * and redirects to the new diagram editor.
   *
   * @param {Event} e - Form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      const nodesToUse = importedData?.nodes || initialNodes || [];
      const edgesToUse = importedData?.edges || initialEdges || [];

      const response = await createDiagram({
        title: formData.title.trim(),
        description: formData.description.trim(),
        nodes: nodesToUse,
        edges: edgesToUse,
      });

      if (response.diagram) {
        registerActivity(
          ACTIVITY_TYPES.CREATE,
          response.diagram.title,
          response.diagram.id
        );
      }

      toast.success('¡Diagrama creado exitosamente!');

      if (onDiagramCreated) {
        onDiagramCreated(response.diagram);
      }

      handleClose();

      if (response.diagram && response.diagram.id) {
        navigate(`/editor/${response.diagram.id}`);
      }
    } catch (error) {
      console.error('Error creating diagram:', error);

      if (error.response?.status === 409) {
        setErrors({
          title: 'Ya existe un diagrama con ese título',
        });
        toast.error('Ya existe un diagrama con ese título');
      } else if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.error || 'Datos inválidos';
        setErrors({
          general: errorMessage,
        });
        toast.error(errorMessage);
      } else {
        const errorMessage = 'Error al crear el diagrama. Por favor, intenta de nuevo.';
        setErrors({
          general: errorMessage,
        });
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Closes the modal and resets the form to its initial state.
   * Clears all fields, errors, and imported data.
   */
  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
    });
    setErrors({});
    setImportedData(null);
    onClose();
  };

  /**
   * Handles keyboard event to close the modal with Escape key.
   *
   * @param {KeyboardEvent} e - Keyboard event
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <section
      className="modal-overlay"
      onClick={handleClose}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <article
        className="modal"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal__header">
          <h2 id="modal-title" className="modal__title">
            {initialNodes ? 'Crear diagrama desde plantilla' : 'Crear nuevo diagrama'}
          </h2>
          <button
            type="button"
            className="modal__close-button"
            onClick={handleClose}
            aria-label="Cerrar modal"
          >
            <FiX />
          </button>
        </header>

        {importedData && (
          <aside className="modal__imported-badge">
            <FiUpload />
            <span>
              Datos importados: {importedData.nodes?.length || 0} nodos y {importedData.edges?.length || 0} conexiones
            </span>
          </aside>
        )}

        <form onSubmit={handleSubmit} className="modal__form">
          {errors.general && (
            <aside className="modal__error-general">
              {errors.general}
            </aside>
          )}

          <fieldset className="modal__form-group">
            <label htmlFor="title" className="modal__label">
              <FiFileText className="modal__label-icon" />
              Título del diagrama
              <span className="modal__required">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`modal__input ${errors.title ? 'modal__input--error' : ''}`}
              placeholder="Ej: Flujo de proceso de ventas"
              maxLength={100}
              autoFocus
            />
            {errors.title && (
              <span className="modal__error">{errors.title}</span>
            )}
          </fieldset>

          <fieldset className="modal__form-group">
            <label htmlFor="description" className="modal__label">
              <FiAlignLeft className="modal__label-icon" />
              Descripción (opcional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="modal__textarea"
              placeholder="Describe brevemente de qué trata este diagrama..."
              rows={4}
              maxLength={500}
            />
            <span className="modal__char-count">
              {formData.description.length}/500
            </span>
          </fieldset>

          {!initialNodes && !importedData && (
            <aside className="modal__import-option">
              <p className="modal__label">
                ¿Quieres importar un diagrama mediante un JSON?
              </p>
              <button
                type="button"
                className="modal__import-button"
                onClick={() => setIsImportModalOpen(true)}
              >
                <FiUpload />
                Importar desde JSON
              </button>
            </aside>
          )}

          <nav className="modal__actions">
            <button
              type="button"
              className="modal__button modal__button--secondary"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="modal__button modal__button--primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creando...' : 'Crear diagrama'}
            </button>
          </nav>
        </form>
      </article>

      <ImportJSON
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImport}
        toast={toast}
      />
    </section>
  );
}

export default NewDiagramModal;
