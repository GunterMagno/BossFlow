import { FiAlertTriangle, FiX } from 'react-icons/fi';
import './ConfirmModal.css';

function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = '¿Estás seguro?',
  message = 'Esta acción no se puede deshacer.',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'danger', // danger, warning, info
  isLoading = false,
}) {
  // Manejar tecla Escape para cerrar modal
  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && !isLoading) {
      onClose();
    }
  };

  // No renderizar si el modal no está abierto
  if (!isOpen) return null;

  return (
    <div
      className="confirm-modal-overlay"
      onClick={!isLoading ? onClose : undefined}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div
        className={`confirm-modal confirm-modal--${type}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con icono */}
        <div className="confirm-modal__header">
          <div className="confirm-modal__icon-wrapper">
            <FiAlertTriangle className="confirm-modal__icon" />
          </div>
          <button
            type="button"
            className="confirm-modal__close-button"
            onClick={onClose}
            disabled={isLoading}
            aria-label="Cerrar modal"
          >
            <FiX />
          </button>
        </div>

        {/* Content */}
        <div className="confirm-modal__content">
          <h2 id="confirm-modal-title" className="confirm-modal__title">
            {title}
          </h2>
          <p className="confirm-modal__message">{message}</p>
        </div>

        {/* Actions */}
        <div className="confirm-modal__actions">
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
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
