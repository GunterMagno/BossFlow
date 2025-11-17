import { useEffect } from 'react';
import { FiBarChart2, FiTarget, FiShare2 } from 'react-icons/fi';
import './Home.css';

function Home() {
  useEffect(() => {
    document.title = 'Inicio | BossFlow';
  }, []);

  return (
    <div className="home">
      <div className="home-container">
        <header className="home-header">
          <div className="logo">
            <img src="/logo-nt.svg" alt="BossFlow Logo" className="logo-icon" />
            <h1>BossFlow</h1>
          </div>
          <p className="tagline">
            Planifica tus estrategias contra los mejores bosses
          </p>
        </header>

        <main className="home-main">
          <div className="hero">
            <h2 className="hero-title">Derrota a cualquier boss</h2>
            <p className="hero-subtitle">
              Crea estrategias visuales y domina cada encuentro
            </p>

            <div className="features">
              <div className="feature-card">
                <span className="feature-icon">
                  <FiBarChart2 />
                </span>
                <h3>Diagramas Visuales</h3>
                <p>Crea flujos de decisión intuitivos para tus combates</p>
              </div>

              <div className="feature-card">
                <span className="feature-icon">
                  <FiTarget />
                </span>
                <h3>Estrategias</h3>
                <p>Documenta cada fase y táctica de combate</p>
              </div>

              <div className="feature-card">
                <span className="feature-icon">
                  <FiShare2 />
                </span>
                <h3>Comparte</h3>
                <p>Colabora con otros jugadores y mejora juntos</p>
              </div>
            </div>
          </div>
        </main>

        <footer className="home-footer">
          <p>© 2025 BossFlow - Domina cada encuentro</p>
        </footer>
      </div>
    </div>
  );
}

export default Home;
