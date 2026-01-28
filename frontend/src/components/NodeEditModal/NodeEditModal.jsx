import { useState, useEffect } from 'react';
import './NodeEditModal.css';
import { FiX, FiTrash2, FiImage } from 'react-icons/fi';
import UploadImageModal from '../UploadImageModal/UploadImageModal';

/**
 * Modal component for editing diagram node properties.
 * Allows modifying title, description, type, and associated image of a node.
 *
 * @param {Object} props - Component properties
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Callback function to close the modal
 * @param {Object} props.node - Node object to edit with its data
 * @param {Function} props.onSave - Callback function to save node changes
 * @param {Function} props.onDelete - Callback function to delete the node
 * @returns {JSX.Element|null} Modal element or null if closed
 */
function NodeEditModal({ isOpen, onClose, node, onSave, onDelete }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    image: null
  });

  const [errors, setErrors] = useState({});
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const nodeTypes = [
    { value: 'action', label: 'Acción' },
    { value: 'decision', label: 'Decisión' },
    { value: 'startEnd', label: 'Evento' },
    { value: 'phase', label: 'Fase' },
    { value: 'position', label: 'Posición' },
    { value: 'timer', label: 'Temporizador' },
    { value: 'mechanic', label: 'Mecánica' },
    { value: 'ability', label: 'Habilidad' }
  ];

  useEffect(() => {
    if (isOpen && node) {
      setFormData({
        title: node.data?.title || '',
        description: node.data?.description || '',
        type: node.type || '',
        image: node.data?.image || null
      });
      setErrors({});
    }
  }, [isOpen, node]);

  /**
   * Handles changes in form fields.
   * Updates the form state and clears the error for the modified field.
   *
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  /**
   * Validates form fields before saving.
   * Checks title, description, and node type according to established rules.
   *
   * @returns {boolean} true if form is valid, false otherwise
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es obligatorio';
    } else if (formData.title.trim().length < 2) {
      newErrors.title = 'El título debe tener al menos 2 caracteres';
    } else if (formData.title.trim().length > 50) {
      newErrors.title = 'El título no puede exceder 50 caracteres';
    }

    if (formData.description && formData.description.length > 200) {
      newErrors.description = 'La descripción no puede exceder 200 caracteres';
    }

    if (!formData.type) {
      newErrors.type = 'Debes seleccionar un tipo de nodo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles form submission to save node changes.
   * Validates data and executes the onSave callback with the updated node.
   *
   * @param {Event} e - Form submission event
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSave({
        ...node,
        type: formData.type,
        data: {
          ...node.data,
          title: formData.title.trim(),
          description: formData.description.trim(),
          image: formData.image
        }
      });
      onClose();
    }
  };

  /**
   * Handles uploaded image from the upload modal.
   * Updates the form state with the new image data.
   *
   * @param {Object} imageData - Object with image data (url, filename, etc.)
   */
  const handleImageUploaded = (imageData) => {
    setFormData(prev => ({
      ...prev,
      image: imageData
    }));
  };

  /**
   * Removes the image associated with the node.
   * Sets the image field to null in the form state.
   */
  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }));
  };

  /**
   * Handles node deletion.
   * Executes the onDelete callback with the node ID if available.
   */
  const handleDelete = () => {
    if (onDelete && node) {
      onDelete(node.id);
    }
  };

  useEffect(() => {
    /**
     * Handles the Escape key to close the modal.
     *
     * @param {KeyboardEvent} e - Keyboard event
     */
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <section className="node-edit-modal-overlay" onClick={onClose}>
      <article className="node-edit-modal" onClick={(e) => e.stopPropagation()}>
        <header className="node-edit-modal__header">
          <h2 className="node-edit-modal__title">Editar Nodo</h2>
          <button
            className="node-edit-modal__close"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            <FiX />
          </button>
        </header>

        <form className="node-edit-modal__form" onSubmit={handleSubmit}>
          <fieldset className="node-edit-modal__field">
            <label htmlFor="title" className="node-edit-modal__label">
              Título <span className="node-edit-modal__required">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`node-edit-modal__input ${errors.title ? 'node-edit-modal__input--error' : ''}`}
              placeholder="Nombre del nodo"
              maxLength={50}
            />
            {errors.title && (
              <span className="node-edit-modal__error">{errors.title}</span>
            )}
          </fieldset>

          <fieldset className="node-edit-modal__field">
            <label htmlFor="type" className="node-edit-modal__label">
              Tipo <span className="node-edit-modal__required">*</span>
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={`node-edit-modal__select ${errors.type ? 'node-edit-modal__select--error' : ''}`}
            >
              <option value="">Seleccionar tipo...</option>
              {nodeTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.type && (
              <span className="node-edit-modal__error">{errors.type}</span>
            )}
          </fieldset>

          <fieldset className="node-edit-modal__field">
            <label htmlFor="description" className="node-edit-modal__label">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`node-edit-modal__textarea ${errors.description ? 'node-edit-modal__textarea--error' : ''}`}
              placeholder="Descripción opcional del nodo"
              rows={4}
              maxLength={200}
            />
            <small className="node-edit-modal__char-count">
              {formData.description.length}/200 caracteres
            </small>
            {errors.description && (
              <span className="node-edit-modal__error">{errors.description}</span>
            )}
          </fieldset>

          <fieldset className="node-edit-modal__field">
            <label className="node-edit-modal__label">
              Imagen
            </label>
            {formData.image ? (
              <figure className="node-edit-modal__image-preview">
                <img 
                  src={formData.image.url} 
                  alt={formData.image.filename || 'Vista previa'}
                  className="node-edit-modal__image"
                />
                <p className="node-edit-modal__image-filename">
                  {formData.image.filename}
                </p>
                <nav className="node-edit-modal__image-actions">
                  <button
                    type="button"
                    className="node-edit-modal__button node-edit-modal__button--change"
                    onClick={() => setIsUploadModalOpen(true)}
                  >
                    <FiImage /> Cambiar
                  </button>
                  <button
                    type="button"
                    className="node-edit-modal__button node-edit-modal__button--remove"
                    onClick={handleRemoveImage}
                  >
                    <FiTrash2 /> Eliminar
                  </button>
                </nav>
              </figure>
            ) : (
              <button
                type="button"
                className="node-edit-modal__button node-edit-modal__button--upload"
                onClick={() => setIsUploadModalOpen(true)}
              >
                <FiImage /> Añadir imagen
              </button>
            )}
          </fieldset>

          <nav className="node-edit-modal__actions">
            <section className="node-edit-modal__actions-left">
              {onDelete && (
                <button
                  type="button"
                  className="node-edit-modal__button node-edit-modal__button--delete"
                  onClick={handleDelete}
                  title="Eliminar nodo"
                >
                  <FiTrash2 /> Eliminar
                </button>
              )}
            </section>
            <section className="node-edit-modal__actions-right">
              <button
                type="button"
                className="node-edit-modal__button node-edit-modal__button--cancel"
                onClick={onClose}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="node-edit-modal__button node-edit-modal__button--save"
              >
                Guardar Cambios
              </button>
            </section>
          </nav>
        </form>

        <UploadImageModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onImageUploaded={handleImageUploaded}
          title="Añadir imagen al nodo"
        />
      </article>
    </section>
  );
}

export default NodeEditModal;
