const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

function auth(req, res, next) {
    // Obtiene el header Authorization
    const header = req.headers.authorization;

    // Comprueba que exista y tenga formato Bearer
    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token requerido" });
    }

    // Extrae el token del header
    const token = header.split(" ")[1];

    try {
        // Verifica y decodifica el token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Guarda los datos del usuario en la request
        req.user = decoded;

        // Continúa con la ruta protegida
        next();
        
    } catch (err) {
        // Token inválido o expirado
        return res.status(401).json({ error: "Token inválido o expirado" });
    }
}

module.exports = auth;