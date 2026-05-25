const express = require('express');
const router = express.Router();

const {
  obtenerVentas,
  obtenerVentaPorId,
  crearVenta,
  obtenerEmpleadosActivos
} = require('../controllers/ventasController');

const { verificarToken, autorizarRoles } = require('../middlewares/authMiddleware');

router.get('/', verificarToken, autorizarRoles('admin', 'gerente', 'vendedor', 'consulta', 'supervisor'), obtenerVentas);
router.get('/empleados', verificarToken, autorizarRoles('admin', 'gerente', 'vendedor', 'supervisor'), obtenerEmpleadosActivos);
router.get('/:id', verificarToken, autorizarRoles('admin', 'gerente', 'vendedor', 'consulta', 'supervisor'), obtenerVentaPorId);
router.post('/', verificarToken, autorizarRoles('admin', 'gerente', 'vendedor'), crearVenta);

module.exports = router;