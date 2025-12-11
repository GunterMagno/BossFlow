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
 * Página del editor de diagramas con canvas interactivo
 * Gestiona la carga, edición, guardado y exportación de diagramas
 * @returns {JSX.Element} Editor completo con toolbar, sidebar y canvas
 */
function Editor() {
  const { diagramId } = useParams();
  const navigate = useNavigate();

  /* Se usa el diagramId para cargar el diagrama desde la base de datos. Se gestiona el estado de carga (loading), el estado de guardado (saving) y errores al obtener el diagrama. Se envían los nodos y conexiones cargados al componente FlowMap. Se muestra feedback al usuario mediante toast. */
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
   * Alterna la visibilidad del sidebar en modo móvil
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
   * Cierra el modal de nuevo diagrama y redirige al dashboard
   */
  const handleCloseNewDiagramModal = () => {
    setIsNewDiagramModalOpen(false);
    navigate('/dashboard', { replace: true });
  };

  useEffect(() => {
    if (!diagramId || diagramId === 'new') return;

    let activo = true;
    const cargarDiagrama = async () => {
      setLoading(true);
      try {
        const response = await getDiagramById(diagramId);
        if (!activo) return;
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
                        console.error('Error al eliminar imagen del servidor:', error);
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
          console.error('Error registrando actividad de visualización:', e);
        }
      } catch (error) {
        if (!activo) return;
        console.error('Error obteniendo el diagrama:', error);
        toast.error('Error al cargar el diagrama');
        setNodes([]);
        setEdges([]);
      } finally {
        if (activo) setLoading(false);
      }
    };

    cargarDiagrama();

    return () => { activo = false; };
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
   * Actualiza el estado de los nodos cuando cambian en el mapa de flujo.
   * @param {Array} updatedNodes - Array de nodos actualizado.
   */
  const handleNodesChange = useCallback((updatedNodes) => {
    setNodes(updatedNodes);
  }, []);

  /**
   * Actualiza el estado de las conexiones cuando cambian en el mapa de flujo.
   * @param {Array} updatedEdges - Array de conexiones actualizado.
   */
  const handleEdgesChange = useCallback((updatedEdges) => {
    setEdges(updatedEdges);
  }, []);

  /**
   * Guarda el diagrama en el servidor con opción de guardado automático
   * @param {boolean} [isAutoSave=false] - Indica si es un guardado automático
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
      
      console.log('💾 Guardando diagrama con nodos:', nodes);
      
      await updateDiagram(diagramId, diagramData);
      if (!isAutoSave) {
        toast.success('Diagrama guardado correctamente');
      }
        try {
          registerActivity(ACTIVITY_TYPES.EDIT, diagramTitle || 'Diagrama', diagramId);
        } catch (e) {
          console.error('Error registrando actividad de edición:', e);
        }
    } catch (error) {
      console.error('Error al guardar diagrama:', error);
      const errorMessage = error.response?.data?.error || 'Error al guardar el diagrama';
      if (!isAutoSave) {
        toast.error(errorMessage);
      }
    } finally {
      setSaving(false);
    }
  };

  /**
   * Maneja la subida de una imagen global al diagrama.
   * @param {Object} imageData - Datos de la imagen subida.
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
   * Agrega un nuevo nodo al diagrama.
   * @param {Object} nodeData - Datos del nodo a agregar.
   */
  const handleAddNode = useCallback((nodeData) => {
    console.log('Añadir nodo:', nodeData);

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
   * Cierra el modal de edición de nodo.
   */
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedNode(null);
  }, []);

  /**
   * Referencia para almacenar la función de actualización de nodos desde FlowMap.
   */
  const updateNodeInFlowMapRef = useRef(null);

  /**
   * Referencia para almacenar la función de eliminación de nodos desde FlowMap.
   */
  const deleteNodesInFlowMapRef = useRef(null);

  /**
   * Guarda los cambios realizados a un nodo editado.
   * @param {Object} updatedNode - Objeto del nodo actualizado.
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
   * Establece la función de actualización de nodos desde el componente FlowMap.
   * @param {Function} updateFn - Función para actualizar un nodo en el mapa de flujo.
   */
  const handleSetUpdateNodeFunction = useCallback((updateFn) => {
    updateNodeInFlowMapRef.current = updateFn;
  }, []);

  /**
   * Establece la función de eliminación de nodos desde el componente FlowMap.
   * @param {Function} deleteFn - Función para eliminar nodos en el mapa de flujo.
   */
  const handleSetDeleteNodesFunction = useCallback((deleteFn) => {
    deleteNodesInFlowMapRef.current = deleteFn;
  }, []);

  /**
   * Inicia el proceso de eliminación de nodos seleccionados.
   * @param {Array} selectedNodes - Array de nodos seleccionados para eliminar.
   */
  const handleDeleteRequest = useCallback((selectedNodes) => {
    if (selectedNodes && selectedNodes.length > 0) {
      setNodesToDelete(selectedNodes);
      setIsConfirmDeleteOpen(true);
    }
  }, []);

  /**
   * Confirma la eliminación de los nodos seleccionados.
   * Elimina los nodos del mapa de flujo y del estado local.
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
   * Cancela el proceso de eliminación de nodos.
   */
  const handleCancelDelete = useCallback(() => {
    setNodesToDelete([]);
    setIsConfirmDeleteOpen(false);
  }, []);

  /**
   * Elimina un nodo específico iniciando el proceso de confirmación de eliminación.
   * @param {string} nodeId - Identificador del nodo a eliminar.
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
   * Solicita la limpieza del lienzo (canvas). Muestra confirmación si hay nodos o conexiones.
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
 * Componente interno que maneja las operaciones de exportación del diagrama.
 * @param {Object} props - Props del componente.
 * @param {boolean} props.isOpen - Indica si el modal de exportación está abierto.
 * @param {Function} props.onClose - Función para cerrar el modal.
 * @param {string} props.diagramTitle - Título del diagrama a exportar.
 * @param {boolean} props.isExporting - Indica si se está exportando.
 * @param {Function} props.setIsExporting - Función para establecer el estado de exportación.
 * @param {Object} props.toast - Objeto de notificaciones toast.
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
