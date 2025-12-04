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

function MobileNodePanel({ onAddNode }) {
  const [isOpen, setIsOpen] = useState(false);

  // Todos los nodos disponibles en una sola lista horizontal
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

  const handleNodeClick = (nodeData) => {
    if (onAddNode) {
      onAddNode(nodeData);
    }
  };

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
    <div className={`mobile-node-panel ${isOpen ? 'mobile-node-panel--open' : ''}`}>
      {/* Toggle button */}
      <button
        className="mobile-node-panel__toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Ocultar nodos' : 'Mostrar nodos'}
      >
        {isOpen ? <FiChevronDown /> : <FiChevronUp />}
        <span>Nodos</span>
      </button>

      {/* Panel content */}
      <div className="mobile-node-panel__content">
        <div className="mobile-node-panel__scroll">
          {allNodes.map((node, index) => (
            <div
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MobileNodePanel;
