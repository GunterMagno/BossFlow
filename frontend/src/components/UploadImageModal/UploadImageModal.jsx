import { useState, useRef } from 'react';
import './UploadImageModal.css';
import { FiUploadCloud } from 'react-icons/fi';

/**
 * Componente modal para subir imágenes desde archivo o URL.
 * Permite arrastrar y soltar archivos, seleccionar desde el explorador o ingresar una URL.
 * Valida el tipo y tamaño de las imágenes antes de subirlas al backend.
 *
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isOpen - Indica si el modal está abierto
 * @param {Function} props.onClose - Función callback para cerrar el modal
 * @param {Function} props.onImageUploaded - Función callback ejecutada cuando se sube una imagen exitosamente
 * @param {string} props.title - Título del modal
 * @returns {JSX.Element|null} Elemento modal o null si está cerrado
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
   * Cierra el modal y reinicia todos los estados a sus valores iniciales.
   * Limpia la URL, errores, vista previa y ejecuta el callback de cierre.
   */
  const handleClose = () => {
    setImageUrl('');
    setError('');
    setPreview(null);
    onClose();
  };

  /**
   * Valida el tipo y tamaño de un archivo de imagen.
   * Verifica que sea JPEG, PNG, GIF o WEBP y no exceda los 5MB.
   *
   * @param {File} file - Archivo a validar
   * @returns {boolean} true si el archivo es válido, false en caso contrario
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
   * Sube un archivo de imagen al backend.
   * Convierte el archivo a base64 y lo envía al servidor mediante una petición POST.
   *
   * @param {File} file - Archivo de imagen a subir
   * @returns {Promise<Object>} Promesa que resuelve con los datos de la imagen subida
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
   * Maneja la selección de un archivo de imagen.
   * Valida el archivo, lo sube al backend y ejecuta el callback con los datos de la imagen.
   *
   * @param {File} file - Archivo de imagen seleccionado
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
   * Maneja el evento de selección de archivo desde el input.
   * Extrae el primer archivo seleccionado y lo procesa.
   *
   * @param {Event} e - Evento de cambio del input de archivo
   */
  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  /**
   * Maneja el evento de arrastrar un archivo sobre la zona de soltar.
   * Previene el comportamiento por defecto y activa el estado de arrastre.
   *
   * @param {DragEvent} e - Evento de arrastre
   */
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  /**
   * Maneja el evento de salida del archivo de la zona de soltar.
   * Previene el comportamiento por defecto y desactiva el estado de arrastre.
   *
   * @param {DragEvent} e - Evento de arrastre
   */
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  /**
   * Maneja el evento de soltar un archivo en la zona designada.
   * Previene el comportamiento por defecto, desactiva el estado de arrastre y procesa el archivo.
   *
   * @param {DragEvent} e - Evento de soltar
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
   * Maneja el envío de una URL de imagen externa.
   * Valida la URL con el backend y ejecuta el callback si es válida.
   *
   * @returns {Promise<void>} Promesa que resuelve cuando se completa la validación
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