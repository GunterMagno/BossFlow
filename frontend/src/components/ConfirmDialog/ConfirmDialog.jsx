import './ConfirmDialog.css';
import { FiAlertTriangle } from 'react-icons/fi';

/**
 * Diálogo modal de confirmación para acciones críticas
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isOpen - Controla la visibilidad del diálogo
 * @param {Function} props.onClose - Callback al cerrar el diálogo
 * @param {Function} props.onConfirm - Callback al confirmar la acción
 * @param {string} props.title - Título mostrado en la cabecera
 * @param {string} props.message - Mensaje descriptivo de la acción
 * @param {string} [props.confirmText='Confirmar'] - Texto del botón de confirmación
 * @param {string} [props.cancelText='Cancelar'] - Texto del botón de cancelación
 * @param {string} [props.type='warning'] - Tipo visual del diálogo (warning, error, etc.)
 * @returns {JSX.Element|null} Renderiza el diálogo o null si está cerrado
 */
function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirmar', cancelText = 'Cancelar', type = 'warning' }) {
  if (!isOpen) return null;

  /**
   * Procesa la confirmación ejecutando el callback y cerrando el diálogo
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
