import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDiagrams } from '../../services/diagramService';
import {
  FiFileText,
  FiClock,
  FiUser,
  FiAlertCircle,
} from 'react-icons/fi';
import './DiagramList.css';

function DiagramList({ onCreateClick }) {
  const [diagrams, setDiagrams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    fetchDiagrams();
  }, []);

  // Función para formatear fecha relativa
  const formatRelativeDate = (date) => {
    const now = new Date();
    const diagramDate = new Date(date);
    const diffMs = now - diagramDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `Hace ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`;
    } else if (diffHours < 24) {
      return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
    } else if (diffDays < 7) {
      return `Hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
    } else {
      return diagramDate.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
  };

  // Estado de carga
  if (loading) {
    return (
      <div className="diagram-list">
        <div className="diagram-list__loading">
          <div className="diagram-list__spinner"></div>
          <p>Cargando diagramas...</p>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="diagram-list">
        <div className="diagram-list__error">
          <FiAlertCircle className="diagram-list__error-icon" />
          <p className="diagram-list__error-message">{error}</p>
          <button
            className="diagram-list__retry-button"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Estado vacío
  if (diagrams.length === 0) {
    return (
      <div className="diagram-list">
        <div className="diagram-list__empty">
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
        </div>
      </div>
    );
  }

  // Lista de diagramas
  return (
    <div className="diagram-list">
      <div className="diagram-list__grid">
        {diagrams.map((diagram) => (
          <Link
            key={diagram.id}
            to={`/editor/${diagram.id}`}
            className="diagram-list__card"
          >
            <div className="diagram-list__card-icon">
              <FiFileText />
            </div>

            <div className="diagram-list__card-content">
              <h3 className="diagram-list__card-title">{diagram.title}</h3>
              {diagram.description && (
                <p className="diagram-list__card-description">
                  {diagram.description}
                </p>
              )}

              <div className="diagram-list__card-footer">
                <div className="diagram-list__card-info">
                  <span className="diagram-list__card-date">
                    <FiClock className="diagram-list__info-icon" />
                    {formatRelativeDate(diagram.updatedAt)}
                  </span>

                  <div className="diagram-list__card-stats">
                    <span className="diagram-list__stat">
                      {diagram.nodesCount || 0} nodos
                    </span>
                    <span className="diagram-list__stat-separator">•</span>
                    <span className="diagram-list__stat">
                      {diagram.edgesCount || 0} conexiones
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default DiagramList;
