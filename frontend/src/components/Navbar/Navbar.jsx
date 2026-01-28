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
 * Main navigation bar component of the application.
 * Provides navigation between pages and user authentication management.
 * Includes responsive menu for mobile devices and user dropdown menu.
 *
 * @returns {JSX.Element} Navigation element with links and user options
 */
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  /**
   * Toggles the visibility state of the desktop user dropdown menu.
   */
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  /**
   * Toggles the visibility state of the mobile hamburger menu.
   */
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  /**
   * Logs out the current user.
   * Closes all open menus, executes logout and redirects to home page.
   */
  const handleLogout = () => {
    console.log('Logging out...');
    setMenuOpen(false);
    setMobileMenuOpen(false);
    logout();
    navigate('/');
  };

  useEffect(() => {
    /**
     * Handles clicks outside the dropdown menu to close it automatically.
     *
     * @param {MouseEvent} event - Mouse click event
     */
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <header className="encabezado">
      <nav className="encabezado__navbar">
        <Link to="/" className="navbar__logo">
          <img src="/logo.png" alt="BossFlow" className="navbar__logo-img" />
        </Link>

        <button
          className="navbar__hamburguesa"
          onClick={toggleMobileMenu}
          aria-label="Menú"
        >
          {mobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>

        <ul
          className={`navbar__enlaces ${mobileMenuOpen ? 'navbar__enlaces--visible' : ''}`}
        >
          <li className="navbar__elemento">
            <Link
              to="/"
              className="navbar__enlace"
              onClick={() => setMobileMenuOpen(false)}
            >
              Inicio
            </Link>
          </li>
          <li className="navbar__elemento">
            <Link
              to="/dashboard"
              className="navbar__enlace"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
          </li>
          <li className="navbar__elemento">
            <Link
              to="/community"
              className="navbar__enlace"
              onClick={() => setMobileMenuOpen(false)}
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
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  className="navbar__boton-registro"
                  onClick={() => setMobileMenuOpen(false)}
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
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FiUser /> Perfil
                </Link>
                <Link
                  to="/settings"
                  className="navbar__enlace"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FiSettings /> Configuración
                </Link>
                <button
                  onClick={handleLogout}
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
              <button className="navbar__usuario" onClick={toggleMenu}>
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
                  className={`navbar__flecha ${menuOpen ? 'navbar__flecha--arriba' : ''}`}
                >
                  <FiChevronDown />
                </span>
              </button>

              {menuOpen && (
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
                      onClick={handleLogout}
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
