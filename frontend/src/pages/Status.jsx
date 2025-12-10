import { useHealthCheck } from '../hooks/useHealthCheck';
import { useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiAlertTriangle } from 'react-icons/fi';
import './Status.css';

/**
 * Página de estado del sistema.
 * Muestra el estado de los servicios y componentes de BossFlow.
 * @returns {React.ReactElement} El componente de la página de estado.
 */
function Status() {
  const { loading, data, error, isConnected } = useHealthCheck();

  /**
   * Establece el título de la página cuando el componente se monta.
   */
  useEffect(() => {
    document.title = 'Estado del Sistema | BossFlow';
  }, []);

  return (
    <main className="status">
      <article className="status__contenedor">
        <header className="status__encabezado">
          <h1 className="status__titulo">Estado del Sistema</h1>
          <p className="status__subtitulo">
            Monitoreo de servicios de BossFlow
          </p>
        </header>

        <section className="status__main">
          <article className="status__servicio">
            <header className="status__servicio-header">
              <h2 className="status__servicio-titulo">Backend API</h2>
              <span
                className={`status__badge ${isConnected ? 'status__badge--online' : 'status__badge--offline'}`}
              >
                {isConnected ? (
                  <>
                    <FiCheckCircle /> Online
                  </>
                ) : (
                  <>
                    <FiXCircle /> Offline
                  </>
                )}
              </span>
            </header>

            <section className="status__servicio-body">
              {loading ? (
                <section className="status__loading">
                  <figure className="status__spinner"></figure>
                  <p>Verificando conexión...</p>
                </section>
              ) : isConnected ? (
                <section className="status__info">
                  <article className="status__info-item">
                    <span className="status__info-label">Estado:</span>
                    <span className="status__info-value status__info-value--success">
                      Operativo
                    </span>
                  </article>
                  <article className="status__info-item">
                    <span className="status__info-label">Último chequeo:</span>
                    <span className="status__info-value">
                      {new Date().toLocaleTimeString('es-ES')}
                    </span>
                  </article>
                </section>
              ) : (
                <section className="status__error">
                  <figure className="status__error-icon">
                    <FiAlertTriangle />
                  </figure>
                  <section className="status__error-content">
                    <p className="status__error-titulo">
                      Servicio no disponible
                    </p>
                    <p className="status__error-mensaje">
                      No se pudo verificar el estado del servicio
                    </p>
                    <section className="status__error-ayuda">
                      <p>Si el problema persiste:</p>
                      <ul>
                        <li>Intenta recargar la página</li>
                        <li>Verifica tu conexión a internet</li>
                        <li>Contacta con soporte si continúa</li>
                      </ul>
                    </section>
                  </section>
                </section>
              )}
            </section>
          </article>

          <article className="status__servicio">
            <header className="status__servicio-header">
              <h2 className="status__servicio-titulo">Base de Datos</h2>
              <span
                className={`status__badge ${isConnected ? 'status__badge--online' : 'status__badge--offline'}`}
              >
                {isConnected ? (
                  <>
                    <FiCheckCircle /> Online
                  </>
                ) : (
                  <>
                    <FiXCircle /> Offline
                  </>
                )}
              </span>
            </header>

            <section className="status__servicio-body">
              <section className="status__info">
                <article className="status__info-item">
                  <span className="status__info-label">Estado:</span>
                  <span className="status__info-value status__info-value--success">
                    {isConnected ? 'Operativo' : 'No disponible'}
                  </span>
                </article>
              </section>
            </section>
          </article>
        </section>
      </article>
    </main>
  );
}

export default Status;
