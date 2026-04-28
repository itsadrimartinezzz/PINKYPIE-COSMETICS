-- Para  ejecutar el script varias veces
DROP VIEW IF EXISTS v_stock_bajo;
DROP VIEW IF EXISTS v_ventas_diarias;

DROP TABLE IF EXISTS detalle_venta;
DROP TABLE IF EXISTS venta;
DROP TABLE IF EXISTS usuario;
DROP TABLE IF EXISTS empleado;
DROP TABLE IF EXISTS cliente;
DROP TABLE IF EXISTS producto;
DROP TABLE IF EXISTS proveedor;
DROP TABLE IF EXISTS marca;
DROP TABLE IF EXISTS categoria;


-- 1. CATEGORIA
-- Agrupa los productos de maquillaje
CREATE TABLE categoria (
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT
);

-- 2. MARCA
CREATE TABLE marca (
    id_marca SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    pais_origen VARCHAR(100) NOT NULL,
    descripcion TEXT
);

-- 3. PROVEEDOR
CREATE TABLE proveedor (
    id_proveedor SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    direccion TEXT NOT NULL,
    nit VARCHAR(20) NOT NULL UNIQUE
);

-- 4. PRODUCTO

CREATE TABLE producto (
    id_producto SERIAL PRIMARY KEY,
    id_categoria INT NOT NULL,
    id_marca INT NOT NULL,
    id_proveedor INT NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    precio_compra NUMERIC(10,2) NOT NULL CHECK (precio_compra >= 0),
    precio_venta NUMERIC(10,2) NOT NULL CHECK (precio_venta >= 0),
    stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    stock_minimo INT NOT NULL DEFAULT 5 CHECK (stock_minimo >= 0),
    sku VARCHAR(50) NOT NULL UNIQUE,
    imagen VARCHAR(255),
    activo BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT fk_prod_categoria 
        FOREIGN KEY (id_categoria) 
        REFERENCES categoria(id_categoria),

    CONSTRAINT fk_prod_marca 
        FOREIGN KEY (id_marca) 
        REFERENCES marca(id_marca),

    CONSTRAINT fk_prod_proveedor 
        FOREIGN KEY (id_proveedor) 
        REFERENCES proveedor(id_proveedor)
);

-- 5. CLIENTE

CREATE TABLE cliente (
    id_cliente SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    direccion TEXT,
    fecha_registro DATE NOT NULL DEFAULT CURRENT_DATE
);

-- 6. EMPLEADO

CREATE TABLE empleado (
    id_empleado SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    puesto VARCHAR(100) NOT NULL,
    fecha_contratacion DATE NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE
);

-- 7. USUARIO

CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    id_empleado INT NOT NULL UNIQUE,
    username VARCHAR(60) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(30) NOT NULL DEFAULT 'vendedor'
        CHECK (rol IN ('admin', 'vendedor', 'supervisor')),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    ultimo_login TIMESTAMPTZ,

    CONSTRAINT fk_usr_empleado 
        FOREIGN KEY (id_empleado) 
        REFERENCES empleado(id_empleado)
);

-- 8. VENTA

CREATE TABLE venta (
    id_venta SERIAL PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_empleado INT NOT NULL,
    fecha_venta TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    subtotal NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
    descuento NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (descuento >= 0),
    total NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (total >= 0),
    estado VARCHAR(20) NOT NULL DEFAULT 'completada'
        CHECK (estado IN ('pendiente', 'completada', 'anulada')),
    observaciones TEXT,

    CONSTRAINT fk_venta_cliente 
        FOREIGN KEY (id_cliente) 
        REFERENCES cliente(id_cliente),

    CONSTRAINT fk_venta_empleado 
        FOREIGN KEY (id_empleado) 
        REFERENCES empleado(id_empleado)
);

-- 9. DETALLE_VENTA

CREATE TABLE detalle_venta (
    id_detalle SERIAL PRIMARY KEY,
    id_venta INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio_unitario NUMERIC(10,2) NOT NULL CHECK (precio_unitario >= 0),
    descuento_linea NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (descuento_linea >= 0),
    subtotal_linea NUMERIC(10,2) NOT NULL CHECK (subtotal_linea >= 0),

    CONSTRAINT fk_det_venta 
        FOREIGN KEY (id_venta) 
        REFERENCES venta(id_venta)
        ON DELETE CASCADE,

    CONSTRAINT fk_det_producto 
        FOREIGN KEY (id_producto) 
        REFERENCES producto(id_producto)
);