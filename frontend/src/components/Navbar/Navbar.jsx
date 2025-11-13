import { useState } from 'react';
import './Navbar.css';

function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  
  
  const [usuarioLogueado, setUsuarioLogueado] = useState(false);
  const usuario = { nombre: 'Nombre', avatar: '👤' };

  const alternarMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  const cerrarSesion = () => {
    console.log('Cerrando sesión...');
    setMenuAbierto(false);
    setUsuarioLogueado(false);
  };

  return (
    <header className="encabezado">
      <nav className="encabezado__navbar">
        <a href="/" className="navbar__logo">
          <h2>BossFlow</h2>
        </a>
        
        <ul className="navbar__enlaces">
          <li className="navbar__elemento">
            <a href="/" className="navbar__enlace">Inicio</a>
          </li>
          <li className="navbar__elemento">
            <a href="/diagrama" className="navbar__enlace">Diagramas</a>
          </li>
          <li className="navbar__elemento">
            <a href="/comunity" className="navbar__enlace">Comunidad</a>
          </li>
        </ul>

        <div className="navbar__usuario-menu">
          {!usuarioLogueado ? (
            // Usuario NO logueado: botón simple que redirige a login
            <a href="/login" className="navbar__boton-login">
              Iniciar sesión
            </a>
          ) : (
            // Usuario logueado: menú desplegable completo
            <>
              <button className="navbar__usuario" onClick={alternarMenu}>
                <span className="navbar__avatar">{usuario.avatar}</span>
                <span className="navbar__nombre">{usuario.nombre}</span>
                <span className={`navbar__flecha ${menuAbierto ? 'navbar__flecha--arriba' : ''}`}>
                  ▼
                </span>
              </button>
              
              {menuAbierto && (
                <ul className="menu-desplegable">
                  <li className="menu-desplegable__elemento">
                    <a href="/profile" className="menu-desplegable__enlace">
                      <span className="menu-desplegable__icono">👤</span>
                      <span>Perfil</span>
                    </a>
                  </li>
                  <li className="menu-desplegable__elemento">
                    <a href="/settings" className="menu-desplegable__enlace">
                      <span className="menu-desplegable__icono">⚙️</span>
                      <span>Configuración</span>
                    </a>
                  </li>
                  <li className="menu-desplegable__separador"></li>
                  <li className="menu-desplegable__elemento">
                    <button onClick={cerrarSesion} className="menu-desplegable__enlace menu-desplegable__enlace--cerrar">
                      <span className="menu-desplegable__icono">🚪</span>
                      <span>Cerrar sesión</span>
                    </button>
                  </li>
                </ul>
              )}
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;