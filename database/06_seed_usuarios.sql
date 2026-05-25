-- ========================================
-- USUARIOS DE LA APLICACIÓN
-- PINKYPIE MAKEUP STORE - PROYECTO 3
-- ========================================

-- Empleados para cada rol
INSERT INTO empleado (nombre, apellido, email, telefono, puesto, fecha_contratacion, activo) 
VALUES 
('Carlos', 'Rodríguez', 'carlos.admin@pinkypie.com', '5551-1111', 'Administrador General', '2020-01-15', true),
('Ana', 'Martínez', 'ana.gerente@pinkypie.com', '5551-2222', 'Gerente de Tienda', '2021-03-10', true),
('María', 'López', 'maria.vendedor@pinkypie.com', '5551-3333', 'Vendedor', '2022-06-20', true),
('Pedro', 'García', 'pedro.inventario@pinkypie.com', '5551-4444', 'Encargado de Inventario', '2021-08-05', true),
('Laura', 'Fernández', 'laura.consulta@pinkypie.com', '5551-5555', 'Analista de Datos', '2023-01-12', true)
ON CONFLICT (email) DO NOTHING;


-- Usuarios de la aplicación
-- Password para todos: admin123, gerente123, vendedor123, inventario123, consulta123
-- Hash bcrypt: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

INSERT INTO usuario (id_empleado, username, password_hash, rol, rol_bd, activo) 
VALUES 
(
    (SELECT id_empleado FROM empleado WHERE email = 'carlos.admin@pinkypie.com'),
    'admin', 
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'admin',
    'role_admin',
    true
),
(
    (SELECT id_empleado FROM empleado WHERE email = 'ana.gerente@pinkypie.com'),
    'gerente', 
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'gerente',
    'role_gerente',
    true
),
(
    (SELECT id_empleado FROM empleado WHERE email = 'maria.vendedor@pinkypie.com'),
    'vendedor', 
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'vendedor',
    'role_vendedor',
    true
),
(
    (SELECT id_empleado FROM empleado WHERE email = 'pedro.inventario@pinkypie.com'),
    'inventario', 
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'inventario',
    'role_inventario',
    true
),
(
    (SELECT id_empleado FROM empleado WHERE email = 'laura.consulta@pinkypie.com'),
    'consulta', 
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'consulta',
    'role_consulta',
    true
)
ON CONFLICT (username) DO UPDATE 
SET rol_bd = EXCLUDED.rol_bd;


DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'USUARIOS DE APLICACIÓN CREADOS';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'CREDENCIALES DE LOGIN:';
    RAISE NOTICE 'admin / admin123';
    RAISE NOTICE 'gerente / gerente123';
    RAISE NOTICE 'vendedor / vendedor123';
    RAISE NOTICE 'inventario / inventario123';
    RAISE NOTICE 'consulta / consulta123';
    RAISE NOTICE '========================================';
END $$;