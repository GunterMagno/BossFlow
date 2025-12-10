import { FiAlertTriangle, FiX } from 'react-icons/fi';
import './ConfirmModal.css';

/**
 * Modal de confirmación para acciones que requieren validación del usuario
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isOpen - Controla la visibilidad del modal
 * @param {Function} props.onClose - Callback ejecutado al cerrar el modal
 * @param {Function} props.onConfirm - Callback ejecutado al confirmar la acción
 * @param {string} [props.title='¿Estás seguro?'] - Título mostrado en el modal
 * @param {string} [props.message='Esta acción no se puede deshacer.'] - Mensaje descriptivo
 * @param {string} [props.confirmText='Confirmar'] - Texto del botón de confirmación
 * @param {string} [props.cancelText='Cancelar'] - Texto del botón de cancelación
 * @param {string} [props.type='danger'] - Tipo visual del modal (danger, warning, info)
 * @param {boolean} [props.isLoading=false] - Indica si hay una operación en curso
 * @returns {JSX.Element|null} Renderiza el modal o null si está cerrado
 */
function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = '¿Estás seguro?',
  message = 'Esta acción no se puede deshacer.',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'danger',
  isLoading = false,
}) {
  /**
   * Gestiona el cierre del modal mediante la tecla Escape
   * @param {KeyboardEvent} e - Evento del teclado
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && !isLoading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <section
      className="confirm-modal-overlay"
      onClick={!isLoading ? onClose : undefined}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <article
        className={`confirm-modal confirm-modal--${type}`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="confirm-modal__header">
          <figure className="confirm-modal__icon-wrapper">
            <FiAlertTriangle className="confirm-modal__icon" />
          </figure>
          <button
            type="button"
            className="confirm-modal__close-button"
            onClick={onClose}
            disabled={isLoading}
            aria-label="Cerrar modal"
          >
            <FiX />
          </button>
        </header>

        <section className="confirm-modal__content">
          <h2 id="confirm-modal-title" className="confirm-modal__title">
            {title}
          </h2>
          <p className="confirm-modal__message">{message}</p>
        </section>

        <nav className="confirm-modal__actions">
          <button
            type="button"
            className="confirm-modal__button confirm-modal__button--cancel"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`confirm-modal__button confirm-modal__button--confirm confirm-modal__button--${type}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Procesando...' : confirmText}
          </button>
        </nav>
      </article>
    </section>
  );
}

export default ConfirmModal;
