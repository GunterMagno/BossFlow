import { useCallback, useEffect, useRef, useState } from "react";
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
import NodeDescriptionPopup from '../NodeDescriptionPopup/NodeDescriptionPopup';
import { useToast } from '../../context/ToastContext';
import useRecentNodes from '../../hooks/useRecentNodes';

const tiposNodos = {
  decision: DecisionNode,
  action: ActionNode,
  phase: PhaseNode,
  effect: EffectNode,
  start: StartNode,
  end: EndNode,
  startEnd: StartNode,
  position: PositionNode,
  timer: TimerNode,
  mechanic: EffectNode,
  ability: AbilityNode,
  imageNode: ImageNode
};
const tiposEdges = { default: CustomEdge };

/**
 * Componente principal del editor de diagramas de flujo
 * @param {Object} props - Propiedades del componente
 * @param {Array} [props.initialNodes=[]] - Nodos iniciales del diagrama
 * @param {Array} [props.initialEdges=[]] - Conexiones iniciales del diagrama
 * @param {Function} props.onNodesChange - Callback ejecutado cuando cambian los nodos
 * @param {Function} props.onEdgesChange - Callback ejecutado cuando cambian las conexiones
 * @param {Function} props.onNodeDoubleClick - Callback para doble clic en un nodo
 * @param {Function} props.onEdgeDoubleClick - Callback para doble clic en una conexión
 * @param {Function} props.onSetUpdateNodeFunction - Expone la función de actualización de nodos
 * @param {Function} props.onSetDeleteNodesFunction - Expone la función de eliminación de nodos
 * @param {Function} props.onDeleteRequest - Callback para solicitudes de eliminación
 * @param {Function} props.onRecentNodesChange - Callback cuando cambian los nodos recientes
 * @returns {JSX.Element} Editor de diagramas interactivo
 */
function FlowMap({ initialNodes = [], initialEdges = [], onNodesChange: onNodesChangeProp, onEdgesChange: onEdgesChangeProp, onNodeDoubleClick, onEdgeDoubleClick, onSetUpdateNodeFunction, onSetDeleteNodesFunction, onDeleteRequest, onRecentNodesChange }) {
  const [nodos, setNodos, onNodosChange] = useNodesState(Array.isArray(initialNodes) ? initialNodes : []);
  const [conexiones, setConexiones, onConexionesChange] = useEdgesState(Array.isArray(initialEdges) ? initialEdges : []);
  const [selectedNodeForDescription, setSelectedNodeForDescription] = useState(null);
  const toast = useToast();
  const reactFlowWrapper = useRef(null);
  const { screenToFlowPosition } = useReactFlow();
  const { nodosRecientes, agregarNodoReciente } = useRecentNodes();
  const hoverTimeoutRef = useRef(null);
  const isDraggingRef = useRef(false);

  /**
   * Gestiona los cambios en los nodos detectando eventos de arrastre
   * @param {Array} changes - Array de cambios aplicados a los nodos
   */
  const handleNodesChange = useCallback((changes) => {
    const isDragging = changes.some(change => 
      change.type === 'position' && change.dragging === true
    );
    
    if (isDragging) {
      isDraggingRef.current = true;
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
      setSelectedNodeForDescription(null);
    } else if (changes.some(change => change.type === 'position' && change.dragging === false)) {
      isDraggingRef.current = false;
    }
    
    onNodosChange(changes);
  }, [onNodosChange]);

  useEffect(() => {
    if (onRecentNodesChange) {
      onRecentNodesChange(nodosRecientes);
    }
  }, [nodosRecientes, onRecentNodesChange]);

  /**
   * Actualiza los datos de un nodo específico
   * @param {Object} updatedNode - Nodo con los datos actualizados
   */
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

  /**
   * Elimina uno o varios nodos y sus conexiones asociadas
   * @param {Array<string>} nodeIdsToDelete - Array de IDs de nodos a eliminar
   */
  const deleteNodes = useCallback((nodeIdsToDelete) => {
    setNodos((nds) => nds.filter((node) => !nodeIdsToDelete.includes(node.id)));
    setConexiones((eds) =>
      eds.filter((edge) =>
        !nodeIdsToDelete.includes(edge.source) && !nodeIdsToDelete.includes(edge.target)
      )
    );
  }, [setNodos, setConexiones]);

  useEffect(() => {
    if (onSetUpdateNodeFunction) {
      onSetUpdateNodeFunction(updateNode);
    }
  }, [onSetUpdateNodeFunction, updateNode]);

  useEffect(() => {
    if (onSetDeleteNodesFunction) {
      onSetDeleteNodesFunction(deleteNodes);
    }
  }, [onSetDeleteNodesFunction, deleteNodes]);

  const hasLocalChangesRef = useRef(false);
  const isInitialLoadRef = useRef(true);

  const prevInitialNodesRef = useRef();
  
  useEffect(() => {
    if (!Array.isArray(initialNodes)) return;
    
    if (isInitialLoadRef.current && initialNodes.length > 0) {
      const nodesWithStyle = initialNodes.map(node => ({
        ...node,
        style: node.style || {}
      }));
      setNodos(nodesWithStyle);
      prevInitialNodesRef.current = initialNodes;
      isInitialLoadRef.current = false;
      return;
    }
    
    if (prevInitialNodesRef.current === initialNodes) {
      return;
    }
    
    if (initialNodes.length !== nodos.length) {
      const nodesWithStyle = initialNodes.map(node => ({
        ...node,
        style: node.style || {}
      }));
      setNodos(nodesWithStyle);
      prevInitialNodesRef.current = initialNodes;
    }
  }, [initialNodes]);

  const prevInitialEdgesRef = useRef();
  
  useEffect(() => {
    if (!Array.isArray(initialEdges)) return;
    
    if (isInitialLoadRef.current && initialEdges.length > 0) {
      setConexiones(initialEdges);
      prevInitialEdgesRef.current = initialEdges;
      return;
    }
    
    if (prevInitialEdgesRef.current === initialEdges) {
      return;
    }
    
    const hasRealChanges = initialEdges.length !== conexiones.length;
    
    if (hasRealChanges) {
      setConexiones(initialEdges);
      prevInitialEdgesRef.current = initialEdges;
    }
  }, [initialEdges]);


  useEffect(() => {
    if (onNodesChangeProp) {
      onNodesChangeProp(nodos);
    }
  }, [nodos, onNodesChangeProp]);

  useEffect(() => {
    if (onEdgesChangeProp) {
      onEdgesChangeProp(conexiones);
    }
  }, [conexiones, onEdgesChangeProp]);

  /**
   * Gestiona la creación de nuevas conexiones entre nodos
   * @param {Object} params - Parámetros de la conexión (source, target, handles)
   */
  const onConnect = useCallback(
    (params) => {
      setConexiones((eds) => {
        const { source, target, sourceHandle, targetHandle } = params || {};

        if (!source || !target) {
          toast.error('Conexión inválida');
          return eds;
        }

        if (source === target) {
          toast.warning('No puedes conectar un nodo a sí mismo');
          return eds;
        }

        const duplicateExists = eds.some(
          (e) => 
            (e.source === source && e.target === target) ||
            (e.source === target && e.target === source)
        );

        if (duplicateExists) {
          toast.info('La conexión ya existe');
          return eds;
        }

        return addEdge(params, eds);
      });
    },
    [setConexiones, toast]
  );

  /**
   * Permite el arrastre sobre el canvas
   * @param {DragEvent} event - Evento de arrastre
   */
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  /**
   * Gestiona la acción de soltar un nodo en el canvas
   * @param {DragEvent} event - Evento de soltar
   */
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const nodeDataString = event.dataTransfer.getData('application/reactflow');

      if (!nodeDataString) {
        console.log('No hay datos en el drop');
        return;
      }

      try {
        const nodeData = JSON.parse(nodeDataString);
        console.log('Datos del nodo dropeado:', nodeData);

        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        console.log('Posición calculada:', position);

        const newNodeId = `${nodeData.type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

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

        setNodos((nds) => {
          console.log('Nodos actuales:', nds);
          const updated = [...nds, newNode];
          console.log('Nodos actualizados:', updated);
          return updated;
        });

        agregarNodoReciente(nodeData);

        toast.success(`Nodo "${nodeData.label}" agregado al canvas`);
      } catch (error) {
        console.error('Error al procesar el drop:', error);
        toast.error('Error al agregar el nodo');
      }
    },
    [screenToFlowPosition, setNodos, toast, agregarNodoReciente]
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Delete' || event.key === 'Supr') {
        const selectedNodes = nodos.filter((node) => node.selected);

        if (selectedNodes.length > 0 && onDeleteRequest) {
          event.preventDefault();
          onDeleteRequest(selectedNodes);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [nodos, onDeleteRequest]);

  /**
   * Gestiona el clic en un nodo para mostrar su descripción
   * @param {Event} _event - Evento de clic (no utilizado)
   * @param {Object} node - Nodo clickeado
   */
  const handleNodeClick = useCallback((_event, node) => {
    if (node.data?.description && node.data.description.trim() !== '') {
      const nodeElement = document.querySelector(`[data-id="${node.id}"]`);
      if (nodeElement) {
        const rect = nodeElement.getBoundingClientRect();
        setSelectedNodeForDescription({
          node,
          nodePosition: rect,
        });
      } else {
        setSelectedNodeForDescription({
          node,
          nodePosition: null,
        });
      }
    } else {
      setSelectedNodeForDescription(null);
    }
  }, []);

  /**
   * Gestiona el hover sobre un nodo en dispositivos desktop
   * @param {Event} _event - Evento de mouse (no utilizado)
   * @param {Object} node - Nodo sobre el que se hace hover
   */
  const handleNodeMouseEnter = useCallback((_event, node) => {
    if (isDraggingRef.current) return;
    
    const hasHover = window.matchMedia('(hover: hover)').matches;
    
    if (!hasHover) return;
    
    if (node.data?.description && node.data.description.trim() !== '') {
      const nodeElement = document.querySelector(`[data-id="${node.id}"]`);
      if (nodeElement) {
        const rect = nodeElement.getBoundingClientRect();
        hoverTimeoutRef.current = setTimeout(() => {
          setSelectedNodeForDescription({
            node,
            nodePosition: rect,
          });
        }, 800);
      }
    }
  }, []);

  /**
   * Gestiona la salida del hover de un nodo
   */
  const handleNodeMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setSelectedNodeForDescription(null);
  }, []);

  return (
    <section className="flowmap">
      <section className="flowmap__wrap" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodos}
          edges={conexiones}
          onNodesChange={handleNodesChange}
          onEdgesChange={onConexionesChange}
          onConnect={onConnect}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onNodeDoubleClick={onNodeDoubleClick}
          onEdgeDoubleClick={onEdgeDoubleClick}
          onNodeClick={handleNodeClick}
          onNodeMouseEnter={handleNodeMouseEnter}
          onNodeMouseLeave={handleNodeMouseLeave}
          nodeTypes={tiposNodos}
          edgeTypes={tiposEdges}
          connectionRadius={30}
          nodesDraggable={true}
          nodesConnectable={true}
          elementsSelectable={true}
          fitView
          attributionPosition="bottom-left"
          zoomOnScroll={false}
          panOnScroll={false}
          preventScrolling={false}
        >
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
      </section>

      <NodeDescriptionPopup
        isOpen={!!selectedNodeForDescription}
        onClose={() => setSelectedNodeForDescription(null)}
        node={selectedNodeForDescription?.node}
        nodePosition={selectedNodeForDescription?.nodePosition}
      />
    </section>
  );

}




export default FlowMap;

