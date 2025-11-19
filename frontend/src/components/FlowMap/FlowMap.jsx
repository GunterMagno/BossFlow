import { useCallback } from "react";
import { DecisionNode, ActionNode, PhaseNode, EffectNode } from "../nodes/Nodes";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";

import "reactflow/dist/style.css";
import "./FlowMap.css";

const tiposNodos = { decision: DecisionNode, action: ActionNode, phase: PhaseNode, effect: EffectNode };

// Nodos
const nodosIniciales = [
  { id: "n1", type: "decision", position: { x: 250, y: 50 }, data: { title: "Elige tu camino", icon: "🎯" } },
  { id: "n2", type: "action", position: { x: 250, y: 200 }, data: { title: "Atacar enemigo", icon: "⚔️" } },
  { id: "n3", type: "phase", position: { x: 500, y: 200 }, data: { title: "Fase de preparación", icon: "⏳" } },
  { id: "n4", type: "effect", position: { x: 250, y: 350 }, data: { title: "Curación", icon: "💖" } },
  { id: "n5", type: "effect", position: { x: 500, y: 350 }, data: { title: "Buff de fuerza", icon: "💪" } },
];

// Conexiones del flujo
// const conexiones = [
//   { id: "e1", source: "n1", target: "n2"},
//   { id: "e2", source: "n1", target: "n3"},
//   { id: "e3", source: "n2", target: "n4"},
//   { id: "e4", source: "n3", target: "n5"},
// ];

const conexiones = [];

function FlowMap() {
  const [nodos, setNodos, onNodosChange] = useNodesState(nodosIniciales);
  const [aristas, setAristas, onAristasChange] = useEdgesState(conexiones);

  const onConnect = useCallback(
    (params) => setAristas((eds) => addEdge(params, eds)),
    [setAristas]
  );

  return (
    <div className="flowmap">
      <div className="flowmap__wrap">
        <ReactFlow
          nodes={nodos}
          edges={aristas}
          onNodesChange={onNodosChange}
          onEdgesChange={onAristasChange}
          onConnect={onConnect}
          nodeTypes={tiposNodos}
          fitView
          attributionPosition="bottom-left"
        >
          {/* Configurar tipos de nodos*/} 
          <MiniMap 
            nodeColor={
              (node) => {
                switch (node.type) {
                  case "decision": return "#4da6ff";
                  case "action": return "#33cc33";
                  case "phase": return "#ffcc00";
                  case "effect": return "#9933ff";
                  default: return "#eee";
                }
              }
            }
            nodeStrokeWidth={2}
          />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
}




export default FlowMap;

