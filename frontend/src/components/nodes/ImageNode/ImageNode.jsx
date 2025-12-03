import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import './ImageNode.css';

const ImageNode = ({ data, selected }) => {
  const handleDelete = (e) => {
    e.stopPropagation();
    if (data.onDelete) {
      data.onDelete();
    }
  };

  const handleResize = (e) => {
    e.stopPropagation();
    // La funcionalidad de resize se maneja con los controles de ReactFlow
  };

  return (
    <div className={`image-node ${selected ? 'selected' : ''}`}>
      <div className="image-node-container">
        {data.image && (
          <img 
            src={data.image.url} 
            alt={data.image.filename || 'Imagen del diagrama'}
            className="image-node-img"
            style={{
              width: data.width || '200px',
              height: data.height || 'auto',
            }}
          />
        )}
        
        {selected && (
          <div className="image-node-controls">
            <button
              className="image-node-delete"
              onClick={handleDelete}
              title="Eliminar imagen"
            >
              🗑️
            </button>
          </div>
        )}
      </div>

      {/* Handles invisibles por si se quieren conectar */}
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
};

export default memo(ImageNode);
