import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiX, FiFileText, FiAlignLeft } from 'react-icons/fi';
import { createDiagram, updateDiagram } from '../../services/diagramService';
import { registerActivity, ACTIVITY_TYPES } from '../../services/activityService';
import { useToast } from '../../context/ToastContext';
import './NewTemplateModal.css';

function NewTemplateModal({ 
  isOpen, 
  onClose, 
  onTemplateCreated, 
  initialTitle = '',
  initialDescription = '',
  initialNodes = [],
  initialEdges = [],
  editingTemplateId = null // Si existe, es edición; si es null, es creación
}) {
  const navigate = useNavigate();
  const toast = useToast();
  const [formData, setFormData] = useState({
    title: initialTitle,
    description: initialDescription,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Actualizar formData cuando cambien los valores iniciales
  useEffect(() => {
    setFormData({
      title: initialTitle,
      description: initialDescription,
    });
  }, [initialTitle, initialDescription, isOpen]);

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

      let response;
      
      if (editingTemplateId) {
        // Actualizar plantilla existente
        response = await updateDiagram(editingTemplateId, {
          title: formData.title.trim(),
          description: formData.description.trim(),
        });

        // Registrar actividad de actualización
        if (response.diagram) {
          registerActivity(
            ACTIVITY_TYPES.UPDATE,
            response.diagram.title,
            response.diagram.id
          );
        }

        toast.success('¡Plantilla actualizada exitosamente!');
        
        // Notificar al componente padre
        if (onTemplateCreated) {
          onTemplateCreated(response.diagram);
        }

        // Cerrar modal
        handleClose();

        // Redirigir al editor con la plantilla actualizada
        if (response.diagram && response.diagram.id) {
          navigate(`/editor/${response.diagram.id}`);
        }
      } else {
        // Crear plantilla nueva en el backend (diagrama con isTemplate: true)
        response = await createDiagram({
          title: formData.title.trim(),
          description: formData.description.trim(),
          nodes: initialNodes,
          edges: initialEdges,
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
        {/* Header del modal */}
        <header className="modal__header">
          <h2 id="modal-title" className="modal__title">
            {editingTemplateId ? 'Editar plantilla' : 'Crear nueva plantilla'}
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

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="modal__form">
          {/* Error general */}
          {errors.general && (
            <aside className="modal__error-general">
              {errors.general}
            </aside>
          )}

          {/* Campo título */}
          <fieldset className="modal__form-group">
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
          </fieldset>

          {/* Campo descripción */}
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
              placeholder="Describe brevemente de qué trata esta plantilla..."
              rows={4}
              maxLength={500}
            />
            <span className="modal__char-count">
              {formData.description.length}/500
            </span>
          </fieldset>

          {/* Botones */}
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
              {isSubmitting 
                ? (editingTemplateId ? 'Guardando...' : 'Creando...') 
                : (editingTemplateId ? 'Guardar y editar' : 'Crear plantilla')
              }
            </button>
          </nav>
        </form>
      </article>
    </section>
  );
}

export default NewTemplateModal;
