const pool = require('../config/db');

// Obtener todas las ventas
const obtenerVentas = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        v.id_venta,
        v.fecha_venta,
        CONCAT(c.nombre, ' ', c.apellido) AS cliente,
        CONCAT(e.nombre, ' ', e.apellido) AS empleado,
        v.subtotal,
        v.descuento,
        v.total,
        v.estado,
        v.observaciones
      FROM venta v
      JOIN cliente c ON c.id_cliente = v.id_cliente
      JOIN empleado e ON e.id_empleado = v.id_empleado
      ORDER BY v.fecha_venta DESC;
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    res.status(500).json({
      mensaje: 'Error al obtener ventas'
    });
  }
};

// Obtener una venta con su detalle
const obtenerVentaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const ventaResult = await pool.query(`
      SELECT
        v.id_venta,
        v.fecha_venta,
        CONCAT(c.nombre, ' ', c.apellido) AS cliente,
        CONCAT(e.nombre, ' ', e.apellido) AS empleado,
        v.subtotal,
        v.descuento,
        v.total,
        v.estado,
        v.observaciones
      FROM venta v
      JOIN cliente c ON c.id_cliente = v.id_cliente
      JOIN empleado e ON e.id_empleado = v.id_empleado
      WHERE v.id_venta = $1;
    `, [id]);

    if (ventaResult.rows.length === 0) {
      return res.status(404).json({
        mensaje: 'Venta no encontrada'
      });
    }

    const detalleResult = await pool.query(`
      SELECT
        dv.id_detalle,
        dv.id_producto,
        p.nombre AS producto,
        m.nombre AS marca,
        dv.cantidad,
        dv.precio_unitario,
        dv.descuento_linea,
        dv.subtotal_linea
      FROM detalle_venta dv
      JOIN producto p ON p.id_producto = dv.id_producto
      JOIN marca m ON m.id_marca = p.id_marca
      WHERE dv.id_venta = $1
      ORDER BY dv.id_detalle;
    `, [id]);

    res.json({
      venta: ventaResult.rows[0],
      detalle: detalleResult.rows
    });
  } catch (error) {
    console.error('Error al obtener venta:', error);
    res.status(500).json({
      mensaje: 'Error al obtener venta'
    });
  }
};

// Crear venta con transacción explícita
const crearVenta = async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      id_cliente,
      id_empleado,
      productos,
      descuento = 0,
      observaciones = ''
    } = req.body;

    if (!id_cliente || !id_empleado || !productos || productos.length === 0) {
      return res.status(400).json({
        mensaje: 'Debe enviar cliente, empleado y al menos un producto'
      });
    }

    // Inicia la transacción
    await client.query('BEGIN');

    let subtotalVenta = 0;
    const detallesCalculados = [];

    // Valida stock y calcula subtotales
    for (const item of productos) {
      const { id_producto, cantidad, descuento_linea = 0 } = item;

      if (!id_producto || !cantidad || cantidad <= 0) {
        throw new Error('Producto o cantidad inválida');
      }

      const productoResult = await client.query(`
        SELECT
          id_producto,
          nombre,
          precio_venta,
          stock
        FROM producto
        WHERE id_producto = $1
          AND activo = TRUE
        FOR UPDATE;
      `, [id_producto]);

      if (productoResult.rows.length === 0) {
        throw new Error(`El producto con ID ${id_producto} no existe o está inactivo`);
      }

      const producto = productoResult.rows[0];

      if (Number(producto.stock) < Number(cantidad)) {
        throw new Error(`No hay stock suficiente para ${producto.nombre}`);
      }

      const precioUnitario = Number(producto.precio_venta);
      const descuentoLinea = Number(descuento_linea);
      const subtotalLinea = (precioUnitario * Number(cantidad)) - descuentoLinea;

      if (subtotalLinea < 0) {
        throw new Error(`El descuento de ${producto.nombre} no puede ser mayor al subtotal`);
      }

      subtotalVenta += subtotalLinea;

      detallesCalculados.push({
        id_producto,
        cantidad: Number(cantidad),
        precio_unitario: precioUnitario,
        descuento_linea: descuentoLinea,
        subtotal_linea: subtotalLinea
      });
    }

    const descuentoVenta = Number(descuento);
    const totalVenta = subtotalVenta - descuentoVenta;

    if (totalVenta < 0) {
      throw new Error('El descuento general no puede ser mayor al subtotal');
    }

    // Inserta encabezado de venta
    const ventaResult = await client.query(`
      INSERT INTO venta (
        id_cliente,
        id_empleado,
        subtotal,
        descuento,
        total,
        estado,
        observaciones
      )
      VALUES ($1, $2, $3, $4, $5, 'completada', $6)
      RETURNING id_venta, fecha_venta, subtotal, descuento, total, estado;
    `, [
      id_cliente,
      id_empleado,
      subtotalVenta,
      descuentoVenta,
      totalVenta,
      observaciones
    ]);

    const ventaCreada = ventaResult.rows[0];

    // Inserta detalle y descuenta stock
    for (const detalle of detallesCalculados) {
      await client.query(`
        INSERT INTO detalle_venta (
          id_venta,
          id_producto,
          cantidad,
          precio_unitario,
          descuento_linea,
          subtotal_linea
        )
        VALUES ($1, $2, $3, $4, $5, $6);
      `, [
        ventaCreada.id_venta,
        detalle.id_producto,
        detalle.cantidad,
        detalle.precio_unitario,
        detalle.descuento_linea,
        detalle.subtotal_linea
      ]);

      await client.query(`
        UPDATE producto
        SET stock = stock - $1
        WHERE id_producto = $2;
      `, [
        detalle.cantidad,
        detalle.id_producto
      ]);
    }

    // Confirma la transacción
    await client.query('COMMIT');

    res.status(201).json({
      mensaje: 'Venta registrada correctamente',
      venta: ventaCreada,
      detalle: detallesCalculados
    });
  } catch (error) {
    // Revierte todo si algo falla
    await client.query('ROLLBACK');

    console.error('Error al crear venta:', error);

    res.status(400).json({
      mensaje: error.message || 'Error al registrar la venta'
    });
  } finally {
    client.release();
  }
};

module.exports = {
  obtenerVentas,
  obtenerVentaPorId,
  crearVenta
};