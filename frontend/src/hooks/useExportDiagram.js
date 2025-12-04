import { useReactFlow, getNodesBounds, getViewportForBounds, getRectOfNodes } from 'reactflow';
import { toPng, toSvg } from 'html-to-image';
import { CURRENT_VERSION } from '../utils/jsonValidator';

// Hook personalizado que se usa para manejar la exportación de diagramas
export function useExportDiagram(diagramName = 'diagrama') {
  const { getNodes, getEdges } = useReactFlow();

  // Se genera el nombre de archivo con fecha/hora
  const generateFileName = (extension) => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10); // YYYY-MM-DD
    const timeStr = now.toTimeString().slice(0, 5).replace(':', '-'); // HH-MM
    return `${diagramName}_${dateStr}_${timeStr}.${extension}`;
  };

  // Se descarga el archivo
  const downloadFile = (dataUrl, fileName) => {
    const a = document.createElement('a');
    a.setAttribute('download', fileName);
    a.setAttribute('href', dataUrl);
    a.click();
  };

  // Se calculan las dimensiones y viewport para la exportación
  const getExportConfig = () => {
    const nodes = getNodes();
    if (nodes.length === 0) {
      return null;
    }

    const nodesBounds = getNodesBounds(nodes);
    const padding = 20; // Padding alrededor del diagrama
    
    // Las dimensiones reales ya incluyen el espacio de los nodos
    // Solo se añade el padding
    const width = nodesBounds.width + padding * 2;
    const height = nodesBounds.height + padding * 2;
    
    // Calcula el offset para centrar considerando el padding
    const offsetX = nodesBounds.x - padding;
    const offsetY = nodesBounds.y - padding;
    
    // Crea el viewport manualmente para mejor control
    const viewport = {
      x: -offsetX,
      y: -offsetY,
      zoom: 1
    };

    return {
      width: Math.ceil(width),
      height: Math.ceil(height),
      viewport,
      nodesBounds
    };
  };

  // Se obtiene el elemento viewport de ReactFlow
  const getViewportElement = () => {
    const viewport = document.querySelector('.react-flow__viewport');
    if (!viewport) {
      throw new Error('No se encontró el viewport de ReactFlow. Asegúrate de que el diagrama esté visible.');
    }
    return viewport;
  };

  // Se exporta el diagrama a PNG
  const exportToPNG = async () => {
    try {
      const nodes = getNodes();
      if (nodes.length === 0) {
        throw new Error('No hay nodos para exportar');
      }

      const config = getExportConfig();
      if (!config) {
        throw new Error('No se pudo calcular la configuración de exportación');
      }

      const viewportElement = getViewportElement();
      
      const dataUrl = await toPng(viewportElement, {
        backgroundColor: '#1a1a1a',
        width: config.width,
        height: config.height,
        style: {
          width: `${config.width}px`,
          height: `${config.height}px`,
          transform: `translate(${config.viewport.x}px, ${config.viewport.y}px) scale(${config.viewport.zoom})`,
        },
      });
      
      downloadFile(dataUrl, generateFileName('png'));
    } catch (error) {
      console.error('Error al exportar PNG:', error);
      throw error;
    }
  };

  // Se exporta el diagrama a SVG
  /* Desactivado por ahora (No se muestra el fondo correctamente)
  const exportToSVG = async () => {
    try {
      const nodes = getNodes();
      if (nodes.length === 0) {
        throw new Error('No hay nodos para exportar');
      }

      const config = getExportConfig();
      if (!config) {
        throw new Error('No se pudo calcular la configuración de exportación');
      }

      const viewportElement = getViewportElement();
      
      // Exporta a SVG con fondo
      const svgDataUrl = await toSvg(viewportElement, {
        backgroundColor: '#1a1a1a',
        width: config.width,
        height: config.height,
        style: {
          width: `${config.width}px`,
          height: `${config.height}px`,
          transform: `translate(${config.viewport.x}px, ${config.viewport.y}px) scale(${config.viewport.zoom})`,
        },
      });
      
      downloadFile(svgDataUrl, generateFileName('svg'));
    } catch (error) {
      console.error('Error al exportar SVG:', error);
      throw error;
    }
  };
  */
  const exportToSVG = null; // Función desactivada temporalmente

  // Se exporta el diagrama a PDF (usando PNG como base)
  /* Desactivado temporalmente
  const exportToPDF = async () => {
    try {
      const nodes = getNodes();
      if (nodes.length === 0) {
        throw new Error('No hay nodos para exportar');
      }

      const config = getExportConfig();
      if (!config) {
        throw new Error('No se pudo calcular la configuración de exportación');
      }

      // Primero exporta a PNG
      const viewportElement = getViewportElement();
      
      const dataUrl = await toPng(viewportElement, {
        backgroundColor: '#1a1a1a',
        width: config.width,
        height: config.height,
        style: {
          width: `${config.width}px`,
          height: `${config.height}px`,
          transform: `translate(${config.viewport.x}px, ${config.viewport.y}px) scale(${config.viewport.zoom})`,
        },
      });

      // Crea un canvas para convertir a PDF
      const img = new Image();
      img.src = dataUrl;
      
      img.onload = () => {
        // Importa jsPDF dinámicamente
        import('jspdf').then(({ jsPDF }) => {
          const orientation = config.width > config.height ? 'landscape' : 'portrait';
          
          const pdf = new jsPDF({
            orientation,
            unit: 'px',
            format: [config.width, config.height]
          });
          
          pdf.addImage(dataUrl, 'PNG', 0, 0, config.width, config.height);
          pdf.save(generateFileName('pdf'));
        }).catch((error) => {
          console.error('Error al cargar jsPDF:', error);
          throw new Error('Error al cargar la librería de PDF');
        });
      };

      img.onerror = () => {
        console.error('Error al cargar la imagen para PDF');
        throw new Error('Error al exportar el PDF');
      };
    } catch (error) {
      console.error('Error al exportar PDF:', error);
      throw error;
    }
  };
  */
  const exportToPDF = null; // Función desactivada temporalmente

  // Se exporta el diagrama a JSON (estructura de datos del diagrama)
  const exportToJSON = async () => {
    try {
      const nodes = getNodes();
      const edges = getEdges();

      if (nodes.length === 0) {
        throw new Error('No hay nodos para exportar');
      }

      // Se crea la estructura JSON con metadata
      const exportData = {
        version: CURRENT_VERSION,
        metadata: {
          title: diagramName || 'Diagrama sin título',
          exportedAt: new Date().toISOString(),
          exportedBy: 'BossFlow',
          nodeCount: nodes.length,
          edgeCount: edges.length
        },
        diagram: {
          nodes: nodes.map(node => ({
            id: node.id,
            type: node.type,
            position: {
              x: node.position.x,
              y: node.position.y
            },
            data: node.data || {},
            style: node.style || {},
            // Incluir campos opcionales si existen
            ...(node.width && { width: node.width }),
            ...(node.height && { height: node.height })
          })),
          edges: edges.map(edge => ({
            id: edge.id,
            source: edge.source,
            target: edge.target,
            sourceHandle: edge.sourceHandle || null,
            targetHandle: edge.targetHandle || null,
            type: edge.type || 'default',
            data: edge.data || {},
            style: edge.style || {},
            animated: edge.animated || false,
            label: edge.label || ''
          }))
        }
      };

      // Convertir a JSON con formato legible
      const jsonString = JSON.stringify(exportData, null, 2);
      
      // Crear blob y descargar
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Generar nombre de archivo
      a.download = generateFileName('json');
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al exportar JSON:', error);
      throw error;
    }
  };

  return {
    exportToPNG,
    exportToSVG, // null - desactivada
    exportToPDF, // null - desactivada
    exportToJSON
  };
}
