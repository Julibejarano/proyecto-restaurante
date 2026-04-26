-- Script de Población para Base de Datos de Restaurante Colombiano
-- Requisitos: 50 puestos totales, 18 cocineros (especializados), Menú Colombiano (41 ítems)

-- 1. Limpiar datos existentes (respetando dependencias)
TRUNCATE TABLE pedido_items CASCADE;
TRUNCATE TABLE pedidos CASCADE;
TRUNCATE TABLE reservas CASCADE;
TRUNCATE TABLE menu_items CASCADE;
TRUNCATE TABLE mesas CASCADE;
TRUNCATE TABLE users CASCADE;

-- 2. Restablecer secuencias
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE mesas_id_seq RESTART WITH 1;
ALTER SEQUENCE menu_items_id_seq RESTART WITH 1;
ALTER SEQUENCE reservas_id_seq RESTART WITH 1;
ALTER SEQUENCE pedidos_id_seq RESTART WITH 1;
ALTER SEQUENCE pedido_items_id_seq RESTART WITH 1;

-- 3. Crear Mesas (Total: 50 puestos exactos)
-- 5 mesas de 2 puestos = 10
-- 6 mesas de 4 puestos = 24
-- 2 mesas de 8 puestos = 16
INSERT INTO mesas (numero, capacidad) VALUES 
(1, 2), (2, 2), (3, 2), (4, 2), (5, 2),
(6, 4), (7, 4), (8, 4), (9, 4), (10, 4), (11, 4),
(12, 8), (13, 8);

-- 4. Crear Empleados (Contraseña para todos es '123' o 'admin123' en SHA-256)
-- 'admin123' -> 240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9
-- '123' -> a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3

-- Admin y Staff general
INSERT INTO users (username, name, password_hash, role, especialidad) VALUES 
('admin', 'Administrador General', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'admin', NULL),
('maitre1', 'Roberto Maitre', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'maitre', NULL),
('maitre2', 'Lucia Recepción', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'maitre', NULL),
('mesero1', 'Carlos Mesero', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'mesero', NULL),
('mesero2', 'Ana Servicio', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'mesero', NULL),
('mesero3', 'Juan Atención', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'mesero', NULL),
('mesero4', 'Maria Mesa', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'mesero', NULL);

-- Cocineros Especializados (18 en total)
-- 5 Entradas
INSERT INTO users (username, name, password_hash, role, especialidad) VALUES 
('c_entrada1', 'Chef Fritos 1', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'cocinero', 'entrada'),
('c_entrada2', 'Chef Fritos 2', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'cocinero', 'entrada'),
('c_entrada3', 'Chef Fritos 3', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'cocinero', 'entrada'),
('c_entrada4', 'Chef Amasijos', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'cocinero', 'entrada'),
('c_entrada5', 'Chef Antojos', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'cocinero', 'entrada');

-- 7 Platos Fuertes
INSERT INTO users (username, name, password_hash, role, especialidad) VALUES 
('c_fuerte1', 'Chef Sancochero 1', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'cocinero', 'plato_fuerte'),
('c_fuerte2', 'Chef Sancochero 2', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'cocinero', 'plato_fuerte'),
('c_fuerte3', 'Chef Parrillero 1', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'cocinero', 'plato_fuerte'),
('c_fuerte4', 'Chef Parrillero 2', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'cocinero', 'plato_fuerte'),
('c_fuerte5', 'Chef Principal 1', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'cocinero', 'plato_fuerte'),
('c_fuerte6', 'Chef Principal 2', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'cocinero', 'plato_fuerte'),
('c_fuerte7', 'Chef Maestro', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'cocinero', 'plato_fuerte');

-- 3 Bebidas
INSERT INTO users (username, name, password_hash, role, especialidad) VALUES 
('c_bebida1', 'Barista 1', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'cocinero', 'bebida'),
('c_bebida2', 'Barista Jugos', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'cocinero', 'bebida'),
('c_bebida3', 'Barista Licores', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'cocinero', 'bebida');

-- 3 Postres
INSERT INTO users (username, name, password_hash, role, especialidad) VALUES 
('c_postre1', 'Repostero Tradicional', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'cocinero', 'postre'),
('c_postre2', 'Repostero Dulces', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'cocinero', 'postre'),
('c_postre3', 'Repostero Helados', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'cocinero', 'postre');

-- 5. Crear Menú Colombiano
-- Entradas (10)
INSERT INTO menu_items (nombre, descripcion, precio, tiempo_preparacion, categoria) VALUES 
('Empanadas de Pipían', 'Clásicas empanadas con ají de maní', 12000, 10, 'entrada'),
('Arepa de Huevo', 'Arepa costeña frita con huevo entero', 9000, 12, 'entrada'),
('Patacones con Hogao', 'Plátano verde frito con guiso tradicional', 15000, 8, 'entrada'),
('Carimañolas', 'Yuca frita rellena de carne o queso', 14000, 15, 'entrada'),
('Chorizo Santarrosano', 'Chorizo ahumado con arepita', 18000, 10, 'entrada'),
('Aborrajados', 'Plátano maduro relleno de queso fundido', 11000, 12, 'entrada'),
('Chicharrón Carnudo', 'Acompañado de arepa blanca', 22000, 20, 'entrada'),
('Pandebono Caliente', 'Recién horneado, porción x4', 8000, 5, 'entrada'),
('Almojábanas', 'Con queso campesino, porción x4', 8000, 5, 'entrada'),
('Marranitas', 'Plátano verde relleno de chicharrón triturado', 14000, 15, 'entrada');

-- Platos Fuertes (15)
INSERT INTO menu_items (nombre, descripcion, precio, tiempo_preparacion, categoria) VALUES 
('Bandeja Paisa', 'Frijoles, chicharrón, carne molida, huevo, plátano, chorizo, aguacate', 45000, 25, 'plato_fuerte'),
('Ajiaco Santafereño', 'Sopa de papa con pollo, alcaparras y crema de leche', 38000, 30, 'plato_fuerte'),
('Sancocho Trifásico', 'Sopa tradicional con res, cerdo, pollo, yuca y papa', 42000, 40, 'plato_fuerte'),
('Mote de Queso', 'Sopa cremosa de ñame con queso costeño', 35000, 25, 'plato_fuerte'),
('Lechona Tolimense', 'Cerdo relleno de arroz y arveja con cuero crocante', 32000, 15, 'plato_fuerte'),
('Mamona a la Llanera', 'Corte de ternera asada a la brasa', 55000, 35, 'plato_fuerte'),
('Pescado Frito', 'Mojarra frita con arroz de coco y patacones', 48000, 25, 'plato_fuerte'),
('Cazuela de Mariscos', 'Mariscos frescos en salsa cremosa del pacífico', 65000, 30, 'plato_fuerte'),
('Mondongo', 'Sopa tradicional de callo con verduras', 32000, 20, 'plato_fuerte'),
('Sobrebarriga Sudada', 'Corte jugoso bañado en hogao con papa y yuca', 38000, 25, 'plato_fuerte'),
('Arroz Atollado', 'Arroz del valle con carnes y hogao', 36000, 20, 'plato_fuerte'),
('Pusandao', 'Sopa tradicional del pacífico colombiano', 45000, 30, 'plato_fuerte'),
('Fritanga Bogotana', 'Picada de cerdo, morcilla, papa criolla y plátano', 60000, 25, 'plato_fuerte'),
('Tamal Tolimense', 'Masa de maíz con carne, pollo y verduras en hoja de plátano', 28000, 15, 'plato_fuerte'),
('Cabrito Santandereano', 'Asado con pepitoria y arepa de maíz pelao', 52000, 35, 'plato_fuerte');

-- Bebidas (8)
INSERT INTO menu_items (nombre, descripcion, precio, tiempo_preparacion, categoria) VALUES 
('Lulada Valluna', 'Bebida refrescante de lulo machacado', 12000, 5, 'bebida'),
('Limonada de Coco', 'Clásica de la costa caribeña', 14000, 5, 'bebida'),
('Jugo de Maracuyá', 'Natural en agua o leche', 9000, 5, 'bebida'),
('Jugo de Guanábana', 'Natural en leche', 10000, 5, 'bebida'),
('Refajo', 'Cerveza mezclada con Colombiana', 15000, 3, 'bebida'),
('Cerveza Club Colombia', 'Dorada, Roja o Negra', 9000, 2, 'bebida'),
('Aguardiente Antioqueño', 'Trago individual (Shot)', 8000, 1, 'bebida'),
('Café Tinto', 'Café 100% colombiano de exportación', 4500, 3, 'bebida');

-- Postres (8)
INSERT INTO menu_items (nombre, descripcion, precio, tiempo_preparacion, categoria) VALUES 
('Brevas con Arequipe', 'Brevas caladas con dulce de leche', 14000, 5, 'postre'),
('Postre de Natas', 'Clásico postre de leche y yemas', 16000, 5, 'postre'),
('Obleas', 'Con arequipe, queso, mora y crema', 12000, 5, 'postre'),
('Arroz con Leche', 'Casero con pasas y canela', 10000, 5, 'postre'),
('Merengón', 'Merengue con crema, fresas y guanábana', 18000, 8, 'postre'),
('Cascos de Guayaba', 'Guayaba dulce con queso campesino', 15000, 5, 'postre'),
('Cuajada con Melao', 'Queso fresco bañado en panela derretida', 13000, 5, 'postre'),
('Esponjado de Maracuyá', 'Suave postre de la fruta de la pasión', 15000, 8, 'postre');

-- 6. Crear Pedidos de Prueba
-- Pedido 1 (En preparación - Mesa 12)
INSERT INTO pedidos (mesa_id, cliente, mesero_id, estado) VALUES (12, 'Familia Jaramillo', 4, 'en_preparacion');
INSERT INTO pedido_items (pedido_id, item_menu_id, cantidad) VALUES 
(1, 1, 2), -- Empanadas
(1, 11, 2), -- Bandeja Paisa
(1, 12, 1), -- Ajiaco
(1, 26, 3), -- Lulada
(1, 35, 1); -- Merengón

-- Pedido 2 (Listo - Mesa 6)
INSERT INTO pedidos (mesa_id, cliente, mesero_id, estado) VALUES (6, 'Ejecutivos', 5, 'listo');
INSERT INTO pedido_items (pedido_id, item_menu_id, cantidad) VALUES 
(2, 3, 1), -- Patacones
(2, 18, 2), -- Pescado frito
(2, 27, 2); -- Limonada de Coco

-- Pedido 3 (Entregado - Mesa 2)
INSERT INTO pedidos (mesa_id, cliente, mesero_id, estado) VALUES (2, 'Pareja VIP', 4, 'entregado');
INSERT INTO pedido_items (pedido_id, item_menu_id, cantidad) VALUES 
(2, 14, 1), -- Mote de queso
(2, 22, 1), -- Fritanga
(2, 30, 2); -- Refajo
