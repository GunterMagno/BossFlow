import { useState, useEffect } from 'react';
import './NodeEditModal.css';
import { FiX, FiTrash2, FiImage } from 'react-icons/fi';
import UploadImageModal from '../UploadImageModal/UploadImageModal';

function NodeEditModal({ isOpen, onClose, node, onSave, onDelete }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    image: null
  });

  const [errors, setErrors] = useState({});
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Tipos de nodos disponibles
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

  // Cargar datos del nodo cuando se abre el modal
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

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error del campo al modificarlo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validar formulario
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

  // Manejar envío del formulario
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

  // Manejar imagen subida
  const handleImageUploaded = (imageData) => {
    setFormData(prev => ({
      ...prev,
      image: imageData
    }));
  };

  // Eliminar imagen del nodo
  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }));
  };

  // Manejar eliminación del nodo
  const handleDelete = () => {
    if (onDelete && node) {
      onDelete(node.id);
    }
  };

  // Cerrar modal con ESC
  useEffect(() => {
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
          {/* Campo: Título */}
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

          {/* Campo: Tipo */}
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

          {/* Campo: Descripción */}
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

          {/* Campo: Imagen */}
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

          {/* Botones de acción */}
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

        {/* Modal de subida de imagen */}
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
