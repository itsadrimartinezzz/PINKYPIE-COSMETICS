-- 1. CONSULTAS CON JOIN


-- JOIN 1: Listado de productos con su categoría, marca y proveedor

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

-- JOIN 2:Listado de ventas con el cliente y el empleado que atendio

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

-- JOIN 3:Detalle de productos vendidos por venta

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


-- 2. GROUP BY, HAVING Y FUNCIONES DE AGREGACIÓN

-- Muestra las Ventas por categoria y que categorías han generado más ingresos

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


-- 3. CONSULTA CON WITH

-- muestra los productos con más unidades vendidas
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


-- 4. CONSULTAS USANDO VIEW

-- Consulta productos con stock bajo para mostrar alertas de inventario 
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


-- Consulta el resumen de ventas diarias para mostrar ingresos y cantidad de ventas por día 
SELECT
    dia,
    num_ventas,
    ingreso_total,
    ticket_promedio
FROM v_ventas_diarias
ORDER BY dia DESC;




-- 5. TRANSACCIÓN DE REFERENCIA

BEGIN;

-- 1. Validar y bloquear producto para evitar cambios simultáneos
SELECT 
    id_producto, 
    nombre, 
    precio_venta, 
    stock
FROM producto
WHERE id_producto = 1
  AND activo = TRUE
FOR UPDATE;

-- 2. Insertar encabezado de venta
INSERT INTO venta (
    id_cliente,
    id_empleado,
    subtotal,
    descuento,
    total,
    estado,
    observaciones
)
VALUES (
    1,
    2,
    385.00,
    0.00,
    385.00,
    'completada',
    'Venta de ejemplo registrada con transacción'
)
RETURNING id_venta;

-- 3. Insertar detalle de venta
INSERT INTO detalle_venta (
    id_venta,
    id_producto,
    cantidad,
    precio_unitario,
    descuento_linea,
    subtotal_linea
)
VALUES (
    currval('venta_id_venta_seq'),
    1,
    1,
    385.00,
    0.00,
    385.00
);

-- 4. Descontar stock del producto vendido
UPDATE producto
SET stock = stock - 1
WHERE id_producto = 1
  AND stock >= 1;

COMMIT;

-- Si ocurre un error en cualquier paso, se ejecuta:
-- ROLLBACK;