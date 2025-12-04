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

  // Wrapper para detectar cuando se está arrastrando
  const handleNodesChange = useCallback((changes) => {
    // Detectar si algún cambio es un evento de drag
    const isDragging = changes.some(change => 
      change.type === 'position' && change.dragging === true
    );
    
    if (isDragging) {
      isDraggingRef.current = true;
      // Cancelar hover mientras se arrastra
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
      setSelectedNodeForDescription(null);
    } else if (changes.some(change => change.type === 'position' && change.dragging === false)) {
      isDraggingRef.current = false;
    }
    
    // Llamar al handler original
    onNodosChange(changes);
  }, [onNodosChange]);

  // Notifica al padre cuando cambien los nodos recientes
  useEffect(() => {
    if (onRecentNodesChange) {
      onRecentNodesChange(nodosRecientes);
    }
  }, [nodosRecientes, onRecentNodesChange]);

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
  const prevInitialNodesRef = useRef();
  
  useEffect(() => {
    if (!Array.isArray(initialNodes)) return;
    
    if (isInitialLoadRef.current && initialNodes.length > 0) {
      // Preservar el estilo (width, height) de los nodos al cargar
      const nodesWithStyle = initialNodes.map(node => ({
        ...node,
        style: node.style || {}
      }));
      setNodos(nodesWithStyle);
      prevInitialNodesRef.current = initialNodes;
      isInitialLoadRef.current = false;
      return;
    }
    
    // Evitar actualizaciones si es la misma referencia
    if (prevInitialNodesRef.current === initialNodes) {
      return;
    }
    
    // Solo actualizar si la longitud cambió (nuevo nodo añadido o eliminado desde fuera)
    if (initialNodes.length !== nodos.length) {
      const nodesWithStyle = initialNodes.map(node => ({
        ...node,
        style: node.style || {}
      }));
      setNodos(nodesWithStyle);
      prevInitialNodesRef.current = initialNodes;
    }
  }, [initialNodes]);

  // Igual para edges, inicializa en la primera carga
  const prevInitialEdgesRef = useRef();
  
  useEffect(() => {
    if (!Array.isArray(initialEdges)) return;
    
    // Solo actualizar en la carga inicial
    if (isInitialLoadRef.current && initialEdges.length > 0) {
      setConexiones(initialEdges);
      prevInitialEdgesRef.current = initialEdges;
      return;
    }
    
    // Evitar actualizaciones si es la misma referencia
    if (prevInitialEdgesRef.current === initialEdges) {
      return;
    }
    
    // Solo actualizar si viene del backend (cambio real desde fuera)
    // No actualizar si son cambios locales del usuario
    const hasRealChanges = initialEdges.length !== conexiones.length;
    
    if (hasRealChanges) {
      setConexiones(initialEdges);
      prevInitialEdgesRef.current = initialEdges;
    }
  }, [initialEdges]);


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

        // Validar que la conexión exacta no exista (mismo source y target)
        // No validar handles exactos porque pueden variar
        const duplicateExists = eds.some(
          (e) => 
            e.source === source && 
            e.target === target
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

        // Registra el nodo en la lista de recientes
        agregarNodoReciente(nodeData);

        toast.success(`Nodo "${nodeData.label}" agregado al canvas`);
      } catch (error) {
        console.error('Error al procesar el drop:', error);
        toast.error('Error al agregar el nodo');
      }
    },
    [screenToFlowPosition, setNodos, toast, agregarNodoReciente]
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

  // Manejador de clic en nodo para mostrar descripción (en mobile: tap)
  const handleNodeClick = useCallback((_event, node) => {
    // Solo mostrar popup si existe descripción no vacía
    if (node.data?.description && node.data.description.trim() !== '') {
      // Calcular posición del nodo en la pantalla
      const nodeElement = document.querySelector(`[data-id="${node.id}"]`);
      if (nodeElement) {
        const rect = nodeElement.getBoundingClientRect();
        setSelectedNodeForDescription({
          node,
          nodePosition: rect,
        });
      } else {
        // Fallback si no se encuentra el elemento
        setSelectedNodeForDescription({
          node,
          nodePosition: null,
        });
      }
    } else {
      // Cerrar tooltip si hacemos clic en un nodo sin descripción
      setSelectedNodeForDescription(null);
    }
  }, []);

  // Manejador de hover en nodo (solo desktop)
  const handleNodeMouseEnter = useCallback((_event, node) => {
    // No mostrar hover si se está arrastrando
    if (isDraggingRef.current) return;
    
    // Detectar si es device con hover (desktop)
    const hasHover = window.matchMedia('(hover: hover)').matches;
    
    if (!hasHover) return; // No hacer nada en mobile
    
    // Solo mostrar popup si existe descripción no vacía
    if (node.data?.description && node.data.description.trim() !== '') {
      // Calcular posición del nodo en la pantalla
      const nodeElement = document.querySelector(`[data-id="${node.id}"]`);
      if (nodeElement) {
        const rect = nodeElement.getBoundingClientRect();
        // Añadir delay de 800ms antes de mostrar el popup
        hoverTimeoutRef.current = setTimeout(() => {
          setSelectedNodeForDescription({
            node,
            nodePosition: rect,
          });
        }, 800);
      }
    }
  }, []);

  // Manejador de mouse leave en nodo (solo desktop)
  const handleNodeMouseLeave = useCallback(() => {
    // Limpiar timeout si el usuario mueve el ratón antes de 800ms
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    // Cerrar el popup inmediatamente si ya estaba abierto
    setSelectedNodeForDescription(null);
  }, []);

  return (
    <section className="flowmap">
      <div className="flowmap__wrap" ref={reactFlowWrapper}>
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

      {/* Popup de descripción del nodo */}
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

