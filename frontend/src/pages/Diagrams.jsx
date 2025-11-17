import "./Diagrams.css";
import { ReactFlowProvider } from 'reactflow'
import FlowMap from "../components/FlowMap/FlowMap";

function Diagrams() {
  return (
    <ReactFlowProvider>
      <div className="diagramas-page">
        <main className="diagramas__main">
          {/* Componente que contiene el mapa (React Flow) */}
          <FlowMap />
        </main>
      </div>
    </ReactFlowProvider>
  );
}

export default Diagrams;