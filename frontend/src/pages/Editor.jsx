import "./Editor.css";
import { ReactFlowProvider } from 'reactflow'
import FlowMap from "../components/FlowMap/FlowMap";

function Editor() {
  const { diagramaId } = useParams();

   /*TODO: cuando en el backend esté implementado GET /api/diagrams/:id, usar el diagramId para cargar el diagrama desde la base de datos. Hay que gestionar el estado de carga (loading) y errores al obtener el diagrama. Enviar los nodos y aristas cargados al componente FlowMap. */

  return (
    <ReactFlowProvider>
      <div className="editor__page">
        {/* <Toolbar /> */}

        <main className="editor__main">
          {/* <Sidebar /> */}

          {/* Componente que contiene el canvas principal */}
          <FlowMap />
        </main>
      </div>
    </ReactFlowProvider>
  );
}

export default Editor;