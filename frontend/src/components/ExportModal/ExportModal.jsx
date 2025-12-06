import { FiDownload, FiX, FiImage, FiFile } from 'react-icons/fi';
import './ExportModal.css';

function ExportModal({ isOpen, onClose, onExportPNG, onExportJSON, isExporting }) {
  if (!isOpen) return null;

  return (
    <section className="export-modal__overlay" onClick={onClose}>
      <article className="export-modal__content" onClick={(e) => e.stopPropagation()}>
        {/* Header del modal */}
        <header className="export-modal__header">
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
        </header>

        {/* Body del modal */}
        <section className="export-modal__body">
          <p className="export-modal__description">
            Selecciona el formato en el que deseas exportar tu diagrama
          </p>

          <nav className="export-modal__options">
            {/* Opción PNG */}
            <button
              className="export-modal__option"
              onClick={onExportPNG}
              disabled={isExporting}
            >
              <figure className="export-modal__option-icon">
                <FiImage />
              </figure>
              <section className="export-modal__option-info">
                <h3>PNG</h3>
                <p>Imagen de alta calidad</p>
              </section>
            </button>

            {/* Opción JSON - Abre modal de importación/exportación */}
            <button
              className="export-modal__option"
              onClick={onExportJSON}
              disabled={isExporting}
            >
              <figure className="export-modal__option-icon">
                <FiFile />
              </figure>
              <section className="export-modal__option-info">
                <h3>JSON</h3>
                <p>Exportar estructura del diagrama</p>
              </section>
            </button>
          </nav>

          {/* Indicador de carga */}
          {isExporting && (
            <aside className="export-modal__loading">
              <figure className="export-modal__spinner"></figure>
              <p>Exportando diagrama...</p>
            </aside>
          )}
        </section>
      </article>
    </section>
  );
}

export default ExportModal;
