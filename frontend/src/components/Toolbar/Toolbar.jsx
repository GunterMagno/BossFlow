import './Toolbar.css';
import { FiMenu } from 'react-icons/fi';

function Toolbar({ onToggleSidebar }) {
  return (
    <div className="toolbar" aria-label="toolbar">
      {/* Menu button for small screens - toggles sidebar overlay */}
      {onToggleSidebar && (
        <button
          className="toolbar__button toolbar__button--menu"
          onClick={onToggleSidebar}
          title="Mostrar/Ocultar panel"
        >
          <FiMenu />
        </button>
      )}
    </div>
  );
}

export default Toolbar;
