import './App.css';

function App() {
  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <div className="logo">
            <span className="logo-icon">👿</span>
            <h1>BossFlow</h1>
          </div>
          <p className="tagline">Planifica tus estrategias contra los mejores bosses</p>
        </header>

        <main className="main">
          <div className="hero">
            <h2>Crea diagramas de flujo interactivos</h2>
            <p>Visualiza y comparte tus estrategias de combate contra jefes finales</p>
            
            <div className="features">
              <div className="feature-card">
                <span className="feature-icon">📊</span>
                <h3>Diagramas Visuales</h3>
                <p>Crea flujos de decisión intuitivos</p>
              </div>
              
              <div className="feature-card">
                <span className="feature-icon">🎯</span>
                <h3>Estrategias</h3>
                <p>Documenta tus tácticas de combate</p>
              </div>
              
              <div className="feature-card">
                <span className="feature-icon">🌐</span>
                <h3>Comparte</h3>
                <p>Colabora con otros jugadores</p>
              </div>
            </div>
          </div>
        </main>

        <footer className="footer">
          <p>BossFlow</p>
        </footer>
      </div>
    </div>
  );
}

export default App;