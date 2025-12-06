import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getDiagrams, deleteDiagram } from '../../services/diagramService';
import { registerActivity, ACTIVITY_TYPES } from '../../services/activityService';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import DiagramCard from '../DiagramCard/DiagramCard';
import { FiFileText, FiAlertCircle } from 'react-icons/fi';
import './DiagramList.css';

function DiagramList({ onCreateClick, onDiagramDeleted }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [diagrams, setDiagrams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [diagramToDelete, setDiagramToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDiagrams = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getDiagrams();
      setDiagrams(response.diagrams || []);
    } catch (err) {
      console.error('Error al cargar diagramas:', err);
      setError('No se pudieron cargar los diagramas. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagrams();
  }, []);

  // Función para eliminar diagrama
  const handleDeleteClick = (diagram) => {
    setDiagramToDelete(diagram);
  };

  // Función para editar diagrama
  const handleEditClick = (diagram) => {
    navigate(`/editor/${diagram.id}`);
  };

  const handleConfirmDelete = async () => {
    if (!diagramToDelete) return;

    try {
      setIsDeleting(true);
      await deleteDiagram(diagramToDelete.id);

      // Registrar actividad de eliminación
      registerActivity(
        ACTIVITY_TYPES.DELETE,
        diagramToDelete.title,
        diagramToDelete.id
      );

      // Actualizar lista de diagramas local
      await fetchDiagrams();

      // Notificar al Dashboard para que actualice su estado
      if (onDiagramDeleted) {
        onDiagramDeleted();
      }

      // Mostrar mensaje de éxito
      toast.success('Diagrama eliminado exitosamente');

      setDiagramToDelete(null);
    } catch (error) {
      console.error('Error al eliminar diagrama:', error);
      toast.error('Error al eliminar el diagrama. Por favor, intenta de nuevo.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    if (!isDeleting) {
      setDiagramToDelete(null);
    }
  };


  // Estado de carga
  if (loading) {
    return (
      <section className="diagram-list">
        <aside className="diagram-list__loading">
          <figure className="diagram-list__spinner"></figure>
          <p>Cargando diagramas...</p>
        </aside>
      </section>
    );
  }

  // Estado de error
  if (error) {
    return (
      <section className="diagram-list">
        <aside className="diagram-list__error">
          <FiAlertCircle className="diagram-list__error-icon" />
          <p className="diagram-list__error-message">{error}</p>
          <button
            className="diagram-list__retry-button"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </aside>
      </section>
    );
  }

  // Estado vacío
  if (diagrams.length === 0) {
    return (
      <section className="diagram-list">
        <aside className="diagram-list__empty">
          <FiFileText className="diagram-list__empty-icon" />
          <h3 className="diagram-list__empty-title">No tienes diagramas aún</h3>
          <p className="diagram-list__empty-message">
            Crea tu primer diagrama para empezar a organizar tus ideas
          </p>
          {onCreateClick ? (
            <button onClick={onCreateClick} className="diagram-list__create-button">
              Crear diagrama
            </button>
          ) : (
            <Link to="/editor" className="diagram-list__create-button">
              Crear diagrama
            </Link>
          )}
        </aside>
      </section>
    );
  }

  // Lista de diagramas
  return (
    <>
      <section className="diagram-list">
        <section className="diagram-list__grid">
          {diagrams.map((diagram) => (
            <DiagramCard
              key={diagram.id}
              diagram={diagram}
              onDelete={handleDeleteClick}
              onEdit={handleEditClick}
            />
          ))}
        </section>
      </section>

      <ConfirmModal
        isOpen={!!diagramToDelete}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar diagrama?"
        message={`¿Estás seguro de que quieres eliminar "${diagramToDelete?.title}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
        isLoading={isDeleting}
      />
    </>
  );
}

export default DiagramList;
