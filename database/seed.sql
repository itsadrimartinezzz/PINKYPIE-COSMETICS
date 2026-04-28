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
(4, 4, 8, 'NARS Light Reflecting Foundation', 'Base de acabado natural y luminoso.', 285.00, 535.00, 14, 4, 'NARS-FOUND-002', 'nars-light-reflecting-foundation.jpg', TRUE),

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
(2, 8, 16, 'Tower 28 ShineOn Lip Jelly', 'Gloss labial hidratante con acabado juicy.', 120.00, 240.00, 24, 6, 'T28-GLOSS-002', 'tower28-shineon-lip-jelly.jpg', TRUE),

-- Charlotte Tilbury
(1, 9, 17, 'Charlotte Tilbury Matte Revolution Pillow Talk', 'Labial matte icónico en tono nude rosado.', 185.00, 365.00, 18, 5, 'CT-LIP-001', 'charlotte-pillow-talk-lipstick.jpg', TRUE),
(13, 9, 18, 'Charlotte Tilbury Airbrush Flawless Setting Spray', 'Spray fijador para prolongar el maquillaje.', 180.00, 360.00, 20, 5, 'CT-SPRAY-002', 'charlotte-setting-spray.jpg', TRUE),

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

