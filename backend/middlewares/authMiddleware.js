const jwt = require('jsonwebtoken');

// Validar token enviado desde el frontend
const verificarToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        mensaje: 'Token no proporcionado'
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        mensaje: 'Token inválido'
      });
    }

    const usuario = jwt.verify(token, process.env.JWT_SECRET);

    req.usuario = usuario;

    next();
  } catch (error) {
    return res.status(401).json({
      mensaje: 'Token inválido o expirado'
    });
  }
};

module.exports = verificarToken;