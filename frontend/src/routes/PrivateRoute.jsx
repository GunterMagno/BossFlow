import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './PrivateRoute.css';

/**
 * Componente para proteger rutas que requieren autenticación
 * 
 * Uso:
 * <Route 
 *   path="/ruta-protegida" 
 *   element={
 *     <PrivateRoute>
 *       <ComponenteProtegido />
 *     </PrivateRoute>
 *   } 
 * />
 */
function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // Mientras verifica autenticación, mostrar loading
  if (loading) {
    return (
      <article className="private-route__loading">
        <figure className="private-route__spinner"></figure>
        <p className="private-route__texto">Verificando autenticación...</p>
      </article>
    );
  }

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, renderizar el componente protegido
  return children;
}

export default PrivateRoute;
