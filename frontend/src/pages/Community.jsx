import { useEffect } from 'react';
import { FiUsers, FiMessageCircle, FiTrendingUp, FiZap } from 'react-icons/fi';
import './Community.css';

function Community() {
  useEffect(() => {
    document.title = 'Comunidad | BossFlow';
  }, []);

  return (
    <div className="community">
      <div className="community-container">
        <main className="community-main">
          <div className="community-hero">
            <div className="community-icon-wrapper">
              <FiUsers className="community-icon" />
            </div>

            <h1 className="community-title">Próximamente</h1>

            <p className="community-subtitle">
              Estamos trabajando en una increíble sección de comunidad donde podrás:
            </p>

            <div className="community-features">
              <div className="community-feature">
                <span className="community-feature-icon">
                  <FiMessageCircle />
                </span>
                <h3>Compartir estrategias</h3>
                <p>Comparte tus diagramas de combate con otros jugadores</p>
              </div>

              <div className="community-feature">
                <span className="community-feature-icon">
                  <FiTrendingUp />
                </span>
                <h3>Explorar contenido popular</h3>
                <p>Descubre las mejores estrategias de la comunidad</p>
              </div>

              <div className="community-feature">
                <span className="community-feature-icon">
                  <FiZap />
                </span>
                <h3>Colaborar en tiempo real</h3>
                <p>Trabaja junto a otros en diagramas compartidos</p>
              </div>
            </div>

            <div className="community-cta">
              <p className="community-cta-text">
                Mantente atento a las próximas actualizaciones
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Community;
