
-- Limpiar roles existentes si existen
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'role_admin') THEN
        DROP ROLE role_admin;
    END IF;
    IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'role_gerente') THEN
        DROP ROLE role_gerente;
    END IF;
    IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'role_vendedor') THEN
        DROP ROLE role_vendedor;
    END IF;
    IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'role_inventario') THEN
        DROP ROLE role_inventario;
    END IF;
    IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'role_consulta') THEN
        DROP ROLE role_consulta;
    END IF;
END $$;

REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM PUBLIC;
REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM PUBLIC;

-- 1. ROL: ADMINISTRADOR

CREATE ROLE role_admin;

GRANT ALL PRIVILEGES ON TABLE categoria TO role_admin;
GRANT ALL PRIVILEGES ON TABLE marca TO role_admin;
GRANT ALL PRIVILEGES ON TABLE proveedor TO role_admin;
GRANT ALL PRIVILEGES ON TABLE producto TO role_admin;
GRANT ALL PRIVILEGES ON TABLE cliente TO role_admin;
GRANT ALL PRIVILEGES ON TABLE empleado TO role_admin;
GRANT ALL PRIVILEGES ON TABLE usuario TO role_admin;
GRANT ALL PRIVILEGES ON TABLE venta TO role_admin;
GRANT ALL PRIVILEGES ON TABLE detalle_venta TO role_admin;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO role_admin;

GRANT SELECT ON v_stock_bajo TO role_admin;
GRANT SELECT ON v_ventas_diarias TO role_admin;

COMMENT ON ROLE role_admin IS 'Administrador con acceso total';

-- 2. ROL: GERENTE

CREATE ROLE role_gerente;

GRANT SELECT ON TABLE categoria TO role_gerente;
GRANT SELECT ON TABLE marca TO role_gerente;
GRANT SELECT ON TABLE proveedor TO role_gerente;
GRANT SELECT ON TABLE producto TO role_gerente;
GRANT SELECT ON TABLE cliente TO role_gerente;
GRANT SELECT ON TABLE empleado TO role_gerente;
GRANT SELECT ON TABLE usuario TO role_gerente;
GRANT SELECT ON TABLE venta TO role_gerente;
GRANT SELECT ON TABLE detalle_venta TO role_gerente;

GRANT INSERT, UPDATE, DELETE ON TABLE categoria TO role_gerente;
GRANT INSERT, UPDATE, DELETE ON TABLE marca TO role_gerente;
GRANT INSERT, UPDATE, DELETE ON TABLE proveedor TO role_gerente;
GRANT INSERT, UPDATE, DELETE ON TABLE producto TO role_gerente;

GRANT INSERT, UPDATE ON TABLE cliente TO role_gerente;
GRANT INSERT, UPDATE ON TABLE empleado TO role_gerente;

GRANT UPDATE ON TABLE venta TO role_gerente;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO role_gerente;

GRANT SELECT ON v_stock_bajo TO role_gerente;
GRANT SELECT ON v_ventas_diarias TO role_gerente;

COMMENT ON ROLE role_gerente IS 'Gerente de tienda - Gestión y reportes';

-- 3. ROL: VENDEDOR

CREATE ROLE role_vendedor;

GRANT SELECT ON TABLE categoria TO role_vendedor;
GRANT SELECT ON TABLE marca TO role_vendedor;
GRANT SELECT ON TABLE producto TO role_vendedor;

GRANT SELECT, INSERT ON TABLE cliente TO role_vendedor;

GRANT SELECT, INSERT ON TABLE venta TO role_vendedor;
GRANT SELECT, INSERT ON TABLE detalle_venta TO role_vendedor;

GRANT SELECT ON TABLE empleado TO role_vendedor;

GRANT USAGE, SELECT ON SEQUENCE venta_id_venta_seq TO role_vendedor;
GRANT USAGE, SELECT ON SEQUENCE detalle_venta_id_detalle_seq TO role_vendedor;
GRANT USAGE, SELECT ON SEQUENCE cliente_id_cliente_seq TO role_vendedor;

GRANT SELECT ON v_ventas_diarias TO role_vendedor;

COMMENT ON ROLE role_vendedor IS 'Vendedor - Operaciones de venta';


-- 4. ROL: INVENTARIO

CREATE ROLE role_inventario;

GRANT SELECT, INSERT, UPDATE ON TABLE categoria TO role_inventario;
GRANT SELECT, INSERT, UPDATE ON TABLE marca TO role_inventario;
GRANT SELECT ON TABLE proveedor TO role_inventario;
GRANT SELECT, INSERT, UPDATE ON TABLE producto TO role_inventario;

GRANT USAGE, SELECT ON SEQUENCE categoria_id_categoria_seq TO role_inventario;
GRANT USAGE, SELECT ON SEQUENCE marca_id_marca_seq TO role_inventario;
GRANT USAGE, SELECT ON SEQUENCE producto_id_producto_seq TO role_inventario;

GRANT SELECT ON v_stock_bajo TO role_inventario;

COMMENT ON ROLE role_inventario IS 'Encargado de inventario';


-- 5. ROL: CONSULTA

CREATE ROLE role_consulta;

GRANT SELECT ON TABLE categoria TO role_consulta;
GRANT SELECT ON TABLE marca TO role_consulta;
GRANT SELECT ON TABLE proveedor TO role_consulta;
GRANT SELECT ON TABLE producto TO role_consulta;
GRANT SELECT ON TABLE cliente TO role_consulta;
GRANT SELECT ON TABLE empleado TO role_consulta;
GRANT SELECT ON TABLE venta TO role_consulta;
GRANT SELECT ON TABLE detalle_venta TO role_consulta;

GRANT SELECT ON v_stock_bajo TO role_consulta;
GRANT SELECT ON v_ventas_diarias TO role_consulta;

COMMENT ON ROLE role_consulta IS 'Solo lectura - Auditoría';


-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE 'ROLES CREADOS EXITOSAMENTE';
    RAISE NOTICE 'role_admin - Administrador total';
    RAISE NOTICE 'role_gerente - Gestión y reportes';
    RAISE NOTICE 'role_vendedor - Operaciones de venta';
    RAISE NOTICE 'role_inventario - Control de stock';
    RAISE NOTICE 'role_consulta - Solo lectura';
END $$;