import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LegalPages.css';

/**
 * Página de Política de Privacidad.
 * Muestra la política de privacidad y protección de datos de BossFlow.
 */
function PrivacyPolicy() {
  useEffect(() => {
    document.title = 'Política de Privacidad | BossFlow';
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="legal-page">
      <article className="legal-page__container">
        <header className="legal-page__header">
          <h1 className="legal-page__title">Política de Privacidad</h1>
          <p className="legal-page__subtitle">
            Última actualización: 11 de diciembre de 2025
          </p>
        </header>

        <section className="legal-page__content">
          <section className="legal-page__section">
            <h2>1. Introducción</h2>
            <p>
              En <strong>BossFlow</strong> (accesible desde{' '}
              <a href="https://bossflow.app/" target="_blank" rel="noopener noreferrer">
                https://bossflow.app/
              </a>
              ), nos tomamos muy en serio la privacidad y la protección de tus datos personales.
              Esta Política de Privacidad describe cómo recopilamos, utilizamos, almacenamos y
              protegemos tu información cuando utilizas nuestro servicio de creación y gestión de
              diagramas de flujo.
            </p>
            <p>
              Al registrarte y utilizar BossFlow, aceptas las prácticas descritas en esta Política
              de Privacidad. Si no estás de acuerdo con alguna parte de esta política, por favor no
              utilices nuestro servicio.
            </p>
          </section>

          <section className="legal-page__section">
            <h2>2. Responsable del Tratamiento</h2>
            <p>El responsable del tratamiento de tus datos personales es:</p>
            <ul>
              <li><strong>Nombre del servicio:</strong> BossFlow</li>
              <li><strong>Sitio web:</strong> https://bossflow.app/</li>
              <li>
                <strong>Email de contacto:</strong>{' '}
                <a href="mailto:bosslflow1@gmail.com">bosslflow1@gmail.com</a>
              </li>
            </ul>
          </section>

          <section className="legal-page__section">
            <h2>3. Datos Personales que Recopilamos</h2>
            <p>Recopilamos y procesamos los siguientes tipos de datos personales:</p>

            <h3>3.1. Datos de registro y autenticación</h3>
            <ul>
              <li><strong>Nombre de usuario:</strong> Identificador único elegido por el usuario</li>
              <li><strong>Correo electrónico:</strong> Utilizado para autenticación, recuperación de cuenta y comunicaciones</li>
              <li><strong>Contraseña:</strong> Cifrada mediante bcrypt (nunca almacenamos contraseñas en texto plano)</li>
            </ul>

            <h3>3.2. Datos de perfil</h3>
            <ul>
              <li><strong>Avatar:</strong> URL de imagen de perfil (opcional)</li>
              <li><strong>Biografía:</strong> Descripción personal (máximo 500 caracteres, opcional)</li>
              <li><strong>Juegos favoritos:</strong> Lista de hasta 10 juegos (opcional)</li>
            </ul>

            <h3>3.3. Contenido generado por el usuario</h3>
            <ul>
              <li><strong>Diagramas:</strong> Estructura JSON de diagramas de flujo (nodos, conexiones, estilos)</li>
              <li><strong>Imágenes subidas:</strong> Archivos de imagen (JPEG, PNG, GIF, WebP) hasta 5 MB por archivo</li>
              <li><strong>Plantillas públicas:</strong> Diagramas marcados como plantillas para compartir con otros usuarios</li>
            </ul>

            <h3>3.4. Datos de uso y estadísticas</h3>
            <ul>
              <li><strong>Fecha de registro:</strong> Timestamp de creación de cuenta</li>
              <li><strong>Última actividad:</strong> Fecha de último acceso</li>
              <li><strong>Estadísticas de uso:</strong> Número de diagramas creados, nodos totales, plantillas creadas</li>
              <li><strong>Logros:</strong> Hitos alcanzados en la plataforma</li>
            </ul>

            <h3>3.5. Datos técnicos</h3>
            <ul>
              <li><strong>Dirección IP:</strong> Registrada temporalmente para seguridad y prevención de abusos</li>
              <li><strong>Información del navegador:</strong> User-agent para compatibilidad técnica</li>
              <li><strong>Tokens de sesión (JWT):</strong> Para mantener tu sesión activa de forma segura</li>
            </ul>
          </section>

          <section className="legal-page__section">
            <h2>4. Base Legal para el Tratamiento de Datos</h2>
            <p>Tratamos tus datos personales en base a las siguientes bases legales (RGPD Art. 6):</p>
            <ul>
              <li>
                <strong>Ejecución de contrato (Art. 6.1.b):</strong> Para proporcionar el servicio
                solicitado (creación de cuenta, almacenamiento de diagramas, gestión de perfil)
              </li>
              <li>
                <strong>Consentimiento (Art. 6.1.a):</strong> Para datos opcionales como avatar,
                biografía y juegos favoritos
              </li>
              <li>
                <strong>Interés legítimo (Art. 6.1.f):</strong> Para seguridad del servicio,
                prevención de fraudes y mejora de funcionalidades
              </li>
              <li>
                <strong>Obligación legal (Art. 6.1.c):</strong> Para cumplir con requisitos legales
                (conservación de datos fiscales, respuesta a requerimientos judiciales)
              </li>
            </ul>
          </section>

          <section className="legal-page__section">
            <h2>5. Finalidades del Tratamiento de Datos</h2>
            <p>Utilizamos tus datos personales para:</p>
            <ul>
              <li>
                <strong>Gestión de cuentas:</strong> Crear, autenticar y gestionar tu cuenta de
                usuario
              </li>
              <li>
                <strong>Prestación del servicio:</strong> Permitir la creación, edición,
                almacenamiento y exportación de diagramas
              </li>
              <li>
                <strong>Comunicaciones:</strong> Enviar notificaciones importantes (verificación de
                cuenta, cambios en términos, alertas de seguridad)
              </li>
              <li>
                <strong>Seguridad:</strong> Proteger la plataforma contra fraudes, abusos y accesos
                no autorizados
              </li>
              <li>
                <strong>Mejoras del servicio:</strong> Analizar estadísticas anónimas para mejorar
                la experiencia de usuario
              </li>
              <li>
                <strong>Cumplimiento legal:</strong> Responder a requerimientos judiciales o de
                autoridades competentes
              </li>
            </ul>
          </section>

          <section className="legal-page__section">
            <h2>6. Compartición de Datos con Terceros</h2>
            <p>
              <strong>BossFlow no vende ni comparte tus datos personales con terceros con fines
              comerciales.</strong>
            </p>
            <p>Únicamente compartimos datos en los siguientes casos:</p>
            <ul>
              <li>
                <strong>Proveedores de servicios:</strong> Empresas que nos ayudan a operar la
                plataforma (hosting, bases de datos, almacenamiento) bajo estrictos acuerdos de
                confidencialidad
              </li>
              <li>
                <strong>Obligaciones legales:</strong> Cuando sea requerido por ley, orden judicial
                o autoridad competente
              </li>
              <li>
                <strong>Contenido público:</strong> Si marcas un diagrama como "plantilla pública",
                será visible para otros usuarios de BossFlow
              </li>
            </ul>
          </section>

          <section className="legal-page__section">
            <h2>7. Transferencias Internacionales de Datos</h2>
            <p>
              Nuestros servidores están ubicados en la Unión Europea. En caso de que algunos
              servicios de terceros (por ejemplo, proveedores de hosting) estén fuera de la UE,
              garantizamos que se aplican las salvaguardias adecuadas (Cláusulas Contractuales Tipo
              de la Comisión Europea, Privacy Shield, etc.) para proteger tus datos.
            </p>
          </section>

          <section className="legal-page__section">
            <h2>8. Conservación de Datos</h2>
            <p>Conservamos tus datos personales durante los siguientes periodos:</p>
            <ul>
              <li>
                <strong>Datos de cuenta activa:</strong> Mientras tu cuenta esté activa y utilices
                el servicio
              </li>
              <li>
                <strong>Datos de cuenta eliminada:</strong> 30 días tras solicitar la eliminación
                de tu cuenta (para permitir recuperación en caso de error)
              </li>
              <li>
                <strong>Logs de seguridad:</strong> Hasta 90 días para prevención de fraudes
              </li>
              <li>
                <strong>Datos fiscales/legales:</strong> Según obligaciones legales aplicables
                (generalmente 5-10 años)
              </li>
            </ul>
            <p>
              Transcurridos estos plazos, eliminamos o anonimizamos tus datos personales de forma
              permanente.
            </p>
          </section>

          <section className="legal-page__section">
            <h2>9. Tus Derechos (RGPD)</h2>
            <p>Como usuario de la Unión Europea, tienes los siguientes derechos:</p>
            <ul>
              <li>
                <strong>Derecho de acceso (Art. 15):</strong> Solicitar una copia de tus datos
                personales
              </li>
              <li>
                <strong>Derecho de rectificación (Art. 16):</strong> Corregir datos inexactos o
                incompletos
              </li>
              <li>
                <strong>Derecho de supresión (Art. 17):</strong> Solicitar la eliminación de tus
                datos ("derecho al olvido")
              </li>
              <li>
                <strong>Derecho de limitación del tratamiento (Art. 18):</strong> Restringir el
                procesamiento de tus datos en ciertos casos
              </li>
              <li>
                <strong>Derecho de portabilidad (Art. 20):</strong> Recibir tus datos en formato
                JSON estructurado
              </li>
              <li>
                <strong>Derecho de oposición (Art. 21):</strong> Oponerte al tratamiento de tus
                datos en determinadas circunstancias
              </li>
              <li>
                <strong>Derecho a retirar el consentimiento:</strong> En cualquier momento, sin
                afectar tratamientos previos
              </li>
              <li>
                <strong>Derecho a presentar reclamación:</strong> Ante la Agencia Española de
                Protección de Datos (AEPD) u otra autoridad competente
              </li>
            </ul>
            <p>
              Para ejercer estos derechos, accede a tu{' '}
              <Link to="/profile" className="legal-page__link">perfil de usuario</Link> o
              contacta con nosotros en{' '}
              <a href="mailto:bosslflow1@gmail.com">bosslflow1@gmail.com</a>.
            </p>
          </section>

          <section className="legal-page__section">
            <h2>10. Seguridad de los Datos</h2>
            <p>Implementamos medidas técnicas y organizativas para proteger tus datos:</p>
            <ul>
              <li>
                <strong>Cifrado de contraseñas:</strong> Utilizamos bcrypt con salt rounds para
                almacenar contraseñas de forma segura
              </li>
              <li>
                <strong>Autenticación JWT:</strong> Tokens seguros con expiración automática
              </li>
              <li>
                <strong>HTTPS:</strong> Todas las comunicaciones están cifradas con TLS/SSL
              </li>
              <li>
                <strong>Validación de datos:</strong> Filtrado y sanitización de inputs para
                prevenir inyecciones SQL/XSS
              </li>
              <li>
                <strong>Backups regulares:</strong> Copias de seguridad cifradas y almacenadas de
                forma segura
              </li>
              <li>
                <strong>Control de acceso:</strong> Acceso restringido a datos personales solo para
                personal autorizado
              </li>
            </ul>
            <p>
              Sin embargo, ningún sistema es 100% seguro. En caso de brecha de seguridad que afecte
              a tus datos, te notificaremos en un plazo de 72 horas según lo establecido por el
              RGPD.
            </p>
          </section>

          <section className="legal-page__section">
            <h2>11. Cookies y Tecnologías de Rastreo</h2>
            <p>
              <strong>BossFlow NO utiliza cookies de terceros ni tecnologías de rastreo para
              publicidad o analítica.</strong>
            </p>
            <p>Solo utilizamos:</p>
            <ul>
              <li>
                <strong>Tokens JWT (almacenados en localStorage):</strong> Para mantener tu sesión
                iniciada de forma segura
              </li>
              <li>
                <strong>Preferencias de usuario (localStorage):</strong> Para guardar configuraciones
                de la interfaz (modo oscuro, idioma, etc.)
              </li>
            </ul>
            <p>
              Para más información, consulta nuestra{' '}
              <Link to="/legal/cookies" className="legal-page__link">
                Política de Cookies
              </Link>.
            </p>
          </section>

          <section className="legal-page__section">
            <h2>12. Menores de Edad</h2>
            <p>
              BossFlow está dirigido a usuarios mayores de <strong>13 años</strong>. Si eres menor
              de 18 años, necesitas el consentimiento de tus padres o tutores legales para utilizar
              el servicio.
            </p>
            <p>
              No recopilamos intencionadamente datos de menores de 13 años. Si detectamos que un
              usuario es menor de 13 años, eliminaremos su cuenta y datos de forma inmediata.
            </p>
          </section>

          <section className="legal-page__section">
            <h2>13. Modificaciones de esta Política</h2>
            <p>
              Nos reservamos el derecho de actualizar esta Política de Privacidad en cualquier
              momento. Te notificaremos de cambios significativos mediante:
            </p>
            <ul>
              <li>Email a la dirección registrada en tu cuenta</li>
              <li>Aviso destacado en la plataforma</li>
              <li>Actualización de la fecha "Última actualización" al inicio de este documento</li>
            </ul>
            <p>
              El uso continuado del servicio tras la publicación de cambios implica la aceptación de
              la nueva Política de Privacidad.
            </p>
          </section>

          <section className="legal-page__section">
            <h2>14. Contacto</h2>
            <p>
              Para cualquier consulta, solicitud o reclamación relacionada con la privacidad y
              protección de datos, puedes contactarnos en:
            </p>
            <ul>
              <li>
                <strong>Email:</strong>{' '}
                <a href="mailto:bosslflow1@gmail.com">bosslflow1@gmail.com</a>
              </li>
              <li>
                <strong>Asunto del email:</strong> "Privacidad - [Tu solicitud]"
              </li>
            </ul>
            <p>Responderemos a tu solicitud en un plazo máximo de 30 días naturales.</p>
          </section>

          <section className="legal-page__section">
            <h2>15. Datos de Contacto de la Autoridad de Control</h2>
            <p>
              Si consideras que tus derechos de protección de datos han sido vulnerados, puedes
              presentar una reclamación ante:
            </p>
            <ul>
              <li><strong>Agencia Española de Protección de Datos (AEPD)</strong></li>
              <li>Sitio web: https://www.aepd.es/</li>
              <li>Dirección: C/ Jorge Juan, 6, 28001 Madrid, España</li>
              <li>Teléfono: +34 901 100 099</li>
            </ul>
          </section>
        </section>

        <footer className="legal-page__footer">
          <p>
            ¿Tienes dudas? Consulta también nuestros{' '}
            <Link to="/legal/terminos" className="legal-page__link">
              Términos de Uso
            </Link>{' '}
            y la{' '}
            <Link to="/legal/cookies" className="legal-page__link">
              Política de Cookies
            </Link>.
          </p>
        </footer>
      </article>
    </main>
  );
}

export default PrivacyPolicy;
