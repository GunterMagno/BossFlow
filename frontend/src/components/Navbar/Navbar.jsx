import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiSettings, FiLogOut, FiChevronDown, FiMenu, FiX } from 'react-icons/fi';
import './Navbar.css';

function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const alternarMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  const alternarMenuMovil = () => {
    setMenuMovilAbierto(!menuMovilAbierto);
  };

  const cerrarSesion = () => {
    console.log('Cerrando sesión...');
    setMenuAbierto(false);
    setMenuMovilAbierto(false);
    logout();
    navigate('/');
  };

  return (
    <header className="encabezado">
      <nav className="encabezado__navbar">
        <a href="/" className="navbar__logo">
          <img src="/logo.png" alt="BossFlow" className="navbar__logo-img" />
        </a>

        {/* Botón hamburguesa para móviles */}
        <button 
          className="navbar__hamburguesa" 
          onClick={alternarMenuMovil}
          aria-label="Menú"
        >
          {menuMovilAbierto ? <FiX /> : <FiMenu />}
        </button>

        <ul className={`navbar__enlaces ${menuMovilAbierto ? 'navbar__enlaces--visible' : ''}`}>
          <li className="navbar__elemento">
            <a href="/" className="navbar__enlace" onClick={() => setMenuMovilAbierto(false)}>
              Inicio
            </a>
          </li>
          <li className="navbar__elemento">
            <a href="/diagrama" className="navbar__enlace" onClick={() => setMenuMovilAbierto(false)}>
              Diagramas
            </a>
          </li>
          <li className="navbar__elemento">
            <a href="/comunity" className="navbar__enlace" onClick={() => setMenuMovilAbierto(false)}>
              Comunidad
            </a>
          </li>
          
          {/* Opciones de auth en móvil dentro del menú */}
          <li className="navbar__elemento navbar__elemento--auth-movil">
            {!isAuthenticated ? (
              <div className="navbar__botones-auth-movil">
                <a href="/login" className="navbar__boton-login" onClick={() => setMenuMovilAbierto(false)}>
                  Iniciar sesión
                </a>
                <a href="/register" className="navbar__boton-registro" onClick={() => setMenuMovilAbierto(false)}>
                  Registrarse
                </a>
              </div>
            ) : (
              <div className="navbar__usuario-movil">
                <a href="/profile" className="navbar__enlace" onClick={() => setMenuMovilAbierto(false)}>
                  <FiUser /> Perfil
                </a>
                <a href="/settings" className="navbar__enlace" onClick={() => setMenuMovilAbierto(false)}>
                  <FiSettings /> Configuración
                </a>
                <button onClick={cerrarSesion} className="navbar__enlace navbar__enlace--logout">
                  <FiLogOut /> Cerrar sesión
                </button>
              </div>
            )}
          </li>
        </ul>

        <div className="navbar__usuario-menu">
          {!isAuthenticated ? (
            // Usuario NO logueado: botones de login y registro (solo desktop)
            <div className="navbar__botones-auth">
              <a href="/login" className="navbar__boton-login">
                Iniciar sesión
              </a>
              <a href="/register" className="navbar__boton-registro">
                Registrarse
              </a>
            </div>
          ) : (
            // Usuario logueado: menú desplegable completo (solo desktop)
            <>
              <button className="navbar__usuario" onClick={alternarMenu}>
                <span className="navbar__avatar"><FiUser /></span>
                <span className="navbar__nombre">{user?.username || user?.email}</span>
                <span
                  className={`navbar__flecha ${menuAbierto ? 'navbar__flecha--arriba' : ''}`}
                >
                  <FiChevronDown />
                </span>
              </button>

              {menuAbierto && (
                <ul className="menu-desplegable">
                  <li className="menu-desplegable__elemento">
                    <a href="/profile" className="menu-desplegable__enlace">
                      <span className="menu-desplegable__icono"><FiUser /></span>
                      <span>Perfil</span>
                    </a>
                  </li>
                  <li className="menu-desplegable__elemento">
                    <a href="/settings" className="menu-desplegable__enlace">
                      <span className="menu-desplegable__icono"><FiSettings /></span>
                      <span>Configuración</span>
                    </a>
                  </li>
                  <li className="menu-desplegable__separador"></li>
                  <li className="menu-desplegable__elemento">
                    <button
                      onClick={cerrarSesion}
                      className="menu-desplegable__enlace menu-desplegable__enlace--cerrar"
                    >
                      <span className="menu-desplegable__icono"><FiLogOut /></span>
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
