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

-- 1. CATEGORIAS
INSERT INTO categoria (nombre, descripcion) VALUES
('Labiales', 'Productos para labios como lipstick, balm, lip oil y lip tint.'),
('Glosses', 'Brillos labiales con acabado glossy o plumping.'),
('Blush', 'Rubores líquidos, en crema, en barra o en polvo.'),
('Bases', 'Bases líquidas, skin tint y foundation sticks.'),
('Correctores', 'Correctores para ojeras, manchas e imperfecciones.'),
('Polvos', 'Polvos sueltos, compactos, matificantes y selladores.'),
('Bronzers', 'Bronceadores en polvo, crema o stick.'),
('Highlighters', 'Iluminadores líquidos, en polvo o en barra.'),
('Máscaras de pestañas', 'Productos para volumen, longitud y definición de pestañas.'),
('Delineadores', 'Delineadores para ojos y labios.'),
('Sombras', 'Paletas de sombras y sombras individuales.'),
('Primers', 'Preparadores de piel para mejorar duración del maquillaje.'),
('Setting Sprays', 'Sprays fijadores para prolongar la duración del maquillaje.'),
('Bálsamos labiales', 'Tratamientos hidratantes para labios.'),
('Lip Liners', 'Lápices para perfilar labios.'),
('Cuidado de piel', 'Productos skincare como cremas, mist, fluidos y tratamientos.'),
('Tintas', 'Tintas multiuso para labios y mejillas.'),
('Contorno', 'Productos para definir facciones del rostro.'),
('Brochas', 'Herramientas de aplicación para rostro, ojos y labios.'),
('Sets', 'Kits o bundles de maquillaje y skincare.'),
('Perfumes', 'Fragancias y perfumes de marcas de belleza.'),
('Cejas', 'Geles, lápices y productos para cejas.'),
('Paletas de rostro', 'Paletas con blush, bronzer, highlighter o polvos.'),
('Lip Oils', 'Aceites labiales con color o tratamiento.'),
('Skin Tints', 'Tintes ligeros de piel con cobertura natural.');

-- 2. MARCAS
INSERT INTO marca (nombre, pais_origen, descripcion) VALUES
('Dior', 'Francia', 'Marca de lujo con maquillaje, fragancias y skincare.'),
('Rare Beauty', 'Estados Unidos', 'Marca enfocada en maquillaje natural, blushes líquidos y productos inclusivos.'),
('Fenty Beauty', 'Estados Unidos', 'Marca reconocida por su variedad de tonos y productos para todos los tonos de piel.'),
('NARS', 'Francia', 'Marca profesional conocida por blushes, correctores, bases y labiales.'),
('Too Faced', 'Estados Unidos', 'Marca de maquillaje con enfoque divertido, glam y productos virales.'),
('Lancôme', 'Francia', 'Marca de lujo con maquillaje, skincare y fragancias.'),
('Patrick Ta', 'Estados Unidos', 'Marca enfocada en maquillaje glam, blushes, lips y complexion.'),
('Tower 28', 'Estados Unidos', 'Marca clean beauty diseñada para piel sensible.'),
('Charlotte Tilbury', 'Reino Unido', 'Marca de lujo conocida por Pillow Talk, complexion y productos glow.'),
('rhode', 'Estados Unidos', 'Marca de skincare y maquillaje minimalista fundada por Hailey Bieber.'),
('ONE/SIZE', 'Estados Unidos', 'Marca de Patrick Starrr enfocada en maquillaje de alto rendimiento.'),
('r.e.m. beauty', 'Estados Unidos', 'Marca de Ariana Grande con productos de ojos, labios y rostro.'),
('Milk Makeup', 'Estados Unidos', 'Marca clean, vegana y cruelty-free con productos en stick y primers.'),
('Huda Beauty', 'Emiratos Árabes Unidos', 'Marca fundada por Huda Kattan, conocida por complexion, polvos y labiales.'),
('Yves Saint Laurent', 'Francia', 'Marca de lujo con labiales, bases, perfumes y maquillaje icónico.'),
('Guerlain', 'Francia', 'Marca francesa de lujo conocida por Terracotta, Météorites y Rouge G.'),
('Makeup by Mario', 'Estados Unidos', 'Marca creada por Mario Dedivanovic con productos profesionales.'),
('Benefit Cosmetics', 'Estados Unidos', 'Marca conocida por productos de cejas, blushes, bronzers y máscaras.'),
('Haus Labs', 'Estados Unidos', 'Marca de Lady Gaga con maquillaje clean y skincare-infused.'),
('Kosas', 'Estados Unidos', 'Marca enfocada en maquillaje con beneficios de skincare.');

-- 3. PROVEEDORES
INSERT INTO proveedor (nombre, telefono, email, direccion, nit) VALUES
('Beauty Import Guatemala', '2450-1001', 'ventas@beautyimportgt.com', 'Zona 10, Ciudad de Guatemala', '9876543-1'),
('Luxury Makeup Distributors', '2450-1002', 'contacto@luxurymakeupgt.com', 'Zona 14, Ciudad de Guatemala', '9876543-2'),
('Cosmo Brands LATAM', '2450-1003', 'info@cosmobrandslatam.com', 'Zona 9, Ciudad de Guatemala', '9876543-3'),
('Pink Retail Supply', '2450-1004', 'ventas@pinkretailsupply.com', 'Zona 15, Ciudad de Guatemala', '9876543-4'),
('Glam Market Guatemala', '2450-1005', 'compras@glammarketgt.com', 'Zona 4, Ciudad de Guatemala', '9876543-5'),
('Makeup Central GT', '2450-1006', 'proveedores@makeupcentralgt.com', 'Mixco, Guatemala', '9876543-6'),
('Importadora Belleza Premium', '2450-1007', 'ventas@bellezapremium.com', 'Carretera a El Salvador, Guatemala', '9876543-7'),
('Distribuidora Rosé', '2450-1008', 'contacto@distribuidorarose.com', 'Zona 16, Ciudad de Guatemala', '9876543-8'),
('Beauty Lab Supplies', '2450-1009', 'info@beautylabsupplies.com', 'Zona 12, Ciudad de Guatemala', '9876543-9'),
('Glow Cosmetics Wholesale', '2450-1010', 'ventas@glowwholesale.com', 'Antigua Guatemala, Sacatepéquez', '9876543-10'),
('Luxe Face Imports', '2450-1011', 'contacto@luxefaceimports.com', 'Zona 13, Ciudad de Guatemala', '9876543-11'),
('Skin & Makeup Partners', '2450-1012', 'ventas@skinmakeuppartners.com', 'Zona 5, Ciudad de Guatemala', '9876543-12'),
('Beauty Proveedores GT', '2450-1013', 'info@beautyproveedoresgt.com', 'Zona 11, Ciudad de Guatemala', '9876543-13'),
('Diva Cosmetics Supply', '2450-1014', 'ventas@divacosmetics.com', 'Villa Nueva, Guatemala', '9876543-14'),
('Makeup House Distributor', '2450-1015', 'contacto@makeuphousedist.com', 'Zona 1, Ciudad de Guatemala', '9876543-15'),
('Prime Beauty Imports', '2450-1016', 'ventas@primebeautyimports.com', 'Zona 10, Ciudad de Guatemala', '9876543-16'),
('Fancy Beauty Logistics', '2450-1017', 'info@fancybeautylogistics.com', 'Amatitlán, Guatemala', '9876543-17'),
('Golden Glam Distributor', '2450-1018', 'ventas@goldenglamgt.com', 'Zona 7, Ciudad de Guatemala', '9876543-18'),
('Makeup Concept Supply', '2450-1019', 'contacto@makeupconcept.com', 'Zona 2, Ciudad de Guatemala', '9876543-19'),
('The Beauty Warehouse GT', '2450-1020', 'ventas@beautywarehousegt.com', 'Zona 18, Ciudad de Guatemala', '9876543-20'),
('Cosmetics Global GT', '2450-1021', 'info@cosmeticsglobalgt.com', 'San Miguel Petapa, Guatemala', '9876543-21'),
('Premium Retail Beauty', '2450-1022', 'ventas@premiumretailbeauty.com', 'Zona 6, Ciudad de Guatemala', '9876543-22'),
('Trend Makeup Import', '2450-1023', 'contacto@trendmakeupimport.com', 'Zona 3, Ciudad de Guatemala', '9876543-23'),
('Soft Glam Wholesale', '2450-1024', 'ventas@softglamwholesale.com', 'Fraijanes, Guatemala', '9876543-24'),
('PinkyPie Supplier Group', '2450-1025', 'compras@pinkypiesupplier.com', 'Zona 10, Ciudad de Guatemala', '9876543-25');

-- 4. PRODUCTOS
INSERT INTO producto (
    id_categoria, id_marca, id_proveedor, nombre, descripcion,
    precio_compra, precio_venta, stock, stock_minimo, sku, imagen, activo
) VALUES
-- Dior
(24, 1, 1, 'Dior Addict Lip Glow Oil', 'Aceite labial con acabado brillante e hidratante.', 210.00, 385.00, 18, 5, 'DIOR-LIP-OIL-001', 'dior-lip-glow-oil.jpg', TRUE),
(3, 1, 2, 'Dior Backstage Rosy Glow Blush', 'Rubor en polvo con acabado fresco y luminoso.', 260.00, 475.00, 12, 4, 'DIOR-BLUSH-002', 'dior-rosy-glow-blush.jpg', TRUE),

-- Rare Beauty
(3, 2, 3, 'Rare Beauty Soft Pinch Liquid Blush', 'Rubor líquido de alta pigmentación y acabado natural.', 150.00, 295.00, 25, 6, 'RARE-BLUSH-001', 'rare-soft-pinch-blush.jpg', TRUE),
(24, 2, 4, 'Rare Beauty Soft Pinch Tinted Lip Oil', 'Lip oil con tinte suave y acabado cómodo.', 135.00, 275.00, 22, 6, 'RARE-LIPOIL-002', 'rare-tinted-lip-oil.jpg', TRUE),

-- Fenty Beauty
(2, 3, 5, 'Fenty Beauty Gloss Bomb Universal Lip Luminizer', 'Gloss universal con brillo intenso.', 140.00, 280.00, 30, 8, 'FENTY-GLOSS-001', 'fenty-gloss-bomb.jpg', TRUE),
(4, 3, 6, 'Fenty Beauty Pro Filt’r Soft Matte Foundation', 'Base de larga duración con acabado soft matte.', 230.00, 445.00, 16, 5, 'FENTY-FOUND-002', 'fenty-pro-filtr-foundation.jpg', TRUE),

-- NARS
(5, 4, 7, 'NARS Radiant Creamy Concealer', 'Corrector cremoso de cobertura media a alta.', 175.00, 340.00, 20, 5, 'NARS-CONC-001', 'nars-radiant-creamy-concealer.jpg', TRUE),
(4, 4, 8, 'NARS Light Reflecting Foundation', 'Base de acabado natural y luminoso.', 285.00, 535.00, 3, 4, 'NARS-FOUND-002', 'nars-light-reflecting-foundation.jpg', TRUE),

-- Too Faced
(9, 5, 9, 'Too Faced Better Than Sex Mascara', 'Máscara de pestañas para volumen intenso.', 145.00, 295.00, 28, 7, 'TF-MASC-001', 'too-faced-better-than-sex.jpg', TRUE),
(2, 5, 10, 'Too Faced Lip Injection Plumping Gloss', 'Gloss con efecto plumping para labios.', 135.00, 270.00, 19, 5, 'TF-GLOSS-002', 'too-faced-lip-injection.jpg', TRUE),

-- Lancôme
(9, 6, 11, 'Lancôme Lash Idôle Mascara', 'Máscara para levantar y definir pestañas.', 160.00, 315.00, 20, 5, 'LAN-MASC-001', 'lancome-lash-idole.jpg', TRUE),
(1, 6, 12, 'Lancôme L’Absolu Rouge Lipstick', 'Labial cremoso de lujo con color intenso.', 175.00, 350.00, 17, 5, 'LAN-LIP-002', 'lancome-labsolu-rouge.jpg', TRUE),

-- Patrick Ta
(3, 7, 13, 'Patrick Ta Major Headlines Double-Take Blush', 'Blush dúo en crema y polvo para acabado glam.', 235.00, 455.00, 15, 4, 'PT-BLUSH-001', 'patrick-ta-blush-duo.jpg', TRUE),
(2, 7, 14, 'Patrick Ta Major Volume Plumping Gloss', 'Gloss con efecto volumen y acabado brillante.', 160.00, 320.00, 18, 5, 'PT-GLOSS-002', 'patrick-ta-plumping-gloss.jpg', TRUE),

-- Tower 28
(3, 8, 15, 'Tower 28 BeachPlease Cream Blush', 'Blush en crema para mejillas y labios.', 130.00, 255.00, 26, 6, 'T28-BLUSH-001', 'tower28-beachplease-blush.jpg', TRUE),
(2, 8, 16, 'Tower 28 ShineOn Lip Jelly', 'Gloss labial hidratante con acabado juicy.', 120.00, 240.00, 5, 6, 'T28-GLOSS-002', 'tower28-shineon-lip-jelly.jpg', TRUE),

-- Charlotte Tilbury
(1, 9, 17, 'Charlotte Tilbury Matte Revolution Pillow Talk', 'Labial matte icónico en tono nude rosado.', 185.00, 365.00, 18, 5, 'CT-LIP-001', 'charlotte-pillow-talk-lipstick.jpg', TRUE),
(13, 9, 18, 'Charlotte Tilbury Airbrush Flawless Setting Spray', 'Spray fijador para prolongar el maquillaje.', 180.00, 360.00, 2, 5, 'CT-SPRAY-002', 'charlotte-setting-spray.jpg', TRUE),

-- rhode
(14, 10, 19, 'rhode Peptide Lip Treatment', 'Tratamiento labial hidratante con acabado glossy.', 95.00, 195.00, 30, 8, 'RHODE-LIP-001', 'rhode-peptide-lip-treatment.jpg', TRUE),
(3, 10, 20, 'rhode Pocket Blush', 'Blush en crema compacto para mejillas y labios.', 115.00, 235.00, 24, 6, 'RHODE-BLUSH-002', 'rhode-pocket-blush.jpg', TRUE),

-- ONE/SIZE
(13, 11, 21, 'ONE/SIZE On Til Dawn Setting Spray', 'Spray fijador matte de larga duración.', 150.00, 300.00, 21, 5, 'OS-SPRAY-001', 'onesize-on-til-dawn.jpg', TRUE),
(6, 11, 22, 'ONE/SIZE Ultimate Blurring Setting Powder', 'Polvo sellador para difuminar textura.', 155.00, 305.00, 17, 5, 'OS-POWDER-002', 'onesize-blurring-powder.jpg', TRUE),

-- r.e.m. beauty
(9, 12, 23, 'r.e.m. beauty Flourishing Lengthening Mascara', 'Máscara para longitud y definición.', 120.00, 245.00, 18, 5, 'REM-MASC-001', 'rem-lengthening-mascara.jpg', TRUE),
(2, 12, 24, 'r.e.m. beauty Essential Drip Lip Oil', 'Lip oil ligero con acabado brillante.', 115.00, 235.00, 20, 5, 'REM-LIPOIL-002', 'rem-essential-drip-lip-oil.jpg', TRUE),

-- Milk Makeup
(12, 13, 25, 'Milk Makeup Hydro Grip Primer', 'Primer hidratante que ayuda a sujetar el maquillaje.', 165.00, 325.00, 22, 5, 'MILK-PRIMER-001', 'milk-hydro-grip-primer.jpg', TRUE),
(7, 13, 1, 'Milk Makeup Matte Cream Bronzer Stick', 'Bronzer en barra con acabado natural.', 130.00, 260.00, 19, 5, 'MILK-BRONZER-002', 'milk-bronzer-stick.jpg', TRUE),

-- Huda Beauty
(6, 14, 2, 'Huda Beauty Easy Bake Loose Powder', 'Polvo suelto para sellar y matificar maquillaje.', 170.00, 335.00, 20, 5, 'HUDA-POWDER-001', 'huda-easy-bake-powder.jpg', TRUE),
(4, 14, 3, 'Huda Beauty FauxFilter Luminous Matte Foundation', 'Base de cobertura alta con acabado matte luminoso.', 210.00, 420.00, 16, 4, 'HUDA-FOUND-002', 'huda-fauxfilter-foundation.jpg', TRUE),

-- Yves Saint Laurent
(5, 15, 4, 'Yves Saint Laurent Touche Éclat Concealer', 'Corrector iluminador para ojeras y zonas de luz.', 230.00, 455.00, 15, 4, 'YSL-CONC-001', 'ysl-touche-eclat.jpg', TRUE),
(1, 15, 5, 'Yves Saint Laurent Rouge Pur Couture Lipstick', 'Labial de lujo con color intenso y acabado elegante.', 240.00, 470.00, 16, 4, 'YSL-LIP-002', 'ysl-rouge-pur-couture.jpg', TRUE),

-- Guerlain
(7, 16, 6, 'Guerlain Terracotta Bronzing Powder', 'Bronzer icónico para acabado sunkissed.', 260.00, 510.00, 12, 4, 'GUE-BRONZER-001', 'guerlain-terracotta.jpg', TRUE),
(6, 16, 7, 'Guerlain Météorites Pearls Powder', 'Perlas de polvo iluminador para sellar y dar glow.', 290.00, 575.00, 10, 3, 'GUE-POWDER-002', 'guerlain-meteorites.jpg', TRUE),

-- Makeup by Mario
(11, 17, 8, 'Makeup by Mario Master Mattes Eyeshadow Palette', 'Paleta de sombras matte en tonos neutros.', 240.00, 465.00, 14, 4, 'MBM-SHADOW-001', 'makeup-by-mario-master-mattes.jpg', TRUE),
(18, 17, 9, 'Makeup by Mario SoftSculpt Transforming Skin Enhancer', 'Producto cremoso para definición y warmth natural.', 190.00, 375.00, 18, 5, 'MBM-CONTOUR-002', 'makeup-by-mario-softsculpt.jpg', TRUE),

-- Benefit Cosmetics
(22, 18, 10, 'Benefit Gimme Brow+ Volumizing Gel', 'Gel de cejas con efecto volumen natural.', 130.00, 260.00, 22, 6, 'BEN-BROW-001', 'benefit-gimme-brow.jpg', TRUE),
(7, 18, 11, 'Benefit Hoola Bronzer', 'Bronzer matte clásico para dar calidez al rostro.', 150.00, 300.00, 20, 5, 'BEN-BRONZER-002', 'benefit-hoola-bronzer.jpg', TRUE),

-- Haus Labs
(4, 19, 12, 'Haus Labs Triclone Skin Tech Foundation', 'Base con fórmula skincare-infused y cobertura natural.', 230.00, 450.00, 16, 4, 'HAUS-FOUND-001', 'haus-labs-triclone-foundation.jpg', TRUE),
(1, 19, 13, 'Haus Labs Atomic Shake Lip Lacquer', 'Labial líquido glossy de larga duración.', 150.00, 300.00, 15, 4, 'HAUS-LIP-002', 'haus-labs-atomic-shake.jpg', TRUE),

-- Kosas
(5, 20, 14, 'Kosas Revealer Concealer', 'Corrector cremoso con acabado natural y beneficios skincare.', 155.00, 310.00, 24, 6, 'KOSAS-CONC-001', 'kosas-revealer-concealer.jpg', TRUE),
(9, 20, 15, 'Kosas Soulgazer Mascara', 'Máscara para pestañas con definición y volumen ligero.', 135.00, 270.00, 21, 5, 'KOSAS-MASC-002', 'kosas-soulgazer-mascara.jpg', TRUE);

-- 5. CLIENTES
INSERT INTO cliente (nombre, apellido, email, telefono, direccion, fecha_registro) VALUES
('Valeria', 'Castillo', 'valeria.castillo@email.com', '5010-1001', 'Zona 10, Ciudad de Guatemala', '2026-01-05'),
('Camila', 'Morales', 'camila.morales@email.com', '5010-1002', 'Zona 15, Ciudad de Guatemala', '2026-01-06'),
('Fernanda', 'López', 'fernanda.lopez@email.com', '5010-1003', 'Mixco, Guatemala', '2026-01-08'),
('Andrea', 'Herrera', 'andrea.herrera@email.com', '5010-1004', 'Zona 16, Ciudad de Guatemala', '2026-01-09'),
('Sofía', 'Ramírez', 'sofia.ramirez@email.com', '5010-1005', 'Carretera a El Salvador, Guatemala', '2026-01-10'),
('Mariana', 'García', 'mariana.garcia@email.com', '5010-1006', 'Zona 14, Ciudad de Guatemala', '2026-01-11'),
('Paola', 'Reyes', 'paola.reyes@email.com', '5010-1007', 'Zona 7, Ciudad de Guatemala', '2026-01-13'),
('Lucía', 'Pérez', 'lucia.perez@email.com', '5010-1008', 'Zona 4, Ciudad de Guatemala', '2026-01-14'),
('Daniela', 'Fuentes', 'daniela.fuentes@email.com', '5010-1009', 'Villa Nueva, Guatemala', '2026-01-15'),
('Gabriela', 'Méndez', 'gabriela.mendez@email.com', '5010-1010', 'Zona 12, Ciudad de Guatemala', '2026-01-16'),
('Natalia', 'Aguilar', 'natalia.aguilar@email.com', '5010-1011', 'San Miguel Petapa, Guatemala', '2026-01-18'),
('Isabella', 'Vásquez', 'isabella.vasquez@email.com', '5010-1012', 'Antigua Guatemala, Sacatepéquez', '2026-01-19'),
('Alejandra', 'Cruz', 'alejandra.cruz@email.com', '5010-1013', 'Zona 11, Ciudad de Guatemala', '2026-01-20'),
('Jimena', 'Ortiz', 'jimena.ortiz@email.com', '5010-1014', 'Zona 5, Ciudad de Guatemala', '2026-01-21'),
('Regina', 'Alvarado', 'regina.alvarado@email.com', '5010-1015', 'Zona 13, Ciudad de Guatemala', '2026-01-22'),
('Mónica', 'Salazar', 'monica.salazar@email.com', '5010-1016', 'Amatitlán, Guatemala', '2026-01-24'),
('Renata', 'Díaz', 'renata.diaz@email.com', '5010-1017', 'Fraijanes, Guatemala', '2026-01-25'),
('Victoria', 'Santos', 'victoria.santos@email.com', '5010-1018', 'Zona 9, Ciudad de Guatemala', '2026-01-26'),
('Elena', 'Navarro', 'elena.navarro@email.com', '5010-1019', 'Zona 1, Ciudad de Guatemala', '2026-01-27'),
('Carolina', 'Molina', 'carolina.molina@email.com', '5010-1020', 'Zona 18, Ciudad de Guatemala', '2026-01-28'),
('Bianca', 'Rivas', 'bianca.rivas@email.com', '5010-1021', 'Zona 6, Ciudad de Guatemala', '2026-01-29'),
('Ximena', 'Chacón', 'ximena.chacon@email.com', '5010-1022', 'Zona 2, Ciudad de Guatemala', '2026-01-30'),
('Nicole', 'Estrada', 'nicole.estrada@email.com', '5010-1023', 'Santa Catarina Pinula, Guatemala', '2026-02-01'),
('Marcela', 'Padilla', 'marcela.padilla@email.com', '5010-1024', 'Zona 3, Ciudad de Guatemala', '2026-02-02'),
('Claudia', 'Mejía', 'claudia.mejia@email.com', '5010-1025', 'Zona 10, Ciudad de Guatemala', '2026-02-03');

-- 6. EMPLEADOS
INSERT INTO empleado (nombre, apellido, email, telefono, puesto, fecha_contratacion, activo) VALUES
('Daniela', 'Rodas', 'daniela.rodas@pinkypie.com', '5020-1001', 'Administradora', '2025-11-01', TRUE),
('Melanie', 'Cifuentes', 'melanie.cifuentes@pinkypie.com', '5020-1002', 'Vendedora', '2025-11-03', TRUE),
('Ashley', 'Gómez', 'ashley.gomez@pinkypie.com', '5020-1003', 'Vendedora', '2025-11-05', TRUE),
('Valentina', 'Soto', 'valentina.soto@pinkypie.com', '5020-1004', 'Supervisora', '2025-11-07', TRUE),
('María', 'Pineda', 'maria.pineda@pinkypie.com', '5020-1005', 'Vendedora', '2025-11-08', TRUE),
('Sara', 'Arévalo', 'sara.arevalo@pinkypie.com', '5020-1006', 'Vendedora', '2025-11-10', TRUE),
('Antonella', 'León', 'antonella.leon@pinkypie.com', '5020-1007', 'Asesora de maquillaje', '2025-11-12', TRUE),
('Flor', 'Barrios', 'flor.barrios@pinkypie.com', '5020-1008', 'Vendedora', '2025-11-13', TRUE),
('Diana', 'Ruiz', 'diana.ruiz@pinkypie.com', '5020-1009', 'Cajera', '2025-11-15', TRUE),
('Paulina', 'Nájera', 'paulina.najera@pinkypie.com', '5020-1010', 'Cajera', '2025-11-16', TRUE),
('Majo', 'Lemus', 'majo.lemus@pinkypie.com', '5020-1011', 'Asesora de skincare', '2025-11-18', TRUE),
('Julieta', 'Vega', 'julieta.vega@pinkypie.com', '5020-1012', 'Vendedora', '2025-11-20', TRUE),
('Rocío', 'Mendoza', 'rocio.mendoza@pinkypie.com', '5020-1013', 'Supervisora', '2025-11-22', TRUE),
('Ana', 'Cáceres', 'ana.caceres@pinkypie.com', '5020-1014', 'Vendedora', '2025-11-23', TRUE),
('Lorena', 'Ibarra', 'lorena.ibarra@pinkypie.com', '5020-1015', 'Bodeguera', '2025-11-24', TRUE),
('Fátima', 'Castañeda', 'fatima.castaneda@pinkypie.com', '5020-1016', 'Bodeguera', '2025-11-25', TRUE),
('Emilia', 'Monterroso', 'emilia.monterroso@pinkypie.com', '5020-1017', 'Vendedora', '2025-11-27', TRUE),
('Michelle', 'Orellana', 'michelle.orellana@pinkypie.com', '5020-1018', 'Asesora de maquillaje', '2025-11-29', TRUE),
('Gabriela', 'Bolaños', 'gabriela.bolanos@pinkypie.com', '5020-1019', 'Vendedora', '2025-12-01', TRUE),
('Josefina', 'Lara', 'josefina.lara@pinkypie.com', '5020-1020', 'Vendedora', '2025-12-02', TRUE),
('Ariana', 'Figueroa', 'ariana.figueroa@pinkypie.com', '5020-1021', 'Cajera', '2025-12-03', TRUE),
('Laura', 'Delgado', 'laura.delgado@pinkypie.com', '5020-1022', 'Vendedora', '2025-12-04', TRUE),
('Karla', 'Rosales', 'karla.rosales@pinkypie.com', '5020-1023', 'Supervisora', '2025-12-05', TRUE),
('Ivanna', 'López', 'ivanna.lopez@pinkypie.com', '5020-1024', 'Asesora de maquillaje', '2025-12-06', TRUE),
('Paula', 'Quiñónez', 'paula.quinonez@pinkypie.com', '5020-1025', 'Vendedora', '2025-12-07', TRUE);


-- 7. USUARIOS hashes generador con bycript
INSERT INTO usuario (id_empleado, username, password_hash, rol, activo, ultimo_login) VALUES
(1, 'admin', '$2b$10$XWgG/ITs.sbVEs3iiMVV5e84VBJPh7OT1t5uGpxH2zytnoNF1zoo.', 'admin', TRUE, '2026-04-01 09:00:00-06'),
(2, 'melanie', '$2b$10$7u2wKaOOTiy71T47BKAmPOf2tRx13976aTkIY6GtKu74fHsye2QBy', 'vendedor', TRUE, '2026-04-01 09:15:00-06'),
(3, 'ashley', '$2b$10$O1qgWTZpDdk3hp19uTtrZuEhCMBu9RvmVt0a9OJpfksRZ1uvn3Fju', 'vendedor', TRUE, '2026-04-01 09:20:00-06'),
(4, 'valentina', '$2b$10$XIvoXkh664MBWvbAeB9e/dh8jYwupFAggMzd6EcUNhaIxdhKIS', 'supervisor', TRUE, '2026-04-01 09:30:00-06'),
(5, 'maria', '$2b$10$JveetaZXo4OONR0ZbX.QqOTNhAHdu00/QSjOuobnkOldby8q7H4sK', 'vendedor', TRUE, '2026-04-01 10:00:00-06'),
(6, 'sara', '$2b$10$VO1kmIEmKvDDkXFlCJfV8Ohu1ac9Ei2HAA03ZKM9PQu8pYwojTuAa', 'vendedor', TRUE, '2026-04-01 10:15:00-06'),
(7, 'antonella', '$2b$10$p8EzWRTWX33PYropXvyiueJsJYpZmc81.a5EEHwP8ZQyCNBWm6H2', 'vendedor', TRUE, '2026-04-01 10:25:00-06'),
(8, 'flor', '$2b$10$z1851HhCzfhngCs5mgDkOuinwIk8Eh8SH2oYimyp7E3tOe2zbK6zi', 'vendedor', TRUE, '2026-04-01 10:40:00-06'),
(9, 'diana', '$2b$10$.omrvNUbEmbSUEXHIf9LGeJAfF5LOz3uB.8BE74Mu7xwVtWelToeW', 'vendedor', TRUE, '2026-04-01 11:00:00-06'),
(10, 'paulina', '$2b$10$sj9ZEAQJZtkuS66wMVKEt.5tqnNjZucVHgPmk.eQBQT/AVzgZX/a1', 'vendedor', TRUE, '2026-04-01 11:05:00-06'),
(11, 'majo', '$2b$10$MbwogoKorjvPfkbgqkev2OlCLMebFfTqAZQvqPRWCzx6qCj8y/DO', 'vendedor', TRUE, '2026-04-01 11:25:00-06'),
(12, 'julieta', '$2b$10$OuuuqsX.T.XTfM0nd3h.P./Qs1V78pgCTsTmsYmst8.IEDZZNmMc2', 'vendedor', TRUE, '2026-04-01 11:35:00-06'),
(13, 'rocio', '$2b$10$jVAHMsDhIoj7Hf1soUSqQeo/L7x59dvA9NwtpdEdb0z4Ty43nXgFa', 'supervisor', TRUE, '2026-04-01 12:00:00-06'),
(14, 'ana', '$2b$10$MhjBf6OutzVtQMIsMxYkueYFk1LkOLiBgsY.PdUeMybC63MGYtuy', 'vendedor', TRUE, '2026-04-01 12:20:00-06'),
(15, 'lorena', '$2b$10$KHIthM6iaqTi9oB3S67Tu.FDWMZ61qGHH1yW1doek1mVaC7ncegi', 'vendedor', TRUE, '2026-04-01 12:40:00-06'),
(16, 'fatima', '$2b$10$armPL3t4ZK4eoFNRLBDDuehh6L3lgIzaKzzbTviP7tJ9JB/HyaVr2', 'vendedor', TRUE, '2026-04-01 13:00:00-06'),
(17, 'emilia', '$2b$10$Znq3umRg8iDNfDs3PP.WEu85gUYWH1NOAhNPQnyykHGG7G1i.WR5W', 'vendedor', TRUE, '2026-04-01 13:20:00-06'),
(18, 'michelle', '$2b$10$hhuF/Pz8Bfk9/Jbu2fD9O.X9vKVYWRbH1Efn..2FWSLBe9doFEsW', 'vendedor', TRUE, '2026-04-01 13:45:00-06'),
(19, 'gabriela', '$2b$10$Da6ovfG6TrRzej/i8cYJOou9jrSSQELmmW1r6zmM2JUZSerpZP8ua', 'vendedor', TRUE, '2026-04-01 14:00:00-06'),
(20, 'josefina', '$2b$10$TnNcFVe3T/qJ98ToCY5z.4/qV3/6xUhh9rTMiNykQTxDcjvhTkm..', 'vendedor', TRUE, '2026-04-01 14:15:00-06'),
(21, 'ariana', '$2b$10$Cs95P5q4IunTaJ68T.Mi4e2InAN01KRIyBHV.BIxim.hKez.6mC7qw', 'vendedor', TRUE, '2026-04-01 14:30:00-06'),
(22, 'laura', '$2b$10$./z5rjOOGnyguDRAQS0C7.sYY.bSBuO0tqgcbB5lZneob86FKI7ly', 'vendedor', TRUE, '2026-04-01 15:00:00-06'),
(23, 'karla', '$2b$10$f.GR6oeH5DwdYJHZ8HGQM./BBYbJrBofN8AQvozj6M3HXsSOSX5D.', 'supervisor', TRUE, '2026-04-01 15:20:00-06'),
(24, 'ivanna', '$2b$10$PqZJVAUTbkYzmNVv7umfouGUhSQqUnmIh2HMk4R73sYnER1Gd5nQ2', 'vendedor', TRUE, '2026-04-01 15:40:00-06'),
(25, 'paula', '$2b$10$PddUsTeGn4luoerKI.pA.okYZHfdd94dsbZ1iOFeFu9Qz7z3gNTu', 'vendedor', TRUE, '2026-04-01 16:00:00-06');

-- 8. VENTAS
INSERT INTO venta (id_cliente, id_empleado, fecha_venta, subtotal, descuento, total, estado, observaciones) VALUES
(1, 2, '2026-02-01 10:15:00-06', 665.00, 0.00, 665.00, 'completada', 'Compra de productos para labios y rostro.'),
(2, 3, '2026-02-01 11:30:00-06', 725.00, 25.00, 700.00, 'completada', 'Descuento aplicado por promoción de apertura.'),
(3, 5, '2026-02-02 09:45:00-06', 575.00, 0.00, 575.00, 'completada', 'Cliente compró productos de lujo.'),
(4, 6, '2026-02-02 13:20:00-06', 540.00, 40.00, 500.00, 'completada', 'Promoción en glosses.'),
(5, 7, '2026-02-03 15:10:00-06', 760.00, 0.00, 760.00, 'completada', 'Venta de productos para rostro.'),
(6, 8, '2026-02-03 16:40:00-06', 595.00, 0.00, 595.00, 'completada', 'Compra regular.'),
(7, 9, '2026-02-04 10:00:00-06', 635.00, 35.00, 600.00, 'completada', 'Descuento por cliente frecuente.'),
(8, 10, '2026-02-04 12:15:00-06', 520.00, 0.00, 520.00, 'completada', 'Venta de productos básicos.'),
(9, 11, '2026-02-05 09:20:00-06', 785.00, 50.00, 735.00, 'completada', 'Combo de productos premium.'),
(10, 12, '2026-02-05 14:00:00-06', 630.00, 0.00, 630.00, 'completada', 'Compra de maquillaje diario.'),
(11, 14, '2026-02-06 10:50:00-06', 815.00, 65.00, 750.00, 'completada', 'Promoción de temporada.'),
(12, 17, '2026-02-06 15:35:00-06', 555.00, 0.00, 555.00, 'completada', 'Productos para piel sensible.'),
(13, 18, '2026-02-07 11:10:00-06', 695.00, 0.00, 695.00, 'completada', 'Compra recomendada por asesora.'),
(14, 19, '2026-02-07 16:25:00-06', 745.00, 45.00, 700.00, 'completada', 'Descuento aplicado en caja.'),
(15, 20, '2026-02-08 10:30:00-06', 470.00, 0.00, 470.00, 'completada', 'Compra de labiales.'),
(16, 21, '2026-02-08 13:45:00-06', 775.00, 25.00, 750.00, 'completada', 'Venta con descuento parcial.'),
(17, 22, '2026-02-09 09:30:00-06', 615.00, 0.00, 615.00, 'completada', 'Compra para regalo.'),
(18, 24, '2026-02-09 12:40:00-06', 720.00, 20.00, 700.00, 'completada', 'Cliente compró productos para rostro.'),
(19, 25, '2026-02-10 10:05:00-06', 575.00, 0.00, 575.00, 'completada', 'Compra de productos virales.'),
(20, 2, '2026-02-10 15:15:00-06', 850.00, 100.00, 750.00, 'completada', 'Descuento especial.'),
(21, 3, '2026-02-11 11:00:00-06', 610.00, 0.00, 610.00, 'completada', 'Compra en tienda física.'),
(22, 5, '2026-02-11 13:35:00-06', 705.00, 5.00, 700.00, 'completada', 'Redondeo promocional.'),
(23, 6, '2026-02-12 10:25:00-06', 480.00, 0.00, 480.00, 'completada', 'Venta de glosses.'),
(24, 7, '2026-02-12 14:10:00-06', 905.00, 105.00, 800.00, 'completada', 'Compra de lujo.'),
(25, 8, '2026-02-13 16:00:00-06', 650.00, 0.00, 650.00, 'completada', 'Compra final del día.');

-- 9. DETALLE_VENTA
INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario, descuento_linea, subtotal_linea) VALUES
-- Venta 1: total 665
(1, 1, 1, 385.00, 0.00, 385.00),
(1, 5, 1, 280.00, 0.00, 280.00),

-- Venta 2: subtotal 725, descuento venta 25, total 700
(2, 3, 1, 295.00, 0.00, 295.00),
(2, 6, 1, 445.00, 15.00, 430.00),

-- Venta 3: total 575
(3, 32, 1, 575.00, 0.00, 575.00),

-- Venta 4: subtotal 540, descuento venta 40, total 500
(4, 10, 1, 270.00, 0.00, 270.00),
(4, 16, 1, 240.00, 0.00, 240.00),
(4, 24, 1, 235.00, 205.00, 30.00),

-- Venta 5: total 760
(5, 7, 1, 340.00, 0.00, 340.00),
(5, 28, 1, 420.00, 0.00, 420.00),

-- Venta 6: total 595
(6, 9, 1, 295.00, 0.00, 295.00),
(6, 34, 1, 300.00, 0.00, 300.00),

-- Venta 7: subtotal 635, descuento venta 35, total 600
(7, 15, 1, 255.00, 0.00, 255.00),
(7, 26, 1, 260.00, 0.00, 260.00),
(7, 23, 1, 245.00, 125.00, 120.00),

-- Venta 8: total 520
(8, 20, 1, 235.00, 0.00, 235.00),
(8, 22, 1, 305.00, 20.00, 285.00),

-- Venta 9: subtotal 785, descuento venta 50, total 735
(9, 13, 1, 455.00, 0.00, 455.00),
(9, 14, 1, 320.00, 0.00, 320.00),
(9, 19, 1, 195.00, 185.00, 10.00),

-- Venta 10: total 630
(10, 11, 1, 315.00, 0.00, 315.00),
(10, 12, 1, 350.00, 35.00, 315.00),

-- Venta 11: subtotal 815, descuento venta 65, total 750
(11, 8, 1, 535.00, 0.00, 535.00),
(11, 4, 1, 275.00, 0.00, 275.00),
(11, 2, 1, 475.00, 470.00, 5.00),

-- Venta 12: total 555
(12, 15, 1, 255.00, 0.00, 255.00),
(12, 21, 1, 300.00, 0.00, 300.00),

-- Venta 13: total 695
(13, 25, 1, 325.00, 0.00, 325.00),
(13, 35, 1, 375.00, 5.00, 370.00),

-- Venta 14: subtotal 745, descuento venta 45, total 700
(14, 17, 1, 365.00, 0.00, 365.00),
(14, 18, 1, 360.00, 0.00, 360.00),
(14, 16, 1, 240.00, 220.00, 20.00),

-- Venta 15: total 470
(15, 30, 1, 470.00, 0.00, 470.00),

-- Venta 16: subtotal 775, descuento venta 25, total 750
(16, 27, 1, 335.00, 0.00, 335.00),
(16, 29, 1, 455.00, 15.00, 440.00),

-- Venta 17: total 615
(17, 36, 1, 260.00, 0.00, 260.00),
(17, 37, 1, 450.00, 95.00, 355.00),

-- Venta 18: subtotal 720, descuento venta 20, total 700
(18, 33, 1, 465.00, 0.00, 465.00),
(18, 38, 1, 300.00, 45.00, 255.00),

-- Venta 19: total 575
(19, 31, 1, 510.00, 0.00, 510.00),
(19, 19, 1, 195.00, 130.00, 65.00),

-- Venta 20: subtotal 850, descuento venta 100, total 750
(20, 39, 1, 310.00, 0.00, 310.00),
(20, 40, 1, 270.00, 0.00, 270.00),
(20, 1, 1, 385.00, 115.00, 270.00),

-- Venta 21: total 610
(21, 22, 1, 305.00, 0.00, 305.00),
(21, 6, 1, 445.00, 140.00, 305.00),

-- Venta 22: subtotal 705, descuento venta 5, total 700
(22, 2, 1, 475.00, 0.00, 475.00),
(22, 20, 1, 235.00, 5.00, 230.00),

-- Venta 23: total 480
(23, 16, 2, 240.00, 0.00, 480.00),

-- Venta 24: subtotal 905, descuento venta 105, total 800
(24, 30, 1, 470.00, 0.00, 470.00),
(24, 32, 1, 575.00, 140.00, 435.00),

-- Venta 25: total 650
(25, 25, 2, 325.00, 0.00, 650.00);
