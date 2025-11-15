import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import './Layout.css';

function Layout() {
  return (
    <div className="layout">
      <Navbar />
      <main className="layout__contenido">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
