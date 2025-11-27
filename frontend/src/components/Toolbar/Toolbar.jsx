import './Toolbar.css';
import { FaSave } from 'react-icons/fa';
import { FiTrash2 } from 'react-icons/fi';

function Toolbar({ onSave, saving = false, onClear }) {
  return (
    <div className="toolbar" aria-label="toolbar">
      {onSave && (
        <button
          className="toolbar__button toolbar__button--save"
          onClick={onSave}
          disabled={saving}
          title={saving ? 'Guardando...' : 'Guardar diagrama'}
        >
          <FaSave /> {saving ? 'Guardando...' : 'Guardar'}
        </button>
      )}
      {onClear && (
        <button
          className="toolbar__button toolbar__button--clear"
          onClick={onClear}
          title="Limpiar canvas"
        >
          <FiTrash2 /> Limpiar
        </button>
      )}
    </div>
  );
}

export default Toolbar;
