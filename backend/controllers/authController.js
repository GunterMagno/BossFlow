const User = require("../models/User");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Registers a new user in the application.
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} req.body - User data.
 * @param {string} req.body.username - Unique username (minimum 3 characters).
 * @param {string} req.body.email - Unique email in valid format.
 * @param {string} req.body.password - Password (minimum 8 characters).
 * @param {boolean} req.body.rememberMe - If true, token lasts 30 days.
 * @param {Object} res - Express response object.
 * @param {Function} next - Next middleware function.
 * @returns {Object} JWT token and the registered user data.
 */
exports.register = async (req, res, next) => {
  try {
    const { username, email, password, rememberMe } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        error: "All fields are required (username, email, password)",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        error: "Invalid email format",
      });
    }

    if (username.trim().length < 3) {
      return res.status(400).json({
        error: "Username must be at least 3 characters",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: "Password must be at least 8 characters",
      });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        error: "Email is already registered",
      });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({
        error: "Username is already in use",
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
      message: "User registered successfully",
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
 * Authenticates an existing user and generates a JWT.
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} req.body - User credentials.
 * @param {string} req.body.email - User email.
 * @param {string} req.body.password - User password.
 * @param {boolean} req.body.rememberMe - If true, token lasts 30 days.
 * @param {Object} res - Express response object.
 * @param {Function} next - Next middleware function.
 * @returns {Object} JWT token and authenticated user data.
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "All fields are required (email, password)",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        error: "Invalid email format",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    const expiresIn = rememberMe ? "30d" : "7d";
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn });

    res.status(200).json({
      message: "Login successful",
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
 * Logs out the user.
 * In a JWT-based system, logout is handled by removing the token on the client.
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Next middleware function.
 * @returns {Object} Confirmation message for logout.
 */
exports.logout = async (req, res, next) => {
  try {
    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (err) {
    next(err);
  }
};
