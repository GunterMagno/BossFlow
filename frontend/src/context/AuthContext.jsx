import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

// Crear el contexto
const AuthContext = createContext(null);

// Hook personalizado para usar el contexto
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};

// Provider del contexto
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Verificar si hay un usuario autenticado al cargar la aplicación
    useEffect(() => {
        checkAuth();
    }, []);

    // Verificar autenticación desde localStorage
    const checkAuth = async () => {
        try {
            const storedUser = localStorage.getItem('user');
            const token = localStorage.getItem('token');

            if (storedUser && token) {
                const userData = JSON.parse(storedUser);
                setUser(userData);
                setIsAuthenticated(true);
                
                // Configurar el token en los headers de axios
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Error al verificar autenticación:', error);
            // Limpiar datos si hay error
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    // Función de login
    const login = async (correo, contrasena) => {
        try {
            setLoading(true);
            
            const response = await api.post('/api/auth/login', {
                email: correo,
                password: contrasena
            });

            const { user: userData, token } = response.data;

            // Guardar en localStorage
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', token);

            // Configurar el token en los headers de axios
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // Actualizar estado
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

    // Función de register
    const register = async (nombreUsuario, correo, contrasena) => {
        try {
            setLoading(true);
            
            const response = await api.post('/api/auth/register', {
                username: nombreUsuario,
                email: correo,
                password: contrasena
            });

            const { user: userData, token } = response.data;

            // Guardar en localStorage
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', token);

            // Configurar el token en los headers de axios
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // Actualizar estado
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

    // Función de logout
    const logout = () => {
        try {
            // Limpiar localStorage
            localStorage.removeItem('user');
            localStorage.removeItem('token');

            // Limpiar headers de axios
            delete api.defaults.headers.common['Authorization'];

            // Actualizar estado
            setUser(null);
            setIsAuthenticated(false);
            
            return { success: true };
        } catch (error) {
            console.error('Error en logout:', error);
            return { success: false, error: 'Error al cerrar sesión' };
        }
    };

    // Valor del contexto
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
