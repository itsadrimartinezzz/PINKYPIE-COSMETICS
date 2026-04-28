-- Búsquedas frecuentes de productos por nombre
CREATE INDEX idx_producto_nombre
ON producto(nombre);

-- Filtro de productos por categoría
CREATE INDEX idx_producto_categoria
ON producto(id_categoria);

-- Reportes e historial de ventas por fecha
CREATE INDEX idx_venta_fecha
ON venta(fecha_venta);

-- Historial de compras por cliente
CREATE INDEX idx_venta_cliente
ON venta(id_cliente);

-- JOIN frecuente entre detalle_venta y venta
CREATE INDEX idx_detalle_venta_id
ON detalle_venta(id_venta);

-- Reportes de stock bajo
CREATE INDEX idx_producto_stock
ON producto(stock);