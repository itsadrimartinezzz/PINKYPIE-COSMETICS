const { Cliente } = require('../models');

// MIGRADO A SEQUELIZE
const obtenerClientes = async (req, res) => {
  try {
    const clientes = await Cliente.findAll({
      order: [['id_cliente', 'ASC']]
    });

    res.json(clientes);
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({
      mensaje: 'Error al obtener clientes'
    });
  }
};

// MIGRADO A SEQUELIZE
const obtenerClientePorId = async (req, res) => {
  try {
    const { id } = req.params;

    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      return res.status(404).json({
        mensaje: 'Cliente no encontrado'
      });
    }

    res.json(cliente);
  } catch (error) {
    console.error('Error al obtener cliente:', error);
    res.status(500).json({
      mensaje: 'Error al obtener cliente'
    });
  }
};

// MIGRADO A SEQUELIZE
const crearCliente = async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      email,
      telefono,
      direccion
    } = req.body;

    if (!nombre || !apellido || !email) {
      return res.status(400).json({
        mensaje: 'Nombre, apellido y email son obligatorios'
      });
    }

    const nuevoCliente = await Cliente.create({
      nombre,
      apellido,
      email,
      telefono,
      direccion
    });

    res.status(201).json({
      mensaje: 'Cliente creado correctamente',
      cliente: nuevoCliente
    });
  } catch (error) {
    console.error('Error al crear cliente:', error);

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        mensaje: 'Ya existe un cliente con ese email'
      });
    }

    res.status(500).json({
      mensaje: 'Error al crear cliente'
    });
  }
};

// ORM: actualizar cliente
const actualizarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, email, telefono, direccion } = req.body;

    if (!nombre || !apellido || !email) {
      return res.status(400).json({
        mensaje: 'Nombre, apellido y email son obligatorios'
      });
    }

    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      return res.status(404).json({
        mensaje: 'Cliente no encontrado'
      });
    }

    await cliente.update({
      nombre,
      apellido,
      email,
      telefono,
      direccion
    });

    res.json({
      mensaje: 'Cliente actualizado correctamente',
      cliente
    });
  } catch (error) {
    console.error('Error al actualizar cliente:', error);

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        mensaje: 'Ya existe otro cliente con ese email'
      });
    }

    res.status(500).json({
      mensaje: 'Error al actualizar cliente'
    });
  }
};

// ORM: eliminar cliente
const eliminarCliente = async (req, res) => {
  try {
    const { id } = req.params;

    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      return res.status(404).json({
        mensaje: 'Cliente no encontrado'
      });
    }

    await cliente.destroy();

    res.json({
      mensaje: 'Cliente eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar cliente:', error);

    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        mensaje: 'No se puede eliminar el cliente porque tiene ventas registradas'
      });
    }

    res.status(500).json({
      mensaje: 'Error al eliminar cliente'
    });
  }
};

module.exports = {
  obtenerClientes,
  obtenerClientePorId,
  crearCliente,
  actualizarCliente,
  eliminarCliente
};