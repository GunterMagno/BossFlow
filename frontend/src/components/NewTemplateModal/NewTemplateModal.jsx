import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiX, FiFileText, FiAlignLeft } from 'react-icons/fi';
import { createDiagram } from '../../services/diagramService';
import { registerActivity, ACTIVITY_TYPES } from '../../services/activityService';
import { useToast } from '../../context/ToastContext';
import './NewTemplateModal.css';

function NewTemplateModal({ isOpen, onClose, onTemplateCreated }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    // Validar título
    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'El título debe tener al menos 3 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar antes de enviar
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      // Crear plantilla en el backend (diagrama con isTemplate: true)
      const response = await createDiagram({
        title: formData.title.trim(),
        description: formData.description.trim(),
        nodes: [],
        edges: [],
        isTemplate: true
      });

      // Registrar actividad de creación
      if (response.diagram) {
        registerActivity(
          ACTIVITY_TYPES.CREATE,
          response.diagram.title,
          response.diagram.id
        );
      }

      // Mostrar mensaje de éxito
      toast.success('¡Plantilla creada exitosamente!');

      // Notificar al componente padre que se creó una plantilla
      if (onTemplateCreated) {
        onTemplateCreated(response.diagram);
      }

      // Cerrar modal
      handleClose();

      // Redirigir al editor con la nueva plantilla
      if (response.diagram && response.diagram.id) {
        navigate(`/editor/${response.diagram.id}`);
      }
    } catch (error) {
      console.error('Error al crear plantilla:', error);

      // Manejar error de título duplicado
      if (error.response?.status === 409) {
        setErrors({
          title: 'Ya existe una plantilla con ese título',
        });
        toast.error('Ya existe una plantilla con ese título');
      } else if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.error || 'Datos inválidos';
        setErrors({
          general: errorMessage,
        });
        toast.error(errorMessage);
      } else {
        const errorMessage = 'Error al crear la plantilla. Por favor, intenta de nuevo.';
        setErrors({
          general: errorMessage,
        });
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cerrar modal y limpiar formulario
  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
    });
    setErrors({});
    onClose();
  };

  // Manejar tecla Escape para cerrar modal
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  // No renderizar si el modal no está abierto
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={handleClose}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header del modal */}
        <div className="modal__header">
          <h2 id="modal-title" className="modal__title">
            Crear nueva plantilla
          </h2>
          <button
            type="button"
            className="modal__close-button"
            onClick={handleClose}
            aria-label="Cerrar modal"
          >
            <FiX />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="modal__form">
          {/* Error general */}
          {errors.general && (
            <div className="modal__error-general">
              {errors.general}
            </div>
          )}

          {/* Campo título */}
          <div className="modal__form-group">
            <label htmlFor="title" className="modal__label">
              <FiFileText className="modal__label-icon" />
              Título de la plantilla
              <span className="modal__required">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`modal__input ${errors.title ? 'modal__input--error' : ''}`}
              placeholder="Ej: Plantilla de flujo de trabajo"
              maxLength={100}
              autoFocus
            />
            {errors.title && (
              <span className="modal__error">{errors.title}</span>
            )}
          </div>

          {/* Campo descripción */}
          <div className="modal__form-group">
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
              placeholder="Describe brevemente de qué trata esta plantilla..."
              rows={4}
              maxLength={500}
            />
            <span className="modal__char-count">
              {formData.description.length}/500
            </span>
          </div>

          {/* Botones */}
          <div className="modal__actions">
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
              {isSubmitting ? 'Creando...' : 'Crear plantilla'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewTemplateModal;
