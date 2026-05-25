-- PROYECTO 3 - STORED PROCEDURES
-- PINKYPIE MAKEUP STORE
-- Stored Procedures para operaciones críticas del negocio

-- ============================================================
-- STORED PROCEDURE 1: REGISTRAR VENTA COMPLETA
-- ============================================================
-- Propósito: Registra una venta con múltiples productos, valida stock,
--            actualiza inventario y maneja errores automáticamente.
--
-- Flujo:
--   1. Valida que cliente y empleado existan
--   2. Crea el encabezado de la venta
--   3. Por cada producto:
--      - Verifica que exista y tenga stock suficiente
--      - Inserta el detalle de venta
--      - Descuenta del inventario
--   4. Actualiza los totales de la venta
--
-- En caso de error en cualquier paso, se revierte TODA la operación (ROLLBACK)

CREATE OR REPLACE FUNCTION sp_registrar_venta(
    p_id_cliente INT,
    p_id_empleado INT,
    p_items JSON,
    OUT p_id_venta INT,
    OUT p_total NUMERIC,
    OUT p_mensaje TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_item JSON;
    v_id_producto INT;
    v_cantidad INT;
    v_precio NUMERIC;
    v_subtotal NUMERIC;
    v_stock_actual INT;
BEGIN
    -- Validar que el cliente existe
    IF NOT EXISTS (SELECT 1 FROM cliente WHERE id_cliente = p_id_cliente) THEN
        RAISE EXCEPTION 'El cliente con ID % no existe', p_id_cliente;
    END IF;

    -- Validar que el empleado existe y está activo
    IF NOT EXISTS (SELECT 1 FROM empleado WHERE id_empleado = p_id_empleado AND activo = TRUE) THEN
        RAISE EXCEPTION 'El empleado con ID % no existe o está inactivo', p_id_empleado;
    END IF;

    -- Inicializar el total en cero
    p_total := 0;

    -- Crear el encabezado de la venta
    INSERT INTO venta (id_cliente, id_empleado, subtotal, descuento, total, estado)
    VALUES (p_id_cliente, p_id_empleado, 0, 0, 0, 'completada')
    RETURNING id_venta INTO p_id_venta;

    -- Procesar cada producto del carrito (viene en formato JSON)
    FOR v_item IN SELECT * FROM json_array_elements(p_items)
    LOOP
        v_id_producto := (v_item->>'id_producto')::INT;
        v_cantidad := (v_item->>'cantidad')::INT;

        -- Obtener precio y stock actual del producto
        SELECT precio_venta, stock 
        INTO v_precio, v_stock_actual
        FROM producto 
        WHERE id_producto = v_id_producto AND activo = TRUE;

        -- Validar que el producto existe y está activo
        IF v_precio IS NULL THEN
            RAISE EXCEPTION 'El producto con ID % no existe o está inactivo', v_id_producto;
        END IF;

        -- Validar que hay suficiente stock
        IF v_stock_actual < v_cantidad THEN
            RAISE EXCEPTION 'Stock insuficiente para producto ID %. Disponible: %, Solicitado: %', 
                v_id_producto, v_stock_actual, v_cantidad;
        END IF;

        -- Calcular el subtotal de esta línea
        v_subtotal := v_precio * v_cantidad;
        p_total := p_total + v_subtotal;

        -- Insertar el detalle de la venta
        INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario, descuento_linea, subtotal_linea)
        VALUES (p_id_venta, v_id_producto, v_cantidad, v_precio, 0, v_subtotal);

        -- Descontar del inventario
        UPDATE producto 
        SET stock = stock - v_cantidad 
        WHERE id_producto = v_id_producto;
    END LOOP;

    -- Actualizar los totales en el encabezado de la venta
    UPDATE venta 
    SET subtotal = p_total, total = p_total 
    WHERE id_venta = p_id_venta;

    p_mensaje := 'Venta registrada exitosamente';

EXCEPTION
    WHEN OTHERS THEN
        -- Si ocurre cualquier error, PostgreSQL hace ROLLBACK automático
        -- y devolvemos valores nulos para indicar fallo
        p_id_venta := NULL;
        p_total := 0;
        p_mensaje := 'ERROR: ' || SQLERRM;
        RAISE;
END;
$$;

COMMENT ON FUNCTION sp_registrar_venta IS 'Registra una venta completa con validaciones y control de stock';


-- ============================================================
-- STORED PROCEDURE 2: ACTUALIZAR STOCK DE PRODUCTO
-- ============================================================
-- Propósito: Actualiza el inventario de un producto, ya sea entrada
--            (compra a proveedor) o salida (ajuste de inventario).
--            Valida que no quede en negativo y alerta si está bajo el mínimo.

CREATE OR REPLACE FUNCTION sp_actualizar_stock(
    p_id_producto INT,
    p_cantidad INT,
    p_tipo_movimiento VARCHAR(10),  -- 'ENTRADA' o 'SALIDA'
    OUT p_stock_nuevo INT,
    OUT p_mensaje TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_stock_actual INT;
    v_stock_minimo INT;
BEGIN
    -- Validar que el tipo de movimiento sea correcto
    IF p_tipo_movimiento NOT IN ('ENTRADA', 'SALIDA') THEN
        RAISE EXCEPTION 'Tipo de movimiento inválido. Use ENTRADA o SALIDA';
    END IF;

    -- Obtener el stock actual y el stock mínimo configurado
    SELECT stock, stock_minimo 
    INTO v_stock_actual, v_stock_minimo
    FROM producto 
    WHERE id_producto = p_id_producto AND activo = TRUE;

    -- Validar que el producto existe
    IF v_stock_actual IS NULL THEN
        RAISE EXCEPTION 'El producto con ID % no existe o está inactivo', p_id_producto;
    END IF;

    -- Calcular el nuevo stock según el tipo de movimiento
    IF p_tipo_movimiento = 'ENTRADA' THEN
        p_stock_nuevo := v_stock_actual + p_cantidad;
    ELSE  -- SALIDA
        p_stock_nuevo := v_stock_actual - p_cantidad;
        
        -- No permitir stock negativo
        IF p_stock_nuevo < 0 THEN
            RAISE EXCEPTION 'Stock insuficiente. Actual: %, Solicitado: %', v_stock_actual, p_cantidad;
        END IF;
    END IF;

    -- Actualizar el stock en la base de datos
    UPDATE producto 
    SET stock = p_stock_nuevo 
    WHERE id_producto = p_id_producto;

    -- Generar mensaje de advertencia si quedó bajo el mínimo
    IF p_stock_nuevo <= v_stock_minimo THEN
        p_mensaje := FORMAT('ADVERTENCIA: Stock bajo mínimo. Actual: %s, Mínimo: %s', p_stock_nuevo, v_stock_minimo);
    ELSE
        p_mensaje := FORMAT('Stock actualizado correctamente. Nuevo stock: %s', p_stock_nuevo);
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        p_stock_nuevo := v_stock_actual;
        p_mensaje := 'ERROR: ' || SQLERRM;
        RAISE;
END;
$$;

COMMENT ON FUNCTION sp_actualizar_stock IS 'Actualiza stock de producto con validaciones';


-- ============================================================
-- STORED PROCEDURE 3: ANULAR VENTA
-- ============================================================
-- Propósito: Anula una venta completada y devuelve todos los productos
--            vendidos al inventario. Útil para devoluciones o cancelaciones.

CREATE OR REPLACE FUNCTION sp_anular_venta(
    p_id_venta INT,
    OUT p_mensaje TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_estado_actual VARCHAR(20);
    v_detalle RECORD;
BEGIN
    -- Obtener el estado actual de la venta
    SELECT estado INTO v_estado_actual
    FROM venta 
    WHERE id_venta = p_id_venta;

    -- Validar que la venta existe
    IF v_estado_actual IS NULL THEN
        RAISE EXCEPTION 'La venta con ID % no existe', p_id_venta;
    END IF;

    -- Validar que no esté ya anulada (no se puede anular dos veces)
    IF v_estado_actual = 'anulada' THEN
        RAISE EXCEPTION 'La venta ID % ya está anulada', p_id_venta;
    END IF;

    -- Devolver el stock de cada producto que se vendió
    FOR v_detalle IN 
        SELECT id_producto, cantidad 
        FROM detalle_venta 
        WHERE id_venta = p_id_venta
    LOOP
        UPDATE producto 
        SET stock = stock + v_detalle.cantidad 
        WHERE id_producto = v_detalle.id_producto;
    END LOOP;

    -- Marcar la venta como anulada
    UPDATE venta 
    SET estado = 'anulada' 
    WHERE id_venta = p_id_venta;

    p_mensaje := FORMAT('Venta ID %s anulada exitosamente. Stock devuelto al inventario', p_id_venta);

EXCEPTION
    WHEN OTHERS THEN
        p_mensaje := 'ERROR: ' || SQLERRM;
        RAISE;
END;
$$;

COMMENT ON FUNCTION sp_anular_venta IS 'Anula una venta y devuelve stock al inventario';


-- ============================================================
-- STORED PROCEDURE 4: REPORTE DE VENTAS POR PERÍODO
-- ============================================================
-- Propósito: Genera un reporte de ventas agrupado por día dentro de
--            un rango de fechas. Útil para análisis de tendencias y dashboards.
--
-- Retorna una tabla con: fecha, cantidad de ventas, monto total,
--                        ticket promedio y productos vendidos

CREATE OR REPLACE FUNCTION sp_reporte_ventas_periodo(
    p_fecha_inicio DATE,
    p_fecha_fin DATE
)
RETURNS TABLE(
    fecha DATE,
    total_ventas BIGINT,
    monto_total NUMERIC,
    ticket_promedio NUMERIC,
    productos_vendidos BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        DATE(v.fecha_venta) as fecha,
        COUNT(DISTINCT v.id_venta)::BIGINT as total_ventas,
        COALESCE(SUM(v.total), 0) as monto_total,
        COALESCE(AVG(v.total), 0) as ticket_promedio,
        COALESCE(SUM(dv.cantidad), 0)::BIGINT as productos_vendidos
    FROM venta v
    LEFT JOIN detalle_venta dv ON dv.id_venta = v.id_venta
    WHERE v.estado = 'completada'
      AND DATE(v.fecha_venta) BETWEEN p_fecha_inicio AND p_fecha_fin
    GROUP BY DATE(v.fecha_venta)
    ORDER BY fecha DESC;
END;
$$;

COMMENT ON FUNCTION sp_reporte_ventas_periodo IS 'Genera reporte de ventas por período de fechas';


-- ============================================================
-- STORED PROCEDURE 5: PRODUCTOS CON STOCK BAJO
-- ============================================================
-- Propósito: Identifica productos que están en o debajo de su stock mínimo.
--            Útil para alertas de reorden y gestión de inventario.
--
-- Retorna una tabla con información del producto, stock actual,
--         stock mínimo, faltante y datos del proveedor

CREATE OR REPLACE FUNCTION sp_productos_bajo_stock()
RETURNS TABLE(
    id_producto INT,
    nombre VARCHAR,
    stock_actual INT,
    stock_minimo INT,
    faltante INT,
    categoria VARCHAR,
    proveedor VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id_producto,
        p.nombre,
        p.stock as stock_actual,
        p.stock_minimo,
        (p.stock_minimo - p.stock) as faltante,
        c.nombre as categoria,
        pr.nombre as proveedor
    FROM producto p
    JOIN categoria c ON c.id_categoria = p.id_categoria
    JOIN proveedor pr ON pr.id_proveedor = p.id_proveedor
    WHERE p.stock <= p.stock_minimo
      AND p.activo = TRUE
    ORDER BY faltante DESC;
END;
$$;

COMMENT ON FUNCTION sp_productos_bajo_stock IS 'Lista productos con stock crítico';


-- Mensaje de confirmación al ejecutar el script
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE 'STORED PROCEDURES CREADOS EXITOSAMENTE';
    RAISE NOTICE '';
    RAISE NOTICE 'Procedimientos disponibles:';
    RAISE NOTICE '  1. sp_registrar_venta - Procesa ventas completas con validaciones';
    RAISE NOTICE '  2. sp_actualizar_stock - Gestiona entradas y salidas de inventario';
    RAISE NOTICE '  3. sp_anular_venta - Cancela ventas y restaura inventario';
    RAISE NOTICE '  4. sp_reporte_ventas_periodo - Análisis de ventas por fechas';
    RAISE NOTICE '  5. sp_productos_bajo_stock - Alertas de reorden de inventario';
    RAISE NOTICE '';
    RAISE NOTICE '';
END $$;