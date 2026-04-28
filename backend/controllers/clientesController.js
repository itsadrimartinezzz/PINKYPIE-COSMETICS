const pool = require('../config/db');

// Obtener todos los clientes
const obtenerClientes = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id_cliente,
        nombre,
        apellido,
        email,
        telefono,
        direccion,
        fecha_registro
      FROM cliente
      ORDER BY id_cliente;
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({
      mensaje: 'Error al obtener clientes'
    });
  }
};

// Obtener un cliente por ID
const obtenerClientePorId = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT
        id_cliente,
        nombre,
        apellido,
        email,
        telefono,
        direccion,
        fecha_registro
      FROM cliente
      WHERE id_cliente = $1;
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        mensaje: 'Cliente no encontrado'
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener cliente:', error);
    res.status(500).json({
      mensaje: 'Error al obtener cliente'
    });
  }
};

// Crear un cliente nuevo
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

    const result = await pool.query(`
      INSERT INTO cliente (
        nombre,
        apellido,
        email,
        telefono,
        direccion
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `, [
      nombre,
      apellido,
      email,
      telefono,
      direccion
    ]);

    res.status(201).json({
      mensaje: 'Cliente creado correctamente',
      cliente: result.rows[0]
    });
  } catch (error) {
    console.error('Error al crear cliente:', error);

    if (error.code === '23505') {
      return res.status(400).json({
        mensaje: 'Ya existe un cliente con ese email'
      });
    }

    res.status(500).json({
      mensaje: 'Error al crear cliente'
    });
  }
};

// Actualizar datos del cliente
const actualizarCliente = async (req, res) => {
  try {
    const { id } = req.params;

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

    const result = await pool.query(`
      UPDATE cliente
      SET
        nombre = $1,
        apellido = $2,
        email = $3,
        telefono = $4,
        direccion = $5
      WHERE id_cliente = $6
      RETURNING *;
    `, [
      nombre,
      apellido,
      email,
      telefono,
      direccion,
      id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        mensaje: 'Cliente no encontrado'
      });
    }

    res.json({
      mensaje: 'Cliente actualizado correctamente',
      cliente: result.rows[0]
    });
  } catch (error) {
    console.error('Error al actualizar cliente:', error);

    if (error.code === '23505') {
      return res.status(400).json({
        mensaje: 'Ya existe otro cliente con ese email'
      });
    }

    res.status(500).json({
      mensaje: 'Error al actualizar cliente'
    });
  }
};

// Eliminar cliente
const eliminarCliente = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      DELETE FROM cliente
      WHERE id_cliente = $1
      RETURNING *;
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        mensaje: 'Cliente no encontrado'
      });
    }

    res.json({
      mensaje: 'Cliente eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar cliente:', error);

    if (error.code === '23503') {
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