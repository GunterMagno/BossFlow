import './Toolbar.css';
import { FaSave } from 'react-icons/fa';

function Toolbar() {
  return (
    <div className="toolbar" aria-label="toolbar">
      {/* Toolbar vacío por ahora - se añadirán herramientas en el futuro */}
// Nodos de ejemplo para mostrar en el canvas (solo demo)
const nodosIniciales = [
  { id: 'n1', type: 'decision', position: { x: 250, y: 50 }, data: { title: 'Elige tu camino' } },
  { id: 'start1', type: 'start', position: { x: 100, y: 50 }, data: { title: 'Start' } },
  { id: 'n2', type: 'action', position: { x: 250, y: 200 }, data: { title: 'Atacar enemigo' } },
  { id: 'n3', type: 'phase', position: { x: 500, y: 200 }, data: { title: 'Fase de preparación' } },
  { id: 'n4', type: 'effect', position: { x: 250, y: 350 }, data: { title: 'Curación'} },
  { id: 'n5', type: 'effect', position: { x: 500, y: 350 }, data: { title: 'Buff de fuerza' } },
  { id: 'end1', type: 'end', position: { x: 700, y: 50 }, data: { title: 'End' } },
];

function Toolbar({ onSave, saving = false }) {
  const handleInsertDemo = () => {
    // Envía un evento personalizado al que FlowMap está atento; detail contiene el array de nodos
    const ev = new CustomEvent('flowmap-insert-sample-nodes', { detail: { nodes: nodosIniciales } });
    window.dispatchEvent(ev);
  };

  return (
    <div className="toolbar" aria-label="toolbar">
      <button className="toolbar__button" onClick={handleInsertDemo} title="Insertar nodos de ejemplo">
        Demo nodos
      </button>
      
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
