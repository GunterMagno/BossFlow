import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

/**
 * Login component with form validation
 * @returns {JSX.Element} Login form with validation and error handling
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

  const [formData, setFormData] = useState({
    correo: '',
    contrasena: '',
    recordarme: false,
  });

  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);

  /**
   * Handles changes in form fields
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  /**
   * Validates login form fields
   * @returns {Object} Object with validation errors found
   */
  const validateForm = () => {
    const newErrors = {};

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

    return newErrors;
  };

  /**
   * Handles login form submission
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

      const result = await login(
        formData.correo,
        formData.contrasena,
        formData.recordarme
      );

      if (result.success) {
        navigate('/dashboard');
      } else {
        setErrors({ submit: result.error });
      }
    } catch (error) {
      setErrors({ submit: 'Error al iniciar sesión. Inténtalo de nuevo.' });
    } finally {
      setLoading(false);
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

        <form onSubmit={handleSubmit} className="login__formulario">
          {errors.submit && (
            <section className="login__error" role="alert">
              {errors.submit}
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
              value={formData.correo}
              onChange={handleChange}
              placeholder="tu@ejemplo.com"
              className={`login__input ${errors.correo ? 'login__input--error' : ''}`}
              disabled={loading}
            />
            {errors.correo && (
              <span className="login__mensaje-error" role="alert">
                {errors.correo}
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
              value={formData.contrasena}
              onChange={handleChange}
              placeholder="********"
              className={`login__input ${errors.contrasena ? 'login__input--error' : ''}`}
              disabled={loading}
            />
            {errors.contrasena && (
              <span className="login__mensaje-error" role="alert">
                {errors.contrasena}
              </span>
            )}
          </fieldset>

          <fieldset className="login__recordar">
            <label className="login__checkbox">
              <input
                type="checkbox"
                id="recordarme"
                name="recordarme"
                checked={formData.recordarme}
                onChange={handleChange}
                className="login__checkbox-input"
              />
              <span className="login__checkbox-texto">Recordarme</span>
            </label>
          </fieldset>

          <button type="submit" className="login__boton" disabled={loading}>
            {loading ? (
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
