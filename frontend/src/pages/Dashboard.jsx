import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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

  useEffect(() => {
    document.title = 'Dashboard | BossFlow';
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Datos de ejemplo - reemplazar con datos reales de API
  const misDiagramas = [
    {
      id: 1,
      nombre: 'Nombre diagrama',
      fechaCreacion: 'Hace 2 horas',
      colaboradores: [1, 2, 3],
    },
    {
      id: 2,
      nombre: 'Nombre diagrama',
      fechaCreacion: 'Hace 2 horas',
      colaboradores: [1, 2, 3],
    },
    {
      id: 3,
      nombre: 'Nombre diagrama',
      fechaCreacion: 'Hace 2 horas',
      colaboradores: [1, 2, 3],
    },
  ];

  const diagramasColaborados = [
    {
      id: 1,
      nombre: 'Nombre diagrama',
      creador: 1,
      colaboradores: [1, 2, 3, 4],
    },
    {
      id: 2,
      nombre: 'Nombre diagrama',
      creador: 1,
      colaboradores: [1, 2, 3, 4],
    },
    {
      id: 3,
      nombre: 'Nombre diagrama',
      creador: 1,
      colaboradores: [1, 2, 3, 4],
    },
    {
      id: 4,
      nombre: 'Nombre diagrama',
      creador: 1,
      colaboradores: [1, 2, 3, 4],
    },
  ];

  const actividadReciente = [
    {
      id: 1,
      tipo: 'creacion',
      diagrama: 'Diagrama de flujo de ventas',
      fecha: 'Hace 2 horas',
    },
    {
      id: 2,
      tipo: 'colaboracion',
      diagrama: 'Proceso de onboarding',
      fecha: 'Hace 5 horas',
    },
    {
      id: 3,
      tipo: 'edicion',
      diagrama: 'Sistema de inventario',
      fecha: 'Hace 1 día',
    },
  ];

  const estadisticas = {
    totalDiagramas: misDiagramas.length,
    colaboraciones: diagramasColaborados.length,
    plantillas: 5,
    comentariosPendientes: 3,
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="dashboard__sidebar">
        <div className="dashboard__sidebar-contenido">
          <div className="dashboard__logo">
            <h2>BossFlow</h2>
          </div>

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
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="dashboard__main">
        {activeMenu === 'inicio' && (
          <>
            {/* Estadísticas */}
            <section className="dashboard__seccion">
              <div className="dashboard__seccion-header">
                <div>
                  <h2 className="dashboard__titulo">Resumen</h2>
                  <p className="dashboard__descripcion">
                    Vista general de tu actividad
                  </p>
                </div>
              </div>

              <div className="dashboard__stats-grid">
                <div className="dashboard__stat-card">
                  <div className="dashboard__stat-icono">
                    <FiFileText />
                  </div>
                  <div className="dashboard__stat-contenido">
                    <h3 className="dashboard__stat-numero">{estadisticas.totalDiagramas}</h3>
                    <p className="dashboard__stat-label">Mis diagramas</p>
                  </div>
                </div>

                <div className="dashboard__stat-card">
                  <div className="dashboard__stat-icono">
                    <FiUsers />
                  </div>
                  <div className="dashboard__stat-contenido">
                    <h3 className="dashboard__stat-numero">{estadisticas.colaboraciones}</h3>
                    <p className="dashboard__stat-label">Colaboraciones</p>
                  </div>
                </div>

                <div className="dashboard__stat-card">
                  <div className="dashboard__stat-icono">
                    <FiLayers />
                  </div>
                  <div className="dashboard__stat-contenido">
                    <h3 className="dashboard__stat-numero">{estadisticas.plantillas}</h3>
                    <p className="dashboard__stat-label">Plantillas</p>
                  </div>
                </div>

                <div className="dashboard__stat-card">
                  <div className="dashboard__stat-icono">
                    <FiMessageSquare />
                  </div>
                  <div className="dashboard__stat-contenido">
                    <h3 className="dashboard__stat-numero">{estadisticas.comentariosPendientes}</h3>
                    <p className="dashboard__stat-label">Comentarios</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Actividad reciente */}
            <section className="dashboard__seccion">
              <div className="dashboard__seccion-header">
                <div>
                  <h2 className="dashboard__titulo">Actividad reciente</h2>
                  <p className="dashboard__descripcion">
                    Tus últimas acciones
                  </p>
                </div>
              </div>

              <div className="dashboard__actividad-lista">
                {actividadReciente.map((actividad) => (
                  <div key={actividad.id} className="dashboard__actividad-item">
                    <div className="dashboard__actividad-icono">
                      <FiClock />
                    </div>
                    <div className="dashboard__actividad-contenido">
                      <p className="dashboard__actividad-texto">
                        <span className="dashboard__actividad-accion">
                          {actividad.tipo === 'creacion' && 'Creaste'}
                          {actividad.tipo === 'colaboracion' && 'Te uniste a'}
                          {actividad.tipo === 'edicion' && 'Editaste'}
                        </span>
                        {' '}<span className="dashboard__actividad-diagrama">{actividad.diagrama}</span>
                      </p>
                      <span className="dashboard__actividad-fecha">{actividad.fecha}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Acceso rápido */}
            <section className="dashboard__seccion">
              <div className="dashboard__seccion-header">
                <div>
                  <h2 className="dashboard__titulo">Acceso rápido</h2>
                  <p className="dashboard__descripcion">
                    Tus diagramas más recientes
                  </p>
                </div>
                <button className="dashboard__boton-nuevo">
                  <FiPlus className="dashboard__boton-icono" />
                  Nuevo diagrama
                </button>
              </div>

              <div className="dashboard__grid">
                {misDiagramas.slice(0, 3).map((diagrama) => (
                  <div key={diagrama.id} className="dashboard__card">
                    <div className="dashboard__card-icono">
                      <FiFileText />
                    </div>

                    <div className="dashboard__card-contenido">
                      <h3 className="dashboard__card-titulo">{diagrama.nombre}</h3>

                      <div className="dashboard__card-footer">
                        <div className="dashboard__card-info">
                          <span className="dashboard__card-fecha">
                            <FiCopy className="dashboard__info-icono" />
                            {diagrama.fechaCreacion}
                          </span>
                          <div className="dashboard__card-colaboradores">
                            {diagrama.colaboradores.map((col, index) => (
                              <div
                                key={index}
                                className="dashboard__avatar"
                                title={`Colaborador ${col}`}
                              >
                                <FiUser />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {activeMenu === 'mis-diagramas' && (
          <section className="dashboard__seccion">
            <div className="dashboard__seccion-header">
              <div>
                <h2 className="dashboard__titulo">Mis Diagramas</h2>
                <p className="dashboard__descripcion">
                  Gestiona y crea tus diagramas
                </p>
              </div>
              <button className="dashboard__boton-nuevo">
                <FiPlus className="dashboard__boton-icono" />
                Nuevo diagrama
              </button>
            </div>

            <div className="dashboard__grid">
              {misDiagramas.map((diagrama) => (
                <div key={diagrama.id} className="dashboard__card">
                  <div className="dashboard__card-icono">
                    <FiFileText />
                  </div>

                  <div className="dashboard__card-contenido">
                    <h3 className="dashboard__card-titulo">{diagrama.nombre}</h3>

                    <div className="dashboard__card-footer">
                      <div className="dashboard__card-info">
                        <span className="dashboard__card-fecha">
                          <FiCopy className="dashboard__info-icono" />
                          {diagrama.fechaCreacion}
                        </span>
                        <div className="dashboard__card-colaboradores">
                          {diagrama.colaboradores.map((col, index) => (
                            <div
                              key={index}
                              className="dashboard__avatar"
                              title={`Colaborador ${col}`}
                            >
                              <FiUser />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
