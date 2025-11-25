import "./Editor.css";
import { useEffect, useState, useCallback } from "react";
import { ReactFlowProvider } from 'reactflow'
import { useParams } from 'react-router-dom'
import FlowMap from "../components/FlowMap/FlowMap";
import Toolbar from "../components/Toolbar/Toolbar";
import Sidebar from "../components/Sidebar/Sidebar";
import { getDiagramById, updateDiagram } from '../services/diagramService';
import { useToast } from '../context/ToastContext';

function Editor() {
  const { diagramId } = useParams();

  /*Usado el diagramId para cargar el diagrama desde la base de datos. Además se gestiona el estado de carga (loading), el estado de guardado (saving) y errores al obtener el diagrama. Envia los nodos y conexiones cargados al componente FlowMap. Y además, se muestra feedback al usuario mediante toast.*/
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
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
    } catch (error) {
      console.error('Error al guardar diagrama:', error);
      const errorMessage = error.response?.data?.error || 'Error al guardar el diagrama';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // Para que haga scroll al principio de la página
  useEffect(() => {
    const offset = window.innerHeight * 0.07; // 10vh
    window.scrollTo({
      top: offset,
      behavior: "smooth" 
    });
  }, []);

  return (
    <ReactFlowProvider>
      <div className="editor__page">
        <Toolbar onSave={handleSave} saving={saving} />

        <Sidebar />

        {/* Componente que contiene el canvas principal */}
        <main className="editor__canvas">
          <FlowMap 
            initialNodes={nodes} 
            initialEdges={edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={handleEdgesChange}
          />
        </main>
      </div>
    </ReactFlowProvider>
  );
}

export default Editor;