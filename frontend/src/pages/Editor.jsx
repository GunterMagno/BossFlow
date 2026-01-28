import "./Editor.css";
import { useEffect, useState, useCallback, useRef } from "react";
import { ReactFlowProvider } from 'reactflow'
import { useParams, useNavigate } from 'react-router-dom'
import FlowMap from "../components/FlowMap/FlowMap";
import Toolbar from "../components/Toolbar/Toolbar";
import EditorSidebar from "../components/EditorSidebar/EditorSidebar";
import MobileNodePanel from "../components/MobileNodePanel/MobileNodePanel";
import NodeEditModal from "../components/NodeEditModal/NodeEditModal";
import ConfirmDialog from "../components/ConfirmDialog/ConfirmDialog";
import UploadImageModal from "../components/UploadImageModal/UploadImageModal";
import NewDiagramModal from "../components/NewDiagramModal/NewDiagramModal";
import ExportModal from "../components/ExportModal/ExportModal";
import { useExportDiagram } from "../hooks/useExportDiagram";
import { getDiagramById, updateDiagram } from '../services/diagramService';
import { deleteImage } from '../services/imageService';
import { registerActivity, ACTIVITY_TYPES } from '../services/activityService';
import { useToast } from '../context/ToastContext';
import { FaSave } from 'react-icons/fa';
import { FiTrash2, FiImage, FiDownload } from 'react-icons/fi';

/**
 * Diagram editor page with interactive canvas
 * Manages loading, editing, saving and exporting diagrams
 * @returns {JSX.Element} Complete editor with toolbar, sidebar and canvas
 */
function Editor() {
  const { diagramId } = useParams();
  const navigate = useNavigate();

  /* The diagramId is used to load the diagram from the database. Loading state, saving state and errors when fetching the diagram are managed. Loaded nodes and connections are sent to the FlowMap component. User feedback is shown via toast. */
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [diagramTitle, setDiagramTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [nodesToDelete, setNodesToDelete] = useState([]);
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUploadImageModalOpen, setIsUploadImageModalOpen] = useState(false);
  const [isNewDiagramModalOpen, setIsNewDiagramModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [recentNodes, setRecentNodes] = useState([]);
  const toast = useToast();
  const autoSaveTimeoutRef = useRef(null);
  const isInitialLoadRef = useRef(true);

  /**
   * Toggles sidebar visibility in mobile mode
   */
  const toggleSidebar = () => {
    setIsSidebarOpen((v) => !v);
  };

  useEffect(() => {
    if (diagramId === 'new') {
      setIsNewDiagramModalOpen(true);
    }
  }, [diagramId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const navbar = document.querySelector('.navbar, nav, header');
      if (navbar) {
        const navbarHeight = navbar.offsetHeight;
        window.scrollTo({
          top: navbarHeight,
          behavior: 'smooth'
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  /**
   * Closes the new diagram modal and redirects to dashboard
   */
  const handleCloseNewDiagramModal = () => {
    setIsNewDiagramModalOpen(false);
    navigate('/dashboard', { replace: true });
  };

  useEffect(() => {
    if (!diagramId || diagramId === 'new') return;

    let active = true;
    const loadDiagram = async () => {
      setLoading(true);
      try {
        const response = await getDiagramById(diagramId);
        if (!active) return;
        const diagram = response.diagram;

        const nodesWithCallbacks = Array.isArray(diagram.nodes) 
          ? diagram.nodes.map(node => {
              if (node.type === 'imageNode') {
                const imageUrl = node.data.image?.url;
                return {
                  ...node,
                  data: {
                    ...node.data,
                    image: {
                      ...node.data.image,
                      width: node.data.image?.width || 150,
                      height: node.data.image?.height || 150
                    },
                    onDelete: async () => {
                      try {
                        await deleteImage(imageUrl);
                      } catch (error) {
                        console.error('Error deleting image from server:', error);
                      }
                      setNodes((nds) => nds.filter((n) => n.id !== node.id));
                      toast.success('Imagen eliminada');
                    }
                  }
                };
              }
              return node;
            })
          : [];
        
        setNodes(nodesWithCallbacks);
        setEdges(Array.isArray(diagram.edges) ? diagram.edges : []);

        setDiagramTitle(diagram.title || '');
        try {
          registerActivity(ACTIVITY_TYPES.VIEW, diagram.title || 'Diagrama', diagram.id);
        } catch (e) {
          console.error('Error registering view activity:', e);
        }
      } catch (error) {
        if (!active) return;
        console.error('Error fetching diagram:', error);
        toast.error('Error al cargar el diagrama');
        setNodes([]);
        setEdges([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadDiagram();

    return () => { active = false; };
  }, [diagramId]);

  /**
   * Marca el final de la carga inicial cuando los datos se han cargado completamente.
   */
  useEffect(() => {
    if (!loading && diagramId) {
      const timer = setTimeout(() => {
        isInitialLoadRef.current = false;
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading, diagramId]);

  /**
   * Configura el guardado automático cuando cambian los nodos o conexiones.
   * Se guarda automáticamente 2 segundos después de la última modificación.
   */
  useEffect(() => {
    if (isInitialLoadRef.current || !diagramId) return;

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      handleSave(true);
    }, 2000);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [nodes, edges, diagramId]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Updates nodes state when they change in the flow map.
   * @param {Array} updatedNodes - Updated array of nodes.
   */
  const handleNodesChange = useCallback((updatedNodes) => {
    setNodes(updatedNodes);
  }, []);

  /**
   * Updates edges state when they change in the flow map.
   * @param {Array} updatedEdges - Updated array of edges.
   */
  const handleEdgesChange = useCallback((updatedEdges) => {
    setEdges(updatedEdges);
  }, []);

  /**
   * Saves the diagram to the server with auto-save option
   * @param {boolean} [isAutoSave=false] - Indicates if it's an auto-save
   */
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
      
      console.log('💾 Saving diagram with nodes:', nodes);
      
      await updateDiagram(diagramId, diagramData);
      if (!isAutoSave) {
        toast.success('Diagrama guardado correctamente');
      }
        try {
          registerActivity(ACTIVITY_TYPES.EDIT, diagramTitle || 'Diagrama', diagramId);
        } catch (e) {
          console.error('Error registering edit activity:', e);
        }
    } catch (error) {
      console.error('Error saving diagram:', error);
      const errorMessage = error.response?.data?.error || 'Error al guardar el diagrama';
      if (!isAutoSave) {
        toast.error(errorMessage);
      }
    } finally {
      setSaving(false);
    }
  };

  /**
   * Handles uploading a global image to the diagram.
   * @param {Object} imageData - Uploaded image data.
   */
  const handleGlobalImageUploaded = useCallback((imageData) => {
    const imageId = `image-${Date.now()}`;
    const imageNode = {
      id: imageId,
      type: 'imageNode',
      position: { x: 250, y: 100 },
      data: {
        image: {
          ...imageData,
          width: 150,
          height: 150
        },
        onDelete: async () => {
          try {
            await deleteImage(imageData.url);
          } catch (error) {
            console.error('Error al eliminar imagen del servidor:', error);
          }
          setNodes((nds) => nds.filter((n) => n.id !== imageId));
          toast.success('Imagen eliminada');
        }
      }
    };

    setNodes((nds) => [...nds, imageNode]);
    toast.success('Imagen añadida al diagrama');
  }, [toast]);

  /**
   * Adds a new node to the diagram.
   * @param {Object} nodeData - Data of the node to add.
   */
  const handleAddNode = useCallback((nodeData) => {
    console.log('Adding node:', nodeData);

    const newNodeId = `${nodeData.type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

    const randomOffset = () => Math.floor(Math.random() * 100) - 50;

    const newNode = {
      id: newNodeId,
      type: nodeData.type,
      position: {
        x: 250 + randomOffset(),
        y: 150 + randomOffset()
      },
      data: {
        title: nodeData.label || 'Nuevo nodo',
        icon: '⚡',
        description: nodeData.description || '',
      },
    };

    setNodes((currentNodes) => {
      const updatedNodes = [...currentNodes, newNode];
      console.log('Nodos actualizados:', updatedNodes);
      return updatedNodes;
    });

    toast.success(`Nodo "${nodeData.label}" agregado al canvas`);
  }, [toast]);

  /**
   * Abre el modal de edición cuando se hace doble clic en un nodo.
   * @param {Event} _event - Evento del doble clic.
   * @param {Object} node - Objeto del nodo seleccionado.
   */
  const handleNodeDoubleClick = useCallback((_event, node) => {
    if (node.type === 'imageNode') return;
    
    setSelectedNode(node);
    setIsModalOpen(true);
  }, []);

  /**
   * Closes the node edit modal.
   */
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedNode(null);
  }, []);

  /**
   * Reference to store the node update function from FlowMap.
   */
  const updateNodeInFlowMapRef = useRef(null);

  /**
   * Reference to store the node deletion function from FlowMap.
   */
  const deleteNodesInFlowMapRef = useRef(null);

  /**
   * Saves changes made to an edited node.
   * @param {Object} updatedNode - Updated node object.
   */
  const handleSaveNode = useCallback((updatedNode) => {
    if (updateNodeInFlowMapRef.current) {
      updateNodeInFlowMapRef.current(updatedNode);
    }

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

  /**
   * Sets the node update function from the FlowMap component.
   * @param {Function} updateFn - Function to update a node in the flow map.
   */
  const handleSetUpdateNodeFunction = useCallback((updateFn) => {
    updateNodeInFlowMapRef.current = updateFn;
  }, []);

  /**
   * Sets the node deletion function from the FlowMap component.
   * @param {Function} deleteFn - Function to delete nodes in the flow map.
   */
  const handleSetDeleteNodesFunction = useCallback((deleteFn) => {
    deleteNodesInFlowMapRef.current = deleteFn;
  }, []);

  /**
   * Initiates the deletion process for selected nodes.
   * @param {Array} selectedNodes - Array of selected nodes to delete.
   */
  const handleDeleteRequest = useCallback((selectedNodes) => {
    if (selectedNodes && selectedNodes.length > 0) {
      setNodesToDelete(selectedNodes);
      setIsConfirmDeleteOpen(true);
    }
  }, []);

  /**
   * Confirms deletion of selected nodes.
   * Removes nodes from flow map and local state.
   */
  const handleConfirmDelete = useCallback(() => {
    if (nodesToDelete.length > 0) {
      const nodeIdsToDelete = nodesToDelete.map((n) => n.id);

      if (deleteNodesInFlowMapRef.current) {
        deleteNodesInFlowMapRef.current(nodeIdsToDelete);
      }

      setNodes((nds) => nds.filter((node) => !nodeIdsToDelete.includes(node.id)));
      setEdges((eds) =>
        eds.filter((edge) =>
          !nodeIdsToDelete.includes(edge.source) && !nodeIdsToDelete.includes(edge.target)
        )
      );

      const count = nodesToDelete.length;
      toast.success(`${count} ${count === 1 ? 'nodo eliminado' : 'nodos eliminados'} correctamente`);

      setNodesToDelete([]);
      setIsConfirmDeleteOpen(false);
    }
  }, [nodesToDelete, toast]);

  /**
   * Cancels the node deletion process.
   */
  const handleCancelDelete = useCallback(() => {
    setNodesToDelete([]);
    setIsConfirmDeleteOpen(false);
  }, []);

  /**
   * Deletes a specific node by initiating the deletion confirmation process.
   * @param {string} nodeId - Identifier of the node to delete.
   */
  const handleDeleteNode = useCallback((nodeId) => {
    const nodeToDelete = nodes.find((n) => n.id === nodeId);
    if (nodeToDelete) {
      setNodesToDelete([nodeToDelete]);
      setIsConfirmDeleteOpen(true);
      setIsModalOpen(false);
      setSelectedNode(null);
    }
  }, [nodes]);

  /**
   * Requests canvas clearing. Shows confirmation if there are nodes or edges.
   */
  const handleClearRequest = useCallback(() => {
    if (nodes.length > 0 || edges.length > 0) {
      setIsConfirmClearOpen(true);
    } else {
      toast.info('El canvas ya está vacío');
    }
  }, [nodes.length, edges.length, toast]);

  /**
   * Confirma la limpieza del lienzo, eliminando todos los nodos y conexiones.
   */
  const handleConfirmClear = useCallback(() => {
    if (deleteNodesInFlowMapRef.current && nodes.length > 0) {
      const allNodeIds = nodes.map((n) => n.id);
      deleteNodesInFlowMapRef.current(allNodeIds);
    }

    setNodes([]);
    setEdges([]);

    toast.success('Canvas limpiado correctamente');
    setIsConfirmClearOpen(false);
  }, [nodes, toast]);

  /**
   * Cancela la limpieza del lienzo.
   */
  const handleCancelClear = useCallback(() => {
    setIsConfirmClearOpen(false);
  }, []);

  return (
    <ReactFlowProvider>
      <section className="editor__page">

        <EditorSidebar
          onAddNode={handleAddNode}
          className={isSidebarOpen ? 'editor-sidebar--open' : ''}
          onCloseSidebar={() => setIsSidebarOpen(false)}
          recentNodes={recentNodes}
        />

        <main className="editor__canvas">
          {loading && diagramId ? (
            <article className="editor__loading">
              <p>Cargando diagrama...</p>
            </article>
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
              onRecentNodesChange={setRecentNodes}
            />
          )}

          {/* Botones flotantes */}
          <aside className="editor__floating-actions">
            <button
              className="editor__floating-button editor__floating-button--image"
              onClick={() => setIsUploadImageModalOpen(true)}
              title="Subir imagen al diagrama"
            >
              <FiImage />
            </button>
            <button
              className="editor__floating-button editor__floating-button--save"
              onClick={() => handleSave()}
              disabled={saving}
              title={saving ? 'Guardando...' : 'Guardar diagrama'}
            >
              <FaSave />
            </button>
            <button
              className="editor__floating-button editor__floating-button--export"
              onClick={() => setIsExportModalOpen(true)}
              disabled={isExporting}
              title="Exportar diagrama"
            >
              <FiDownload />
            </button>
            <button
              className="editor__floating-button editor__floating-button--clear"
              onClick={handleClearRequest}
              title="Limpiar canvas"
            >
              <FiTrash2 />
            </button>
          </aside>
        </main>

        {/* Panel móvil de nodos */}
        <MobileNodePanel onAddNode={handleAddNode} />

        <NodeEditModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          node={selectedNode}
          onSave={handleSaveNode}
          onDelete={handleDeleteNode}
        />

        <UploadImageModal
          isOpen={isUploadImageModalOpen}
          onClose={() => setIsUploadImageModalOpen(false)}
          onImageUploaded={handleGlobalImageUploaded}
          title="Subir imagen al diagrama"
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

        <NewDiagramModal
          isOpen={isNewDiagramModalOpen}
          onClose={handleCloseNewDiagramModal}
        />

        {/* Modal de exportación */}
        <ExportHandler
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          diagramTitle={diagramTitle}
          isExporting={isExporting}
          setIsExporting={setIsExporting}
          toast={toast}
        />
      </section>
    </ReactFlowProvider>
  );
}

/**
 * Internal component that handles diagram export operations.
 * @param {Object} props - Component props.
 * @param {boolean} props.isOpen - Indicates if the export modal is open.
 * @param {Function} props.onClose - Function to close the modal.
 * @param {string} props.diagramTitle - Title of the diagram to export.
 * @param {boolean} props.isExporting - Indicates if exporting is in progress.
 * @param {Function} props.setIsExporting - Function to set the export state.
 * @param {Object} props.toast - Toast notifications object.
 */
function ExportHandler({ isOpen, onClose, diagramTitle, isExporting, setIsExporting, toast }) {
  const { exportToPNG, exportToJSON } = useExportDiagram(diagramTitle || 'diagram');

  /**
   * Exporta el diagrama como archivo PNG.
   */
  const handleExportPNG = async () => {
    setIsExporting(true);
    try {
      await exportToPNG();
      toast.success('Diagrama exportado como PNG');
      onClose();
    } catch (error) {
      toast.error('Error al exportar PNG');
    } finally {
      setIsExporting(false);
    }
  };

  /**
   * Exporta el diagrama como archivo JSON.
   */
  const handleExportJSON = async () => {
    setIsExporting(true);
    try {
      await exportToJSON();
      toast.success('Diagrama exportado como JSON');
      onClose();
    } catch (error) {
      toast.error('Error al exportar JSON: ' + error.message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <ExportModal
      isOpen={isOpen}
      onClose={onClose}
      onExportPNG={handleExportPNG}
      onExportJSON={handleExportJSON}
      isExporting={isExporting}
    />
  );
}

export default Editor;