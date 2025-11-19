import React from "react";
import "./Nodes.css";

// Nodo Decisión
export const DecisionNode = ({ data }) => (
  <div className="node decision-node">
    <span className="icon">{data.icon}</span>
    <span className="title">{data.title}</span>
  </div>
);

export const ActionNode = ({ data }) => (
  <div className="node action-node">
    <span className="icon">{data.icon}</span>
    <span className="title">{data.title}</span>
  </div>
);

export const PhaseNode = ({ data }) => (
  <div className="node phase-node">
    <span className="icon">{data.icon}</span>
    <span className="title">{data.title}</span>
  </div>
);

export const EffectNode = ({ data }) => (
  <div className="node effect-node">
    <span className="icon">{data.icon}</span>
    <span className="title">{data.title}</span>
  </div>
);
