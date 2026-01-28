import { useState, useRef } from 'react';
import { FiUpload, FiX, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import './ImportJSON.css';
import { validateJSONStructure, isValidJSONFile, COMPATIBLE_VERSIONS } from '../../utils/jsonValidator';

/**
 * Component to import diagrams from JSON files with validation and preview
 * @param {Object} props - Component properties
 * @param {boolean} props.isOpen - Controls the visibility of the modal
 * @param {Function} props.onClose - Callback executed when closing the modal
 * @param {Function} props.onImport - Callback executed when importing the diagram
 * @param {Object} props.toast - Object to display notifications
 * @returns {JSX.Element|null} Import modal or null if closed
 */
function ImportJSON({ 
  isOpen, 
  onClose, 
  onImport,
  toast 
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [importFile, setImportFile] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  /**
   * Closes the modal and resets all component state
   */
  const handleClose = () => {
    setPreviewData(null);
    setValidationError(null);
    setImportFile(null);
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  /**
   * Manages the selection and validation of the JSON file
   * @param {Event} event - File selection event
   */
  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!isValidJSONFile(file.name)) {
      setValidationError('Por favor, selecciona un archivo JSON válido (.json)');
      setPreviewData(null);
      setImportFile(null);
      return;
    }

    setImportFile(file);
    setValidationError(null);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        const data = JSON.parse(content);
        
        const validation = validateJSONStructure(data);
        
        if (!validation.valid) {
          setValidationError(validation.errors.join(', '));
          setPreviewData(null);
          return;
        }

        setPreviewData(data);
        setValidationError(null);
      } catch (error) {
        setValidationError('Error al leer el archivo: ' + error.message);
        setPreviewData(null);
      }
    };
    
    reader.onerror = () => {
      setValidationError('Error al leer el archivo');
      setPreviewData(null);
    };
    
    reader.readAsText(file);
  };

  /**
   * Confirms and executes the import of the validated diagram
   */
  const handleConfirmImport = () => {
    if (!previewData) return;

    setIsProcessing(true);
    
    try {
      if (!COMPATIBLE_VERSIONS.includes(previewData.version)) {
        throw new Error(`Versión incompatible: ${previewData.version}`);
      }

      const { nodes: importedNodes, edges: importedEdges } = previewData.diagram;

      if (!importedNodes || importedNodes.length === 0) {
        throw new Error('El archivo no contiene nodos para importar');
      }

      onImport({
        nodes: importedNodes,
        edges: importedEdges || [],
        metadata: previewData.metadata
      });

      toast.success(`Diagrama "${previewData.metadata.title}" importado correctamente`);
      handleClose();
    } catch (error) {
      console.error('Error al importar JSON:', error);
      toast.error('Error al importar el diagrama: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Cancels the import and clears the preview state
   */
  const handleCancelImport = () => {
    setPreviewData(null);
    setValidationError(null);
    setImportFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <section className="import-json__overlay" onClick={handleClose}>
      <article className="import-json__content" onClick={(e) => e.stopPropagation()}>
        <header className="import-json__header">
          <h2 className="import-json__title">
            <FiUpload />
            Importar Diagrama desde JSON
          </h2>
          <button
            className="import-json__close"
            onClick={handleClose}
            disabled={isProcessing}
            title="Cerrar"
          >
            <FiX />
          </button>
        </header>

        <section className="import-json__body">
          {!previewData ? (
            <>
              <p className="import-json__description">
                Selecciona un archivo JSON para importar el diagrama. El archivo debe estar en formato BossFlow válido.
              </p>

              <section className="import-json__file-input">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileSelect}
                  id="json-file-input"
                  className="import-json__file-input-hidden"
                />
                <label htmlFor="json-file-input" className="import-json__file-label">
                  <FiUpload />
                  {importFile ? importFile.name : 'Seleccionar archivo JSON'}
                </label>
              </section>

              {validationError && (
                <section className="import-json__error">
                  <FiAlertCircle />
                  <article>
                    <strong>Error de validación:</strong>
                    <p>{validationError}</p>
                  </article>
                </section>
              )}

              <section className="import-json__info">
                <FiAlertCircle />
                <article>
                  <p><strong>Importante:</strong> Al importar un diagrama, se reemplazará el contenido actual del canvas.</p>
                  <p className="import-json__info-detail">
                    Asegúrate de guardar tu trabajo antes de importar.
                  </p>
                </article>
              </section>

              <nav className="import-json__actions">
                <button
                  className="import-json__button import-json__button--secondary"
                  onClick={handleClose}
                >
                  Cancelar
                </button>
              </nav>
            </>
          ) : (
            <>
              <section className="import-json__preview">
                <header className="import-json__preview-header">
                  <FiCheckCircle className="import-json__preview-icon" />
                  <h3>Vista previa del diagrama</h3>
                </header>
                
                <section className="import-json__preview-content">
                  <article className="import-json__preview-item">
                    <strong>Título:</strong>
                    <span>{previewData.metadata.title}</span>
                  </article>
                  <article className="import-json__preview-item">
                    <strong>Exportado:</strong>
                    <span>{new Date(previewData.metadata.exportedAt).toLocaleString()}</span>
                  </article>
                  <article className="import-json__preview-item">
                    <strong>Versión:</strong>
                    <span>{previewData.version}</span>
                  </article>
                  <article className="import-json__preview-item">
                    <strong>Nodos:</strong>
                    <span>{previewData.metadata.nodeCount}</span>
                  </article>
                  <article className="import-json__preview-item">
                    <strong>Conexiones:</strong>
                    <span>{previewData.metadata.edgeCount}</span>
                  </article>
                </section>
              </section>

              <aside className="import-json__warning import-json__warning--danger">
                <FiAlertCircle />
                <p><strong>¿Continuar con la importación?</strong> El contenido actual del canvas será reemplazado.</p>
              </aside>

              <nav className="import-json__actions">
                <button
                  className="import-json__button import-json__button--secondary"
                  onClick={handleCancelImport}
                  disabled={isProcessing}
                >
                  Cancelar
                </button>
                <button
                  className="import-json__button import-json__button--primary"
                  onClick={handleConfirmImport}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Importando...' : 'Confirmar importación'}
                </button>
              </nav>
            </>
          )}

          {isProcessing && (
            <aside className="import-json__loading">
              <figure className="import-json__spinner"></figure>
              <p>Importando diagrama...</p>
            </aside>
          )}
        </section>
      </article>
    </section>
  );
}

export default ImportJSON;
