import './Home.css';

function Home() {
  return (
    <div className="home">
      <div className="home-container">
        <header className="home-header">
          <div className="logo">
            <span className="logo-icon">👿</span>
            <h1>BossFlow</h1>
          </div>
          <p className="tagline">Planifica tus estrategias contra los mejores bosses</p>
        </header>

        <main className="home-main">
          <div className="hero">
            <h2 className="hero-title">Hello BossFlow</h2>
            <p className="hero-subtitle">
              Tu herramienta definitiva para crear diagramas de flujo de estrategias contra bosses épicos
            </p>
            
            <div className="features">
              <div className="feature-card">
                <span className="feature-icon">📊</span>
                <h3>Diagramas Visuales</h3>
                <p>Crea flujos de decisión intuitivos para tus combates</p>
              </div>
              
              <div className="feature-card">
                <span className="feature-icon">🎯</span>
                <h3>Estrategias</h3>
                <p>Documenta cada fase y táctica de combate</p>
              </div>
              
              <div className="feature-card">
                <span className="feature-icon">🌐</span>
                <h3>Comparte</h3>
                <p>Colabora con otros jugadores y mejora juntos</p>
              </div>
            </div>
          </div>
        </main>

        <footer className="home-footer">
          <p>BossFlow</p>
        </footer>
      </div>
    </div>
  );
}

export default Home;