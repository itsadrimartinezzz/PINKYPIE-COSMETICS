const express = require('express');
const router = express.Router();

const {
  obtenerClientes,
  obtenerClientePorId,
  crearCliente,
  actualizarCliente,
  eliminarCliente
} = require('../controllers/clientesController');

const { verificarToken, autorizarRoles } = require('../middlewares/authMiddleware');

router.get('/', verificarToken, autorizarRoles('admin', 'gerente', 'vendedor', 'consulta', 'supervisor'), obtenerClientes);
router.get('/:id', verificarToken, autorizarRoles('admin', 'gerente', 'vendedor', 'consulta', 'supervisor'), obtenerClientePorId);
router.post('/', verificarToken, autorizarRoles('admin', 'gerente', 'vendedor'), crearCliente);
router.put('/:id', verificarToken, autorizarRoles('admin', 'gerente'), actualizarCliente);
router.delete('/:id', verificarToken, autorizarRoles('admin'), eliminarCliente);

module.exports = router;