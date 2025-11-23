import React from "react";
import { Handle, Position } from "reactflow";
import "./Nodes.css";
import { NODE_COLORS } from './colors';
import { DecisionIcon, ActionIcon, PhaseIcon, EffectIcon } from './icons';

// Define positions array to reuse names and positions
const posiciones = [
  { pos: Position.Top, name: "top" },
  { pos: Position.Right, name: "right" },
  { pos: Position.Bottom, name: "bottom" },
  { pos: Position.Left, name: "left" },
];

// Handles con IDs únicos
// Acepta `color` para el fondo del handle acorde al nodo
const Handles = ({ color = NODE_COLORS.handleDefault }) => (
  <>
    {posiciones.map(({ pos, name }) => (
      <React.Fragment key={name}>
        <Handle
          id={`${name}-target`}
          type="target"
          position={pos}
          isConnectable={true}
          style={{ width: 12, height: 12, borderRadius: 6, zIndex: 10, background: color }}
        />
        <Handle
          id={`${name}-source`}
          type="source"
          position={pos}
          isConnectable={true}
          style={{ width: 12, height: 12, borderRadius: 6, background: color, zIndex: 10 }}
        />
      </React.Fragment>
    ))}
  </>
);

export const DecisionNode = ({ id, data }) => (
  <div className="node decision-node" style={{ position: "relative" }}>
    <Handles color={NODE_COLORS.decision} />
    <span className="icon"><DecisionIcon className="node-icon icon-decision" role="img" aria-label="Icono de decisión" /></span>
    <span className="node-title">{data.title}</span>
  </div>
);

export const ActionNode = ({ id, data }) => (
  <div className="node action-node" style={{ position: "relative" }}>
    <Handles color={NODE_COLORS.action} />
    <span className="icon"><ActionIcon className="node-icon icon-action" role="img" aria-label="Icono de acción" /></span>
    <span className="node-title">{data.title}</span>
  </div>
);

export const PhaseNode = ({ id, data }) => (
  <div className="node phase-node" style={{ position: "relative" }}>
    <Handles color={NODE_COLORS.phase} />
    <span className="icon"><PhaseIcon className="node-icon icon-phase" role="img" aria-label="Icono de fase" /></span>
    <span className="node-title">{data.title}</span>
  </div>
);

export const EffectNode = ({ id, data }) => (
  <div className="node effect-node" style={{ position: "relative" }}>
    <Handles color={NODE_COLORS.effect} />
    <span className="icon"><EffectIcon className="node-icon icon-effect" role="img" aria-label="Icono de efecto" /></span>
    <span className="node-title">{data.title}</span>
  </div>
);
