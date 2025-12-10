import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiUser,
  FiSettings,
  FiLogOut,
  FiChevronDown,
  FiMenu,
  FiX,
} from 'react-icons/fi';
import './Navbar.css';

/**
 * Componente de barra de navegación principal de la aplicación.
 * Proporciona navegación entre páginas y gestión de autenticación de usuario.
 * Incluye menú responsive para dispositivos móviles y menú desplegable de usuario.
 *
 * @returns {JSX.Element} Elemento de navegación con enlaces y opciones de usuario
 */
function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  /**
   * Alterna el estado de visibilidad del menú desplegable de usuario en escritorio.
   */
  const alternarMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  /**
   * Alterna el estado de visibilidad del menú hamburguesa en dispositivos móviles.
   */
  const alternarMenuMovil = () => {
    setMenuMovilAbierto(!menuMovilAbierto);
  };

  /**
   * Cierra la sesión del usuario actual.
   * Cierra todos los menús abiertos, ejecuta el logout y redirige a la página de inicio.
   */
  const cerrarSesion = () => {
    console.log('Cerrando sesión...');
    setMenuAbierto(false);
    setMenuMovilAbierto(false);
    logout();
    navigate('/');
  };

  useEffect(() => {
    /**
     * Maneja los clics fuera del menú desplegable para cerrarlo automáticamente.
     *
     * @param {MouseEvent} event - Evento de clic del ratón
     */
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuAbierto(false);
      }
    };

    if (menuAbierto) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuAbierto]);

  return (
    <header className="encabezado">
      <nav className="encabezado__navbar">
        <Link to="/" className="navbar__logo">
          <img src="/logo.png" alt="BossFlow" className="navbar__logo-img" />
        </Link>

        <button
          className="navbar__hamburguesa"
          onClick={alternarMenuMovil}
          aria-label="Menú"
        >
          {menuMovilAbierto ? <FiX /> : <FiMenu />}
        </button>

        <ul
          className={`navbar__enlaces ${menuMovilAbierto ? 'navbar__enlaces--visible' : ''}`}
        >
          <li className="navbar__elemento">
            <Link
              to="/"
              className="navbar__enlace"
              onClick={() => setMenuMovilAbierto(false)}
            >
              Inicio
            </Link>
          </li>
          <li className="navbar__elemento">
            <Link
              to="/dashboard"
              className="navbar__enlace"
              onClick={() => setMenuMovilAbierto(false)}
            >
              Dashboard
            </Link>
          </li>
          <li className="navbar__elemento">
            <Link
              to="/community"
              className="navbar__enlace"
              onClick={() => setMenuMovilAbierto(false)}
            >
              Comunidad
            </Link>
          </li>

          <li className="navbar__elemento navbar__elemento--auth-movil">
            {!isAuthenticated ? (
              <section className="navbar__botones-auth-movil">
                <Link
                  to="/login"
                  className="navbar__boton-login"
                  onClick={() => setMenuMovilAbierto(false)}
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  className="navbar__boton-registro"
                  onClick={() => setMenuMovilAbierto(false)}
                >
                  Registrarse
                </Link>
              </section>
            ) : (
              <section className="navbar__usuario-movil">
                <h3 className="navbar__seccion-titulo">Cuenta</h3>
                <Link
                  to="/profile"
                  className="navbar__enlace"
                  onClick={() => setMenuMovilAbierto(false)}
                >
                  <FiUser /> Perfil
                </Link>
                <Link
                  to="/settings"
                  className="navbar__enlace"
                  onClick={() => setMenuMovilAbierto(false)}
                >
                  <FiSettings /> Configuración
                </Link>
                <button
                  onClick={cerrarSesion}
                  className="navbar__enlace navbar__enlace--logout"
                >
                  <FiLogOut /> Cerrar sesión
                </button>
              </section>
            )}
          </li>
        </ul>

        <section className="navbar__usuario-menu" ref={menuRef}>
          {!isAuthenticated ? (
              <section className="navbar__botones-auth">
              <Link to="/login" className="navbar__boton-login">
                Iniciar sesión
              </Link>
              <Link to="/register" className="navbar__boton-registro">
                Registrarse
              </Link>
            </section>
          ) : (
            <>
              <button className="navbar__usuario" onClick={alternarMenu}>
                <span className="navbar__avatar">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.username} className="navbar__avatar-img" />
                  ) : (
                    <FiUser />
                  )}
                </span>
                <span className="navbar__nombre">
                  {user?.username || user?.email}
                </span>
                <span
                  className={`navbar__flecha ${menuAbierto ? 'navbar__flecha--arriba' : ''}`}
                >
                  <FiChevronDown />
                </span>
              </button>

              {menuAbierto && (
                <ul className="menu-desplegable">
                  <li className="menu-desplegable__elemento">
                    <Link to="/profile" className="menu-desplegable__enlace">
                      <span className="menu-desplegable__icono">
                        <FiUser />
                      </span>
                      <span>Perfil</span>
                    </Link>
                  </li>
                  <li className="menu-desplegable__elemento">
                    <Link to="/settings" className="menu-desplegable__enlace">
                      <span className="menu-desplegable__icono">
                        <FiSettings />
                      </span>
                      <span>Configuración</span>
                    </Link>
                  </li>
                  <li className="menu-desplegable__separador"></li>
                  <li className="menu-desplegable__elemento">
                    <button
                      onClick={cerrarSesion}
                      className="menu-desplegable__enlace menu-desplegable__enlace--cerrar"
                    >
                      <span className="menu-desplegable__icono">
                        <FiLogOut />
                      </span>
                      <span>Cerrar sesión</span>
                    </button>
                  </li>
                </ul>
              )}
            </>
          )}
        </section>
      </nav>
    </header>
  );
}

export default Navbar;
