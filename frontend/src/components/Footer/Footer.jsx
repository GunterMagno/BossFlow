import './Footer.css';
import {
  FaFacebookF,
  FaXTwitter,
  FaInstagram,
  FaYoutube,
} from 'react-icons/fa6';

/**
 * Pie de página de la aplicación con información corporativa y enlaces
 * @returns {JSX.Element} Footer con marca, enlaces, redes sociales y copyright
 */
function Footer() {
  return (
    <footer className="footer">
      <section className="footer__superior">
        <section className="footer__seccion footer__seccion--sobre">
          <section className="footer__marca">
            <img
              src="/logo-nt.svg"
              alt="BossFlow Logo"
              className="footer__logo"
            />
            <h3 className="footer__titulo footer__titulo--marca">BossFlow</h3>
          </section>
          <p className="footer__descripcion">
            La plataforma para planificar y optimizar tácticas de batallas
            contra jefes con diagramas de flujos interactivos. Colabora con tu
            equipo, diseña estrategias visuales y gana fácil contra cualquier
            boss.
          </p>
        </section>

        <section className="footer__enlaces">
          <section className="footer__seccion footer__seccion--enlaces">
            <h3 className="footer__titulo">Enlaces útiles</h3>
            <ul className="footer__lista">
              <li className="footer__elemento">
                <a href="/about" className="footer__enlace">
                  Sobre nosotros
                </a>
              </li>
              <li className="footer__elemento">
                <a href="/features" className="footer__enlace">
                  Características
                </a>
              </li>
              <li className="footer__elemento">
                <a href="/blog" className="footer__enlace">
                  Blog
                </a>
              </li>
            </ul>
          </section>

          <section className="footer__seccion footer__seccion--enlaces">
            <h3 className="footer__titulo">Soporte & Legal</h3>
            <ul className="footer__lista">
              <li className="footer__elemento">
                <a href="/legal/terminos" className="footer__enlace">
                  Términos de Uso
                </a>
              </li>
              <li className="footer__elemento">
                <a href="/legal/privacidad" className="footer__enlace">
                  Política de Privacidad
                </a>
              </li>
              <li className="footer__elemento">
                <a href="/legal/cookies" className="footer__enlace">
                  Política de Cookies
                </a>
              </li>
              <li className="footer__elemento">
                <a href="/status" className="footer__enlace">
                  Estado del servicio
                </a>
              </li>
            </ul>
          </section>
        </section>

        <section className="footer__seccion footer__seccion--redes">
          <h3 className="footer__titulo">Redes sociales</h3>
          <section className="footer__redes">
            <a
              href="https://www.facebook.com/profile.php?id=61585128865474"
              className="footer__red"
              aria-label="Facebook"
              target="_blank"
            >
              <FaFacebookF className="footer__red-icono" />
            </a>
            <a
              href="https://x.com/Bossflow412981"
              className="footer__red"
              aria-label="X"
              target="_blank"
            >
              <FaXTwitter className="footer__red-icono" />
            </a>
            <a
              href="https://www.instagram.com/bossflowpi/"
              className="footer__red"
              aria-label="Instagram"
              target="_blank"
            >
              <FaInstagram className="footer__red-icono" />
            </a>
            <a
              href="https://www.youtube.com/channel/UC4oVyly7b4UCxzs9ugaDd0w"
              className="footer__red"
              aria-label="YouTube"
              target="_blank"
            >
              <FaYoutube className="footer__red-icono" />
            </a>
          </section>
        </section>
      </section>

      <hr className="footer__separador" />

      <section className="footer__inferior">
        <p className="footer__copyright">
          © BossFlow 2025. Todos los derechos reservados.
        </p>
        <p className="footer__lema">Planifica. Mejora. Derrota al boss.</p>
      </section>
    </footer>
  );
}

export default Footer;
