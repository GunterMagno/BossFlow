import { useCallback } from "react";
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

const nodosIniciales = [
  { id: "nodo1", position: { x: 500, y: 100 }, data: { label: "Nodo 1" } },
  { id: "nodo2", position: { x: 500, y: 200 }, data: { label: "Nodo 2" } },
  { id: "nodo3", position: { x: 400, y: 300 }, data: { label: "Nodo 3" } },
];

const conexiones = [{ id: "nodo1-nodo2", source: "nodo1", target: "nodo2" }, { id: "nodo2-nodo3", source: "nodo2", target: "nodo3" }];

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
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
}

export default FlowMap;