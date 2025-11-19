import React from "react";
import { Handle, Position } from "reactflow";
import "./Nodes.css";

// Define positions array to reuse names and positions
const posiciones = [
  { pos: Position.Top, name: "top" },
  { pos: Position.Right, name: "right" },
  { pos: Position.Bottom, name: "bottom" },
  { pos: Position.Left, name: "left" },
];

// Handles con IDs únicos
// Acepta `color` para el fondo del handle acorde al nodo
const Handles = ({ color = "#555" }) => (
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
    <Handles color="#4da6ff" />
    <span className="icon">{data.icon}</span>
    <span className="title">{data.title}</span>
  </div>
);

export const ActionNode = ({ id, data }) => (
  <div className="node action-node" style={{ position: "relative" }}>
    <Handles color="#33cc33" />
    <span className="icon">{data.icon}</span>
    <span className="title">{data.title}</span>
  </div>
);

export const PhaseNode = ({ id, data }) => (
  <div className="node phase-node" style={{ position: "relative" }}>
    <Handles color="#ffcc00" />
    <span className="icon">{data.icon}</span>
    <span className="title">{data.title}</span>
  </div>
);

export const EffectNode = ({ id, data }) => (
  <div className="node effect-node" style={{ position: "relative" }}>
    <Handles color="#9933ff" />
    <span className="icon">{data.icon}</span>
    <span className="title">{data.title}</span>
  </div>
);
