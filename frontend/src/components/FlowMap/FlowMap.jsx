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
 * Main flow diagram editor component.
 * @param {Object} props - Component properties
 * @param {Array} [props.initialNodes=[]] - Initial diagram nodes
 * @param {Array} [props.initialEdges=[]] - Initial diagram connections
 * @param {Function} props.onNodesChange - Callback executed when nodes change
 * @param {Function} props.onEdgesChange - Callback executed when connections change
 * @param {Function} props.onNodeDoubleClick - Callback for double-click on a node
 * @param {Function} props.onEdgeDoubleClick - Callback for double-click on a connection
 * @param {Function} props.onSetUpdateNodeFunction - Exposes the node update function
 * @param {Function} props.onSetDeleteNodesFunction - Exposes the node deletion function
 * @param {Function} props.onDeleteRequest - Callback for deletion requests
 * @param {Function} props.onRecentNodesChange - Callback when recent nodes change
 * @returns {JSX.Element} Interactive diagram editor
 */
function FlowMap({ initialNodes = [], initialEdges = [], onNodesChange: onNodesChangeProp, onEdgesChange: onEdgesChangeProp, onNodeDoubleClick, onEdgeDoubleClick, onSetUpdateNodeFunction, onSetDeleteNodesFunction, onDeleteRequest, onRecentNodesChange }) {
  const [nodes, setNodes, onNodesChangeInternal] = useNodesState(Array.isArray(initialNodes) ? initialNodes : []);
  const [edges, setEdges, onEdgesChangeInternal] = useEdgesState(Array.isArray(initialEdges) ? initialEdges : []);
  const [selectedNodeForDescription, setSelectedNodeForDescription] = useState(null);
  const toast = useToast();
  const reactFlowWrapper = useRef(null);
  const { screenToFlowPosition } = useReactFlow();
  const { recentNodes, addRecentNode } = useRecentNodes();
  const hoverTimeoutRef = useRef(null);
  const isDraggingRef = useRef(false);

  /**
   * Manages node changes by detecting drag events.
   * @param {Array} changes - Array of changes applied to nodes
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
    
    onNodesChangeInternal(changes);
  }, [onNodesChangeInternal]);

  useEffect(() => {
    if (onRecentNodesChange) {
      onRecentNodesChange(recentNodes);
    }
  }, [recentNodes, onRecentNodesChange]);

  /**
   * Updates data for a specific node.
   * @param {Object} updatedNode - Node with updated data
   */
  const updateNode = useCallback((updatedNode) => {
    setNodes((nds) =>
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
  }, [setNodes]);

  /**
   * Deletes one or multiple nodes and their associated connections.
   * @param {Array<string>} nodeIdsToDelete - Array of node IDs to delete
   */
  const deleteNodes = useCallback((nodeIdsToDelete) => {
    setNodes((nds) => nds.filter((node) => !nodeIdsToDelete.includes(node.id)));
    setEdges((eds) =>
      eds.filter((edge) =>
        !nodeIdsToDelete.includes(edge.source) && !nodeIdsToDelete.includes(edge.target)
      )
    );
  }, [setNodes, setEdges]);

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
      setNodes(nodesWithStyle);
      prevInitialNodesRef.current = initialNodes;
      isInitialLoadRef.current = false;
      return;
    }
    
    if (prevInitialNodesRef.current === initialNodes) {
      return;
    }
    
    if (initialNodes.length !== nodes.length) {
      const nodesWithStyle = initialNodes.map(node => ({
        ...node,
        style: node.style || {}
      }));
      setNodes(nodesWithStyle);
      prevInitialNodesRef.current = initialNodes;
    }
  }, [initialNodes]);

  const prevInitialEdgesRef = useRef();
  
  useEffect(() => {
    if (!Array.isArray(initialEdges)) return;
    
    if (isInitialLoadRef.current && initialEdges.length > 0) {
      setEdges(initialEdges);
      prevInitialEdgesRef.current = initialEdges;
      return;
    }
    
    if (prevInitialEdgesRef.current === initialEdges) {
      return;
    }
    
    const hasRealChanges = initialEdges.length !== edges.length;
    
    if (hasRealChanges) {
      setEdges(initialEdges);
      prevInitialEdgesRef.current = initialEdges;
    }
  }, [initialEdges]);


  useEffect(() => {
    if (onNodesChangeProp) {
      onNodesChangeProp(nodes);
    }
  }, [nodes, onNodesChangeProp]);

  useEffect(() => {
    if (onEdgesChangeProp) {
      onEdgesChangeProp(edges);
    }
  }, [edges, onEdgesChangeProp]);

  /**
   * Manages creation of new connections between nodes.
   * @param {Object} params - Connection parameters (source, target, handles)
   */
  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => {
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
    [setEdges, toast]
  );

  /**
   * Allows dragging over the canvas.
   * @param {DragEvent} event - Drag event
   */
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  /**
   * Handles the action of dropping a node on the canvas.
   * @param {DragEvent} event - Drop event
   */
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const nodeDataString = event.dataTransfer.getData('application/reactflow');

      if (!nodeDataString) {
        console.log('No data in drop');
        return;
      }

      try {
        const nodeData = JSON.parse(nodeDataString);
        console.log('Dropped node data:', nodeData);

        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        console.log('Calculated position:', position);

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

        console.log('New node to create:', newNode);

        setNodes((nds) => {
          console.log('Current nodes:', nds);
          const updated = [...nds, newNode];
          console.log('Updated nodes:', updated);
          return updated;
        });

        addRecentNode(nodeData);

        toast.success(`Nodo "${nodeData.label}" agregado al canvas`);
      } catch (error) {
        console.error('Error processing drop:', error);
        toast.error('Error al agregar el nodo');
      }
    },
    [screenToFlowPosition, setNodes, toast, addRecentNode]
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Delete' || event.key === 'Supr') {
        const selectedNodes = nodes.filter((node) => node.selected);

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
  }, [nodes, onDeleteRequest]);

  /**
   * Handles clicking on a node to show its description.
   * @param {Event} _event - Click event (unused)
   * @param {Object} node - Clicked node
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
   * Handles hovering over a node on desktop devices.
   * @param {Event} _event - Mouse event (unused)
   * @param {Object} node - Node being hovered over
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
   * Handles exiting hover from a node.
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
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={onEdgesChangeInternal}
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

