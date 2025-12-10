import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiAlertCircle } from 'react-icons/fi';
import './NotFound.css';

/**
 * Página de error 404 - Página no encontrada.
 * Muestra un mensaje amigable cuando el usuario intenta acceder a una ruta inexistente.
 * @returns {React.ReactElement} El componente de la página de error 404.
 */
function NotFound() {
  const navigate = useNavigate();

  /**
   * Establece el título de la página cuando el componente se monta.
   */
  useEffect(() => {
    document.title = '404 - Página no encontrada | BossFlow';
  }, []);

  return (
    <main className="not-found">
      <article className="not-found__contenedor">
        <section className="not-found__icono">
          <FiAlertCircle />
        </section>

        <h1 className="not-found__codigo">404</h1>

        <h2 className="not-found__titulo">Boss no encontrado</h2>
        <p className="not-found__mensaje">
          La página que buscas ha sido derrotada o nunca existió en este reino.
        </p>

        <section className="not-found__sugerencias">
          <p className="not-found__sugerencias-titulo">Posibles razones:</p>
          <ul className="not-found__lista">
            <li>La URL fue escrita incorrectamente</li>
            <li>La página fue movida o eliminada</li>
            <li>El enlace está desactualizado</li>
          </ul>
        </section>

        <section className="not-found__acciones">
          <button
            className="not-found__boton not-found__boton--primario"
            onClick={() => navigate('/')}
          >
            <FiHome />
            <span>Volver al inicio</span>
          </button>
          <button
            className="not-found__boton not-found__boton--secundario"
            onClick={() => navigate(-1)}
          >
            <span>Página anterior</span>
          </button>
        </section>
      </article>
    </main>
  );
}

export default NotFound;
