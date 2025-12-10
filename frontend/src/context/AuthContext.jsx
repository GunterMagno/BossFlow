import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import authService from '../services/authService';

const AuthContext = createContext(null);

/**
 * Hook personalizado para acceder al contexto de autenticación.
 * Proporciona acceso a los datos y funciones de autenticación del usuario.
 *
 * @throws {Error} Si se usa fuera de un AuthProvider
 * @returns {Object} Objeto con datos y métodos de autenticación
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};

/**
 * Componente proveedor del contexto de autenticación.
 * Gestiona el estado de autenticación, login, registro y cierre de sesión de usuarios.
 * Verifica automáticamente la autenticación al cargar y maneja tokens expirados.
 *
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componentes hijos envueltos por el proveedor
 * @returns {JSX.Element} Proveedor del contexto de autenticación
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();

        /**
         * Maneja el evento de token expirado.
         * Cierra la sesión del usuario y redirige a la página de login.
         */
        const handleTokenExpired = () => {
            console.log('Token expirado detectado, cerrando sesión...');
            logout();
            window.location.href = '/login';
        };

        window.addEventListener('token-expired', handleTokenExpired);

        return () => {
            window.removeEventListener('token-expired', handleTokenExpired);
        };
    }, []);

    /**
     * Verifica la autenticación del usuario desde localStorage.
     * Recupera los datos del usuario y token guardados, actualizando el estado si son válidos.
     *
     * @returns {Promise<void>} Promesa que resuelve cuando se completa la verificación
     */
    const checkAuth = async () => {
        try {
            const storedUser = localStorage.getItem('user');
            const token = localStorage.getItem('token');

            if (storedUser && token) {
                const userData = JSON.parse(storedUser);
                setUser(userData);
                setIsAuthenticated(true);

                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Error al verificar autenticación:', error);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Inicia sesión de un usuario con correo y contraseña.
     * Guarda los datos del usuario y token en localStorage y actualiza el estado de autenticación.
     *
     * @param {string} correo - Correo electrónico del usuario
     * @param {string} contrasena - Contraseña del usuario
     * @param {boolean} recordarme - Indica si se debe recordar la sesión
     * @returns {Promise<Object>} Promesa que resuelve con resultado del login (success, user o error)
     */
    const login = async (correo, contrasena, recordarme = false) => {
        try {
            setLoading(true);

            const { user: userData, token } = await authService.login(correo, contrasena, recordarme);

            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', token);

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            setUser(userData);
            setIsAuthenticated(true);

            return { success: true, user: userData };
        } catch (error) {
            console.error('Error en login:', error);
            const errorMessage = error.response?.data?.error || 'Error al iniciar sesión. Inténtalo de nuevo.';
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    /**
     * Registra un nuevo usuario en el sistema.
     * Guarda los datos del usuario y token en localStorage tras el registro exitoso.
     *
     * @param {string} nombreUsuario - Nombre de usuario para el nuevo registro
     * @param {string} correo - Correo electrónico del usuario
     * @param {string} contrasena - Contraseña del usuario
     * @param {boolean} recordarme - Indica si se debe recordar la sesión
     * @returns {Promise<Object>} Promesa que resuelve con resultado del registro (success, user o error)
     */
    const register = async (nombreUsuario, correo, contrasena, recordarme = false) => {
        try {
            setLoading(true);

            const { user: userData, token } = await authService.register(
                nombreUsuario,
                correo,
                contrasena,
                recordarme
            );

            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', token);

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            setUser(userData);
            setIsAuthenticated(true);

            return { success: true, user: userData };
        } catch (error) {
            console.error('Error en register:', error);
            const errorMessage = error.response?.data?.error || 'Error al registrarse. Inténtalo de nuevo.';
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    /**
     * Cierra la sesión del usuario actual.
     * Elimina los datos del usuario y token de localStorage y limpia el estado de autenticación.
     *
     * @returns {Object} Objeto con el resultado del logout (success o error)
     */
    const logout = () => {
        try {
            localStorage.removeItem('user');
            localStorage.removeItem('token');

            delete api.defaults.headers.common['Authorization'];

            setUser(null);
            setIsAuthenticated(false);

            return { success: true };
        } catch (error) {
            console.error('Error en logout:', error);
            return { success: false, error: 'Error al cerrar sesión' };
        }
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        register
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
