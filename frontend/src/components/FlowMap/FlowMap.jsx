import { useCallback, useEffect, useRef } from "react";
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

// FlowMap ahora acepta propiedades `initialNodes` e `initialEdges` para iniciar estado vacío o con diagrama cargado

function FlowMap({ initialNodes = [], initialEdges = [] }) {
  const [nodos, setNodos, onNodosChange] = useNodesState(Array.isArray(initialNodes) ? initialNodes : []);
  const [conexiones, setConexiones, onConexionesChange] = useEdgesState(Array.isArray(initialEdges) ? initialEdges : []);

  /* Usamos refs para evitar reinicializar el estado interno del editor, si Editor vuelve a pasar las mismas propiedades o props vacías después de que
     el usuario haya comenzado a editar el diagrama. Solo inicializa la primera vez que lleguen datos reales, evitando así sobrescribir las ediciones realizadas por el usuario localmente. */

  // Referencias que indican si ya se inicializó el estado a partir de las propiedades.
  const nodesInitRef = useRef(false);
  const edgesInitRef = useRef(false);

  /* Inicializa los nodos a partir de `initialNodes` sólo una vez (cuando llegan datos reales). No vuelve a ejecutar la asignación después para no borrar los cambios del usuario si el padre vuelve a renderizar o envía arrays vacíos. */
  useEffect(() => {
    if (nodesInitRef.current) return;
    if (Array.isArray(initialNodes) && initialNodes.length > 0) {
      setNodos(initialNodes);
      nodesInitRef.current = true;
    }
  }, [initialNodes, setNodos]);

  // Igual que en el código anterior, inicializa sólo la primera vez que recibimos edges.
  useEffect(() => {
    if (edgesInitRef.current) return;
    if (Array.isArray(initialEdges) && initialEdges.length > 0) {
      setConexiones(initialEdges);
      edgesInitRef.current = true;
    }
  }, [initialEdges, setConexiones]);

  const onConnect = useCallback(
    (params) => setConexiones((eds) => addEdge(params, eds)),
    [setConexiones]
  );

  return (
    <div className="flowmap">
      <div className="flowmap__wrap">
        <ReactFlow
          nodes={nodos}
          edges={conexiones}
          onNodesChange={onNodosChange}
          onEdgesChange={onConexionesChange}
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

