import './ConfirmDialog.css';
import { FiAlertTriangle } from 'react-icons/fi';

/**
 * Confirmation modal dialog for critical actions
 * @param {Object} props - Component properties
 * @param {boolean} props.isOpen - Controls the visibility of the dialog
 * @param {Function} props.onClose - Callback when closing the dialog
 * @param {Function} props.onConfirm - Callback when confirming the action
 * @param {string} props.title - Title shown in the header
 * @param {string} props.message - Descriptive message for the action
 * @param {string} [props.confirmText='Confirmar'] - Text of the confirmation button
 * @param {string} [props.cancelText='Cancelar'] - Text of the cancel button
 * @param {string} [props.type='warning'] - Visual type of the dialog (warning, error, etc.)
 * @returns {JSX.Element|null} Renders the dialog or null if closed
 */
function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirmar', cancelText = 'Cancelar', type = 'warning' }) {
  if (!isOpen) return null;

  /**
   * Processes the confirmation by executing the callback and closing the dialog
   */
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <section className="confirm-dialog-overlay" onClick={onClose}>
      <article className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <header className={`confirm-dialog__header confirm-dialog__header--${type}`}>
          <FiAlertTriangle className="confirm-dialog__icon" />
          <h3 className="confirm-dialog__title">{title}</h3>
        </header>

        <section className="confirm-dialog__body">
          <p className="confirm-dialog__message">{message}</p>
        </section>

        <nav className="confirm-dialog__actions">
          <button
            type="button"
            className="confirm-dialog__button confirm-dialog__button--cancel"
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`confirm-dialog__button confirm-dialog__button--confirm confirm-dialog__button--${type}`}
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </nav>
      </article>
    </section>
  );
}

export default ConfirmDialog;
