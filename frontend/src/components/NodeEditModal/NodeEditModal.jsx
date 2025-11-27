import { useState, useEffect } from 'react';
import './NodeEditModal.css';
import { FiX, FiTrash2 } from 'react-icons/fi';

function NodeEditModal({ isOpen, onClose, node, onSave, onDelete }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: ''
  });

  const [errors, setErrors] = useState({});

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
        type: node.type || ''
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
          description: formData.description.trim()
        }
      });
      onClose();
    }
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
    <div className="node-edit-modal-overlay" onClick={onClose}>
      <div className="node-edit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="node-edit-modal__header">
          <h2 className="node-edit-modal__title">Editar Nodo</h2>
          <button
            className="node-edit-modal__close"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            <FiX />
          </button>
        </div>

        <form className="node-edit-modal__form" onSubmit={handleSubmit}>
          {/* Campo: Título */}
          <div className="node-edit-modal__field">
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
          </div>

          {/* Campo: Tipo */}
          <div className="node-edit-modal__field">
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
          </div>

          {/* Campo: Descripción */}
          <div className="node-edit-modal__field">
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
            <div className="node-edit-modal__char-count">
              {formData.description.length}/200 caracteres
            </div>
            {errors.description && (
              <span className="node-edit-modal__error">{errors.description}</span>
            )}
          </div>

          {/* Botones de acción */}
          <div className="node-edit-modal__actions">
            <div className="node-edit-modal__actions-left">
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
            </div>
            <div className="node-edit-modal__actions-right">
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
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NodeEditModal;
