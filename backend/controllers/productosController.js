const pool = require('../config/db');

const obtenerProductos = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id_producto,
        p.sku,
        p.nombre AS producto,
        p.descripcion,
        c.id_categoria,
        c.nombre AS categoria,
        m.id_marca,
        m.nombre AS marca,
        pr.id_proveedor,
        pr.nombre AS proveedor,
        p.precio_compra,
        p.precio_venta,
        p.stock,
        p.stock_minimo,
        p.imagen,
        p.activo
      FROM producto p
      JOIN categoria c ON c.id_categoria = p.id_categoria
      JOIN marca m ON m.id_marca = p.id_marca
      JOIN proveedor pr ON pr.id_proveedor = p.id_proveedor
      ORDER BY p.id_producto;
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ mensaje: 'Error al obtener productos' });
  }
};

const obtenerProductoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT *
      FROM producto
      WHERE id_producto = $1;
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ mensaje: 'Error al obtener producto' });
  }
};

const crearProducto = async (req, res) => {
  try {
    const {
      id_categoria,
      id_marca,
      id_proveedor,
      nombre,
      descripcion,
      precio_compra,
      precio_venta,
      stock,
      stock_minimo,
      sku,
      imagen,
      activo
    } = req.body;

    if (!id_categoria || !id_marca || !id_proveedor || !nombre || !precio_compra || !precio_venta || !sku) {
      return res.status(400).json({
        mensaje: 'Faltan campos obligatorios'
      });
    }

    const result = await pool.query(`
      INSERT INTO producto (
        id_categoria,
        id_marca,
        id_proveedor,
        nombre,
        descripcion,
        precio_compra,
        precio_venta,
        stock,
        stock_minimo,
        sku,
        imagen,
        activo
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, COALESCE($12, TRUE))
      RETURNING *;
    `, [
      id_categoria,
      id_marca,
      id_proveedor,
      nombre,
      descripcion,
      precio_compra,
      precio_venta,
      stock || 0,
      stock_minimo || 5,
      sku,
      imagen,
      activo
    ]);

    res.status(201).json({
      mensaje: 'Producto creado correctamente',
      producto: result.rows[0]
    });
  } catch (error) {
    console.error('Error al crear producto:', error);

    if (error.code === '23505') {
      return res.status(400).json({
        mensaje: 'Ya existe un producto con ese SKU'
      });
    }

    res.status(500).json({ mensaje: 'Error al crear producto' });
  }
};

const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      id_categoria,
      id_marca,
      id_proveedor,
      nombre,
      descripcion,
      precio_compra,
      precio_venta,
      stock,
      stock_minimo,
      sku,
      imagen,
      activo
    } = req.body;

    const result = await pool.query(`
      UPDATE producto
      SET
        id_categoria = $1,
        id_marca = $2,
        id_proveedor = $3,
        nombre = $4,
        descripcion = $5,
        precio_compra = $6,
        precio_venta = $7,
        stock = $8,
        stock_minimo = $9,
        sku = $10,
        imagen = $11,
        activo = $12
      WHERE id_producto = $13
      RETURNING *;
    `, [
      id_categoria,
      id_marca,
      id_proveedor,
      nombre,
      descripcion,
      precio_compra,
      precio_venta,
      stock,
      stock_minimo,
      sku,
      imagen,
      activo,
      id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    res.json({
      mensaje: 'Producto actualizado correctamente',
      producto: result.rows[0]
    });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ mensaje: 'Error al actualizar producto' });
  }
};

const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      UPDATE producto
      SET activo = FALSE
      WHERE id_producto = $1
      RETURNING *;
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    res.json({
      mensaje: 'Producto desactivado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ mensaje: 'Error al eliminar producto' });
  }
};

module.exports = {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto
};