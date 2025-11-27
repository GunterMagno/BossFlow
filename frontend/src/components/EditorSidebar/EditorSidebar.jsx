import { useState } from 'react';
import {
  FiZap,
  FiGitBranch,
  FiCircle,
  FiMapPin,
  FiClock,
  FiChevronDown,
  FiChevronRight,
  FiWatch,
  FiTool,
  FiStar,
} from 'react-icons/fi';
import './EditorSidebar.css';

import { FiX } from 'react-icons/fi';

function EditorSidebar({ onAddNode, className = '', onCloseSidebar }) {
  const [expandedSections, setExpandedSections] = useState({
    basic: false,
    game: false,
    recent: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Demo removed: sample node insertion logic has been removed per request

  // Definición de tipos de nodos básicos
  const basicNodes = [
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
  ];

  // Definición de nodos específicos del juego
  const gameNodes = [
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

  // Nodos recientes (mock - en producción vendría del estado global o localStorage)
  const recentNodes = [
    { type: 'action', label: 'Nodo nombre', icon: <FiZap /> },
    { type: 'decision', label: 'Nodo nombre', icon: <FiGitBranch /> },
    { type: 'phase', label: 'Nodo nombre', icon: <FiWatch /> },
  ];

  const handleNodeClick = (nodeType) => {
    if (onAddNode) {
      onAddNode(nodeType);
    }
  };

  const onDragStart = (event, nodeData) => {
    // Extraer solo los datos serializables (sin el componente React del icono)
    const nodeInfo = {
      type: nodeData.type,
      label: nodeData.label,
      description: nodeData.description,
      color: nodeData.color
    };

    console.log('Drag iniciado con datos:', nodeInfo);
    event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeInfo));
    event.dataTransfer.effectAllowed = 'move';
  };

  const renderNodeButton = (node, index) => (
    <div
      key={`${node.type}-${index}`}
      className="editor-sidebar__node-button"
      draggable
      onDragStart={(event) => onDragStart(event, node)}
      onClick={() => handleNodeClick(node)}
      title={node.description}
      style={{ '--node-color': node.color }}
    >
      <span className="editor-sidebar__node-icon" style={{ color: node.color }}>
        {node.icon}
      </span>
      <span className="editor-sidebar__node-label">{node.label}</span>
    </div>
  );

  return (
    <aside className={`editor-sidebar ${className}`} aria-label="Biblioteca de nodos">
      <div className="editor-sidebar__header">
        <h2 className="editor-sidebar__title">Biblioteca de Nodos</h2>
        {/* Close button for overlay (visible on small screens) */}
        {onCloseSidebar && (
          <button
            className="editor-sidebar__close-button"
            onClick={onCloseSidebar}
            aria-label="Cerrar panel"
            title="Cerrar panel"
          >
            <FiX />
          </button>
        )}
      </div>

      {/* Demo button removed */}

      <div className="editor-sidebar__content">
        {/* Nodos Básicos */}
        <section className="editor-sidebar__section">
          <button
            className="editor-sidebar__section-header"
            onClick={() => toggleSection('basic')}
            aria-expanded={expandedSections.basic}
          >
            <span className="editor-sidebar__section-icon">
              {expandedSections.basic ? <FiChevronDown /> : <FiChevronRight />}
            </span>
            <h3 className="editor-sidebar__section-title">Nodos Básicos</h3>
          </button>

          {expandedSections.basic && (
            <div className="editor-sidebar__section-content">
              {basicNodes.map((node, index) => renderNodeButton(node, index))}
            </div>
          )}
        </section>

        {/* Específicos del Juego */}
        <section className="editor-sidebar__section">
          <button
            className="editor-sidebar__section-header"
            onClick={() => toggleSection('game')}
            aria-expanded={expandedSections.game}
          >
            <span className="editor-sidebar__section-icon">
              {expandedSections.game ? <FiChevronDown /> : <FiChevronRight />}
            </span>
            <h3 className="editor-sidebar__section-title">Específicos del Juego</h3>
          </button>

          {expandedSections.game && (
            <div className="editor-sidebar__section-content">
              {gameNodes.map((node, index) => renderNodeButton(node, index))}
            </div>
          )}
        </section>

        {/* Nodos Recientes */}
        <section className="editor-sidebar__section">
          <button
            className="editor-sidebar__section-header"
            onClick={() => toggleSection('recent')}
            aria-expanded={expandedSections.recent}
          >
            <span className="editor-sidebar__section-icon">
              {expandedSections.recent ? <FiChevronDown /> : <FiChevronRight />}
            </span>
            <h3 className="editor-sidebar__section-title">Nodos Recientes</h3>
          </button>

          {expandedSections.recent && (
            <div className="editor-sidebar__section-content">
              {recentNodes.map((node, index) => (
                <div
                  key={`recent-${index}`}
                  className="editor-sidebar__recent-item"
                  draggable
                  onDragStart={(event) => onDragStart(event, node)}
                  onClick={() => handleNodeClick(node)}
                >
                  <span className="editor-sidebar__recent-icon">{node.icon}</span>
                  <span className="editor-sidebar__recent-label">{node.label}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </aside>
  );
}

export default EditorSidebar;
