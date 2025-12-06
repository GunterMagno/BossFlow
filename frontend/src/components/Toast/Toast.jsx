import { useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';
import './Toast.css';

function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

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
