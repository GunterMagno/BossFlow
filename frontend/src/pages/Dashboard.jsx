import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDiagrams } from '../services/diagramService';
import { getStats } from '../services/profileService';
import { getFormattedActivities } from '../services/activityService';
import DiagramList from '../components/DiagramList/DiagramList';
import NewDiagramModal from '../components/NewDiagramModal/NewDiagramModal';
import {
  FiHome,
  FiFileText,
  FiLayers,
  FiUsers,
  FiMessageSquare,
  FiSettings,
  FiLogOut,
  FiPlus,
  FiCopy,
  FiUser,
  FiTrendingUp,
  FiClock,
} from 'react-icons/fi';
import './Dashboard.css';

function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('inicio');
  const [diagrams, setDiagrams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activities, setActivities] = useState([]);
  const [userStats, setUserStats] = useState(null);

  useEffect(() => {
    document.title = 'Dashboard | BossFlow';
  }, []);

  // Función para cargar diagramas
  const fetchDiagrams = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getDiagrams();
      setDiagrams(response.diagrams || []);
    } catch (error) {
      console.error('Error al cargar diagramas:', error);
      setError('No se pudieron cargar los diagramas. El endpoint aún no está disponible.');
      setDiagrams([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar estadísticas
  const fetchStats = async () => {
    try {
      const response = await getStats();
      setUserStats(response.stats);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  // Cargar diagramas, actividades y estadísticas al montar el componente
  useEffect(() => {
    fetchDiagrams();
    loadActivities();
    fetchStats();
  }, []);

  // Función para cargar actividades
  const loadActivities = () => {
    const formattedActivities = getFormattedActivities();
    setActivities(formattedActivities);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Handler cuando se crea un nuevo diagrama
  const handleDiagramCreated = () => {
    // Refrescar la lista de diagramas, actividades y estadísticas
    fetchDiagrams();
    loadActivities();
    fetchStats();
  };

  // Handler cuando se elimina un diagrama
  const handleDiagramDeleted = () => {
    // Refrescar la lista de diagramas, actividades y estadísticas
    fetchDiagrams();
    loadActivities();
    fetchStats();
  };

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

  // Calcular estadísticas desde datos reales o del backend
  const estadisticas = userStats ? {
    totalDiagramas: userStats.diagramsCreated || diagrams.length,
    totalNodos: userStats.nodesCreated || 0,
    colaboraciones: userStats.collaborations || 0,
    plantillas: 0,
    comentariosPendientes: 0,
  } : {
    totalDiagramas: diagrams.length,
    totalNodos: 0,
    colaboraciones: 0,
    plantillas: 0,
    comentariosPendientes: 0,
  };

  // Obtener los 3 diagramas más recientes
  const diagramasRecientes = diagrams.slice(0, 3);

  return (
    <section className="dashboard">
      {/* Sidebar */}
      <aside className="dashboard__sidebar">
        <section className="dashboard__sidebar-contenido">
          <header className="dashboard__logo">
            <h2>BossFlow</h2>
          </header>

          <nav className="dashboard__nav">
            <Link
              to="/dashboard"
              className={`dashboard__nav-item ${
                activeMenu === 'inicio' ? 'dashboard__nav-item--activo' : ''
              }`}
              onClick={() => setActiveMenu('inicio')}
            >
              <FiHome className="dashboard__nav-icono" />
              <span>Inicio</span>
            </Link>

            <Link
              to="/dashboard"
              className={`dashboard__nav-item ${
                activeMenu === 'mis-diagramas' ? 'dashboard__nav-item--activo' : ''
              }`}
              onClick={() => setActiveMenu('mis-diagramas')}
            >
              <FiFileText className="dashboard__nav-icono" />
              <span>Mis diagramas</span>
            </Link>

            <Link
              to="/dashboard/colaboraciones"
              className={`dashboard__nav-item ${
                activeMenu === 'colaboraciones' ? 'dashboard__nav-item--activo' : ''
              }`}
              onClick={() => setActiveMenu('colaboraciones')}
            >
              <FiUsers className="dashboard__nav-icono" />
              <span>Colaboraciones</span>
            </Link>

            <Link
              to="/dashboard/plantillas"
              className={`dashboard__nav-item ${
                activeMenu === 'plantillas' ? 'dashboard__nav-item--activo' : ''
              }`}
              onClick={() => setActiveMenu('plantillas')}
            >
              <FiLayers className="dashboard__nav-icono" />
              <span>Plantillas</span>
            </Link>

            <Link
              to="/dashboard/comentarios"
              className={`dashboard__nav-item ${
                activeMenu === 'comentarios' ? 'dashboard__nav-item--activo' : ''
              }`}
              onClick={() => setActiveMenu('comentarios')}
            >
              <FiMessageSquare className="dashboard__nav-icono" />
              <span>Comentarios</span>
            </Link>

            <Link
              to="/settings"
              className={`dashboard__nav-item ${
                activeMenu === 'configuracion' ? 'dashboard__nav-item--activo' : ''
              }`}
              onClick={() => setActiveMenu('configuracion')}
            >
              <FiSettings className="dashboard__nav-icono" />
              <span>Configuración</span>
            </Link>
          </nav>

          <button className="dashboard__logout" onClick={handleLogout}>
            <FiLogOut className="dashboard__nav-icono" />
            <span>Cerrar sesión</span>
          </button>
        </section>
      </aside>

      {/* Contenido principal */}
      <main className="dashboard__main">
        {activeMenu === 'inicio' && (
          <>
            {/* Estadísticas */}
            <section className="dashboard__seccion">
              <header className="dashboard__seccion-header">
                <section>
                  <h2 className="dashboard__titulo">Resumen</h2>
                  <p className="dashboard__descripcion">
                    Vista general de tu actividad
                  </p>
                </section>
              </header>

              <section className="dashboard__stats-grid">
                <article className="dashboard__stat-card">
                  <figure className="dashboard__stat-icono">
                    <FiFileText />
                  </figure>
                  <section className="dashboard__stat-contenido">
                    <h3 className="dashboard__stat-numero">{estadisticas.totalDiagramas}</h3>
                    <p className="dashboard__stat-label">Mis diagramas</p>
                  </section>
                </article>

                <article className="dashboard__stat-card">
                  <figure className="dashboard__stat-icono">
                    <FiUsers />
                  </figure>
                  <section className="dashboard__stat-contenido">
                    <h3 className="dashboard__stat-numero">{estadisticas.colaboraciones}</h3>
                    <p className="dashboard__stat-label">Colaboraciones</p>
                  </section>
                </article>

                <article className="dashboard__stat-card">
                  <figure className="dashboard__stat-icono">
                    <FiCopy />
                  </figure>
                  <section className="dashboard__stat-contenido">
                    <h3 className="dashboard__stat-numero">{estadisticas.totalNodos}</h3>
                    <p className="dashboard__stat-label">Nodos creados</p>
                  </section>
                </article>

                <article className="dashboard__stat-card">
                  <figure className="dashboard__stat-icono">
                    <FiMessageSquare />
                  </figure>
                  <section className="dashboard__stat-contenido">
                    <h3 className="dashboard__stat-numero">{estadisticas.comentariosPendientes}</h3>
                    <p className="dashboard__stat-label">Comentarios</p>
                  </section>
                </article>
              </section>
            </section>

            {/* Acceso rápido */}
            <section className="dashboard__seccion">
              <header className="dashboard__seccion-header">
                <section>
                  <h2 className="dashboard__titulo">Acceso rápido</h2>
                  <p className="dashboard__descripcion">
                    Tus diagramas más recientes
                  </p>
                </section>
              <section>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="dashboard__boton-nuevo"
                >
                  <FiPlus className="dashboard__boton-icono" />
                  Nuevo diagrama
                </button>
              </section>
              </header>

              {loading ? (
                <article className="dashboard__loading">
                  <figure className="dashboard__spinner"></figure>
                  <p>Cargando diagramas...</p>
                </article>
              ) : error ? (
                <article className="dashboard__error">
                  <p className="dashboard__error-message">{error}</p>
                </article>
              ) : diagramasRecientes.length > 0 ? (
                <section className="dashboard__grid">
                  {diagramasRecientes.map((diagrama) => (
                    <Link
                      key={diagrama.id}
                      to={`/editor/${diagrama.id}`}
                      className="dashboard__card"
                    >
                      <figure className="dashboard__card-icono">
                        <FiFileText />
                      </figure>

                      <article className="dashboard__card-contenido">
                        <h3 className="dashboard__card-titulo">{diagrama.title}</h3>
                        {diagrama.description && (
                          <p className="dashboard__card-descripcion">
                            {diagrama.description}
                          </p>
                        )}

                        <footer className="dashboard__card-footer">
                          <section className="dashboard__card-info">
                            <span className="dashboard__card-fecha">
                              <FiClock className="dashboard__info-icono" />
                              {formatRelativeDate(diagrama.updatedAt)}
                            </span>
                            <section className="dashboard__card-stats">
                              <span>{(diagrama.nodes ? diagrama.nodes.length : 0)} nodos</span>
                              <span className="dashboard__stat-separator">•</span>
                              <span>{(diagrama.edges ? diagrama.edges.length : 0)} conexiones</span>
                            </section>
                          </section>
                        </footer>
                      </article>
                    </Link>
                  ))}
                </section>
              ) : (
                <article className="dashboard__empty">
                  <p>No tienes diagramas todavía. Crea tu primer diagrama para empezar.</p>
                </article>
              )}
            </section>

            {/* Actividad reciente */}
            <section className="dashboard__seccion">
              <header className="dashboard__seccion-header">
                <section>
                  <h2 className="dashboard__titulo">Actividad reciente</h2>
                  <p className="dashboard__descripcion">
                    Tus últimas acciones
                  </p>
                </section>
              </header>

              {activities.length > 0 ? (
                <ul className="dashboard__actividad-lista">
                  {activities.map((actividad) => (
                    <li key={actividad.id} className="dashboard__actividad-item">
                      <figure className="dashboard__actividad-icono">
                        <FiClock />
                      </figure>
                      <article className="dashboard__actividad-contenido">
                        <p className="dashboard__actividad-texto">
                          <span className="dashboard__actividad-accion">
                            {actividad.tipo === 'creacion' && 'Creaste'}
                            {actividad.tipo === 'edicion' && 'Editaste'}
                            {actividad.tipo === 'eliminacion' && 'Eliminaste'}
                            {actividad.tipo === 'visualizacion' && 'Visualizaste'}
                          </span>
                          {' '}<span className="dashboard__actividad-diagrama">{actividad.diagrama}</span>
                        </p>
                        <span className="dashboard__actividad-fecha">{actividad.fechaFormateada}</span>
                      </article>
                    </li>
                  ))}
                </ul>
              ) : (
                <article className="dashboard__empty">
                  <p>No hay actividad reciente. Crea o edita diagramas para ver tu actividad aquí.</p>
                </article>
              )}
            </section>
          </>
        )}

        {activeMenu === 'mis-diagramas' && (
          <section className="dashboard__seccion">
            <header className="dashboard__seccion-header">
              <section>
                <h2 className="dashboard__titulo">Mis Diagramas</h2>
                <p className="dashboard__descripcion">
                  Gestiona y crea tus diagramas
                </p>
              </section>
              <button
                onClick={() => setIsModalOpen(true)}
                className="dashboard__boton-nuevo"
              >
                <FiPlus className="dashboard__boton-icono" />
                Nuevo diagrama
              </button>
            </header>

            <DiagramList
              onCreateClick={() => setIsModalOpen(true)}
              onDiagramDeleted={handleDiagramDeleted}
            />
          </section>
        )}
      </main>

      {/* Modal para crear nuevo diagrama */}
      <NewDiagramModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDiagramCreated={handleDiagramCreated}
      />

      {/* Navegación móvil inferior */}
      <nav className="dashboard__mobile-nav">
        <button
          className={`dashboard__mobile-nav-item ${activeMenu === 'inicio' ? 'dashboard__mobile-nav-item--activo' : ''}`}
          onClick={() => setActiveMenu('inicio')}
          aria-label="Inicio"
        >
          <FiHome />
          <span>Inicio</span>
        </button>
        <button
          className={`dashboard__mobile-nav-item ${activeMenu === 'mis-diagramas' ? 'dashboard__mobile-nav-item--activo' : ''}`}
          onClick={() => setActiveMenu('mis-diagramas')}
          aria-label="Mis diagramas"
        >
          <FiFileText />
          <span>Diagramas</span>
        </button>
        <button
          className={`dashboard__mobile-nav-item ${activeMenu === 'plantillas' ? 'dashboard__mobile-nav-item--activo' : ''}`}
          onClick={() => { setActiveMenu('plantillas'); navigate('/dashboard/plantillas'); }}
          aria-label="Plantillas"
        >
          <FiLayers />
          <span>Plantillas</span>
        </button>
        <button
          className="dashboard__mobile-nav-item dashboard__mobile-nav-item--new"
          onClick={() => setIsModalOpen(true)}
          aria-label="Nuevo diagrama"
        >
          <FiPlus />
        </button>
        <button
          className={`dashboard__mobile-nav-item ${activeMenu === 'comentarios' ? 'dashboard__mobile-nav-item--activo' : ''}`}
          onClick={() => setActiveMenu('comentarios')}
          aria-label="Comentarios"
        >
          <FiMessageSquare />
          <span>Comentarios</span>
        </button>
        <button
          className={`dashboard__mobile-nav-item ${activeMenu === 'colaboraciones' ? 'dashboard__mobile-nav-item--activo' : ''}`}
          onClick={() => setActiveMenu('colaboraciones')}
          aria-label="Colaboraciones"
        >
          <FiUsers />
          <span>Colaborar</span>
        </button>
        <button
          className={`dashboard__mobile-nav-item ${activeMenu === 'configuracion' ? 'dashboard__mobile-nav-item--activo' : ''}`}
          onClick={() => navigate('/settings')}
          aria-label="Configuración"
        >
          <FiSettings />
          <span>Config</span>
        </button>
      </nav>
    </section>
  );
}

export default Dashboard;
