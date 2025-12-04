import { FiDownload, FiX, FiImage, FiFile } from 'react-icons/fi';
import './ExportModal.css';

function ExportModal({ isOpen, onClose, onExportPNG, onExportJSON, isExporting }) {
  if (!isOpen) return null;

  return (
    <div className="export-modal__overlay" onClick={onClose}>
      <div className="export-modal__content" onClick={(e) => e.stopPropagation()}>
        {/* Header del modal */}
        <div className="export-modal__header">
          <h2 className="export-modal__title">
            <FiDownload />
            Exportar Diagrama
          </h2>
          <button
            className="export-modal__close"
            onClick={onClose}
            disabled={isExporting}
            title="Cerrar"
          >
            <FiX />
          </button>
        </div>

        {/* Body del modal */}
        <div className="export-modal__body">
          <p className="export-modal__description">
            Selecciona el formato en el que deseas exportar tu diagrama
          </p>

          <div className="export-modal__options">
            {/* Opción PNG */}
            <button
              className="export-modal__option"
              onClick={onExportPNG}
              disabled={isExporting}
            >
              <div className="export-modal__option-icon">
                <FiImage />
              </div>
              <div className="export-modal__option-info">
                <h3>PNG</h3>
                <p>Imagen de alta calidad</p>
              </div>
            </button>

            {/* Opción JSON - Abre modal de importación/exportación */}
            <button
              className="export-modal__option"
              onClick={onExportJSON}
              disabled={isExporting}
            >
              <div className="export-modal__option-icon">
                <FiFile />
              </div>
              <div className="export-modal__option-info">
                <h3>JSON</h3>
                <p>Exportar estructura del diagrama</p>
              </div>
            </button>
          </div>

          {/* Indicador de carga */}
          {isExporting && (
            <div className="export-modal__loading">
              <div className="export-modal__spinner"></div>
              <p>Exportando diagrama...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExportModal;
