const pool = require('../config/db');

// JOIN 1: productos con categoría, marca y proveedor
const obtenerProductosInventario = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id_producto,
        p.sku,
        p.nombre AS producto,
        c.nombre AS categoria,
        m.nombre AS marca,
        pr.nombre AS proveedor,
        p.precio_venta,
        p.stock,
        p.activo
      FROM producto p
      JOIN categoria c ON c.id_categoria = p.id_categoria
      JOIN marca m ON m.id_marca = p.id_marca
      JOIN proveedor pr ON pr.id_proveedor = p.id_proveedor
      ORDER BY p.id_producto;
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error en reporte de inventario:', error);
    res.status(500).json({
      mensaje: 'Error al obtener el reporte de inventario'
    });
  }
};

// JOIN 2: ventas con cliente y empleado
const obtenerVentasGenerales = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        v.id_venta,
        v.fecha_venta,
        CONCAT(c.nombre, ' ', c.apellido) AS cliente,
        CONCAT(e.nombre, ' ', e.apellido) AS empleado,
        v.total,
        v.estado
      FROM venta v
      JOIN cliente c ON c.id_cliente = v.id_cliente
      JOIN empleado e ON e.id_empleado = v.id_empleado
      ORDER BY v.fecha_venta DESC;
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error en reporte de ventas:', error);
    res.status(500).json({
      mensaje: 'Error al obtener el reporte de ventas'
    });
  }
};

// JOIN 3: detalle de productos vendidos
const obtenerDetalleVentas = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        dv.id_venta,
        p.nombre AS producto,
        m.nombre AS marca,
        dv.cantidad,
        dv.precio_unitario,
        dv.subtotal_linea
      FROM detalle_venta dv
      JOIN producto p ON p.id_producto = dv.id_producto
      JOIN marca m ON m.id_marca = p.id_marca
      ORDER BY dv.id_venta;
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error en detalle de ventas:', error);
    res.status(500).json({
      mensaje: 'Error al obtener el detalle de ventas'
    });
  }
};

// GROUP BY + HAVING: ventas por categoría
const obtenerVentasPorCategoria = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        c.nombre AS categoria,
        SUM(dv.cantidad) AS unidades_vendidas,
        SUM(dv.subtotal_linea) AS total_vendido
      FROM detalle_venta dv
      JOIN producto p ON p.id_producto = dv.id_producto
      JOIN categoria c ON c.id_categoria = p.id_categoria
      JOIN venta v ON v.id_venta = dv.id_venta
      WHERE v.estado = 'completada'
      GROUP BY c.nombre
      HAVING SUM(dv.subtotal_linea) > 500
      ORDER BY total_vendido DESC;
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error en ventas por categoría:', error);
    res.status(500).json({
      mensaje: 'Error al obtener ventas por categoría'
    });
  }
};

// CTE: productos más vendidos
const obtenerProductosMasVendidos = async (req, res) => {
  try {
    const result = await pool.query(`
      WITH ventas_por_producto AS (
        SELECT
          p.id_producto,
          p.nombre AS producto,
          m.nombre AS marca,
          SUM(dv.cantidad) AS unidades_vendidas,
          SUM(dv.subtotal_linea) AS total_vendido
        FROM detalle_venta dv
        JOIN producto p ON p.id_producto = dv.id_producto
        JOIN marca m ON m.id_marca = p.id_marca
        JOIN venta v ON v.id_venta = dv.id_venta
        WHERE v.estado = 'completada'
        GROUP BY p.id_producto, p.nombre, m.nombre
      )
      SELECT
        producto,
        marca,
        unidades_vendidas,
        total_vendido
      FROM ventas_por_producto
      ORDER BY unidades_vendidas DESC, total_vendido DESC;
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error en productos más vendidos:', error);
    res.status(500).json({
      mensaje: 'Error al obtener productos más vendidos'
    });
  }
};

// VIEW: productos con stock bajo
const obtenerStockBajo = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id_producto,
        sku,
        producto,
        categoria,
        marca,
        stock,
        stock_minimo,
        unidades_faltantes
      FROM v_stock_bajo
      ORDER BY unidades_faltantes DESC;
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error en stock bajo:', error);
    res.status(500).json({
      mensaje: 'Error al obtener productos con stock bajo'
    });
  }
};

// VIEW: resumen de ventas diarias
const obtenerVentasDiarias = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        dia,
        num_ventas,
        ingreso_total,
        ticket_promedio
      FROM v_ventas_diarias
      ORDER BY dia DESC;
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error en ventas diarias:', error);
    res.status(500).json({
      mensaje: 'Error al obtener ventas diarias'
    });
  }
};

module.exports = {
  obtenerProductosInventario,
  obtenerVentasGenerales,
  obtenerDetalleVentas,
  obtenerVentasPorCategoria,
  obtenerProductosMasVendidos,
  obtenerStockBajo,
  obtenerVentasDiarias
};