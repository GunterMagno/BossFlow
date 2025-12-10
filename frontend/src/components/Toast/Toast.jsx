import { useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';
import './Toast.css';

/**
 * Componente de notificación toast temporal.
 * Muestra mensajes emergentes con diferentes tipos y se cierra automáticamente.
 * Incluye iconos según el tipo de mensaje y botón de cierre manual.
 *
 * @param {Object} props - Propiedades del componente
 * @param {string} props.message - Mensaje a mostrar en la notificación
 * @param {string} props.type - Tipo de notificación (success, error, warning, info)
 * @param {Function} props.onClose - Función callback para cerrar la notificación
 * @param {number} props.duration - Duración en milisegundos antes de cerrarse automáticamente
 * @returns {JSX.Element} Elemento de notificación toast
 */
function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  /**
   * Obtiene el icono correspondiente según el tipo de notificación.
   * Devuelve diferentes iconos para success, error, warning e info.
   *
   * @returns {JSX.Element} Elemento de icono según el tipo de notificación
   */
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="toast__icon" />;
      case 'error':
        return <FiXCircle className="toast__icon" />;
      case 'warning':
        return <FiAlertCircle className="toast__icon" />;
      case 'info':
        return <FiInfo className="toast__icon" />;
      default:
        return <FiInfo className="toast__icon" />;
    }
  };

  return (
    <aside className={`toast toast--${type}`}>
      {getIcon()}
      <span className="toast__message">{message}</span>
      <button
        className="toast__close"
        onClick={onClose}
        aria-label="Cerrar notificación"
      >
        <FiX />
      </button>
    </aside>
  );
}

export default Toast;
