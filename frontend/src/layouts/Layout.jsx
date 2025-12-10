import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import './Layout.css';

/**
 * Componente de disposición principal de la aplicación
 * Envuelve la barra de navegación, contenido dinámico y pie de página
 * @returns {JSX.Element} Estructura base de la aplicación con Navbar, Outlet y Footer
 */
function Layout() {
  return (
    <section className="layout">
      <Navbar />
      <main className="layout__contenido">
        <Outlet />
      </main>
      <Footer />
    </section>
  );
}

export default Layout;
