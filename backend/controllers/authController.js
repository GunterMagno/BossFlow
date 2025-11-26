const User = require('../models/User');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const JWT_SECRET = process.env.JWT_SECRET

exports.register = async (req, res, next) => {
    try {
        const { username, email, password, rememberMe } = req.body;

        // Valida que todos los campos requeridos estén presentes
        if (!username || !email || !password) {
            return res.status(400).json({
                error: 'Todos los campos son requeridos (username, email, password)'
            });
        }

        // Valida formato del email
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                error: 'El formato del email no es válido'
            });
        }

        // Valida longitud mínima del username
        if (username.trim().length < 3) {
            return res.status(400).json({
                error: 'El username debe tener al menos 3 caracteres'
            });
        }

        // Valida longitud mínima del password
        if (password.length < 8) {
            return res.status(400).json({
                error: 'La contraseña debe tener al menos 8 caracteres'
            });
        }

        // Verifica que el email no esté ya registrado
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({
                error: 'El email ya está registrado'
            });
        }

        // Verifica que el username no esté ya en uso
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({
                error: 'El username ya está en uso'
            });
        }

        // Crea y guarda el nuevo usuario (el password se hasheará automáticamente)
        const newUser = new User({
            username: username.trim(),
            email: email.toLowerCase().trim(),
            password
        });
        await newUser.save();

        // Genera token JWT para el nuevo usuario
        // Si rememberMe está activo, el token dura 30 días, sino 7 días
        const expiresIn = rememberMe ? '30d' : '7d';
        const token = jwt.sign(
            { userId: newUser._id },
            JWT_SECRET,
            { expiresIn }
        );

        // Retorna respuesta exitosa con token
        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password, rememberMe } = req.body;

        // Valida que todos los campos requeridos estén presentes
        if (!email || !password) {
            return res.status(400).json({
                error: 'Todos los campos son requeridos (email, password)'
            });
        }

        // Valida formato del email
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                error: 'El formato del email no es válido'
            });
        }

        // Normaliza el email a minúsculas antes de buscar (igual que cuando se registra)
        const normalizedEmail = email.toLowerCase().trim();

        // Busca el usuario por email (que es único)
        const user = await User.findOne({ email: normalizedEmail });

        // Verifica si el usuario existe
        if (!user) {
            return res.status(401).json({
                error: 'Credenciales inválidas'
            });
        }

        // Compara la contraseña con el hash almacenado
        const isMatch = await user.comparePassword(password);

        // Si no coincide, retorna error
        if (!isMatch) {
            return res.status(401).json({
                error: 'Credenciales inválidas'
            });
        }

        // Genera token JWT
        // Si rememberMe está activo, el token dura 30 días, sino 7 días
        const expiresIn = rememberMe ? '30d' : '7d';
        const token = jwt.sign(
            { userId: user._id },
            JWT_SECRET,
            { expiresIn }
        );

        // Retorna token y datos del usuario (sin password)
        res.status(200).json({
            message: 'Login exitoso',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.logout = async (req, res, next) => {
    try {
        // En un sistema basado en JWT sin estado, el logout se maneja en el cliente
        // eliminando el token. Aquí simplemente confirmamos la operación.
        res.status(200).json({ 
            message: 'Sesión cerrada correctamente'
        });
    } catch (err) {
        next(err);
    }
};