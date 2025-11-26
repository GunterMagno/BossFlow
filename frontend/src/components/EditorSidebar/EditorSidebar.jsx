import { useState } from 'react';
import {
  FiZap,
  FiGitBranch,
  FiCircle,
  FiHexagon,
  FiMapPin,
  FiClock,
  FiSettings,
  FiChevronDown,
  FiChevronRight,
} from 'react-icons/fi';
import './EditorSidebar.css';

function EditorSidebar({ onAddNode, className = '' }) {
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

  // Nodos de ejemplo para mostrar en el canvas (solo demo)
  const nodosIniciales = [
    { id: 'n1', type: 'decision', position: { x: 250, y: 50 }, data: { title: 'Elige tu camino', icon: '🎯' } },
    { id: 'n2', type: 'action', position: { x: 250, y: 200 }, data: { title: 'Atacar enemigo', icon: '⚔️' } },
    { id: 'n3', type: 'phase', position: { x: 500, y: 200 }, data: { title: 'Fase de preparación', icon: '⏳' } },
    { id: 'n4', type: 'effect', position: { x: 250, y: 350 }, data: { title: 'Curación', icon: '💖' } },
    { id: 'n5', type: 'effect', position: { x: 500, y: 350 }, data: { title: 'Buff de fuerza', icon: '💪' } },
  ];

  const handleInsertDemo = () => {
    // Envía un evento personalizado al que FlowMap está atento
    const ev = new CustomEvent('flowmap-insert-sample-nodes', { detail: { nodes: nodosIniciales } });
    window.dispatchEvent(ev);
  };

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
      icon: <FiHexagon />,
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
      icon: <FiSettings />,
      description: 'Mecánica especial',
      color: '#9b59b6',
    },
    {
      type: 'ability',
      label: 'Habilidad',
      icon: <FiZap />,
      description: 'Habilidad especial',
      color: '#f39c12',
    },
  ];

  // Nodos recientes (mock - en producción vendría del estado global o localStorage)
  const recentNodes = [
    { type: 'action', label: 'Nodo nombre', icon: <FiZap /> },
    { type: 'decision', label: 'Nodo nombre', icon: <FiGitBranch /> },
    { type: 'phase', label: 'Nodo nombre', icon: <FiHexagon /> },
  ];

  const handleNodeClick = (nodeType) => {
    if (onAddNode) {
      onAddNode(nodeType);
    }
  };

  const renderNodeButton = (node, index) => (
    <button
      key={`${node.type}-${index}`}
      className="editor-sidebar__node-button"
      onClick={() => handleNodeClick(node)}
      title={node.description}
      style={{ '--node-color': node.color }}
    >
      <span className="editor-sidebar__node-icon" style={{ color: node.color }}>
        {node.icon}
      </span>
      <span className="editor-sidebar__node-label">{node.label}</span>
    </button>
  );

  return (
    <aside className={`editor-sidebar ${className}`} aria-label="Biblioteca de nodos">
      <div className="editor-sidebar__header">
        <h2 className="editor-sidebar__title">Biblioteca de Nodos</h2>
      </div>

      {/* Botón Demo */}
      <div className="editor-sidebar__demo-section">
        <button
          className="editor-sidebar__demo-button"
          onClick={handleInsertDemo}
          title="Insertar nodos de ejemplo en el canvas"
        >
          <FiZap />
          <span>Demo</span>
        </button>
      </div>

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
                <button
                  key={`recent-${index}`}
                  className="editor-sidebar__recent-item"
                  onClick={() => handleNodeClick(node)}
                >
                  <span className="editor-sidebar__recent-icon">{node.icon}</span>
                  <span className="editor-sidebar__recent-label">{node.label}</span>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </aside>
  );
}

export default EditorSidebar;
