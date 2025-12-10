const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware de autenticación basado en JWT.
 * Verifica y decodifica el token enviado en el header Authorization.
 * @param {Object} req - Objeto de solicitud Express.
 * @param {Object} req.headers - Headers de la solicitud.
 * @param {string} req.headers.authorization - Header Authorization con formato "Bearer token".
 * @param {Object} res - Objeto de respuesta Express.
 * @param {Function} next - Middleware de siguiente en la cadena.
 * @returns {void} Si el token es válido, continúa con next(). Si es inválido, retorna error 401.
 * @throws {Object} Error JSON con mensaje si el token no existe, es inválido o ha expirado.
 */
function auth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token requerido" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}

module.exports = auth;
