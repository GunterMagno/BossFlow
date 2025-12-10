const User = require("../models/User");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Registra un nuevo usuario en la aplicación.
 * @async
 * @param {Object} req - Objeto de solicitud Express.
 * @param {Object} req.body - Datos del usuario.
 * @param {string} req.body.username - Nombre de usuario único (mínimo 3 caracteres).
 * @param {string} req.body.email - Email único en formato válido.
 * @param {string} req.body.password - Contraseña (mínimo 8 caracteres).
 * @param {boolean} req.body.rememberMe - Si es verdadero, el token dura 30 días.
 * @param {Object} res - Objeto de respuesta Express.
 * @param {Function} next - Función middleware siguiente.
 * @returns {Object} Token JWT y datos del usuario registrado.
 */
exports.register = async (req, res, next) => {
  try {
    const { username, email, password, rememberMe } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        error: "Todos los campos son requeridos (username, email, password)",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        error: "El formato del email no es válido",
      });
    }

    if (username.trim().length < 3) {
      return res.status(400).json({
        error: "El username debe tener al menos 3 caracteres",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: "La contraseña debe tener al menos 8 caracteres",
      });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        error: "El email ya está registrado",
      });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({
        error: "El username ya está en uso",
      });
    }

    const newUser = new User({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password,
    });
    await newUser.save();

    const expiresIn = rememberMe ? "30d" : "7d";
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn });

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        avatar: newUser.avatar || null,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Autentica un usuario existente y genera un token JWT.
 * @async
 * @param {Object} req - Objeto de solicitud Express.
 * @param {Object} req.body - Credenciales del usuario.
 * @param {string} req.body.email - Email del usuario.
 * @param {string} req.body.password - Contraseña del usuario.
 * @param {boolean} req.body.rememberMe - Si es verdadero, el token dura 30 días.
 * @param {Object} res - Objeto de respuesta Express.
 * @param {Function} next - Función middleware siguiente.
 * @returns {Object} Token JWT y datos del usuario autenticado.
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Todos los campos son requeridos (email, password)",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        error: "El formato del email no es válido",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        error: "Credenciales inválidas",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        error: "Credenciales inválidas",
      });
    }

    const expiresIn = rememberMe ? "30d" : "7d";
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn });

    res.status(200).json({
      message: "Login exitoso",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar || null,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Cierra la sesión del usuario.
 * En un sistema basado en JWT, el cierre de sesión se maneja eliminando el token en el cliente.
 * @async
 * @param {Object} req - Objeto de solicitud Express.
 * @param {Object} res - Objeto de respuesta Express.
 * @param {Function} next - Función middleware siguiente.
 * @returns {Object} Mensaje de confirmación de cierre de sesión.
 */
exports.logout = async (req, res, next) => {
  try {
    res.status(200).json({
      message: "Sesión cerrada correctamente",
    });
  } catch (err) {
    next(err);
  }
};
