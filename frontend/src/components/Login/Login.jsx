import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

/**
 * Componente de inicio de sesión con validación de formulario
 * @returns {JSX.Element} Formulario de login con validación y gestión de errores
 */
function Login() {
  const navigate = useNavigate();
  const { login, loading: authLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    document.title = 'Iniciar Sesión | BossFlow';

    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const [datosFormulario, setDatosFormulario] = useState({
    correo: '',
    contrasena: '',
    recordarme: false,
  });

  const [errores, setErrores] = useState({});

  const [cargando, setCargando] = useState(false);

  /**
   * Gestiona los cambios en los campos del formulario
   * @param {Event} e - Evento de cambio del input
   */
  const manejoCambios = (e) => {
    const { name, value, type, checked } = e.target;
    setDatosFormulario({
      ...datosFormulario,
      [name]: type === 'checkbox' ? checked : value,
    });

    if (errores[name]) {
      setErrores((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  /**
   * Valida los campos del formulario de login
   * @returns {Object} Objeto con los errores de validación encontrados
   */
  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!datosFormulario.correo) {
      nuevosErrores.correo = 'Es obligatorio introducir un correo electrónico.';
    } else if (
      !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        datosFormulario.correo
      )
    ) {
      nuevosErrores.correo = 'El correo electrónico no es válido.';
    }

    if (!datosFormulario.contrasena) {
      nuevosErrores.contrasena = 'Es obligatorio introducir una contraseña.';
    } else if (datosFormulario.contrasena.length < 8) {
      nuevosErrores.contrasena =
        'La contraseña debe tener al menos 8 caracteres.';
    }

    return nuevosErrores;
  };

  /**
   * Gestiona el envío del formulario de login
   * @param {Event} e - Evento de submit del formulario
   */
  const manejoSubmit = async (e) => {
    e.preventDefault();

    const nuevosErrores = validarFormulario();
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    try {
      setErrores({});
      setCargando(true);

      const resultado = await login(
        datosFormulario.correo,
        datosFormulario.contrasena,
        datosFormulario.recordarme
      );

      if (resultado.success) {
        navigate('/dashboard');
      } else {
        setErrores({ submit: resultado.error });
      }
    } catch (error) {
      setErrores({ submit: 'Error al iniciar sesión. Inténtalo de nuevo.' });
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="login">
      <article className="login__contenedor">
        <section className="login__encabezado">
          <h3 className="login__titulo">Iniciar sesión</h3>
          <p className="login__subtitulo">
            Por favor inicia sesión en tu cuenta
          </p>
        </section>

        <form onSubmit={manejoSubmit} className="login__formulario">
          {errores.submit && (
            <section className="login__error" role="alert">
              {errores.submit}
            </section>
          )}

          <fieldset className="login__campo">
            <label htmlFor="correo" className="login__etiqueta">
              Correo Electrónico
            </label>
            <input
              type="text"
              id="correo"
              name="correo"
              value={datosFormulario.correo}
              onChange={manejoCambios}
              placeholder="tu@ejemplo.com"
              className={`login__input ${errores.correo ? 'login__input--error' : ''}`}
              disabled={cargando}
            />
            {errores.correo && (
              <span className="login__mensaje-error" role="alert">
                {errores.correo}
              </span>
            )}
          </fieldset>

          <fieldset className="login__campo">
            <section className="login__etiqueta-con-enlace">
              <label htmlFor="contrasena" className="login__etiqueta">
                Contraseña
              </label>
              <Link
                to="/recuperar-contrasena"
                className="login__enlace-recuperar"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </section>
            <input
              type="password"
              id="contrasena"
              name="contrasena"
              value={datosFormulario.contrasena}
              onChange={manejoCambios}
              placeholder="********"
              className={`login__input ${errores.contrasena ? 'login__input--error' : ''}`}
              disabled={cargando}
            />
            {errores.contrasena && (
              <span className="login__mensaje-error" role="alert">
                {errores.contrasena}
              </span>
            )}
          </fieldset>

          <fieldset className="login__recordar">
            <label className="login__checkbox">
              <input
                type="checkbox"
                id="recordarme"
                name="recordarme"
                checked={datosFormulario.recordarme}
                onChange={manejoCambios}
                className="login__checkbox-input"
              />
              <span className="login__checkbox-texto">Recordarme</span>
            </label>
          </fieldset>

          <button type="submit" className="login__boton" disabled={cargando}>
            {cargando ? (
              <>
                <span className="login__spinner" aria-label="Cargando"></span>
                Iniciar sesión
              </>
            ) : (
              'Iniciar sesión'
            )}
          </button>

          <section className="login__pie">
            <p className="login__pie-texto">
              ¿Aún no tienes cuenta?{' '}
              <Link to="/register" className="login__enlace-registro">
                Regístrate aquí
              </Link>
            </p>
          </section>
        </form>
      </article>
    </main>
  );
}

export default Login;
