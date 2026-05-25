const express = require('express');
const router = express.Router();

const {
  registrarVentaSP,
  actualizarStockSP,
  anularVentaSP,
  reporteVentasPeriodoSP,
  productosBajoStockSP
} = require('../controllers/proceduresController');

const {
  verificarToken,
  autorizarRoles
} = require('../middlewares/authMiddleware');

// SP 1: Registrar venta
router.post(
  '/registrar-venta',
  verificarToken,
  autorizarRoles('admin', 'gerente', 'vendedor'),
  registrarVentaSP
);

// SP 2: Actualizar stock
router.post(
  '/actualizar-stock',
  verificarToken,
  autorizarRoles('admin', 'gerente', 'inventario'),
  actualizarStockSP
);

// SP 3: Anular venta
router.post(
  '/anular-venta',
  verificarToken,
  autorizarRoles('admin', 'gerente'),
  anularVentaSP
);

// SP 4: Reporte de ventas por período
router.get(
  '/reporte-ventas-periodo',
  verificarToken,
  autorizarRoles('admin', 'gerente', 'consulta'),
  reporteVentasPeriodoSP
);

// SP 5: Productos con bajo stock
router.get(
  '/productos-bajo-stock',
  verificarToken,
  autorizarRoles('admin', 'gerente', 'inventario', 'consulta'),
  productosBajoStockSP
);

module.exports = router;