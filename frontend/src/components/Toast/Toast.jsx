import { useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';
import './Toast.css';

/**
 * Temporary toast notification component.
 * Displays popup messages with different types and closes automatically.
 * Includes icons according to message type and manual close button.
 *
 * @param {Object} props - Component properties
 * @param {string} props.message - Message to display in the notification
 * @param {string} props.type - Notification type (success, error, warning, info)
 * @param {Function} props.onClose - Callback function to close the notification
 * @param {number} props.duration - Duration in milliseconds before closing automatically
 * @returns {JSX.Element} Toast notification element
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
   * Gets the corresponding icon based on notification type.
   * Returns different icons for success, error, warning and info.
   *
   * @returns {JSX.Element} Icon element according to notification type
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
