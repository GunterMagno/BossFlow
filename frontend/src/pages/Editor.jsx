import "./Editor.css";
import { useEffect } from "react";
import { ReactFlowProvider } from 'reactflow'
import { useParams } from 'react-router-dom'
import FlowMap from "../components/FlowMap/FlowMap";
import Toolbar from "../components/Toolbar/Toolbar";
import Sidebar from "../components/Sidebar/Sidebar";

function Editor() {
  const { diagramaId } = useParams();

  /*TODO: cuando en el backend esté implementado GET /api/diagrams/:id, usar el diagramId para cargar el diagrama desde la base de datos. Hay que gestionar el estado de carga (loading) y errores al obtener el diagrama. Enviar los nodos y aristas cargados al componente FlowMap. */


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
        <Toolbar />

        <Sidebar />

        {/* Componente que contiene el canvas principal */}
        <main className="editor__canvas">
          <FlowMap />
        </main>
      </div>
    </ReactFlowProvider>
  );
}

export default Editor;