import "./Editor.css";
import { useEffect, useState, useCallback, useRef } from "react";
import { ReactFlowProvider } from 'reactflow'
import { useParams } from 'react-router-dom'
import FlowMap from "../components/FlowMap/FlowMap";
import Toolbar from "../components/Toolbar/Toolbar";
import EditorSidebar from "../components/EditorSidebar/EditorSidebar";
import NodeEditModal from "../components/NodeEditModal/NodeEditModal";
import { getDiagramById, updateDiagram } from '../services/diagramService';
import { registerActivity, ACTIVITY_TYPES } from '../services/activityService';
import { useToast } from '../context/ToastContext';

function Editor() {
  const { diagramId } = useParams();

  /*Usado el diagramId para cargar el diagrama desde la base de datos. Además se gestiona el estado de carga (loading), el estado de guardado (saving) y errores al obtener el diagrama. Envia los nodos y conexiones cargados al componente FlowMap. Y además, se muestra feedback al usuario mediante toast.*/
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [diagramTitle, setDiagramTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const toast = useToast();

  useEffect(() => {
    if (!diagramId) return; // nuevo diagrama: estado inicial vacío

    // indica si el componente sigue activo para evitar actualizar estado. 
    let activo = true;
    const cargarDiagrama = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getDiagramById(diagramId);
        if (!activo) return;
        // La API devuelve { diagram: {...} }, así que se accede a response.diagram
        const diagram = response.diagram;

        // Si la API devuelve nodos/conexiones se utilizan. Si no, se crean vacíos
        setNodes(Array.isArray(diagram.nodes) ? diagram.nodes : []);
        setEdges(Array.isArray(diagram.edges) ? diagram.edges : []);

        // Guarda título para futuras actividades
        setDiagramTitle(diagram.title || '');
        // Registrar actividad de visualización
        try {
          registerActivity(ACTIVITY_TYPES.VIEW, diagram.title || 'Diagrama', diagram.id);
        } catch (e) {
          // no bloquear la carga si falla el registro de actividad
          console.error('Error registrando actividad de visualización:', e);
        }
      } catch (error) {
        if (!activo) return;
        console.error('Error obteniendo el diagrama:', error);
        setError(error);
        // En caso de error dejamos nodes/edges vacíos
        setNodes([]);
        setEdges([]);
      } finally {
        if (activo) setLoading(false);
      }
    };

    cargarDiagrama();

    return () => { activo = false; };
  }, [diagramId]);

  // Handlers para actualizar nodes y edges desde FlowMap
  const handleNodesChange = useCallback((updatedNodes) => {
    setNodes(updatedNodes);
  }, []);

  const handleEdgesChange = useCallback((updatedEdges) => {
    setEdges(updatedEdges);
  }, []);

  // Función asícronica para guardar el diagrama
  const handleSave = async () => {
    if (!diagramId) {
      toast.error('No se puede guardar: diagrama no encontrado');
      return;
    }

    setSaving(true);
    
      try {
      const diagramData = {
        nodes,
        edges
      };
      
      await updateDiagram(diagramId, diagramData);
      toast.success('Diagrama guardado correctamente');
        // Registra actividad de edición al guardar
        try {
          registerActivity(ACTIVITY_TYPES.EDIT, diagramTitle || 'Diagrama', diagramId);
        } catch (e) {
          console.error('Error registrando actividad de edición:', e);
        }
    } catch (error) {
      console.error('Error al guardar diagrama:', error);
      const errorMessage = error.response?.data?.error || 'Error al guardar el diagrama';
      toast.error(errorMessage);
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

  return (
    <ReactFlowProvider>
      <div className="editor__page">
        <Toolbar onSave={handleSave} saving={saving} />

        <EditorSidebar onAddNode={handleAddNode} />

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
            />
          )}
        </main>

        <NodeEditModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          node={selectedNode}
          onSave={handleSaveNode}
        />
      </div>
    </ReactFlowProvider>
  );
}

export default Editor;