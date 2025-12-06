import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import './Layout.css';

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
