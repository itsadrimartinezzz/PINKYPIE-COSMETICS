-- ========================================
-- USUARIOS DE PRUEBA CON ROLES ASIGNADOS
-- PINKYPIE MAKEUP STORE
-- ========================================

DO $$ 
BEGIN
    PERFORM pg_terminate_backend(pid) 
    FROM pg_stat_activity 
    WHERE usename IN ('admin_user', 'gerente_user', 'vendedor_user', 'inventario_user', 'consulta_user')
    AND pid <> pg_backend_pid();

    IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'admin_user') THEN
        DROP USER admin_user;
    END IF;
    IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'gerente_user') THEN
        DROP USER gerente_user;
    END IF;
    IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'vendedor_user') THEN
        DROP USER vendedor_user;
    END IF;
    IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'inventario_user') THEN
        DROP USER inventario_user;
    END IF;
    IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'consulta_user') THEN
        DROP USER consulta_user;
    END IF;
END $$;


CREATE USER admin_user WITH PASSWORD 'admin123' LOGIN;
GRANT role_admin TO admin_user;
GRANT CREATE ON SCHEMA public TO admin_user;

CREATE USER gerente_user WITH PASSWORD 'gerente123' LOGIN;
GRANT role_gerente TO gerente_user;

CREATE USER vendedor_user WITH PASSWORD 'vendedor123' LOGIN;
GRANT role_vendedor TO vendedor_user;

CREATE USER inventario_user WITH PASSWORD 'inventario123' LOGIN;
GRANT role_inventario TO inventario_user;

CREATE USER consulta_user WITH PASSWORD 'consulta123' LOGIN;
GRANT role_consulta TO consulta_user;


GRANT CONNECT ON DATABASE "PINKYPIE" TO admin_user;
GRANT CONNECT ON DATABASE "PINKYPIE" TO gerente_user;
GRANT CONNECT ON DATABASE "PINKYPIE" TO vendedor_user;
GRANT CONNECT ON DATABASE "PINKYPIE" TO inventario_user;
GRANT CONNECT ON DATABASE "PINKYPIE" TO consulta_user;

GRANT USAGE ON SCHEMA public TO admin_user;
GRANT USAGE ON SCHEMA public TO gerente_user;
GRANT USAGE ON SCHEMA public TO vendedor_user;
GRANT USAGE ON SCHEMA public TO inventario_user;
GRANT USAGE ON SCHEMA public TO consulta_user;


DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'USUARIOS POSTGRESQL CREADOS';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'admin_user / admin123';
    RAISE NOTICE 'gerente_user / gerente123';
    RAISE NOTICE 'vendedor_user / vendedor123';
    RAISE NOTICE 'inventario_user / inventario123';
    RAISE NOTICE 'consulta_user / consulta123';
    RAISE NOTICE '========================================';
END $$;