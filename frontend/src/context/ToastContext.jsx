import { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/Toast/Toast';

const ToastContext = createContext();

/**
 * Hook personalizado para acceder al contexto de notificaciones toast.
 * Proporciona métodos para mostrar notificaciones temporales en la interfaz.
 *
 * @throws {Error} Si se usa fuera de un ToastProvider
 * @returns {Object} Objeto con métodos para mostrar notificaciones toast
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe ser usado dentro de ToastProvider');
  }
  return context;
};

/**
 * Componente proveedor del contexto de notificaciones toast.
 * Gestiona el estado y ciclo de vida de las notificaciones emergentes.
 * Proporciona métodos para mostrar diferentes tipos de notificaciones (success, error, warning, info).
 *
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componentes hijos envueltos por el proveedor
 * @returns {JSX.Element} Proveedor del contexto de notificaciones toast
 */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  /**
   * Muestra una notificación toast con mensaje, tipo y duración personalizables.
   * Añade la notificación al estado y programa su eliminación automática.
   *
   * @param {string} message - Mensaje a mostrar en la notificación
   * @param {string} type - Tipo de notificación (success, error, warning, info)
   * @param {number} duration - Duración en milisegundos antes de cerrarse automáticamente
   * @returns {number} ID único de la notificación creada
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
   * Elimina una notificación toast del estado por su ID.
   * Hace desaparecer la notificación de la interfaz.
   *
   * @param {number} id - ID único de la notificación a eliminar
   */
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  /**
   * Muestra una notificación toast de tipo éxito.
   * Método de conveniencia que usa showToast con tipo 'success'.
   *
   * @param {string} message - Mensaje a mostrar en la notificación
   * @param {number} duration - Duración en milisegundos antes de cerrarse automáticamente
   * @returns {number} ID único de la notificación creada
   */
  const success = useCallback(
    (message, duration) => showToast(message, 'success', duration),
    [showToast]
  );

  /**
   * Muestra una notificación toast de tipo error
   * Método de conveniencia que usa showToast con tipo 'error'
   * @param {string} message - Mensaje a mostrar en la notificación
   * @param {number} duration - Duración en milisegundos antes de cerrarse automáticamente
   * @returns {number} ID único de la notificación creada
   */
  const error = useCallback(
    (message, duration) => showToast(message, 'error', duration),
    [showToast]
  );

  /**
   * Muestra una notificación toast de tipo advertencia
   * Método de conveniencia que usa showToast con tipo 'warning'
   * @param {string} message - Mensaje a mostrar en la notificación
   * @param {number} duration - Duración en milisegundos antes de cerrarse automáticamente
   * @returns {number} ID único de la notificación creada
   */
  const warning = useCallback(
    (message, duration) => showToast(message, 'warning', duration),
    [showToast]
  );

  /**
   * Muestra una notificación toast de tipo información
   * Método de conveniencia que usa showToast con tipo 'info'
   * @param {string} message - Mensaje a mostrar en la notificación
   * @param {number} duration - Duración en milisegundos antes de cerrarse automáticamente
   * @returns {number} ID único de la notificación creada
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
