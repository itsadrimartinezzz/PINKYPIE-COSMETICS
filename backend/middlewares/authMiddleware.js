const jwt = require('jsonwebtoken');

// Validar token enviado desde el frontend
const verificarToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ mensaje: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ mensaje: 'Token inválido' });
    }

    const usuario = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = usuario;

    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token inválido o expirado' });
  }
};

// Validar que el rol del usuario tenga permiso para la ruta
const autorizarRoles = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ mensaje: 'Usuario no autenticado' });
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({
        mensaje: 'No tienes permisos para realizar esta acción'
      });
    }

    next();
  };
};

module.exports = {
  verificarToken,
  autorizarRoles
};