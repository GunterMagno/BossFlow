import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LegalPages.css';

/**
 * Página de Política de Cookies.
 * Explica el uso (o no uso) de cookies en BossFlow.
 */
function CookiesPolicy() {
  useEffect(() => {
    document.title = 'Política de Cookies | BossFlow';
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="legal-page">
      <article className="legal-page__container">
        <header className="legal-page__header">
          <h1 className="legal-page__title">Política de Cookies</h1>
          <p className="legal-page__subtitle">
            Última actualización: 11 de diciembre de 2025
          </p>
        </header>

        <section className="legal-page__content">
          <section className="legal-page__section">
            <h2>1. ¿Qué son las cookies?</h2>
            <p>
              Las cookies son pequeños archivos de texto que los sitios web almacenan en el
              navegador del usuario para recordar información sobre su visita. Las cookies pueden
              utilizarse para diversos fines, como autenticación, personalización de la experiencia,
              análisis de tráfico o publicidad.
            </p>
          </section>

          <section className="legal-page__section">
            <h2>2. BossFlow NO utiliza cookies</h2>
            <p className="legal-page__highlight">
              <strong>
                BossFlow NO utiliza cookies tradicionales (archivos de texto enviados por el
                servidor) para ningún propósito.
              </strong>
            </p>
            <p>
              Nos tomamos muy en serio tu privacidad y hemos decidido implementar nuestro sistema
              de autenticación y gestión de preferencias sin depender de cookies. Esto significa
              que:
            </p>
            <ul>
              <li>
                <strong>No rastreamos tu actividad</strong> con cookies de terceros
              </li>
              <li>
                <strong>No utilizamos cookies de publicidad</strong>
              </li>
              <li>
                <strong>No utilizamos cookies de análisis</strong> (Google Analytics, Facebook
                Pixel, etc.)
              </li>
              <li>
                <strong>No compartimos información</strong> con redes publicitarias o empresas de
                analítica mediante cookies
              </li>
            </ul>
          </section>

          <section className="legal-page__section">
            <h2>3. Tecnologías alternativas: localStorage</h2>
            <p>
              En lugar de cookies, BossFlow utiliza <strong>localStorage</strong>, una tecnología
              nativa de los navegadores web modernos que permite almacenar información localmente en
              tu dispositivo de forma más segura y transparente.
            </p>

            <h3>3.1. ¿Qué almacenamos en localStorage?</h3>
            <p>Únicamente almacenamos la información estrictamente necesaria para que funcione el servicio:</p>

            <h4>Token de autenticación (JWT)</h4>
            <ul>
              <li>
                <strong>Propósito:</strong> Mantener tu sesión iniciada de forma segura sin
                necesidad de introducir usuario y contraseña en cada visita
              </li>
              <li>
                <strong>Contenido:</strong> Token JWT cifrado que contiene tu identificador de
                usuario y fecha de expiración
              </li>
              <li>
                <strong>Duración:</strong> El token expira automáticamente tras un periodo de
                inactividad (configurable, generalmente 7-30 días)
              </li>
              <li>
                <strong>Control del usuario:</strong> Puedes cerrar sesión en cualquier momento
                desde el menú de usuario, lo que eliminará el token inmediatamente
              </li>
            </ul>

            <h4>Preferencias de interfaz (opcional)</h4>
            <ul>
              <li>
                <strong>Propósito:</strong> Recordar tus preferencias de configuración de la
                interfaz (por ejemplo, modo oscuro/claro, idioma preferido)
              </li>
              <li>
                <strong>Contenido:</strong> Configuraciones de personalización seleccionadas por ti
              </li>
              <li>
                <strong>Duración:</strong> Indefinida, hasta que limpies los datos de tu navegador
                o cambies las preferencias
              </li>
              <li>
                <strong>Control del usuario:</strong> Puedes restablecer las preferencias por
                defecto en cualquier momento desde la configuración de tu perfil
              </li>
            </ul>

            <h3>3.2. ¿En qué se diferencia localStorage de las cookies?</h3>
            <table className="legal-page__table">
              <thead>
                <tr>
                  <th>Característica</th>
                  <th>Cookies</th>
                  <th>localStorage (BossFlow)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Envío al servidor</td>
                  <td>Sí, en cada petición HTTP</td>
                  <td>No, permanece en el navegador</td>
                </tr>
                <tr>
                  <td>Capacidad de almacenamiento</td>
                  <td>~4 KB por cookie</td>
                  <td>~5-10 MB por dominio</td>
                </tr>
                <tr>
                  <td>Acceso desde JavaScript</td>
                  <td>Limitado (HttpOnly cookies)</td>
                  <td>Completo y transparente</td>
                </tr>
                <tr>
                  <td>Rastreo de terceros</td>
                  <td>Posible (cookies de terceros)</td>
                  <td>Imposible (solo accesible por BossFlow)</td>
                </tr>
                <tr>
                  <td>Expiración automática</td>
                  <td>Configurable por el servidor</td>
                  <td>Gestionada por el usuario o la app</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="legal-page__section">
            <h2>4. Cookies de terceros</h2>
            <p>
              <strong>BossFlow NO incluye scripts de terceros que utilicen cookies.</strong>
            </p>
            <p>Sin embargo, es importante que sepas que:</p>

            <h3>4.1. Google Fonts</h3>
            <p>
              Utilizamos fuentes tipográficas de Google Fonts cargadas desde servidores de Google.
              Esto implica que tu navegador realiza peticiones HTTP a{' '}
              <code>fonts.googleapis.com</code> y <code>fonts.gstatic.com</code>, lo que puede
              incluir tu dirección IP y metadatos del navegador (User-Agent). Google puede
              registrar esta información conforme a su propia{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Política de Privacidad
              </a>.
            </p>
            <p>
              <strong>Nota:</strong> Estamos trabajando en alojar las fuentes directamente en
              nuestros servidores para eliminar esta dependencia externa.
            </p>

            <h3>4.2. Hosting y CDN</h3>
            <p>
              Nuestros servidores de hosting y CDN (Content Delivery Network) pueden registrar
              información técnica básica (dirección IP, fecha/hora de acceso, páginas visitadas)
              para fines de seguridad, rendimiento y cumplimiento de obligaciones legales. Esta
              información NO se utiliza para rastrearte con fines publicitarios.
            </p>
          </section>

          <section className="legal-page__section">
            <h2>5. Control y gestión de localStorage</h2>

            <h3>5.1. Cómo ver qué datos almacena BossFlow</h3>
            <p>Puedes inspeccionar en cualquier momento los datos almacenados en tu navegador:</p>
            <ol>
              <li>
                Abre las <strong>Herramientas de Desarrollador</strong> de tu navegador (F12 en la
                mayoría de navegadores)
              </li>
              <li>
                Ve a la pestaña <strong>Application</strong> (Chrome/Edge) o{' '}
                <strong>Storage</strong> (Firefox)
              </li>
              <li>
                En el menú lateral, expande <strong>Local Storage</strong> y selecciona{' '}
                <code>https://bossflow.app</code>
              </li>
              <li>
                Verás una lista de todas las claves y valores almacenados (por ejemplo,{' '}
                <code>token</code>, <code>userPreferences</code>)
              </li>
            </ol>

            <h3>5.2. Cómo eliminar los datos almacenados</h3>
            <p>Tienes varias opciones para eliminar los datos de localStorage:</p>

            <h4>Opción 1: Cerrar sesión en BossFlow</h4>
            <ul>
              <li>Haz clic en tu avatar/menú de usuario</li>
              <li>Selecciona "Cerrar sesión"</li>
              <li>
                Esto eliminará automáticamente el token de autenticación (pero conservará las
                preferencias de interfaz)
              </li>
            </ul>

            <h4>Opción 2: Limpiar datos del sitio (navegador)</h4>
            <ul>
              <li>
                <strong>Chrome/Edge:</strong> Configuración {'>'} Privacidad y seguridad {'>'}{' '}
                Configuración de sitios {'>'} Ver permisos y datos almacenados en sitios {'>'}{' '}
                Buscar "bossflow.app" {'>'} Eliminar datos
              </li>
              <li>
                <strong>Firefox:</strong> Configuración {'>'} Privacidad y seguridad {'>'} Cookies
                y datos del sitio {'>'} Gestionar datos {'>'} Buscar "bossflow.app" {'>'} Eliminar
              </li>
              <li>
                <strong>Safari:</strong> Preferencias {'>'} Privacidad {'>'} Gestionar datos de
                sitios web {'>'} Buscar "bossflow.app" {'>'} Eliminar
              </li>
            </ul>

            <h4>Opción 3: Modo incógnito/privado</h4>
            <p>
              Si utilizas BossFlow en una ventana de navegación privada o modo incógnito, todos los
              datos almacenados (incluido el token de sesión) se eliminarán automáticamente al
              cerrar la ventana.
            </p>
          </section>

          <section className="legal-page__section">
            <h2>6. ¿Necesito aceptar cookies para usar BossFlow?</h2>
            <p>
              <strong>No.</strong> Como BossFlow no utiliza cookies, no necesitas aceptar ningún
              banner de cookies tradicional.
            </p>
            <p>
              Sin embargo, el uso de localStorage (para mantener tu sesión iniciada) es esencial
              para el funcionamiento del servicio. Al registrarte y utilizar BossFlow, aceptas
              implícitamente el uso de localStorage conforme a esta política y a nuestra{' '}
              <Link to="/legal/privacidad" className="legal-page__link">
                Política de Privacidad
              </Link>.
            </p>
          </section>

          <section className="legal-page__section">
            <h2>7. Cambios en esta Política de Cookies</h2>
            <p>
              Si en el futuro decidimos implementar cookies (por ejemplo, para integrar funcionalidades
              de terceros como mapas interactivos, chat en vivo, etc.), actualizaremos esta política
              y te notificaremos mediante:
            </p>
            <ul>
              <li>Email a la dirección registrada en tu cuenta</li>
              <li>Aviso destacado en la plataforma</li>
              <li>
                Banner de consentimiento de cookies (si es requerido por normativa RGPD/ePrivacy)
              </li>
            </ul>
            <p>
              Puedes consultar siempre la versión más actualizada de esta política en{' '}
              <Link to="/legal/cookies" className="legal-page__link">
                https://bossflow.app/legal/cookies
              </Link>.
            </p>
          </section>

          <section className="legal-page__section">
            <h2>8. Normativa aplicable</h2>
            <p>Esta Política de Cookies cumple con:</p>
            <ul>
              <li>
                <strong>Reglamento General de Protección de Datos (RGPD)</strong> — Reglamento UE
                2016/679
              </li>
              <li>
                <strong>Directiva ePrivacy (Directiva 2002/58/CE)</strong> y legislación nacional
                española de implementación
              </li>
              <li>
                <strong>
                  Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de
                  Comercio Electrónico (LSSI-CE)
                </strong>
              </li>
            </ul>
          </section>

          <section className="legal-page__section">
            <h2>9. Contacto</h2>
            <p>
              Si tienes alguna duda sobre esta Política de Cookies, el uso de localStorage o
              cualquier aspecto relacionado con la privacidad en BossFlow, puedes contactarnos en:
            </p>
            <ul>
              <li>
                <strong>Email:</strong>{' '}
                <a href="mailto:bosslflow1@gmail.com">bosslflow1@gmail.com</a>
              </li>
              <li>
                <strong>Asunto del email:</strong> "Política de Cookies - [Tu consulta]"
              </li>
            </ul>
            <p>
              Responderemos a tu consulta en un plazo máximo de 30 días naturales.
            </p>
          </section>
        </section>

        <footer className="legal-page__footer">
          <p>
            <strong>Resumen:</strong> BossFlow respeta tu privacidad y NO utiliza cookies de
            rastreo, publicidad ni analítica. Solo almacenamos datos esenciales en localStorage
            para mantener tu sesión activa y tus preferencias de interfaz.
          </p>
          <p>
            Consulta también nuestra{' '}
            <Link to="/legal/privacidad" className="legal-page__link">
              Política de Privacidad
            </Link>{' '}
            y{' '}
            <Link to="/legal/terminos" className="legal-page__link">
              Términos de Uso
            </Link>.
          </p>
        </footer>
      </article>
    </main>
  );
}

export default CookiesPolicy;
