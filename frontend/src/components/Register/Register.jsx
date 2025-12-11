import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Register.css';

/**
 * Componente de página de registro de nuevos usuarios.
 * Proporciona un formulario completo con validación para crear una cuenta nueva.
 * Incluye campos para nombre de usuario, correo, contraseña y aceptación de términos.
 *
 * @returns {JSX.Element} Elemento de página de registro
 */
function Register() {
  const navigate = useNavigate();
  const {
    register: registerUser,
    loading: authLoading,
    isAuthenticated,
  } = useAuth();

  useEffect(() => {
    document.title = 'Registrarse | BossFlow';

    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const [datosFormulario, setDatosFormulario] = useState({
    nombreUsuario: '',
    correo: '',
    contrasena: '',
    confirmarContrasena: '',
  });

  const [errores, setErrores] = useState({});

  const [cargando, setCargando] = useState(false);

  const [aceptarTerminos, setAceptarTerminos] = useState(false);

  /**
   * Maneja los cambios en los campos del formulario.
   * Actualiza el estado del formulario y limpia el error del campo modificado.
   *
   * @param {Event} e - Evento de cambio del input
   */
  const manejoCambios = (e) => {
    const { name, value } = e.target;
    setDatosFormulario({
      ...datosFormulario,
      [name]: value,
    });

    if (errores[name]) {
      setErrores((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  /**
   * Valida todos los campos del formulario de registro.
   * Verifica nombre de usuario, correo, contraseñas y aceptación de términos.
   *
   * @returns {Object} Objeto con los errores encontrados en la validación
   */
  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!datosFormulario.nombreUsuario) {
      nuevosErrores.nombreUsuario =
        'Es obligatorio introducir un nombre de usuario.';
    } else if (datosFormulario.nombreUsuario.length < 3) {
      nuevosErrores.nombreUsuario =
        'El nombre de usuario debe tener al menos 3 caracteres.';
    } else if (!/^[a-zA-Z0-9_-]+$/.test(datosFormulario.nombreUsuario)) {
      nuevosErrores.nombreUsuario =
        'El nombre de usuario solo puede contener letras, números, guiones y guiones bajos.';
    }

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

    if (!datosFormulario.confirmarContrasena) {
      nuevosErrores.confirmarContrasena =
        'Es obligatorio confirmar la contraseña.';
    } else if (
      datosFormulario.contrasena !== datosFormulario.confirmarContrasena
    ) {
      nuevosErrores.confirmarContrasena = 'Las contraseñas no coinciden.';
    }

    if (!aceptarTerminos) {
      nuevosErrores.terminos = 'Debes aceptar los Términos de Uso y la Política de Privacidad.';
    }

    return nuevosErrores;
  };

  /**
   * Maneja el envío del formulario de registro.
   * Valida los datos, registra al usuario y redirige al dashboard si tiene éxito.
   *
   * @param {Event} e - Evento de envío del formulario
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

      const resultado = await registerUser(
        datosFormulario.nombreUsuario,
        datosFormulario.correo,
        datosFormulario.contrasena
      );

      if (resultado.success) {
        navigate('/dashboard');
      } else {
        setErrores({ submit: resultado.error });
      }
    } catch (error) {
      setErrores({ submit: 'Error al registrarse. Inténtalo de nuevo.' });
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="register">
      <article className="register__contenedor">
        <section className="register__encabezado">
          <h3 className="register__titulo">Crear cuenta</h3>
          <p className="register__subtitulo">Regístrate para comenzar</p>
        </section>

        <form onSubmit={manejoSubmit} className="register__formulario">
          {errores.submit && (
            <section className="register__error" role="alert">
              {errores.submit}
            </section>
          )}

          <fieldset className="register__campo">
            <label htmlFor="nombreUsuario" className="register__etiqueta">
              Nombre de Usuario
            </label>
            <input
              type="text"
              id="nombreUsuario"
              name="nombreUsuario"
              value={datosFormulario.nombreUsuario}
              onChange={manejoCambios}
              placeholder="usuario123"
              className={`register__input ${errores.nombreUsuario ? 'register__input--error' : ''}`}
              disabled={cargando}
            />
            {errores.nombreUsuario && (
              <span className="register__mensaje-error" role="alert">
                {errores.nombreUsuario}
              </span>
            )}
          </fieldset>

          <fieldset className="register__campo">
            <label htmlFor="correo" className="register__etiqueta">
              Correo Electrónico
            </label>
            <input
              type="text"
              id="correo"
              name="correo"
              value={datosFormulario.correo}
              onChange={manejoCambios}
              placeholder="tu@ejemplo.com"
              className={`register__input ${errores.correo ? 'register__input--error' : ''}`}
              disabled={cargando}
            />
            {errores.correo && (
              <span className="register__mensaje-error" role="alert">
                {errores.correo}
              </span>
            )}
          </fieldset>

          <fieldset className="register__campo">
            <label htmlFor="contrasena" className="register__etiqueta">
              Contraseña
            </label>
            <input
              type="password"
              id="contrasena"
              name="contrasena"
              value={datosFormulario.contrasena}
              onChange={manejoCambios}
              placeholder="********"
              className={`register__input ${errores.contrasena ? 'register__input--error' : ''}`}
              disabled={cargando}
            />
            {errores.contrasena && (
              <span className="register__mensaje-error" role="alert">
                {errores.contrasena}
              </span>
            )}
          </fieldset>

          <fieldset className="register__campo">
            <label htmlFor="confirmarContrasena" className="register__etiqueta">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              id="confirmarContrasena"
              name="confirmarContrasena"
              value={datosFormulario.confirmarContrasena}
              onChange={manejoCambios}
              placeholder="********"
              className={`register__input ${errores.confirmarContrasena ? 'register__input--error' : ''}`}
              disabled={cargando}
            />
            {errores.confirmarContrasena && (
              <span className="register__mensaje-error" role="alert">
                {errores.confirmarContrasena}
              </span>
            )}
          </fieldset>

          <fieldset className="register__terminos">
            <label className="register__checkbox">
              <input
                type="checkbox"
                id="terminos"
                className="register__checkbox-input"
                checked={aceptarTerminos}
                onChange={(e) => {
                  setAceptarTerminos(e.target.checked);
                  if (errores.terminos) {
                    setErrores((prev) => ({ ...prev, terminos: '' }));
                  }
                }}
                disabled={cargando}
              />
              <span className="register__checkbox-texto">
                Acepto los{' '}
                <Link to="/legal/terminos" className="register__enlace-terminos" target="_blank">
                  Términos de Uso
                </Link>{' '}
                y la{' '}
                <Link to="/legal/privacidad" className="register__enlace-terminos" target="_blank">
                  Política de Privacidad
                </Link>
              </span>
            </label>
            {errores.terminos && (
              <span className="register__mensaje-error" role="alert">
                {errores.terminos}
              </span>
            )}
          </fieldset>

          <button type="submit" className="register__boton" disabled={cargando}>
            {cargando ? (
              <>
                <span className="register__spinner"></span>
                Registrando...
              </>
            ) : (
              'Crear cuenta'
            )}
          </button>
        </form>

        <section className="register__pie">
          <p className="register__pie-texto">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="register__enlace-login">
              Inicia sesión
            </Link>
          </p>
        </section>
      </article>
    </main>
  );
}

export default Register;
