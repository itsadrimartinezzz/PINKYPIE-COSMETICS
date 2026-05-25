const express = require('express');
const router = express.Router();

const {
  login,
  logout,
  obtenerPerfil
} = require('../controllers/authController');

const { verificarToken } = require('../middlewares/authMiddleware');

router.post('/login', login);
router.post('/logout', verificarToken, logout);
router.get('/perfil', verificarToken, obtenerPerfil);

module.exports = router;