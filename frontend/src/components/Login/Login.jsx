import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import './Login.css';

function Login() {
    const navigate = useNavigate();
    
    // Estado formulario
    const [datosFormulario, setDatosFormulario] = useState({
        correo: '',
        contrasena: ''
    });

    // Estadio validación
    const [errores, setErrores] = useState({});

    // Estado carga
    const [cargando, setCargando] = useState(false);

    // Control de cambios inputs
    const manejoCambios = (e) => {
        const { name, value } = e.target;
        setDatosFormulario({
            ...datosFormulario,
            [name]: value
        });

        if (errores[name]) {
            setErrores(prev => ({
                ...prev,
                [name]: ''
        }));
        }
    };

    // Validar formulario
    const validarFormulario = () => {
        const nuevosErrores = {};
        
        // Validar correo
        if (!datosFormulario.correo) {
            nuevosErrores.correo = 'Es obligatorio introducir un correo electrónico.';
        } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(datosFormulario.correo)) {
            nuevosErrores.correo = 'El correo electrónico no es válido.';
        }

        // Validar contraseña
        if (!datosFormulario.contrasena) {
            nuevosErrores.contrasena = 'Es obligatorio introducir una contraseña.';
        } else if (datosFormulario.contrasena.length < 8) {
            nuevosErrores.contrasena = 'La contraseña debe tener al menos 8 caracteres.';
        }

        return nuevosErrores;
    };

    // Control de submits
    const manejoSubmit = async (e) => {
        e.preventDefault();
        
        const nuevosErrores = validarFormulario();
        if (Object.keys(nuevosErrores).length > 0) {
            setErrores(nuevosErrores);
            return;
        }

        setCargando(true);

        try {
            // Simular llamada a backend (2 segundos para probar el spinner)
            await new Promise(resolve => setTimeout(resolve, 2000));
            navigate('/dashboard');
        } catch (error) {
            setErrores({ general: 'Error al iniciar sesión. Inténtalo de nuevo.' });
        } finally {
            setCargando(false);
        }
    };

    return (
        <main className="login">

            {/* Botón volver */}
            <button 
                className="login__boton-volver"
                onClick={() => navigate(-1)}
                aria-label="Volver a la página anterior"
            >
                <FiArrowLeft />
                <span>Volver</span>
            </button>

            {/* Contenedor principal */}
            <article className="login__contenedor">
                {/* Título */}
                <section className="login__encabezado">
                    <h3 className="login__titulo">Iniciar sesión</h3>
                    <p className="login__subtitulo">Por favor inicia sesión en tu cuenta</p>
                </section>

                {/* Formulario*/}
                <form onSubmit={manejoSubmit} className="login__formulario">
                    {/* Error general */}
                    {errores.submit && (<section className="login__error" role="alert">{errores.submit}</section>)}

                    {/* Campo correo */}
                    <section className="login__campo">
                        <label htmlFor="correo" className="login__etiqueta">Correo Electrónico</label>
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
                        {errores.correo && (<span className="login__mensaje-error" role="alert">{errores.correo}</span>)}
                    </section>

                    {/* Campo contraseña */}
                    <section className="login__campo">
                        <section className="login__etiqueta-con-enlace">
                            <label htmlFor="contrasena" className="login__etiqueta">Contraseña</label>
                            <Link to="/recuperar-contrasena" className="login__enlace-recuperar">
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
                        {errores.contrasena && (<span className="login__mensaje-error" role="alert">{errores.contrasena}</span>)}
                    </section>

                    {/* Checkbox recordarme */}
                    <section className="login__recordar">
                        <label className="login__checkbox">
                            <input type="checkbox" id="recordarme" className="login__checkbox-input" />
                            <span className="login__checkbox-texto">Recordarme</span>
                        </label>
                    </section>

                    {/* Botón submit */}
                    <button
                        type="submit"
                        className="login__boton"
                        disabled={cargando}
                    >
                        {cargando ? (
                            <>
                            <span className="login__spinner" aria-label="Cargando"></span>
                            Iniciar sesión
                            </>
                        ) : (
                            "Iniciar sesión"
                        )}
                    </button>

                    {/* Link registrarse */}
                    <section className="login__pie">
                        <p className="login__pie-texto">
                            ¿Aún no tienes cuenta? {' '}
                            <Link to="/register" className="login__enlace-registro">Regístrate aquí</Link>
                        </p>
                    </section>
                </form>
            </article>
        </main>
    );
}

export default Login;
