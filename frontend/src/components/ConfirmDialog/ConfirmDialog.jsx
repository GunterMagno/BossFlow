import './ConfirmDialog.css';
import { FiAlertTriangle } from 'react-icons/fi';

function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirmar', cancelText = 'Cancelar', type = 'warning' }) {
  if (!isOpen) return null;

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
