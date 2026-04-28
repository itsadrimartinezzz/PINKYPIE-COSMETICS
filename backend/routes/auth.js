const express = require('express');
const router = express.Router();

// Funciones del controlador de autenticación
const {
  login,
  obtenerPerfil
} = require('../controllers/authController');

// Middleware para validar token
const verificarToken = require('../middlewares/authMiddleware');

// Rutas de autenticación
router.post('/login', login);
router.get('/perfil', verificarToken, obtenerPerfil);

module.exports = router;