import { useState } from 'react';
import {
  FiZap,
  FiGitBranch,
  FiCircle,
  FiMapPin,
  FiClock,
  FiWatch,
  FiTool,
  FiStar,
  FiChevronUp,
  FiChevronDown,
} from 'react-icons/fi';
import './MobileNodePanel.css';

/**
 * Panel inferior deslizable para dispositivos móviles con todos los tipos de nodos
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onAddNode - Callback ejecutado al añadir un nodo
 * @returns {JSX.Element} Panel deslizable con scroll horizontal de nodos
 */
function MobileNodePanel({ onAddNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const allNodes = [
    {
      type: 'action',
      label: 'Acción',
      icon: <FiZap />,
      description: 'Acción ejecutable',
      color: '#33cc33',
    },
    {
      type: 'decision',
      label: 'Decisión',
      icon: <FiGitBranch />,
      description: 'Punto de bifurcación',
      color: '#4da6ff',
    },
    {
      type: 'startEnd',
      label: 'Evento',
      icon: <FiCircle />,
      description: 'Inicio o fin',
      color: '#888888',
    },
    {
      type: 'phase',
      label: 'Fase',
      icon: <FiWatch />,
      description: 'Fase del boss',
      color: '#ffcc00',
    },
    {
      type: 'position',
      label: 'Posición',
      icon: <FiMapPin />,
      description: 'Posicionamiento',
      color: '#ff6b6b',
    },
    {
      type: 'timer',
      label: 'Temporizador',
      icon: <FiClock />,
      description: 'Evento temporizado',
      color: '#4ecdc4',
    },
    {
      type: 'mechanic',
      label: 'Mecánica',
      icon: <FiTool />,
      description: 'Mecánica especial',
      color: '#9b59b6',
    },
    {
      type: 'ability',
      label: 'Habilidad',
      icon: <FiStar />,
      description: 'Habilidad especial',
      color: '#f39c12',
    },
  ];

  /**
   * Gestiona el clic sobre un tipo de nodo para añadirlo al canvas
   * @param {Object} nodeData - Datos del nodo a añadir
   */
  const handleNodeClick = (nodeData) => {
    if (onAddNode) {
      onAddNode(nodeData);
    }
  };

  /**
   * Inicia el arrastre de un nodo preparando los datos a transferir
   * @param {DragEvent} event - Evento de arrastre
   * @param {Object} nodeData - Datos del nodo a arrastrar
   */
  const onDragStart = (event, nodeData) => {
    const nodeInfo = {
      type: nodeData.type,
      label: nodeData.label,
      description: nodeData.description,
      color: nodeData.color
    };

    event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeInfo));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className={`mobile-node-panel ${isOpen ? 'mobile-node-panel--open' : ''}`}>
      <button
        className="mobile-node-panel__toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Ocultar nodos' : 'Mostrar nodos'}
      >
        {isOpen ? <FiChevronDown /> : <FiChevronUp />}
        <span>Nodos</span>
      </button>

      <section className="mobile-node-panel__content">
        <section className="mobile-node-panel__scroll">
          {allNodes.map((node, index) => (
            <article
              key={`${node.type}-${index}`}
              className="mobile-node-panel__node"
              draggable
              onDragStart={(event) => onDragStart(event, node)}
              onClick={() => handleNodeClick(node)}
              title={node.description}
              style={{ '--node-color': node.color }}
            >
              <span className="mobile-node-panel__node-icon" style={{ color: node.color }}>
                {node.icon}
              </span>
              <span className="mobile-node-panel__node-label">{node.label}</span>
            </article>
          ))}
        </section>
      </section>
    </aside>
  );
}

export default MobileNodePanel;
