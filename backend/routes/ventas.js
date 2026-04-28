const express = require('express');
const router = express.Router();

// Funciones del controlador de ventas
const {
  obtenerVentas,
  obtenerVentaPorId,
  crearVenta
} = require('../controllers/ventasController');

// Rutas de ventas
router.get('/', obtenerVentas);
router.get('/:id', obtenerVentaPorId);
router.post('/', crearVenta);

module.exports = router;