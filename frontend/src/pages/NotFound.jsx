import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiAlertCircle } from 'react-icons/fi';
import './NotFound.css';

function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = '404 - Página no encontrada | BossFlow';
  }, []);

  return (
    <main className="not-found">
      <article className="not-found__contenedor">
        {/* Icono de alerta */}
        <section className="not-found__icono">
          <FiAlertCircle />
        </section>

        {/* Código de error */}
        <h1 className="not-found__codigo">404</h1>

        {/* Mensaje principal */}
        <h2 className="not-found__titulo">Boss no encontrado</h2>
        <p className="not-found__mensaje">
          La página que buscas ha sido derrotada o nunca existió en este reino.
        </p>

        {/* Sugerencias */}
        <section className="not-found__sugerencias">
          <p className="not-found__sugerencias-titulo">Posibles razones:</p>
          <ul className="not-found__lista">
            <li>La URL fue escrita incorrectamente</li>
            <li>La página fue movida o eliminada</li>
            <li>El enlace está desactualizado</li>
          </ul>
        </section>

        {/* Botones de acción */}
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
