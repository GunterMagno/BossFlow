import "./Editor.css";
import { useEffect, useState, useCallback, useRef } from "react";
import { ReactFlowProvider } from 'reactflow'
import { useParams } from 'react-router-dom'
import FlowMap from "../components/FlowMap/FlowMap";
import Toolbar from "../components/Toolbar/Toolbar";
import EditorSidebar from "../components/EditorSidebar/EditorSidebar";
import NodeEditModal from "../components/NodeEditModal/NodeEditModal";
import ConfirmDialog from "../components/ConfirmDialog/ConfirmDialog";
import { getDiagramById, updateDiagram } from '../services/diagramService';
import { registerActivity, ACTIVITY_TYPES } from '../services/activityService';
import { useToast } from '../context/ToastContext';

function Editor() {
  const { diagramId } = useParams();

  /* Se usa el diagramId para cargar el diagrama desde la base de datos. Se gestiona el estado de carga (loading), el estado de guardado (saving) y errores al obtener el diagrama. Se envían los nodos y conexiones cargados al componente FlowMap. Se muestra feedback al usuario mediante toast. */
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [diagramTitle, setDiagramTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [nodesToDelete, setNodesToDelete] = useState([]);
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toast = useToast();
  const autoSaveTimeoutRef = useRef(null);
  const isInitialLoadRef = useRef(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((v) => !v);
  };

  useEffect(() => {
    if (!diagramId) return; // Nuevo diagrama: estado inicial vacío

    // Indica si el componente sigue activo para evitar actualizar estado 
    let activo = true;
    const cargarDiagrama = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getDiagramById(diagramId);
        if (!activo) return;
        // La API devuelve { diagram: {...} }, así que se accede a response.diagram
        const diagram = response.diagram;

        // Si la API devuelve nodos/conexiones se utilizan, si no, se crean vacíos
        setNodes(Array.isArray(diagram.nodes) ? diagram.nodes : []);
        setEdges(Array.isArray(diagram.edges) ? diagram.edges : []);

        // Se guarda el título para futuras actividades
        setDiagramTitle(diagram.title || '');
        // Se registra la actividad de visualización
        try {
          registerActivity(ACTIVITY_TYPES.VIEW, diagram.title || 'Diagrama', diagram.id);
        } catch (e) {
          // No se bloquea la carga si falla el registro de actividad
          console.error('Error registrando actividad de visualización:', e);
        }
      } catch (error) {
        if (!activo) return;
        console.error('Error obteniendo el diagrama:', error);
        setError(error);
        // En caso de error se dejan nodes/edges vacíos
        setNodes([]);
        setEdges([]);
      } finally {
        if (activo) setLoading(false);
      }
    };

    cargarDiagrama();

    return () => { activo = false; };
  }, [diagramId]);

  // Marca que la carga inicial ha terminado
  useEffect(() => {
    if (!loading && diagramId) {
      // Pequeño delay para asegurar que la carga inicial ha terminado
      const timer = setTimeout(() => {
        isInitialLoadRef.current = false;
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading, diagramId]);

  // Se activa el guardado automático cuando cambian nodos o conexiones
  useEffect(() => {
    // No se guarda durante la carga inicial
    if (isInitialLoadRef.current || !diagramId) return;

    // Se limpia el timeout anterior si existe
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Se configura un nuevo timeout para guardar después de 2 segundos de inactividad
    autoSaveTimeoutRef.current = setTimeout(() => {
      handleSave(true); // true indica que es guardado automático
    }, 2000);

    // Se limpia el timeout al desmontar o cuando cambien las dependencias
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [nodes, edges, diagramId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Se actualizan nodes y edges desde FlowMap
  const handleNodesChange = useCallback((updatedNodes) => {
    setNodes(updatedNodes);
  }, []);

  const handleEdgesChange = useCallback((updatedEdges) => {
    setEdges(updatedEdges);
  }, []);

  // Función asíncrona que guarda el diagrama
  const handleSave = async (isAutoSave = false) => {
    if (!diagramId) {
      if (!isAutoSave) {
        toast.error('No se puede guardar: diagrama no encontrado');
      }
      return;
    }

    setSaving(true);
    
      try {
      const diagramData = {
        nodes,
        edges
      };
      
      await updateDiagram(diagramId, diagramData);
      if (!isAutoSave) {
        toast.success('Diagrama guardado correctamente');
      }
        // Se registra la actividad de edición al guardar
        try {
          registerActivity(ACTIVITY_TYPES.EDIT, diagramTitle || 'Diagrama', diagramId);
        } catch (e) {
          console.error('Error registrando actividad de edición:', e);
        }
    } catch (error) {
      console.error('Error al guardar diagrama:', error);
      const errorMessage = error.response?.data?.error || 'Error al guardar el diagrama';
      // Solo se muestra el error si no es guardado automático
      if (!isAutoSave) {
        toast.error(errorMessage);
      }
    } finally {
      setSaving(false);
    }
  };


  const handleAddNode = (nodeType) => {
    console.log('Añadir nodo:', nodeType);
    // TODO: Implementar lógica para añadir nodo al canvas
  };

  // Función para abrir el modal de edición de nodo
  const handleNodeDoubleClick = useCallback((_event, node) => {
    setSelectedNode(node);
    setIsModalOpen(true);
  }, []);

  // Función para cerrar el modal
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedNode(null);
  }, []);

  // Ref para almacenar la función de actualización de nodos desde FlowMap
  const updateNodeInFlowMapRef = useRef(null);
  // Ref para almacenar la función de eliminación de nodos desde FlowMap
  const deleteNodesInFlowMapRef = useRef(null);

  // Función para guardar los cambios del nodo editado
  const handleSaveNode = useCallback((updatedNode) => {
    // Actualizar directamente en FlowMap si la función está disponible
    if (updateNodeInFlowMapRef.current) {
      updateNodeInFlowMapRef.current(updatedNode);
    }

    // También actualizar en el estado local del Editor
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
    toast.success('Nodo actualizado correctamente');
  }, [toast]);

  // Callback para recibir la función de actualización desde FlowMap
  const handleSetUpdateNodeFunction = useCallback((updateFn) => {
    updateNodeInFlowMapRef.current = updateFn;
  }, []);

  // Callback para recibir la función de eliminación desde FlowMap
  const handleSetDeleteNodesFunction = useCallback((deleteFn) => {
    deleteNodesInFlowMapRef.current = deleteFn;
  }, []);

  // Función para iniciar la eliminación de nodos (desde tecla Suprimir)
  const handleDeleteRequest = useCallback((selectedNodes) => {
    if (selectedNodes && selectedNodes.length > 0) {
      setNodesToDelete(selectedNodes);
      setIsConfirmDeleteOpen(true);
    }
  }, []);

  // Función para confirmar la eliminación de nodos
  const handleConfirmDelete = useCallback(() => {
    if (nodesToDelete.length > 0) {
      const nodeIdsToDelete = nodesToDelete.map((n) => n.id);

      // Eliminar directamente en FlowMap si la función está disponible
      if (deleteNodesInFlowMapRef.current) {
        deleteNodesInFlowMapRef.current(nodeIdsToDelete);
      }

      // También actualizar en el estado local del Editor
      setNodes((nds) => nds.filter((node) => !nodeIdsToDelete.includes(node.id)));
      setEdges((eds) =>
        eds.filter((edge) =>
          !nodeIdsToDelete.includes(edge.source) && !nodeIdsToDelete.includes(edge.target)
        )
      );

      const count = nodesToDelete.length;
      toast.success(`${count} ${count === 1 ? 'nodo eliminado' : 'nodos eliminados'} correctamente`);

      // Limpiar estado
      setNodesToDelete([]);
      setIsConfirmDeleteOpen(false);
    }
  }, [nodesToDelete, toast]);

  // Función para cancelar la eliminación
  const handleCancelDelete = useCallback(() => {
    setNodesToDelete([]);
    setIsConfirmDeleteOpen(false);
  }, []);

  // Función para eliminar un nodo específico (desde el modal de edición)
  const handleDeleteNode = useCallback((nodeId) => {
    const nodeToDelete = nodes.find((n) => n.id === nodeId);
    if (nodeToDelete) {
      setNodesToDelete([nodeToDelete]);
      setIsConfirmDeleteOpen(true);
      // Cerrar el modal de edición
      setIsModalOpen(false);
      setSelectedNode(null);
    }
  }, [nodes]);

  // Función para solicitar la limpieza del canvas
  const handleClearRequest = useCallback(() => {
    // Solo mostrar confirmación si hay nodos en el canvas
    if (nodes.length > 0 || edges.length > 0) {
      setIsConfirmClearOpen(true);
    } else {
      toast.info('El canvas ya está vacío');
    }
  }, [nodes.length, edges.length, toast]);

  // Función para confirmar la limpieza del canvas
  const handleConfirmClear = useCallback(() => {
    // Limpiar nodos y conexiones en FlowMap
    if (deleteNodesInFlowMapRef.current && nodes.length > 0) {
      const allNodeIds = nodes.map((n) => n.id);
      deleteNodesInFlowMapRef.current(allNodeIds);
    }

    // Limpiar estado local
    setNodes([]);
    setEdges([]);

    toast.success('Canvas limpiado correctamente');
    setIsConfirmClearOpen(false);
  }, [nodes, toast]);

  // Función para cancelar la limpieza
  const handleCancelClear = useCallback(() => {
    setIsConfirmClearOpen(false);
  }, []);

  return (
    <ReactFlowProvider>
      <div className="editor__page">
        <Toolbar onSave={handleSave} saving={saving} onClear={handleClearRequest} onToggleSidebar={toggleSidebar} />

        <EditorSidebar
          onAddNode={handleAddNode}
          className={isSidebarOpen ? 'editor-sidebar--open' : ''}
          onCloseSidebar={() => setIsSidebarOpen(false)}
        />

        <main className="editor__canvas">
          {loading && diagramId ? (
            <div className="editor__loading">
              <p>Cargando diagrama...</p>
            </div>
          ) : (
            <FlowMap
              initialNodes={nodes}
              initialEdges={edges}
              onNodesChange={handleNodesChange}
              onEdgesChange={handleEdgesChange}
              onNodeDoubleClick={handleNodeDoubleClick}
              onSetUpdateNodeFunction={handleSetUpdateNodeFunction}
              onSetDeleteNodesFunction={handleSetDeleteNodesFunction}
              onDeleteRequest={handleDeleteRequest}
            />
          )}
        </main>

        <NodeEditModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          node={selectedNode}
          onSave={handleSaveNode}
          onDelete={handleDeleteNode}
        />

        <ConfirmDialog
          isOpen={isConfirmDeleteOpen}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Confirmar eliminación"
          message={
            nodesToDelete.length === 1
              ? `¿Estás seguro de que deseas eliminar el nodo "${nodesToDelete[0]?.data?.title || 'Sin título'}"?`
              : `¿Estás seguro de que deseas eliminar ${nodesToDelete.length} nodos seleccionados?`
          }
          confirmText="Eliminar"
          cancelText="Cancelar"
          type="danger"
        />

        <ConfirmDialog
          isOpen={isConfirmClearOpen}
          onClose={handleCancelClear}
          onConfirm={handleConfirmClear}
          title="Limpiar canvas"
          message={`¿Estás seguro de que deseas limpiar todo el canvas? Se eliminarán todos los nodos (${nodes.length}) y conexiones (${edges.length}). Esta acción no se puede deshacer.`}
          confirmText="Limpiar todo"
          cancelText="Cancelar"
          type="danger"
        />
      </div>
    </ReactFlowProvider>
  );
}

export default Editor;