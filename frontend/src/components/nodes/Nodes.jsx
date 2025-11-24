import React from "react";
import { Handle, Position, NodeResizer } from "reactflow";
import "./Nodes.css";
import { DecisionIcon, ActionIcon, PhaseIcon, EffectIcon } from './icons';

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
    <span className="icon"><DecisionIcon className="node-icon icon-decision" role="img" aria-label="Icono de decisión" /></span>
    <span className="node-title">{data.title}</span>
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
    <span className="icon"><ActionIcon className="node-icon icon-action" role="img" aria-label="Icono de acción" /></span>
    <span className="node-title">{data.title}</span>
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
    <span className="icon"><PhaseIcon className="node-icon icon-phase" role="img" aria-label="Icono de fase" /></span>
    <span className="node-title">{data.title}</span>
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
    <span className="icon"><EffectIcon className="node-icon icon-effect" role="img" aria-label="Icono de efecto" /></span>
    <span className="node-title">{data.title}</span>
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
    <span className="node-title">{data?.title || 'Start'}</span>
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
    <span className="node-title">{data?.title || 'End'}</span>
  </div>
);
