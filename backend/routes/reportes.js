const express = require('express');
const router = express.Router();

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

const { verificarToken, autorizarRoles } = require('../middlewares/authMiddleware');

const puedeVerReportes = autorizarRoles('admin', 'gerente', 'consulta', 'supervisor');

router.get('/productos-inventario', verificarToken, puedeVerReportes, obtenerProductosInventario);
router.get('/ventas-generales', verificarToken, puedeVerReportes, obtenerVentasGenerales);
router.get('/detalle-ventas', verificarToken, puedeVerReportes, obtenerDetalleVentas);
router.get('/ventas-categoria', verificarToken, puedeVerReportes, obtenerVentasPorCategoria);
router.get('/productos-mas-vendidos', verificarToken, puedeVerReportes, obtenerProductosMasVendidos);
router.get('/stock-bajo', verificarToken, puedeVerReportes, obtenerStockBajo);
router.get('/ventas-diarias', verificarToken, puedeVerReportes, obtenerVentasDiarias);
router.get('/dashboard', verificarToken, autorizarRoles('admin', 'gerente', 'vendedor', 'inventario', 'consulta', 'supervisor'), obtenerDashboard);

module.exports = router;