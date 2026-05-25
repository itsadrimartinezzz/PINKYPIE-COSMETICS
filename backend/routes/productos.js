const express = require('express');
const router = express.Router();

const {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} = require('../controllers/productosController');

const { verificarToken, autorizarRoles } = require('../middlewares/authMiddleware');

router.get('/', verificarToken, autorizarRoles('admin', 'gerente', 'vendedor', 'inventario', 'consulta', 'supervisor'), obtenerProductos);
router.get('/:id', verificarToken, autorizarRoles('admin', 'gerente', 'vendedor', 'inventario', 'consulta', 'supervisor'), obtenerProductoPorId);
router.post('/', verificarToken, autorizarRoles('admin', 'gerente', 'inventario'), crearProducto);
router.put('/:id', verificarToken, autorizarRoles('admin', 'gerente', 'inventario'), actualizarProducto);
router.delete('/:id', verificarToken, autorizarRoles('admin', 'gerente', 'inventario'), eliminarProducto);

module.exports = router;