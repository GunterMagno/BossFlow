import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Register.css';

/**
 * Registration page component for new users.
 * Provides a complete form with validation to create a new account.
 * Includes fields for username, email, password and terms acceptance.
 *
 * @returns {JSX.Element} Registration page element
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

  const [formData, setFormData] = useState({
    nombreUsuario: '',
    correo: '',
    contrasena: '',
    confirmarContrasena: '',
  });

  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);

  const [acceptTerms, setAcceptTerms] = useState(false);

  /**
   * Handles changes in form fields.
   * Updates form state and clears the error of the modified field.
   *
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  /**
   * Validates all registration form fields.
   * Checks username, email, passwords and terms acceptance.
   *
   * @returns {Object} Object with validation errors found
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombreUsuario) {
      newErrors.nombreUsuario =
        'Es obligatorio introducir un nombre de usuario.';
    } else if (formData.nombreUsuario.length < 3) {
      newErrors.nombreUsuario =
        'El nombre de usuario debe tener al menos 3 caracteres.';
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.nombreUsuario)) {
      newErrors.nombreUsuario =
        'El nombre de usuario solo puede contener letras, números, guiones y guiones bajos.';
    }

    if (!formData.correo) {
      newErrors.correo = 'Es obligatorio introducir un correo electrónico.';
    } else if (
      !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        formData.correo
      )
    ) {
      newErrors.correo = 'El correo electrónico no es válido.';
    }

    if (!formData.contrasena) {
      newErrors.contrasena = 'Es obligatorio introducir una contraseña.';
    } else if (formData.contrasena.length < 8) {
      newErrors.contrasena =
        'La contraseña debe tener al menos 8 caracteres.';
    }

    if (!formData.confirmarContrasena) {
      newErrors.confirmarContrasena =
        'Es obligatorio confirmar la contraseña.';
    } else if (
      formData.contrasena !== formData.confirmarContrasena
    ) {
      newErrors.confirmarContrasena = 'Las contraseñas no coinciden.';
    }

    if (!acceptTerms) {
      newErrors.terminos = 'Debes aceptar los Términos de Uso y la Política de Privacidad.';
    }

    return newErrors;
  };

  /**
   * Handles registration form submission.
   * Validates data, registers the user and redirects to dashboard on success.
   *
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setErrors({});
      setLoading(true);

      const result = await registerUser(
        formData.nombreUsuario,
        formData.correo,
        formData.contrasena
      );

      if (result.success) {
        navigate('/dashboard');
      } else {
        setErrors({ submit: result.error });
      }
    } catch (error) {
      setErrors({ submit: 'Error al registrarse. Inténtalo de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register">
      <article className="register__contenedor">
        <section className="register__encabezado">
          <h3 className="register__titulo">Crear cuenta</h3>
          <p className="register__subtitulo">Regístrate para comenzar</p>
        </section>

        <form onSubmit={handleSubmit} className="register__formulario">
          {errors.submit && (
            <section className="register__error" role="alert">
              {errors.submit}
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
              value={formData.nombreUsuario}
              onChange={handleChange}
              placeholder="usuario123"
              className={`register__input ${errors.nombreUsuario ? 'register__input--error' : ''}`}
              disabled={loading}
            />
            {errors.nombreUsuario && (
              <span className="register__mensaje-error" role="alert">
                {errors.nombreUsuario}
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
              value={formData.correo}
              onChange={handleChange}
              placeholder="tu@ejemplo.com"
              className={`register__input ${errors.correo ? 'register__input--error' : ''}`}
              disabled={loading}
            />
            {errors.correo && (
              <span className="register__mensaje-error" role="alert">
                {errors.correo}
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
              value={formData.contrasena}
              onChange={handleChange}
              placeholder="********"
              className={`register__input ${errors.contrasena ? 'register__input--error' : ''}`}
              disabled={loading}
            />
            {errors.contrasena && (
              <span className="register__mensaje-error" role="alert">
                {errors.contrasena}
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
              value={formData.confirmarContrasena}
              onChange={handleChange}
              placeholder="********"
              className={`register__input ${errors.confirmarContrasena ? 'register__input--error' : ''}`}
              disabled={loading}
            />
            {errors.confirmarContrasena && (
              <span className="register__mensaje-error" role="alert">
                {errors.confirmarContrasena}
              </span>
            )}
          </fieldset>

          <fieldset className="register__terminos">
            <label className="register__checkbox">
              <input
                type="checkbox"
                id="terminos"
                className="register__checkbox-input"
                checked={acceptTerms}
                onChange={(e) => {
                  setAcceptTerms(e.target.checked);
                  if (errors.terminos) {
                    setErrors((prev) => ({ ...prev, terminos: '' }));
                  }
                }}
                disabled={loading}
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
            {errors.terminos && (
              <span className="register__mensaje-error" role="alert">
                {errors.terminos}
              </span>
            )}
          </fieldset>

          <button type="submit" className="register__boton" disabled={loading}>
            {loading ? (
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
