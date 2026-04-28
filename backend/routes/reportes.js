const express = require('express');
const router = express.Router();

// Funciones del controlador de reportes
const {
  obtenerProductosInventario,
  obtenerVentasGenerales,
  obtenerDetalleVentas,
  obtenerVentasPorCategoria,
  obtenerProductosMasVendidos,
  obtenerStockBajo,
  obtenerVentasDiarias,
  obtenerDashboard
} = require('../controllers/reportesController');

// Rutas de reportes
router.get('/productos-inventario', obtenerProductosInventario);
router.get('/ventas-generales', obtenerVentasGenerales);
router.get('/detalle-ventas', obtenerDetalleVentas);
router.get('/ventas-categoria', obtenerVentasPorCategoria);
router.get('/productos-mas-vendidos', obtenerProductosMasVendidos);
router.get('/stock-bajo', obtenerStockBajo);
router.get('/ventas-diarias', obtenerVentasDiarias);
router.get('/dashboard', obtenerDashboard);

module.exports = router;