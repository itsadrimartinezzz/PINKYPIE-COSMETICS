-- RELACIÓN ENTRE USUARIOS DE APP Y ROLES DE BD

UPDATE usuario
SET rol_bd = 'role_admin'
WHERE username = 'admin';

UPDATE usuario
SET rol_bd = 'role_gerente'
WHERE username = 'gerente';

UPDATE usuario
SET rol_bd = 'role_vendedor'
WHERE username = 'vendedor';

UPDATE usuario
SET rol_bd = 'role_inventario'
WHERE username = 'inventario';

UPDATE usuario
SET rol_bd = 'role_consulta'
WHERE username = 'consulta';

DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'ROLES BD ASIGNADOS A USUARIOS DE APP';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'admin -> role_admin';
    RAISE NOTICE 'gerente -> role_gerente';
    RAISE NOTICE 'vendedor -> role_vendedor';
    RAISE NOTICE 'inventario -> role_inventario';
    RAISE NOTICE 'consulta -> role_consulta';
    RAISE NOTICE '========================================';
END $$;