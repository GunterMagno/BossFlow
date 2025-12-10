import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiX, FiFileText, FiAlignLeft } from 'react-icons/fi';
import { createDiagram, updateDiagram } from '../../services/diagramService';
import { registerActivity, ACTIVITY_TYPES } from '../../services/activityService';
import { useToast } from '../../context/ToastContext';
import './NewTemplateModal.css';

/**
 * Componente modal para crear o editar plantillas de diagramas.
 * Permite definir título y descripción para plantillas reutilizables.
 *
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isOpen - Indica si el modal está abierto
 * @param {Function} props.onClose - Función callback para cerrar el modal
 * @param {Function} props.onTemplateCreated - Función callback ejecutada cuando se crea o actualiza una plantilla
 * @param {string} props.initialTitle - Título inicial de la plantilla (para edición)
 * @param {string} props.initialDescription - Descripción inicial de la plantilla (para edición)
 * @param {Array} props.initialNodes - Nodos iniciales de la plantilla
 * @param {Array} props.initialEdges - Conexiones iniciales de la plantilla
 * @param {string|null} props.editingTemplateId - ID de la plantilla si es edición, null si es creación
 * @returns {JSX.Element|null} Elemento modal o null si está cerrado
 */
function NewTemplateModal({
  isOpen,
  onClose,
  onTemplateCreated,
  initialTitle = '',
  initialDescription = '',
  initialNodes = [],
  initialEdges = [],
  editingTemplateId = null
}) {
  const navigate = useNavigate();
  const toast = useToast();
  const [formData, setFormData] = useState({
    title: initialTitle,
    description: initialDescription,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData({
      title: initialTitle,
      description: initialDescription,
    });
  }, [initialTitle, initialDescription, isOpen]);

  /**
   * Maneja los cambios en los campos de entrada del formulario.
   * Actualiza el estado del formulario y limpia los errores del campo modificado.
   *
   * @param {Event} e - Evento de cambio del input
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
   * Valida los campos del formulario antes de enviar.
   * Verifica que el título esté presente y tenga al menos 3 caracteres.
   *
   * @returns {boolean} true si el formulario es válido, false en caso contrario
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
   * Maneja el envío del formulario para crear o actualizar una plantilla.
   * Determina si se trata de una creación o actualización según editingTemplateId,
   * registra la actividad correspondiente y redirige al editor.
   *
   * @param {Event} e - Evento de envío del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      let response;

      if (editingTemplateId) {
        response = await updateDiagram(editingTemplateId, {
          title: formData.title.trim(),
          description: formData.description.trim(),
        });

        if (response.diagram) {
          registerActivity(
            ACTIVITY_TYPES.UPDATE,
            response.diagram.title,
            response.diagram.id
          );
        }

        toast.success('¡Plantilla actualizada exitosamente!');

        if (onTemplateCreated) {
          onTemplateCreated(response.diagram);
        }

        handleClose();

        if (response.diagram && response.diagram.id) {
          navigate(`/editor/${response.diagram.id}`);
        }
      } else {
        response = await createDiagram({
          title: formData.title.trim(),
          description: formData.description.trim(),
          nodes: initialNodes,
          edges: initialEdges,
          isTemplate: true
        });

        if (response.diagram) {
          registerActivity(
            ACTIVITY_TYPES.CREATE,
            response.diagram.title,
            response.diagram.id
          );
        }

        toast.success('¡Plantilla creada exitosamente!');

        if (onTemplateCreated) {
          onTemplateCreated(response.diagram);
        }

        handleClose();

        if (response.diagram && response.diagram.id) {
          navigate(`/editor/${response.diagram.id}`);
        }
      }
    } catch (error) {
      console.error('Error al crear plantilla:', error);

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

  /**
   * Cierra el modal y reinicia el formulario a su estado inicial.
   * Limpia todos los campos y errores.
   */
  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
    });
    setErrors({});
    onClose();
  };

  /**
   * Maneja el evento de teclado para cerrar el modal con la tecla Escape.
   *
   * @param {KeyboardEvent} e - Evento de teclado
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

        <form onSubmit={handleSubmit} className="modal__form">
          {errors.general && (
            <aside className="modal__error-general">
              {errors.general}
            </aside>
          )}

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
