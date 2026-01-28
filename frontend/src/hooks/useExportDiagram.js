import { useReactFlow, getNodesBounds, getViewportForBounds, getRectOfNodes } from 'reactflow';
import { toPng, toSvg } from 'html-to-image';
import { CURRENT_VERSION } from '../utils/jsonValidator';

/**
 * Custom hook for exporting diagrams in different formats.
 * @param {string} [diagramName='diagrama'] - Base name for exported files
 * @returns {Object} Object with export methods (PNG, JSON) and references to SVG and PDF (disabled)
 */
export function useExportDiagram(diagramName = 'diagrama') {
  const { getNodes, getEdges } = useReactFlow();

  /**
   * Generates a filename with timestamp.
   * @param {string} extension - File extension (png, json, svg, pdf)
   * @returns {string} Filename with format 'diagrama_YYYY-MM-DD_HH-MM.extension'
   */
  const generateFileName = (extension) => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10); // YYYY-MM-DD
    const timeStr = now.toTimeString().slice(0, 5).replace(':', '-'); // HH-MM
    return `${diagramName}_${dateStr}_${timeStr}.${extension}`;
  };

  /**
   * Downloads a generated file from a data URL.
   * @param {string} dataUrl - Data URL of the file to download
   * @param {string} fileName - Name of the file to download
   */
  const downloadFile = (dataUrl, fileName) => {
    const a = document.createElement('a');
    a.setAttribute('download', fileName);
    a.setAttribute('href', dataUrl);
    a.click();
  };

  /**
   * Calculates dimensions and viewport configuration for export.
   * @returns {Object|null} Object with width, height, viewport, and node bounds, or null if no nodes
   */
  const getExportConfig = () => {
    const nodes = getNodes();
    if (nodes.length === 0) {
      return null;
    }

    const nodesBounds = getNodesBounds(nodes);
    const padding = 20;
    
    const width = nodesBounds.width + padding * 2;
    const height = nodesBounds.height + padding * 2;
    
    const offsetX = nodesBounds.x - padding;
    const offsetY = nodesBounds.y - padding;
    
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

  /**
   * Gets the ReactFlow viewport DOM element.
   * @returns {Element} ReactFlow viewport element
   * @throws {Error} If viewport is not found
   */
  const getViewportElement = () => {
    const viewport = document.querySelector('.react-flow__viewport');
    if (!viewport) {
      throw new Error('ReactFlow viewport not found. Make sure the diagram is visible.');
    }
    return viewport;
  };

  /**
   * Exports the diagram to PNG format.
   * @async
   * @throws {Error} If there are no nodes to export or export fails
   */
  const exportToPNG = async () => {
    try {
      const nodes = getNodes();
      if (nodes.length === 0) {
        throw new Error('No nodes to export');
      }

      const config = getExportConfig();
      if (!config) {
        throw new Error('Could not calculate export configuration');
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
      console.error('Error exporting PNG:', error);
      throw error;
    }
  };

  const exportToSVG = null;

  /**
   * Exports the diagram to PDF (temporarily disabled).
   */
  /* Temporarily disabled
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

      const img = new Image();
      img.src = dataUrl;
      
      img.onload = () => {
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
  const exportToPDF = null;

  /**
   * Exports the diagram to JSON with diagram data structure.
   */
  const exportToJSON = async () => {
    try {
      const nodes = getNodes();
      const edges = getEdges();

      if (nodes.length === 0) {
        throw new Error('No nodes to export');
      }

      const exportData = {
        version: CURRENT_VERSION,
        metadata: {
          title: diagramName || 'Untitled diagram',
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

      const jsonString = JSON.stringify(exportData, null, 2);
      
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      a.download = generateFileName('json');
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting JSON:', error);
      throw error;
    }
  };

  return {
    exportToPNG,
    exportToSVG,
    exportToPDF,
    exportToJSON
  };
}
