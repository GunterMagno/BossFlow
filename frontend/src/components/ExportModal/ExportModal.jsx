import { FiDownload, FiX, FiImage, FiFile } from 'react-icons/fi';
import './ExportModal.css';

function ExportModal({ isOpen, onClose, onExportPNG, onExportSVG, onExportPDF, isExporting }) {
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

            {/* Opción SVG */}
            <button
              className="export-modal__option export-modal__option--disabled"
              onClick={onExportSVG}
              disabled={true}
              title="Funcionalidad temporalmente deshabilitada"
            >
              <div className="export-modal__option-icon">
                <FiImage />
              </div>
              <div className="export-modal__option-info">
                <h3>SVG <span style={{fontSize: '0.8em', opacity: 0.7}}>(No disponible)</span></h3>
                <p>Gráfico vectorial escalable</p>
              </div>
            </button>

            {/* Opción PDF */}
            <button
              className="export-modal__option"
              onClick={onExportPDF}
              disabled={isExporting}
            >
              <div className="export-modal__option-icon">
                <FiFile />
              </div>
              <div className="export-modal__option-info">
                <h3>PDF</h3>
                <p>Documento para impresión</p>
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
