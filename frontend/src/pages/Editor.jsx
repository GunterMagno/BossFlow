import "./Editor.css";
import { useEffect, useState } from "react";
import { ReactFlowProvider } from 'reactflow'
import { useParams } from 'react-router-dom'
import FlowMap from "../components/FlowMap/FlowMap";
import Toolbar from "../components/Toolbar/Toolbar";
import EditorSidebar from "../components/EditorSidebar/EditorSidebar";
import { getDiagramById } from '../services/diagramService';

function Editor() {
  const { diagramaId } = useParams();

  /*Usado el diagramId para cargar el diagrama desde la base de datos. Además se gestiona el estado de carga (loading) y errores al obtener el diagrama. Envia los nodos y conexiones cargados al componente FlowMap. */
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!diagramaId) return; // nuevo diagrama: estado inicial vacío

    // indica si el componente sigue activo para evitar actualizar estado. 
    let activo = true;
    const cargarDiagrama = async () => {
      setLoading(true);
      setError(null);
      try {
        const diagram = await getDiagramById(diagramaId);
        if (!activo) return;
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
  }, [diagramaId]);


  const handleAddNode = (nodeType) => {
    console.log('Añadir nodo:', nodeType);
    // TODO: Implementar lógica para añadir nodo al canvas
  };

  return (
    <ReactFlowProvider>
      <div className="editor__page">
        <Toolbar />

        <EditorSidebar onAddNode={handleAddNode} />

        <main className="editor__canvas">
          <FlowMap initialNodes={nodes} initialEdges={edges} />
        </main>
      </div>
    </ReactFlowProvider>
  );
}

export default Editor;