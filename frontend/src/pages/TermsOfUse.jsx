import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LegalPages.css';

/**
 * Página de Términos de Uso y Condiciones de Servicio.
 * Muestra los términos y condiciones completos para el uso de BossFlow.
 */
function TermsOfUse() {
  useEffect(() => {
    document.title = 'Términos de Uso | BossFlow';
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="legal-page">
      <article className="legal-page__container">
        <header className="legal-page__header">
          <h1 className="legal-page__title">Términos de Uso y Condiciones de Servicio</h1>
          <p className="legal-page__subtitle">
            Fecha de entrada en vigor: 11 de diciembre de 2025<br />
            Última actualización: 11 de diciembre de 2025
          </p>
        </header>

        <section className="legal-page__content">
          <section className="legal-page__section">
            <h2>1. Aceptación de los Términos</h2>
            <p>
              Bienvenido/a a <strong>BossFlow</strong>, una aplicación web para crear, editar y
              compartir diagramas de flujo interactivos. Al acceder, registrarse o utilizar
              cualquier función de BossFlow (en adelante, "el Servicio" o "la Plataforma"), usted
              acepta y se compromete a cumplir estos Términos de Uso (en adelante, "los Términos").
              Si no está de acuerdo con alguna de las disposiciones aquí establecidas,{' '}
              <strong>no utilice el Servicio</strong>.
            </p>
            <p>
              Estos Términos constituyen un acuerdo legal vinculante entre usted (el "Usuario") y
              los responsables de BossFlow (en adelante, "BossFlow", "nosotros", "nuestro"). Nos
              reservamos el derecho de modificar estos Términos en cualquier momento. Las
              modificaciones entrarán en vigor tras su publicación en la Plataforma. El uso
              continuado del Servicio tras la publicación de cambios implica la aceptación de los
              mismos.
            </p>
          </section>

          <section className="legal-page__section">
            <h2>2. Descripción del Servicio</h2>
            <p>BossFlow es una plataforma web (SaaS) que ofrece las siguientes funcionalidades:</p>
            <ul>
              <li>
                <strong>Creación y edición de diagramas de flujo:</strong> Herramientas
                interactivas para diseñar diagramas con nodos, conexiones (edges), texto, imágenes
                y estilos personalizados.
              </li>
              <li>
                <strong>Gestión de plantillas:</strong> Los usuarios pueden crear diagramas basados
                en plantillas predefinidas o marcar sus propios diagramas como plantillas públicas.
              </li>
              <li>
                <strong>Almacenamiento en la nube:</strong> Los diagramas se guardan en nuestros
                servidores y están accesibles desde cualquier dispositivo con acceso a Internet.
              </li>
              <li>
                <strong>Carga de imágenes:</strong> Subida de imágenes (JPEG, PNG, GIF, WebP)
                hasta un máximo de 5 MB por archivo y 10 imágenes por diagrama.
              </li>
              <li>
                <strong>Perfil de usuario:</strong> Gestión de datos personales (nombre de usuario,
                email, avatar, bio, juegos favoritos) y estadísticas de uso.
              </li>
              <li>
                <strong>Autenticación y seguridad:</strong> Sistema de registro y login con
                cifrado de contraseñas (bcrypt) y autenticación mediante tokens JWT.
              </li>
            </ul>
            <p>
              El Servicio se proporciona <strong>"tal cual" y "según disponibilidad"</strong>.
              BossFlow no garantiza que el Servicio estará disponible de forma ininterrumpida,
              segura o libre de errores.
            </p>
          </section>

          <section className="legal-page__section">
            <h2>3. Registro y Cuenta de Usuario</h2>

            <h3>3.1. Elegibilidad</h3>
            <p>Para utilizar BossFlow, debe:</p>
            <ul>
              <li>
                Ser mayor de <strong>13 años</strong>. Si es menor de 18 años, debe contar con el
                consentimiento de sus padres o tutores legales.
              </li>
              <li>Proporcionar información veraz, completa y actualizada durante el registro.</li>
              <li>
                Ser responsable de mantener la confidencialidad de su contraseña y de todas las
                actividades que se realicen bajo su cuenta.
              </li>
            </ul>

            <h3>3.2. Obligaciones del Usuario</h3>
            <p>Al crear una cuenta, usted se compromete a:</p>
            <ul>
              <li>
                <strong>No compartir su contraseña</strong> ni permitir que terceros accedan a su
                cuenta.
              </li>
              <li>
                <strong>Notificar inmediatamente</strong> a BossFlow (
                <a href="mailto:bosslflow1@gmail.com">bosslflow1@gmail.com</a>) si sospecha un
                acceso no autorizado a su cuenta.
              </li>
              <li>
                <strong>Proporcionar información precisa</strong> y actualizar sus datos de perfil
                cuando sea necesario.
              </li>
              <li>
                <strong>Utilizar un email válido</strong> para recibir comunicaciones importantes
                (verificación de cuenta, notificaciones de seguridad, cambios en los Términos).
              </li>
            </ul>

            <h3>3.3. Suspensión y Cancelación de Cuenta</h3>
            <p>
              BossFlow se reserva el derecho de <strong>suspender o cancelar</strong> su cuenta en
              cualquier momento, sin previo aviso, si:
            </p>
            <ul>
              <li>Infringe estos Términos de Uso.</li>
              <li>Proporciona información falsa o engañosa durante el registro.</li>
              <li>Utiliza el Servicio para actividades ilegales o fraudulentas.</li>
              <li>
                Realiza actividades que pongan en riesgo la seguridad, integridad o disponibilidad
                de la Plataforma o de otros usuarios.
              </li>
              <li>
                Permanece inactivo durante un periodo prolongado (definido por BossFlow).
              </li>
            </ul>
            <p>
              El Usuario puede solicitar la <strong>eliminación de su cuenta</strong> desde su{' '}
              <Link to="/profile" className="legal-page__link">perfil</Link> o enviando un email a{' '}
              <a href="mailto:bosslflow1@gmail.com">bosslflow1@gmail.com</a>. La eliminación de la
              cuenta conlleva la supresión permanente de todos los datos personales y contenidos
              asociados (diagramas, imágenes), sin posibilidad de recuperación.
            </p>
          </section>

          <section className="legal-page__section">
            <h2>4. Uso Permitido del Servicio</h2>
            <p>El Usuario puede utilizar BossFlow para:</p>
            <ul>
              <li>
                Crear, editar, almacenar y exportar diagramas de flujo para fines personales,
                educativos o profesionales.
              </li>
              <li>
                Compartir diagramas con otros usuarios (si esta funcionalidad está habilitada).
              </li>
              <li>Utilizar plantillas públicas creadas por otros usuarios o por BossFlow.</li>
              <li>
                Personalizar su perfil de usuario y gestionar sus estadísticas de uso.
              </li>
              <li>
                Cargar imágenes propias o con licencia de uso legal para incluir en los diagramas.
              </li>
            </ul>
          </section>

          <section className="legal-page__section">
            <h2>5. Uso Prohibido y Conductas Inaceptables</h2>
            <p>
              Queda <strong>estrictamente prohibido</strong>:
            </p>

            <h3>5.1. Contenido ilegal o inapropiado</h3>
            <p>Subir, publicar o compartir contenido que:</p>
            <ul>
              <li>
                Infrinja derechos de propiedad intelectual de terceros (marcas, derechos de autor,
                patentes).
              </li>
              <li>
                Sea ilegal, obsceno, difamatorio, amenazante, acosador, discriminatorio, violento o
                pornográfico.
              </li>
              <li>
                Promueva actividades ilegales (fraude, phishing, venta de drogas, etc.).
              </li>
              <li>
                Contenga virus, malware, scripts maliciosos o cualquier código dañino.
              </li>
              <li>
                Incluya información personal o confidencial de terceros sin su consentimiento.
              </li>
            </ul>

            <h3>5.2. Actividades prohibidas</h3>
            <ul>
              <li>
                <strong>Ingeniería inversa, modificación o descompilación</strong> del código
                fuente de BossFlow.
              </li>
              <li>
                <strong>Acceso no autorizado</strong> a sistemas, servidores, bases de datos o
                áreas restringidas de la Plataforma.
              </li>
              <li>
                <strong>Automatización no autorizada:</strong> Uso de bots, scrapers, scripts
                automáticos o herramientas de extracción masiva de datos sin permiso expreso de
                BossFlow.
              </li>
              <li>
                <strong>Sobrecarga del sistema:</strong> Envío de peticiones masivas (ataques DDoS,
                spam) que puedan afectar el rendimiento o disponibilidad del Servicio.
              </li>
              <li>
                <strong>Suplantación de identidad:</strong> Hacerse pasar por otro usuario,
                administrador de BossFlow o cualquier otra persona o entidad.
              </li>
              <li>
                <strong>Venta o reventa del Servicio:</strong> Redistribuir, revender o
                comercializar el acceso a BossFlow sin autorización previa por escrito.
              </li>
              <li>
                <strong>Interferencia con otros usuarios:</strong> Acosar, intimidar, amenazar o
                perjudicar la experiencia de otros usuarios.
              </li>
            </ul>
          </section>

          <section className="legal-page__section">
            <h2>6. Propiedad Intelectual</h2>

            <h3>6.1. Propiedad de BossFlow</h3>
            <p>
              Todos los derechos de propiedad intelectual sobre el código fuente, diseño, interfaz,
              logotipo, marca, documentación y cualquier otro elemento de BossFlow son propiedad
              exclusiva de los creadores de BossFlow o de sus licenciantes. Estos Términos no le
              otorgan ningún derecho de propiedad sobre dichos elementos, únicamente una{' '}
              <strong>
                licencia limitada, no exclusiva, revocable y no transferible
              </strong>{' '}
              para utilizar el Servicio conforme a estos Términos.
            </p>

            <h3>6.2. Contenido generado por el Usuario</h3>
            <p>
              El Usuario conserva todos los derechos de propiedad intelectual sobre los diagramas,
              textos, imágenes y demás contenidos que cree o suba a BossFlow.
            </p>
            <p>
              No obstante, al subir contenido a la Plataforma, usted otorga a BossFlow una{' '}
              <strong>
                licencia mundial, no exclusiva, libre de regalías, sublicenciable y transferible
              </strong>{' '}
              para:
            </p>
            <ul>
              <li>
                Almacenar, reproducir, procesar y mostrar su contenido con el fin de prestar el
                Servicio.
              </li>
              <li>
                Realizar copias de seguridad y operaciones técnicas necesarias (backups,
                migraciones de servidor).
              </li>
              <li>
                Permitir que otros usuarios accedan a su contenido si usted elige hacerlo público o
                compartirlo (por ejemplo, al marcar un diagrama como plantilla pública).
              </li>
            </ul>
          </section>

          <section className="legal-page__section">
            <h2>7. Limitación de Responsabilidad</h2>

            <h3>7.1. Exclusión de garantías</h3>
            <p>
              El Servicio se proporciona <strong>"tal cual" y "según disponibilidad"</strong>, sin
              garantías de ningún tipo, expresas o implícitas.
            </p>

            <h3>7.2. Limitación de responsabilidad</h3>
            <p>En la máxima medida permitida por la ley aplicable:</p>
            <ul>
              <li>
                La responsabilidad total de BossFlow se limita a un importe total de{' '}
                <strong>€100 (cien euros)</strong> por reclamación.
              </li>
              <li>
                BossFlow no será responsable de daños indirectos, pérdida de beneficios, pérdida de
                datos, interrupciones del servicio o acciones de terceros.
              </li>
            </ul>

            <h3>7.3. Indemnización</h3>
            <p>
              El Usuario acepta indemnizar y mantener indemne a BossFlow frente a cualquier
              reclamación derivada de:
            </p>
            <ul>
              <li>Incumplimiento de estos Términos de Uso.</li>
              <li>Infracción de derechos de terceros.</li>
              <li>Uso ilegal o no autorizado del Servicio.</li>
            </ul>
          </section>

          <section className="legal-page__section">
            <h2>8. Privacidad y Protección de Datos</h2>
            <p>
              BossFlow se compromete a proteger la privacidad de sus usuarios conforme al{' '}
              <strong>Reglamento General de Protección de Datos (RGPD)</strong> y a las leyes de
              privacidad aplicables.
            </p>
            <p>
              Para información detallada sobre qué datos recogemos, cómo los utilizamos y cuáles
              son sus derechos, consulte nuestra{' '}
              <Link to="/legal/privacidad" className="legal-page__link">
                Política de Privacidad
              </Link>.
            </p>
            <p>
              Para consultas de privacidad o ejercicio de derechos, contacte con{' '}
              <a href="mailto:bosslflow1@gmail.com">bosslflow1@gmail.com</a>.
            </p>
          </section>

          <section className="legal-page__section">
            <h2>9. Modificación y Terminación del Servicio</h2>

            <h3>9.1. Modificaciones del Servicio</h3>
            <p>BossFlow se reserva el derecho de:</p>
            <ul>
              <li>
                Modificar, suspender o discontinuar cualquier funcionalidad del Servicio, de forma
                temporal o permanente.
              </li>
              <li>Actualizar estos Términos de Uso en cualquier momento.</li>
            </ul>

            <h3>9.2. Terminación por parte del Usuario</h3>
            <p>
              El Usuario puede dejar de utilizar el Servicio en cualquier momento y solicitar la
              eliminación de su cuenta desde su{' '}
              <Link to="/profile" className="legal-page__link">perfil</Link>.
            </p>

            <h3>9.3. Terminación por parte de BossFlow</h3>
            <p>
              Podemos suspender o cancelar su acceso al Servicio si infringe estos Términos o
              realiza actividades perjudiciales. En caso de terminación, perderá el acceso a su
              cuenta y a todo el contenido almacenado.
            </p>
          </section>

          <section className="legal-page__section">
            <h2>10. Resolución de Disputas</h2>

            <h3>10.1. Ley aplicable</h3>
            <p>
              Estos Términos se rigen e interpretan de acuerdo con las leyes de <strong>España</strong>.
            </p>

            <h3>10.2. Jurisdicción</h3>
            <p>
              Las partes intentarán primero resolver de forma amistosa cualquier disputa mediante
              negociaciones informales durante un plazo de 30 días. Si no se alcanza un acuerdo, la
              disputa será sometida a los tribunales competentes de España.
            </p>
          </section>

          <section className="legal-page__section">
            <h2>11. Causas de Suspensión o Cancelación de Cuenta</h2>
            <p>
              BossFlow se reserva el derecho de suspender o cancelar cuentas en los siguientes
              casos:
            </p>
            <ul>
              <li>Violación de los Términos de Uso</li>
              <li>Actividades ilegales o fraudulentas</li>
              <li>Infracción de derechos de terceros</li>
              <li>Comportamiento abusivo o acoso</li>
              <li>Spam y abuso del sistema</li>
              <li>Inactividad prolongada</li>
              <li>Información falsa o engañosa</li>
              <li>Violación de seguridad</li>
            </ul>
            <p>
              <strong>Consecuencias:</strong> Pérdida inmediata del acceso al Servicio y a todo el
              contenido almacenado, sin derecho a reembolso ni compensación.
            </p>
            <p>
              <strong>Apelación:</strong> Puede contactar con{' '}
              <a href="mailto:bosslflow1@gmail.com">bosslflow1@gmail.com</a> en un plazo de 30
              días para solicitar una revisión.
            </p>
          </section>

          <section className="legal-page__section">
            <h2>12. Contacto</h2>
            <p>Para consultas relacionadas con estos Términos de Uso, contacte con:</p>
            <ul>
              <li>
                <strong>Email:</strong>{' '}
                <a href="mailto:bosslflow1@gmail.com">bosslflow1@gmail.com</a>
              </li>
              <li>
                <strong>Plazo de respuesta:</strong> 30 días hábiles tras la recepción de su
                solicitud
              </li>
            </ul>
          </section>

          <section className="legal-page__section">
            <h2>13. Actualizaciones de estos Términos</h2>
            <p>
              Estos Términos pueden ser actualizados periódicamente. Si realizamos cambios
              significativos, le notificaremos por email o mediante un aviso visible en la
              Plataforma con al menos 15 días de antelación.
            </p>
            <p>
              El uso continuado del Servicio tras la entrada en vigor de los cambios constituye su
              aceptación de los nuevos Términos.
            </p>
          </section>
        </section>

        <footer className="legal-page__footer">
          <p>
            <strong>Gracias por utilizar BossFlow.</strong>
          </p>
          <p>
            Consulta también nuestra{' '}
            <Link to="/legal/privacidad" className="legal-page__link">
              Política de Privacidad
            </Link>{' '}
            y{' '}
            <Link to="/legal/cookies" className="legal-page__link">
              Política de Cookies
            </Link>.
          </p>
        </footer>
      </article>
    </main>
  );
}

export default TermsOfUse;
