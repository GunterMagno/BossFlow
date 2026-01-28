import { FiAlertTriangle, FiX } from 'react-icons/fi';
import './ConfirmModal.css';

/**
 * Confirmation modal for actions that require user validation
 * @param {Object} props - Component properties
 * @param {boolean} props.isOpen - Controls the visibility of the modal
 * @param {Function} props.onClose - Callback executed when closing the modal
 * @param {Function} props.onConfirm - Callback executed when confirming the action
 * @param {string} [props.title='¿Estás seguro?'] - Title shown in the modal
 * @param {string} [props.message='Esta acción no se puede deshacer.'] - Descriptive message
 * @param {string} [props.confirmText='Confirmar'] - Text of the confirmation button
 * @param {string} [props.cancelText='Cancelar'] - Text of the cancel button
 * @param {string} [props.type='danger'] - Visual type of the modal (danger, warning, info)
 * @param {boolean} [props.isLoading=false] - Indicates if an operation is in progress
 * @returns {JSX.Element|null} Renders the modal or null if closed
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
   * Manages closing the modal using the Escape key
   * @param {KeyboardEvent} e - Keyboard event
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
