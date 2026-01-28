const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * JWT-based authentication middleware.
 * Verifies and decodes the token sent in the Authorization header.
 * @param {Object} req - Express request object.
 * @param {Object} req.headers - Request headers.
 * @param {string} req.headers.authorization - Authorization header in the format "Bearer token".
 * @param {Object} res - Express response object.
 * @param {Function} next - Next middleware function.
 * @returns {void} If the token is valid, calls next(). If invalid, returns 401.
 * @throws {Object} JSON error with message if the token is missing, invalid or expired.
 */
function auth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token required" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token invalid or expired" });
  }
}

module.exports = auth;
