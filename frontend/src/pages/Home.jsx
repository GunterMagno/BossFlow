import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiBarChart2,
  FiTarget,
  FiShare2,
  FiZap,
  FiUsers,
  FiTrendingUp,
  FiArrowRight,
  FiCheck,
  FiGrid,
  FiGitBranch
} from 'react-icons/fi';
import './Home.css';

function Home() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    document.title = 'BossFlow - Planifica tus estrategias contra los mejores bosses';
  }, []);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <FiZap className="badge-icon" />
              <span>La herramienta definitiva para gamers</span>
            </div>
            <h1 className="hero-title">
              Domina cada <span className="gradient-text">Boss Fight</span> con estrategias visuales
            </h1>
            <p className="hero-description">
              Crea diagramas de flujo interactivos para planificar tus combates,
              colabora con tu equipo y conquista cualquier desafío.
            </p>
            <div className="hero-cta">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="btn btn-primary">
                    <FiGrid />
                    Ir al Dashboard
                  </Link>
                  <Link to="/editor/new" className="btn btn-secondary">
                    Crear diagrama
                    <FiArrowRight />
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary">
                    Comenzar ahora
                    <FiArrowRight />
                  </Link>
                  <Link to="/login" className="btn btn-secondary">
                    Iniciar sesión
                  </Link>
                </>
              )}
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <FiUsers className="stat-icon" />
                <span className="stat-label">Comunidad activa</span>
              </div>
              <div className="stat-item">
                <FiZap className="stat-icon" />
                <span className="stat-label">Flujos totalmente personalizables</span>
              </div>
              <div className="stat-item">
                <FiCheck className="stat-icon" />
                <span className="stat-label">Totalmente gratuito</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="visual-card">
              <div className="card-glow"></div>
              <FiGitBranch className="visual-icon" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Todo lo que necesitas para triunfar</h2>
            <p className="section-subtitle">
              Herramientas profesionales diseñadas para jugadores exigentes
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <FiBarChart2 className="feature-icon" />
              </div>
              <h3>Diagramas Intuitivos</h3>
              <p>
                Crea flujos de decisión visuales con nuestro editor drag & drop.
                Sin complicaciones, solo resultados.
              </p>
              <ul className="feature-list">
                <li><FiCheck /> Editor visual avanzado</li>
                <li><FiCheck /> Múltiples tipos de nodos</li>
                <li><FiCheck /> Exportación en varios formatos</li>
              </ul>
            </div>

            <div className="feature-card feature-card-highlight">
              <div className="feature-icon-wrapper">
                <FiTarget className="feature-icon" />
              </div>
              <h3>Estrategias Ganadoras</h3>
              <p>
                Documenta cada fase, ataque y contraataque.
                Planifica como un profesional.
              </p>
              <ul className="feature-list">
                <li><FiCheck /> Fases de combate detalladas</li>
                <li><FiCheck /> Notas y descripciones</li>
                <li><FiCheck /> Plantillas predefinidas</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <FiShare2 className="feature-icon" />
              </div>
              <h3>Colaboración en Tiempo Real</h3>
              <p>
                Comparte tus estrategias con tu guild o comunidad.
                Mejoren juntos, ganen juntos.
              </p>
              <ul className="feature-list">
                <li><FiCheck /> Compartir con un clic</li>
                <li><FiCheck /> Comentarios y feedback</li>
                <li><FiCheck /> Comunidad activa</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <FiUsers className="feature-icon" />
              </div>
              <h3>Trabajo en Equipo</h3>
              <p>
                Colabora con tu raid team y sincroniza tus estrategias
                para una ejecución perfecta.
              </p>
              <ul className="feature-list">
                <li><FiCheck /> Gestión de equipos</li>
                <li><FiCheck /> Roles y permisos</li>
                <li><FiCheck /> Chat integrado</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <FiTrendingUp className="feature-icon" />
              </div>
              <h3>Análisis y Mejora</h3>
              <p>
                Registra tus intentos, analiza qué funciona y optimiza
                tu estrategia continuamente.
              </p>
              <ul className="feature-list">
                <li><FiCheck /> Historial de intentos</li>
                <li><FiCheck /> Métricas de rendimiento</li>
                <li><FiCheck /> Optimización continua</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <FiZap className="feature-icon" />
              </div>
              <h3>Rápido y Eficiente</h3>
              <p>
                Interfaz optimizada para que te concentres en lo importante:
                derrotar al boss.
              </p>
              <ul className="feature-list">
                <li><FiCheck /> Carga instantánea</li>
                <li><FiCheck /> Guardado automático</li>
                <li><FiCheck /> Acceso desde cualquier lugar</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            {isAuthenticated ? (
              <>
                <h2 className="cta-title">¡Hora de crear estrategias épicas!</h2>
                <p className="cta-description">
                  Comienza a planificar tus combates y colabora con tu equipo para
                  derrotar a los bosses más difíciles.
                </p>
                <div className="cta-buttons">
                  <Link to="/editor/new" className="btn btn-primary btn-large">
                    <FiZap />
                    Crear nuevo diagrama
                  </Link>
                </div>
                <p className="cta-note">
                  Accede a todas tus herramientas desde el Dashboard
                </p>
              </>
            ) : (
              <>
                <h2 className="cta-title">¿Listo para conquistar tu próximo desafío?</h2>
                <p className="cta-description">
                  Únete a cientos de jugadores que ya están usando BossFlow para
                  mejorar sus estrategias y derrotar a los bosses más difíciles.
                </p>
                <div className="cta-buttons">
                  <Link to="/register" className="btn btn-primary btn-large">
                    Crear cuenta ahora
                    <FiArrowRight />
                  </Link>
                </div>
                <p className="cta-note">
                  Totalmente gratuito • Configuración en 2 minutos
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
