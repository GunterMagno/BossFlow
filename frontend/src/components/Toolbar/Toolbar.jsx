import './Toolbar.css';
import { FaSave } from 'react-icons/fa';
import { FiTrash2, FiMenu } from 'react-icons/fi';

function Toolbar({ onSave, saving = false, onClear, onToggleSidebar }) {
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

      {onSave && (
        <button
          className="toolbar__button toolbar__button--save"
          onClick={onSave}
          disabled={saving}
          title={saving ? 'Guardando...' : 'Guardar diagrama'}
        >
          <FaSave /> <span>{saving ? 'Guardando...' : 'Guardar'}</span>
        </button>
      )}
      {onClear && (
        <button
          className="toolbar__button toolbar__button--clear"
          onClick={onClear}
          title="Limpiar canvas"
        >
          <FiTrash2 /> <span>Limpiar</span>
        </button>
      )}
    </div>
  );
}

export default Toolbar;
