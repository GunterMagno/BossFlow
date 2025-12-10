import './Toolbar.css';
import { FiMenu } from 'react-icons/fi';

/**
 * Componente de barra de herramientas de la aplicación.
 * Proporciona botón de menú para alternar la visibilidad del panel lateral.
 * Especialmente útil en pantallas pequeñas para mostrar/ocultar el panel.
 *
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onToggleSidebar - Función callback para alternar la visibilidad del panel lateral
 * @returns {JSX.Element} Elemento de barra de herramientas
 */
function Toolbar({ onToggleSidebar }) {
  return (
    <nav className="toolbar" aria-label="toolbar">
      {onToggleSidebar && (
        <button
          className="toolbar__button toolbar__button--menu"
          onClick={onToggleSidebar}
          title="Mostrar/Ocultar panel"
        >
          <FiMenu />
        </button>
      )}
    </nav>
  );
}

export default Toolbar;
