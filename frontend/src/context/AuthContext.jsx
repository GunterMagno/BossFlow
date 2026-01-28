import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import authService from '../services/authService';

const AuthContext = createContext(null);

/**
 * Custom hook to access the authentication context.
 * Provides access to user authentication data and functions.
 *
 * @throws {Error} If used outside an AuthProvider
 * @returns {Object} Object with authentication data and methods
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

/**
 * Authentication context provider component.
 * Manages authentication state, login, registration, and user logout.
 * Automatically verifies authentication on load and handles expired tokens.
 *
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Child components wrapped by the provider
 * @returns {JSX.Element} Authentication context provider
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();

        /**
         * Handles expired token event.
         * Logs out the user and redirects to login page.
         */
        const handleTokenExpired = () => {
            console.log('Expired token detected, logging out...');
            logout();
            window.location.href = '/login';
        };

        window.addEventListener('token-expired', handleTokenExpired);

        return () => {
            window.removeEventListener('token-expired', handleTokenExpired);
        };
    }, []);

    /**
     * Verifies user authentication from localStorage.
     * Retrieves stored user data and token, updating state if valid.
     *
     * @returns {Promise<void>} Promise that resolves when verification is complete
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
            console.error('Error verifying authentication:', error);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Logs in a user with email and password.
     * Saves user data and token to localStorage and updates authentication state.
     *
     * @param {string} email - User's email address
     * @param {string} password - User's password
     * @param {boolean} rememberMe - Whether to remember the session
     * @returns {Promise<Object>} Promise that resolves with login result (success, user or error)
     */
    const login = async (email, password, rememberMe = false) => {
        try {
            setLoading(true);

            const { user: userData, token } = await authService.login(email, password, rememberMe);

            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', token);

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            setUser(userData);
            setIsAuthenticated(true);

            return { success: true, user: userData };
        } catch (error) {
            console.error('Error in login:', error);
            const errorMessage = error.response?.data?.error || 'Error al iniciar sesión. Inténtalo de nuevo.';
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    /**
     * Registers a new user in the system.
     * Saves user data and token to localStorage after successful registration.
     *
     * @param {string} username - Username for the new registration
     * @param {string} email - User's email address
     * @param {string} password - User's password
     * @param {boolean} rememberMe - Whether to remember the session
     * @returns {Promise<Object>} Promise that resolves with registration result (success, user or error)
     */
    const register = async (username, email, password, rememberMe = false) => {
        try {
            setLoading(true);

            const { user: userData, token } = await authService.register(
                username,
                email,
                password,
                rememberMe
            );

            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', token);

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            setUser(userData);
            setIsAuthenticated(true);

            return { success: true, user: userData };
        } catch (error) {
            console.error('Error in register:', error);
            const errorMessage = error.response?.data?.error || 'Error al registrarse. Inténtalo de nuevo.';
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    /**
     * Logs out the current user.
     * Removes user data and token from localStorage and clears authentication state.
     *
     * @returns {Object} Object with logout result (success or error)
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
            console.error('Error in logout:', error);
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
