import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  FiX,
  FiLogOut,
} from 'react-icons/fi';
import './EditorSidebar.css';

const nodeIconMap = {
  action: <FiZap />,
  decision: <FiGitBranch />,
  startEnd: <FiCircle />,
  phase: <FiWatch />,
  position: <FiMapPin />,
  timer: <FiClock />,
  mechanic: <FiTool />,
  ability: <FiStar />,
};

/**
 * Panel lateral del editor con biblioteca de nodos disponibles
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onAddNode - Callback ejecutado al añadir un nodo
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @param {Function} props.onCloseSidebar - Callback to close sidebar on mobile
 * @param {Array} props.recentNodes - Array of recently used nodes
 * @returns {JSX.Element} Sidebar with draggable node categories
 */
function EditorSidebar({ onAddNode, className = '', onCloseSidebar, recentNodes = [] }) {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState({
    basic: false,
    game: false,
    recent: false,
  });

  /**
   * Alterna la expansión de una sección del sidebar
   * @param {string} section - Section identifier to toggle
   */
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

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

  /**
   * Gestiona el clic sobre un tipo de nodo para añadirlo al canvas
   * @param {Object} nodeType - Tipo de nodo a añadir
   */
  const handleNodeClick = (nodeType) => {
    if (onAddNode) {
      onAddNode(nodeType);
    }
  };

  /**
   * Navega a la página anterior al salir del editor
   */
  const handleExit = () => {
    navigate(-1);
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

    console.log('Drag started with data:', nodeInfo);
    event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeInfo));
    event.dataTransfer.effectAllowed = 'move';
  };

  /**
   * Renders a draggable node button
   * @param {Object} node - Node data to render
   * @param {number} index - Node index in the list
   * @returns {JSX.Element} Node button with drag capability
   */
  const renderNodeButton = (node, index) => (
    <button
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
    </button>
  );

  return (
    <aside className={`editor-sidebar ${className}`} aria-label="Biblioteca de nodos">
      <header className="editor-sidebar__header">
        <h2 className="editor-sidebar__title">Biblioteca de Nodos</h2>
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
      </header>

      <section className="editor-sidebar__content">
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
            <section className="editor-sidebar__section-content">
              {basicNodes.map((node, index) => renderNodeButton(node, index))}
            </section>
          )}
        </section>

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
            <section className="editor-sidebar__section-content">
              {gameNodes.map((node, index) => renderNodeButton(node, index))}
            </section>
          )}
        </section>

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
            <section className="editor-sidebar__section-content">
              {recentNodes.length === 0 ? (
                <p className="editor-sidebar__empty-message">
                  No hay nodos recientes. Arrastra un nodo al canvas para comenzar.
                </p>
              ) : (
                recentNodes.map((node, index) => {
                  const nodeWithIcon = {
                    ...node,
                    icon: nodeIconMap[node.type] || <FiCircle />
                  };
                  return renderNodeButton(nodeWithIcon, index);
                })
              )}
            </section>
          )}
        </section>
      </section>

      <button className="editor-sidebar__exit-button" onClick={handleExit}>
        <FiLogOut className="editor-sidebar__nav-icono" />
        <span>Salir</span>
      </button>
    </aside>
  );
}

export default EditorSidebar;
