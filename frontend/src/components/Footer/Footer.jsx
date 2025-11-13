import './Footer.css';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="footer">
      <section className="footer__superior">
        <section className="footer__seccion footer__seccion--sobre">
          <h3 className="footer__titulo">Sobre BossFlow</h3>
          <p className="footer__descripcion">
            La plataforma para planificar y optimizar tácticas de batallas contra jefes con diagramas de flujos interactivos. Colabora con tu equipo, diseña estrategias visuales y gana fácil contra cualquier boss.
          </p>
        </section>

        
        <div className="footer__enlaces">
          <section className="footer__seccion footer__seccion--enlaces">
            <h3 className="footer__titulo">Enlaces útiles</h3>
            <ul className="footer__lista">
              <li className="footer__elemento">
                <a href="/about" className="footer__enlace">Sobre nosotros</a>
              </li>
              <li className="footer__elemento">
                <a href="/features" className="footer__enlace">Características</a>
              </li>
              <li className="footer__elemento">
                <a href="/pricing" className="footer__enlace">Precios</a>
              </li>
              <li className="footer__elemento">
                <a href="/blog" className="footer__enlace">Blog</a>
              </li>
            </ul>
          </section>

          <section className="footer__seccion footer__seccion--enlaces">
            <h3 className="footer__titulo">Soporte & Legal</h3>
            <ul className="footer__lista">
              <li className="footer__elemento">
                <a href="/terms" className="footer__enlace">Términos y Condiciones</a>
              </li>
              <li className="footer__elemento">
                <a href="/privacy" className="footer__enlace">Política de Privacidad</a>
              </li>
              <li className="footer__elemento">
                <a href="/help" className="footer__enlace">Centro de Ayuda</a>
              </li>
              <li className="footer__elemento">
                <a href="/status" className="footer__enlace">Estado del servicio</a>
              </li>
            </ul>
          </section>
        </div>

        <section className="footer__seccion footer__seccion--redes">
          <h3 className="footer__titulo">Redes sociales</h3>
          <div className="footer__redes">
            <a href="https://facebook.com" className="footer__red" aria-label="Facebook" target="_blank">
              <FaFacebookF className="footer__red-icono" />
            </a>
            <a href="https://twitter.com" className="footer__red" aria-label="Twitter" target="_blank">
              <FaTwitter className="footer__red-icono" />
            </a>
            <a href="https://instagram.com" className="footer__red" aria-label="Instagram" target="_blank">
              <FaInstagram className="footer__red-icono" />
            </a>
            <a href="https://linkedin.com" className="footer__red" aria-label="LinkedIn" target="_blank">
              <FaLinkedinIn className="footer__red-icono" />
            </a>
          </div>
        </section>
      </section>

      <div className="footer__separador"></div>

      <section className="footer__inferior">
        <p className="footer__copyright">
          © BossFlow 2025. Todos los derechos reservados.
        </p>
        <p className="footer__lema">
          Planifica. Mejora. Derrota al boss.
        </p>
      </section>
    </footer>
  );
}

export default Footer;