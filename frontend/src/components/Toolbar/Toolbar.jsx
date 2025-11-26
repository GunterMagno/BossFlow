import './Toolbar.css';
import { FaSave } from 'react-icons/fa';

function Toolbar({ onSave, saving = false }) {
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
    </div>
  );
}

export default Toolbar;
