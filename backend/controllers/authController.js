const User = require('../models/User');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const JWT_SECRET = process.env.JWT_SECRET

exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

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

        // Retorna respuesta exitosa
        res.status(201).json({ 
            message: 'Usuario registrado exitosamente',
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

