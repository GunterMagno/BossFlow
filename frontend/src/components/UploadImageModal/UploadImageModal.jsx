import { useState, useRef } from 'react';
import './UploadImageModal.css';
import { FiUploadCloud } from 'react-icons/fi';

/**
 * Modal component to upload images from file or URL.
 * Allows drag and drop files, select from explorer or enter a URL.
 * Validates image type and size before uploading to backend.
 *
 * @param {Object} props - Component properties
 * @param {boolean} props.isOpen - Indicates if the modal is open
 * @param {Function} props.onClose - Callback function to close the modal
 * @param {Function} props.onImageUploaded - Callback function executed when an image is successfully uploaded
 * @param {string} props.title - Modal title
 * @returns {JSX.Element|null} Modal element or null if closed
 */
const UploadImageModal = ({ isOpen, onClose, onImageUploaded, title = "Subir imagen" }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  /**
   * Closes the modal and resets all states to their initial values.
   * Clears URL, errors, preview and executes the close callback.
   */
  const handleClose = () => {
    setImageUrl('');
    setError('');
    setPreview(null);
    onClose();
  };

  /**
   * Validates the type and size of an image file.
   * Verifies it is JPEG, PNG, GIF or WEBP and does not exceed 5MB.
   *
   * @param {File} file - File to validate
   * @returns {boolean} true if the file is valid, false otherwise
   */
  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      setError('Tipo de archivo no válido. Use: JPEG, PNG, GIF o WEBP');
      return false;
    }

    if (file.size > maxSize) {
      setError('La imagen excede el tamaño máximo de 5MB');
      return false;
    }

    setError('');
    return true;
  };

  /**
   * Uploads an image file to the backend.
   * Converts the file to base64 and sends it to the server via a POST request.
   *
   * @param {File} file - Image file to upload
   * @returns {Promise<Object>} Promise that resolves with the uploaded image data
   */
  const uploadFileToBackend = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const base64Data = e.target.result;
          
          const response = await fetch('/api/images/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              image: base64Data,
              filename: file.name,
              mimeType: file.type
            })
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al subir imagen');
          }

          const data = await response.json();
          resolve(data.image);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('Error al leer el archivo'));
      reader.readAsDataURL(file);
    });
  };

  /**
   * Handles the selection of an image file.
   * Validates the file, uploads it to the backend and executes the callback with the image data.
   *
   * @param {File} file - Selected image file
   */
  const handleFileSelect = async (file) => {
    if (!validateFile(file)) return;

    setIsUploading(true);
    setError('');

    try {
      const imageData = await uploadFileToBackend(file);
      const fullUrl = imageData.url;
      setPreview(fullUrl);

      onImageUploaded({
        ...imageData,
        url: fullUrl
      });
      
      handleClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Handles the file selection event from the input.
   * Extracts the first selected file and processes it.
   *
   * @param {Event} e - File input change event
   */
  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  /**
   * Handles the event of dragging a file over the drop zone.
   * Prevents default behavior and activates the dragging state.
   *
   * @param {DragEvent} e - Drag event
   */
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  /**
   * Handles the event of leaving the drop zone.
   * Prevents default behavior and deactivates the dragging state.
   *
   * @param {DragEvent} e - Drag event
   */
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  /**
   * Handles the event of dropping a file in the designated zone.
   * Prevents default behavior, deactivates the dragging state and processes the file.
   *
   * @param {DragEvent} e - Drop event
   */
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  /**
   * Handles the submission of an external image URL.
   * Validates the URL with the backend and executes the callback if valid.
   *
   * @returns {Promise<void>} Promise that resolves when validation completes
   */
  const handleUrlSubmit = async () => {
    if (!imageUrl.trim()) {
      setError('Por favor, ingrese una URL');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const response = await fetch('/api/images/validate-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ url: imageUrl })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al validar URL');
      }

      const data = await response.json();
      setPreview(imageUrl);
      
      onImageUploaded(data.image);
      handleClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="upload-image-modal-overlay" onClick={handleClose}>
      <article className="upload-image-modal" onClick={(e) => e.stopPropagation()}>
        <header className="upload-image-modal-header">
          <h2>{title}</h2>
          <button className="close-button" onClick={handleClose}>
            ✕
          </button>
        </header>

        <section className="upload-image-modal-body">
          {error && (
            <aside className="upload-error">
              {error}
            </aside>
          )}

          <section className="upload-url-section">
            <h3 className="section-title">Desde URL</h3>
            <label htmlFor="image-url-input">URL de la imagen:</label>
            <input
              id="image-url-input"
              type="text"
              className="url-input"
              placeholder="https://ejemplo.com/imagen.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleUrlSubmit()}
            />
            
            {preview && (
              <figure className="url-preview">
                <img src={preview} alt="Vista previa" />
              </figure>
            )}

            <button
              className="url-submit-button"
              onClick={handleUrlSubmit}
              disabled={isUploading || !imageUrl.trim()}
            >
              {isUploading ? 'Validando...' : 'Usar esta imagen'}
            </button>
          </section>

          <section className="section-divider">

          <section className="upload-file-section">
            <h3 className="section-title">Desde archivo</h3>
            <section
              className={`upload-drop-zone ${isDragging ? 'dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              tabIndex={0}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileInput}
                style={{ display: 'none' }}
              />
              
              {isUploading ? (
                <aside className="upload-loading">
                  <figure className="spinner"></figure>
                  <p>Subiendo imagen...</p>
                </aside>
              ) : (
                <>
                  <FiUploadCloud className="upload-icon" />
                  <p className="upload-main-text">
                    Arrastra una imagen aquí
                  </p>
                  <button
                    className="upload-browse-button"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Seleccionar archivo
                  </button>
                  <p className="upload-info">
                    Formatos: JPEG, PNG, GIF, WEBP (máx. 5MB)
                  </p>
                </>
              )}
              </section>
            </section>
          </section>
        </section>
      </article>
    </section>
  );
};

export default UploadImageModal;