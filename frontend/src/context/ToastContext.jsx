import { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/Toast/Toast';

const ToastContext = createContext();

/**
 * Custom hook to access the toast notification context.
 * Provides methods to display temporary notifications in the interface.
 *
 * @throws {Error} If used outside a ToastProvider
 * @returns {Object} Object with methods to display toast notifications
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

/**
 * Toast notification context provider component.
 * Manages the state and lifecycle of popup notifications.
 * Provides methods to display different types of notifications (success, error, warning, info).
 *
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Child components wrapped by the provider
 * @returns {JSX.Element} Toast notification context provider
 */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  /**
   * Displays a toast notification with customizable message, type, and duration.
   * Adds the notification to state and schedules its automatic removal.
   *
   * @param {string} message - Message to display in the notification
   * @param {string} type - Notification type (success, error, warning, info)
   * @param {number} duration - Duration in milliseconds before auto-closing
   * @returns {number} Unique ID of the created notification
   */
  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now();
    const newToast = { id, message, type, duration };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  /**
   * Removes a toast notification from state by its ID.
   * Makes the notification disappear from the interface.
   *
   * @param {number} id - Unique ID of the notification to remove
   */
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  /**
   * Displays a success toast notification.
   * Convenience method that uses showToast with type 'success'.
   *
   * @param {string} message - Message to display in the notification
   * @param {number} duration - Duration in milliseconds before auto-closing
   * @returns {number} Unique ID of the created notification
   */
  const success = useCallback(
    (message, duration) => showToast(message, 'success', duration),
    [showToast]
  );

  /**
   * Displays an error toast notification.
   * Convenience method that uses showToast with type 'error'.
   *
   * @param {string} message - Message to display in the notification
   * @param {number} duration - Duration in milliseconds before auto-closing
   * @returns {number} Unique ID of the created notification
   */
  const error = useCallback(
    (message, duration) => showToast(message, 'error', duration),
    [showToast]
  );

  /**
   * Displays a warning toast notification.
   * Convenience method that uses showToast with type 'warning'.
   *
   * @param {string} message - Message to display in the notification
   * @param {number} duration - Duration in milliseconds before auto-closing
   * @returns {number} Unique ID of the created notification
   */
  const warning = useCallback(
    (message, duration) => showToast(message, 'warning', duration),
    [showToast]
  );

  /**
   * Displays an info toast notification.
   * Convenience method that uses showToast with type 'info'.
   *
   * @param {string} message - Message to display in the notification
   * @param {number} duration - Duration in milliseconds before auto-closing
   * @returns {number} Unique ID of the created notification
   */
  const info = useCallback(
    (message, duration) => showToast(message, 'info', duration),
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
      <aside className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={0}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </aside>
    </ToastContext.Provider>
  );
};
