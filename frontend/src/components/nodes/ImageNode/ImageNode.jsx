import { memo } from 'react';
import { Handle, Position, NodeResizer } from 'reactflow';
import './ImageNode.css';

/**
 * Componente de nodo de imagen para diagramas.
 * Muestra una imagen redimensionable con puntos de conexión invisibles.
 * Incluye capacidad de redimensionado y eliminación cuando está seleccionado.
 *
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.data - Datos del nodo (imagen, callbacks, etc.)
 * @param {boolean} props.selected - Indica si el nodo está seleccionado
 * @param {string} props.id - ID único del nodo
 * @returns {JSX.Element} Elemento de nodo de imagen
 */
const ImageNode = ({ data, selected, id }) => {
  /**
   * Maneja la eliminación del nodo de imagen.
   * Detiene la propagación del evento y ejecuta el callback de eliminación.
   *
   * @param {MouseEvent} e - Evento de clic del ratón
   */
  const handleDelete = (e) => {
    e.stopPropagation();
    if (data.onDelete) {
      data.onDelete();
    }
  };

  /**
   * Maneja el redimensionado del nodo de imagen.
   * Guarda las nuevas dimensiones en los datos del nodo.
   *
   * @param {Event} event - Evento de redimensionado
   * @param {Object} params - Parámetros del redimensionado con width y height
   */
  const handleResize = (event, params) => {
    if (data.image) {
      data.image.width = params.width;
      data.image.height = params.height;
    }
  };

  const imageWidth = data.image?.width || 150;
  const imageHeight = data.image?.height || 150;

  return (
    <article 
      className={`image-node ${selected ? 'selected' : ''}`}
      style={{
        width: imageWidth,
        height: imageHeight
      }}
    >
      <NodeResizer 
        isVisible={selected}
        minWidth={80}
        minHeight={80}
        onResize={handleResize}
        handleStyle={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          backgroundColor: '#4a90e2',
        }}
      />
      <figure className="image-node-container">
        {data.image && (
          <img 
            src={data.image.url} 
            alt={data.image.filename || 'Imagen del diagrama'}
            className="image-node-img"
            draggable={false}
            loading="eager"
            key={data.image.url}
          />
        )}
        
        {selected && (
          <button
            className="image-node-delete"
            onClick={handleDelete}
            title="Eliminar imagen"
          >
            ✕
          </button>
        )}
      </figure>

      <Handle
        type="target"
        position={Position.Top}
        id="top"
        style={{
          opacity: 0,
          width: '10px',
          height: '10px',
          pointerEvents: 'auto'
        }}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right"
        style={{
          opacity: 0,
          width: '10px',
          height: '10px',
          pointerEvents: 'auto'
        }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom"
        style={{
          opacity: 0,
          width: '10px',
          height: '10px',
          pointerEvents: 'auto'
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        style={{
          opacity: 0,
          width: '10px',
          height: '10px',
          pointerEvents: 'auto'
        }}
      />
      <Handle
        type="source"
        position={Position.Top}
        id="top-source"
        style={{
          opacity: 0,
          width: '10px',
          height: '10px',
          pointerEvents: 'auto'
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        style={{
          opacity: 0,
          width: '10px',
          height: '10px',
          pointerEvents: 'auto'
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        style={{
          opacity: 0,
          width: '10px',
          height: '10px',
          pointerEvents: 'auto'
        }}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left-source"
        style={{
          opacity: 0,
          width: '10px',
          height: '10px',
          pointerEvents: 'auto'
        }}
      />
    </article>
  );
};

export default memo(ImageNode);
