--  Vistas para reportes y dashboard
CREATE OR REPLACE VIEW v_stock_bajo AS
SELECT
    p.id_producto,
    p.sku,
    p.nombre AS producto,
    c.nombre AS categoria,
    m.nombre AS marca,
    p.stock,
    p.stock_minimo,
    (p.stock_minimo - p.stock) AS unidades_faltantes
FROM producto p
JOIN categoria c ON c.id_categoria = p.id_categoria
JOIN marca m ON m.id_marca = p.id_marca
WHERE p.stock <= p.stock_minimo
  AND p.activo = TRUE;

CREATE OR REPLACE VIEW v_ventas_diarias AS
SELECT
    DATE(fecha_venta) AS dia,
    COUNT(*) AS num_ventas,
    SUM(total) AS ingreso_total,
    AVG(total) AS ticket_promedio
FROM venta
WHERE estado = 'completada'
GROUP BY DATE(fecha_venta);