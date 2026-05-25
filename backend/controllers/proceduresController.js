const pool = require('../config/db');

// SP 1: Registrar venta completa
// Invoca: sp_registrar_venta(p_id_cliente, p_id_empleado, p_items)
const registrarVentaSP = async (req, res) => {
  try {
    const {
      id_cliente,
      id_empleado,
      productos
    } = req.body;

    if (!id_cliente || !id_empleado || !productos || productos.length === 0) {
      return res.status(400).json({
        mensaje: 'Debe enviar id_cliente, id_empleado y al menos un producto'
      });
    }

    const result = await pool.query(
      `
      SELECT *
      FROM sp_registrar_venta($1, $2, $3::json);
      `,
      [
        id_cliente,
        id_empleado,
        JSON.stringify(productos)
      ]
    );

    res.status(201).json({
      mensaje: 'Stored procedure sp_registrar_venta ejecutado correctamente',
      resultado: result.rows[0]
    });
  } catch (error) {
    console.error('Error al ejecutar sp_registrar_venta:', error);

    res.status(400).json({
      mensaje: error.message || 'Error al registrar venta mediante stored procedure'
    });
  }
};

// SP 2: Actualizar stock
// Invoca: sp_actualizar_stock(p_id_producto, p_cantidad, p_tipo_movimiento)
const actualizarStockSP = async (req, res) => {
  try {
    const {
      id_producto,
      cantidad,
      tipo_movimiento
    } = req.body;

    if (!id_producto || !cantidad || !tipo_movimiento) {
      return res.status(400).json({
        mensaje: 'Debe enviar id_producto, cantidad y tipo_movimiento'
      });
    }

    const result = await pool.query(
      `
      SELECT *
      FROM sp_actualizar_stock($1, $2, $3);
      `,
      [
        id_producto,
        cantidad,
        tipo_movimiento
      ]
    );

    res.json({
      mensaje: 'Stored procedure sp_actualizar_stock ejecutado correctamente',
      resultado: result.rows[0]
    });
  } catch (error) {
    console.error('Error al ejecutar sp_actualizar_stock:', error);

    res.status(400).json({
      mensaje: error.message || 'Error al actualizar stock mediante stored procedure'
    });
  }
};

// SP 3: Anular venta
// Invoca: sp_anular_venta(p_id_venta)
const anularVentaSP = async (req, res) => {
  try {
    const { id_venta } = req.body;

    if (!id_venta) {
      return res.status(400).json({
        mensaje: 'Debe enviar id_venta'
      });
    }

    const result = await pool.query(
      `
      SELECT *
      FROM sp_anular_venta($1);
      `,
      [id_venta]
    );

    res.json({
      mensaje: 'Stored procedure sp_anular_venta ejecutado correctamente',
      resultado: result.rows[0]
    });
  } catch (error) {
    console.error('Error al ejecutar sp_anular_venta:', error);

    res.status(400).json({
      mensaje: error.message || 'Error al anular venta mediante stored procedure'
    });
  }
};

// SP 4: Reporte de ventas por período
// Invoca: sp_reporte_ventas_periodo(p_fecha_inicio, p_fecha_fin)
const reporteVentasPeriodoSP = async (req, res) => {
  try {
    const {
      fecha_inicio,
      fecha_fin
    } = req.query;

    if (!fecha_inicio || !fecha_fin) {
      return res.status(400).json({
        mensaje: 'Debe enviar fecha_inicio y fecha_fin como query params'
      });
    }

    const result = await pool.query(
      `
      SELECT *
      FROM sp_reporte_ventas_periodo($1, $2);
      `,
      [
        fecha_inicio,
        fecha_fin
      ]
    );

    res.json({
      mensaje: 'Stored procedure sp_reporte_ventas_periodo ejecutado correctamente',
      resultado: result.rows
    });
  } catch (error) {
    console.error('Error al ejecutar sp_reporte_ventas_periodo:', error);

    res.status(500).json({
      mensaje: 'Error al generar reporte mediante stored procedure'
    });
  }
};

// SP 5: Productos con stock bajo
// Invoca: sp_productos_bajo_stock()
const productosBajoStockSP = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM sp_productos_bajo_stock();
      `
    );

    res.json({
      mensaje: 'Stored procedure sp_productos_bajo_stock ejecutado correctamente',
      resultado: result.rows
    });
  } catch (error) {
    console.error('Error al ejecutar sp_productos_bajo_stock:', error);

    res.status(500).json({
      mensaje: 'Error al obtener productos con bajo stock mediante stored procedure'
    });
  }
};

module.exports = {
  registrarVentaSP,
  actualizarStockSP,
  anularVentaSP,
  reporteVentasPeriodoSP,
  productosBajoStockSP
};