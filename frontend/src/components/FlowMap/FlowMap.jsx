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
import CustomEdge from '../customEdge/CustomEdge';
import { useToast } from '../../context/ToastContext';
import { NODE_COLORS } from '../nodes/colors';

const tiposNodos = { decision: DecisionNode, action: ActionNode, phase: PhaseNode, effect: EffectNode };
// Definir edge types fuera del componente para evitar recrear el objeto en cada render
const tiposEdges = { default: CustomEdge };

// FlowMap ahora acepta propiedades `initialNodes` e `initialEdges` para iniciar estado vacío o con diagrama cargado

function FlowMap({ initialNodes = [], initialEdges = [] }) {
  const [nodos, setNodos, onNodosChange] = useNodesState(Array.isArray(initialNodes) ? initialNodes : []);
  const [conexiones, setConexiones, onConexionesChange] = useEdgesState(Array.isArray(initialEdges) ? initialEdges : []);
  const toast = useToast();

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
    (params) => {
      setConexiones((eds) => {
        const { source, target, sourceHandle, targetHandle } = params || {};

        //VALIDACIONES
        if (!source || !target) {
          toast.error('Conexión inválida');
          return eds;
        }

        if (source === target) {
          toast.warning('No puedes conectar un nodo a sí mismo');
          return eds;
        }

        // Validación para que no haya más de una conexión entre nodos
        const connectionBetweenNodes = eds.some(
          (e) => (e.source === source && e.target === target) || (e.source === target && e.target === source)
        );

        if (connectionBetweenNodes) {
          toast.warning('Ya existe una conexión entre estos nodos');
          return eds;
        }

        const exists = eds.some( (e) =>
            e.source === source && e.target === target && (e.sourceHandle || null) === (sourceHandle || null) && (e.targetHandle || null) === (targetHandle || null)
        );

        if (exists) {
          toast.info('La conexión ya existe');
          return eds;
        }

        return addEdge(params, eds);
      });
    },
    [setConexiones, toast]
  );

  // Listener para insertar nodos de demo cuando se dispare el evento desde la Toolbar
  useEffect(() => {
    const handler = (e) => {
      const incoming = e?.detail?.nodes;
      if (!Array.isArray(incoming) || incoming.length === 0) return;

      setNodos((prev) => {
        // Evitar ids duplicados: si un id ya existe, le añadimos un sufijo único
        const existingIds = new Set(prev.map(n => n.id));
        const mapped = incoming.map((n) => {
          let id = n.id;
          if (existingIds.has(id)) {
            id = `${id}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,6)}`;
          }
          return { ...n, id };
        });
        return [...prev, ...mapped];
      });
    };

    window.addEventListener('flowmap-insert-sample-nodes', handler);
    return () => window.removeEventListener('flowmap-insert-sample-nodes', handler);
  }, [setNodos]);

  return (
    <section className="flowmap">
      <div className="flowmap__wrap">
        <ReactFlow
          nodes={nodos}
          edges={conexiones}
          onNodesChange={onNodosChange}
          onEdgesChange={onConexionesChange}
          onConnect={onConnect}
          nodeTypes={tiposNodos}
          edgeTypes={tiposEdges}
          fitView
          attributionPosition="bottom-left"
        >
          {/* Configurar tipos de nodos*/} 
          <MiniMap 
            nodeColor={(node) => NODE_COLORS[node.type] || NODE_COLORS.default}
            nodeStrokeWidth={2}
          />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </section>
  );
}




export default FlowMap;

