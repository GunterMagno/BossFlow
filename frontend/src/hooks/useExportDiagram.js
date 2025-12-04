import { useReactFlow, getNodesBounds, getViewportForBounds, getRectOfNodes } from 'reactflow';
import { toPng, toSvg } from 'html-to-image';

// Hook personalizado que maneja la exportación de diagramas
export function useExportDiagram(diagramName = 'diagrama') {
  const { getNodes } = useReactFlow();

  // Genera nombre de archivo con fecha/hora
  const generateFileName = (extension) => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10); // YYYY-MM-DD
    const timeStr = now.toTimeString().slice(0, 5).replace(':', '-'); // HH-MM
    return `${diagramName}_${dateStr}_${timeStr}.${extension}`;
  };

  // Descarga el archivo
  const downloadFile = (dataUrl, fileName) => {
    const a = document.createElement('a');
    a.setAttribute('download', fileName);
    a.setAttribute('href', dataUrl);
    a.click();
  };

  // Calcula dimensiones y viewport para la exportación
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

  // Obtiene el elemento viewport de ReactFlow
  const getViewportElement = () => {
    const viewport = document.querySelector('.react-flow__viewport');
    if (!viewport) {
      throw new Error('No se encontró el viewport de ReactFlow. Asegúrate de que el diagrama esté visible.');
    }
    return viewport;
  };

  // Exporta a PNG
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

  // Exporta a SVG
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

  // Exporta a PDF (usando PNG como base)
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

  // Exporta a JSON (estructura de datos del diagrama)
  const exportToJSON = async () => {
    try {
      const nodes = getNodes();
      if (nodes.length === 0) {
        throw new Error('No hay nodos para exportar');
      }

      // Aquí se implementará la exportación JSON
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
