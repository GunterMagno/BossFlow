import { useEffect } from 'react';
import { FiUsers, FiMessageCircle, FiTrendingUp, FiZap } from 'react-icons/fi';
import './Community.css';

function Community() {
  useEffect(() => {
    document.title = 'Comunidad | BossFlow';
  }, []);

  return (
    <section className="community">
      <section className="community-container">
        <main className="community-main">
          <header className="community-hero">
            <figure className="community-icon-wrapper">
              <FiUsers className="community-icon" />
            </figure>

            <h1 className="community-title">Próximamente</h1>

            <p className="community-subtitle">
              Estamos trabajando en una increíble sección de comunidad donde podrás:
            </p>

            <section className="community-features">
              <article className="community-feature">
                <span className="community-feature-icon">
                  <FiMessageCircle />
                </span>
                <h3>Compartir estrategias</h3>
                <p>Comparte tus diagramas de combate con otros jugadores</p>
              </article>

              <article className="community-feature">
                <span className="community-feature-icon">
                  <FiTrendingUp />
                </span>
                <h3>Explorar contenido popular</h3>
                <p>Descubre las mejores estrategias de la comunidad</p>
              </article>

              <article className="community-feature">
                <span className="community-feature-icon">
                  <FiZap />
                </span>
                <h3>Colaborar en tiempo real</h3>
                <p>Trabaja junto a otros en diagramas compartidos</p>
              </article>
            </section>

            <aside className="community-cta">
              <p className="community-cta-text">
                Mantente atento a las próximas actualizaciones
              </p>
            </aside>
          </header>
        </main>
      </section>
    </section>
  );
}

export default Community;
