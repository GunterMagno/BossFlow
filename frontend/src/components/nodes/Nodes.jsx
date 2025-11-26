import React from "react";
import { Handle, Position, NodeResizer } from "reactflow";
import "./Nodes.css";
import {
  FiZap,
  FiGitBranch,
  FiCircle,
  FiWatch,
  FiTool,
  FiMapPin,
  FiClock,
  FiStar,
} from 'react-icons/fi';

// Define positions array to reuse names and positions
const posiciones = [
  { pos: Position.Top, name: "top" },
  { pos: Position.Right, name: "right" },
  { pos: Position.Bottom, name: "bottom" },
  { pos: Position.Left, name: "left" },
];

// Handles con IDs únicos
// Acepta `nodeId` para garantizar ids únicos y `color` para el fondo del handle acorde al nodo
const Handles = ({ nodeId = '', color = 'var(--handle-default)' }) => (
  <>
    {posiciones.map(({ pos, name }) => (
      <React.Fragment key={name}>
        <Handle
          id={`${nodeId}-${name}-target`}
          type="target"
          position={pos}
          isConnectable={true}
          style={{ width: 12, height: 12, borderRadius: 6, zIndex: 10, background: color }}
        />
        <Handle
          id={`${nodeId}-${name}-source`}
          type="source"
          position={pos}
          isConnectable={true}
          style={{ width: 12, height: 12, borderRadius: 6, background: color, zIndex: 10 }}
        />
      </React.Fragment>
    ))}
  </>
);

// Componente simple para mostrar el título del nodo (sin edición inline)
const NodeTitle = ({ value }) => {
  return <span className="node-title">{value}</span>;
};

export const DecisionNode = ({ id, data, style, selected }) => (
  <div className={`node decision-node ${selected ? 'selected' : ''}`} style={style}>
    <NodeResizer minWidth={100} minHeight={30} isVisible={selected} handleStyle={{
      width: '8px',
      height: '8px',
      backgroundColor: selected ? 'var(--node-decision)' : 'transparent',
      border: '1px solid white',
      borderRadius: '2px',
    }} />
    <Handles nodeId={id} color={'var(--node-decision)'} />
    <span className="icon"><FiGitBranch className="node-icon icon-decision" role="img" aria-label="Icono de decisión" /></span>
    <NodeTitle value={data.title} />
  </div>
);

export const ActionNode = ({ id, data, style, selected }) => (
  <div className={`node action-node ${selected ? 'selected' : ''}`} style={style}>
    <NodeResizer minWidth={100} minHeight={30} isVisible={selected} handleStyle={{
      width: '8px',
      height: '8px',
      backgroundColor: selected ? 'var(--node-action)' : 'transparent',
      border: '1px solid white',
      borderRadius: '2px',
    }} />
    <Handles nodeId={id} color={'var(--node-action)'} />
    <span className="icon"><FiZap className="node-icon icon-action" role="img" aria-label="Icono de acción" /></span>
    <NodeTitle value={data.title} />
  </div>
);

export const PhaseNode = ({ id, data, style, selected }) => (
  <div className={`node phase-node ${selected ? 'selected' : ''}`} style={style}>
    <NodeResizer minWidth={100} minHeight={30} isVisible={selected} handleStyle={{
      width: '8px',
      height: '8px',
      backgroundColor: selected ? 'var(--node-phase)' : 'transparent',
      border: '1px solid white',
      borderRadius: '2px',
    }} />
    <Handles nodeId={id} color={'var(--node-phase)'} />
    <span className="icon"><FiWatch className="node-icon icon-phase" role="img" aria-label="Icono de fase" /></span>
    <NodeTitle value={data.title} />
  </div>
);

export const EffectNode = ({ id, data, style, selected }) => (
  <div className={`node effect-node ${selected ? 'selected' : ''}`} style={style}>
    <NodeResizer minWidth={100} minHeight={30} isVisible={selected} handleStyle={{
      width: '8px',
      height: '8px',
      backgroundColor: selected ? 'var(--node-effect)' : 'transparent',
      border: '1px solid white',
      borderRadius: '2px',
    }} />
    <Handles nodeId={id} color={'var(--node-effect)'} />
    <span className="icon"><FiTool className="node-icon icon-effect" role="img" aria-label="Icono de mecánica" /></span>
    <NodeTitle value={data.title} />
  </div>
);

export const StartNode = ({ id, data, style, selected }) => (
  <div className={`node start-node ${selected ? 'selected' : ''}`} style={style}>
    <NodeResizer minWidth={80} minHeight={30} isVisible={selected} handleStyle={{
      width: '8px',
      height: '8px',
      backgroundColor: selected ? 'var(--node-start-end)' : 'transparent',
      border: '1px solid white',
      borderRadius: '2px',
    }} />
    <Handles nodeId={id} color={'var(--node-start-end)'} />
    <span className="icon"><FiCircle className="node-icon icon-start-end" role="img" aria-label="Icono de evento" /></span>
    <NodeTitle value={data?.title || 'Start'} />
  </div>
);

export const EndNode = ({ id, data, style, selected }) => (
  <div className={`node end-node ${selected ? 'selected' : ''}`} style={style}>
    <NodeResizer minWidth={80} minHeight={30} isVisible={selected} handleStyle={{
      width: '8px',
      height: '8px',
      backgroundColor: selected ? 'var(--node-start-end)' : 'transparent',
      border: '1px solid white',
      borderRadius: '2px',
    }} />
    <Handles nodeId={id} color={'var(--node-start-end)'} />
    <span className="icon"><FiCircle className="node-icon icon-start-end" role="img" aria-label="Icono de evento" /></span>
    <NodeTitle value={data?.title || 'End'} />
  </div>
);

// Nodos específicos del juego
export const PositionNode = ({ id, data, style, selected }) => (
  <div className={`node position-node ${selected ? 'selected' : ''}`} style={style}>
    <NodeResizer minWidth={100} minHeight={30} isVisible={selected} handleStyle={{
      width: '8px',
      height: '8px',
      backgroundColor: selected ? 'var(--node-position)' : 'transparent',
      border: '1px solid white',
      borderRadius: '2px',
    }} />
    <Handles nodeId={id} color={'var(--node-position)'} />
    <span className="icon"><FiMapPin className="node-icon icon-position" role="img" aria-label="Icono de posición" /></span>
    <NodeTitle value={data.title} />
  </div>
);

export const TimerNode = ({ id, data, style, selected }) => (
  <div className={`node timer-node ${selected ? 'selected' : ''}`} style={style}>
    <NodeResizer minWidth={100} minHeight={30} isVisible={selected} handleStyle={{
      width: '8px',
      height: '8px',
      backgroundColor: selected ? 'var(--node-timer)' : 'transparent',
      border: '1px solid white',
      borderRadius: '2px',
    }} />
    <Handles nodeId={id} color={'var(--node-timer)'} />
    <span className="icon"><FiClock className="node-icon icon-timer" role="img" aria-label="Icono de temporizador" /></span>
    <NodeTitle value={data.title} />
  </div>
);

export const AbilityNode = ({ id, data, style, selected }) => (
  <div className={`node ability-node ${selected ? 'selected' : ''}`} style={style}>
    <NodeResizer minWidth={100} minHeight={30} isVisible={selected} handleStyle={{
      width: '8px',
      height: '8px',
      backgroundColor: selected ? 'var(--node-ability)' : 'transparent',
      border: '1px solid white',
      borderRadius: '2px',
    }} />
    <Handles nodeId={id} color={'var(--node-ability)'} />
    <span className="icon"><FiStar className="node-icon icon-ability" role="img" aria-label="Icono de habilidad" /></span>
    <NodeTitle value={data.title} />
  </div>
);
