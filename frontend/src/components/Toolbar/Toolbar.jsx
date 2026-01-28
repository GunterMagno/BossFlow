import './Toolbar.css';
import { FiMenu } from 'react-icons/fi';

/**
 * Application toolbar component.
 * Provides a menu button to toggle sidebar visibility.
 * Especially useful on small screens to show/hide the panel.
 *
 * @param {Object} props - Component properties
 * @param {Function} props.onToggleSidebar - Callback function to toggle sidebar visibility
 * @returns {JSX.Element} Toolbar element
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
