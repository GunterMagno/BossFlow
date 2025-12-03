import { useCallback, useEffect, useRef } from "react";
import { DecisionNode, ActionNode, PhaseNode, EffectNode, StartNode, EndNode, PositionNode, TimerNode, AbilityNode } from "../nodes/Nodes";
import ImageNode from "../nodes/ImageNode/ImageNode";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
} from "reactflow";

import "reactflow/dist/style.css";
import "./FlowMap.css";
import CustomEdge from '../customEdge/CustomEdge';
import { useToast } from '../../context/ToastContext';

const tiposNodos = {
  decision: DecisionNode,
  action: ActionNode,
  phase: PhaseNode,
  effect: EffectNode,
  start: StartNode,
  end: EndNode,
  // Mapeo de tipos adicionales a componentes específicos
  startEnd: StartNode,
  position: PositionNode,
  timer: TimerNode,
  mechanic: EffectNode,
  ability: AbilityNode,
  imageNode: ImageNode
};
// Definir edge types fuera del componente para evitar recrear el objeto en cada render
const tiposEdges = { default: CustomEdge };

// FlowMap acepta propiedades `initialNodes` e `initialEdges` para iniciar estado vacío o con diagrama cargado. Las propiedades onNodesChange y onEdgesChange son para indicar si cambian

function FlowMap({ initialNodes = [], initialEdges = [], onNodesChange: onNodesChangeProp, onEdgesChange: onEdgesChangeProp, onNodeDoubleClick, onSetUpdateNodeFunction, onSetDeleteNodesFunction, onDeleteRequest }) {
  const [nodos, setNodos, onNodosChange] = useNodesState(Array.isArray(initialNodes) ? initialNodes : []);
  const [conexiones, setConexiones, onConexionesChange] = useEdgesState(Array.isArray(initialEdges) ? initialEdges : []);
  const toast = useToast();
  const reactFlowWrapper = useRef(null);
  const { screenToFlowPosition } = useReactFlow();

  // Función para actualizar un nodo específico
  const updateNode = useCallback((updatedNode) => {
    setNodos((nds) =>
      nds.map((node) => {
        if (node.id === updatedNode.id) {
          return {
            ...updatedNode,
            data: { ...updatedNode.data },
          };
        }
        return node;
      })
    );
  }, [setNodos]);

  // Función para eliminar nodos específicos
  const deleteNodes = useCallback((nodeIdsToDelete) => {
    setNodos((nds) => nds.filter((node) => !nodeIdsToDelete.includes(node.id)));
    setConexiones((eds) =>
      eds.filter((edge) =>
        !nodeIdsToDelete.includes(edge.source) && !nodeIdsToDelete.includes(edge.target)
      )
    );
  }, [setNodos, setConexiones]);

  // Exponer la función de actualización al componente padre
  useEffect(() => {
    if (onSetUpdateNodeFunction) {
      onSetUpdateNodeFunction(updateNode);
    }
  }, [onSetUpdateNodeFunction, updateNode]);

  // Exponer la función de eliminación al componente padre
  useEffect(() => {
    if (onSetDeleteNodesFunction) {
      onSetDeleteNodesFunction(deleteNodes);
    }
  }, [onSetDeleteNodesFunction, deleteNodes]);

  /* Se usan refs para evitar reinicializar el estado interno del editor si el usuario ya ha comenzado a editar. Solo carga datos desde initialNodes/initialEdges una vez al inicializar el componente o cuando cambian desde el backend. */

  // Referencia para saber si el usuario ha hecho cambios locales
  const hasLocalChangesRef = useRef(false);
  const isInitialLoadRef = useRef(true);

  /* Inicializa los nodos cuando llegan del backend. Solo actualiza si el cambio viene del padre (diferentes IDs o longitud). */
  useEffect(() => {
    if (Array.isArray(initialNodes)) {
      if (isInitialLoadRef.current && initialNodes.length > 0) {
        setNodos(initialNodes);
        isInitialLoadRef.current = false;
      } else if (!isInitialLoadRef.current && initialNodes.length !== nodos.length) {
        // Solo actualizar si la longitud cambió (nuevo nodo añadido o eliminado)
        setNodos(initialNodes);
      }
    }
  }, [initialNodes, nodos.length, setNodos]);

  // Igual para edges, inicializa en la primera carga y actualiza después
  useEffect(() => {
    if (Array.isArray(initialEdges) && initialEdges.length !== conexiones.length) {
      setConexiones(initialEdges);
    }
  }, [initialEdges, conexiones.length, setConexiones]);


  // Notifica a Editor.jsx cuando cambien los nodos
  useEffect(() => {
    if (onNodesChangeProp) {
      onNodesChangeProp(nodos);
    }
  }, [nodos, onNodesChangeProp]);

  // Notifica a Editor.jsx cuando cambien las conexiones
  useEffect(() => {
    if (onEdgesChangeProp) {
      onEdgesChangeProp(conexiones);
    }
  }, [conexiones, onEdgesChangeProp]);

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

  // Funciones para drag & drop
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const nodeDataString = event.dataTransfer.getData('application/reactflow');

      // Si no hay datos, salir
      if (!nodeDataString) {
        console.log('No hay datos en el drop');
        return;
      }

      try {
        const nodeData = JSON.parse(nodeDataString);
        console.log('Datos del nodo dropeado:', nodeData);

        // Convertir la posición del mouse a coordenadas del canvas
        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        console.log('Posición calculada:', position);

        // Generar ID único para el nuevo nodo
        const newNodeId = `${nodeData.type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

        // Crear nuevo nodo con datos por defecto
        const newNode = {
          id: newNodeId,
          type: nodeData.type,
          position,
          data: {
            title: nodeData.label || 'Nuevo nodo',
            icon: '⚡',
            description: nodeData.description || '',
          },
        };

        console.log('Nuevo nodo a crear:', newNode);

        // Agregar el nuevo nodo al estado
        setNodos((nds) => {
          console.log('Nodos actuales:', nds);
          const updated = [...nds, newNode];
          console.log('Nodos actualizados:', updated);
          return updated;
        });

        toast.success(`Nodo "${nodeData.label}" agregado al canvas`);
      } catch (error) {
        console.error('Error al procesar el drop:', error);
        toast.error('Error al agregar el nodo');
      }
    },
    [screenToFlowPosition, setNodos, toast]
  );

  // Listener para detectar la tecla Suprimir/Delete
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Detectar tecla Suprimir o Delete
      if (event.key === 'Delete' || event.key === 'Supr') {
        // Obtener nodos seleccionados
        const selectedNodes = nodos.filter((node) => node.selected);

        if (selectedNodes.length > 0 && onDeleteRequest) {
          event.preventDefault();
          onDeleteRequest(selectedNodes);
        }
      }
    };

    // Agregar listener al documento
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [nodos, onDeleteRequest]);

  return (
    <section className="flowmap">
      <div className="flowmap__wrap" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodos}
          edges={conexiones}
          onNodesChange={onNodosChange}
          onEdgesChange={onConexionesChange}
          onConnect={onConnect}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onNodeDoubleClick={onNodeDoubleClick}
          nodeTypes={tiposNodos}
          edgeTypes={tiposEdges}
          connectionRadius={30}
          fitView
          attributionPosition="bottom-left"
        >
          {/* Configurar tipos de nodos*/} 
          <MiniMap 
            nodeColor={(node) => {
              try {
                const key = `--node-${node.type}`;
                const v = getComputedStyle(document.documentElement).getPropertyValue(key).trim();
                return v || getComputedStyle(document.documentElement).getPropertyValue('--node-default').trim() || '#eee';
              } catch (e) {
                return '#eee';
              }
            }}
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

