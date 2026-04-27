const { Pool } = require('pg')
const crypto = require('crypto')

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex')
}

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_vOSUjhDfk20Z@ep-wandering-dew-amx5upwb.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
})

async function run() {
  console.log('Connecting to Neon...');
  
  try {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(64) UNIQUE NOT NULL,
      name VARCHAR(128) NOT NULL,
      password_hash VARCHAR(128) NOT NULL,
      role VARCHAR(32) NOT NULL,
      especialidad VARCHAR(32),
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS mesas (
      id SERIAL PRIMARY KEY,
      numero INT UNIQUE NOT NULL,
      capacidad INT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS menu_items (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(128) NOT NULL,
      descripcion TEXT,
      precio NUMERIC(10,2) NOT NULL,
      tiempo_preparacion INT NOT NULL,
      categoria VARCHAR(32) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reservas (
      id SERIAL PRIMARY KEY,
      cliente VARCHAR(128) NOT NULL,
      mesa_id INT NOT NULL REFERENCES mesas(id) ON DELETE CASCADE,
      fecha_hora TIMESTAMPTZ NOT NULL,
      duracion INT NOT NULL DEFAULT 2,
      numero_personas INT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS pedidos (
      id SERIAL PRIMARY KEY,
      mesa_id INT NOT NULL REFERENCES mesas(id) ON DELETE CASCADE,
      cliente VARCHAR(128),
      mesero_id INT REFERENCES users(id),
      estado VARCHAR(32) NOT NULL DEFAULT 'en_preparacion',
      creado_en TIMESTAMPTZ DEFAULT NOW(),
      actualizado_en TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS pedido_items (
      id SERIAL PRIMARY KEY,
      pedido_id INT NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
      item_menu_id INT NOT NULL REFERENCES menu_items(id),
      cantidad INT NOT NULL DEFAULT 1,
      estado VARCHAR(32) NOT NULL DEFAULT 'en_preparacion'
    );
  `)
  console.log('Tables created successfully.');
  
  const existing = await pool.query('SELECT id FROM users LIMIT 1')
  if (existing.rowCount === 0) {
    console.log('Seeding...');
    await pool.query(
      'INSERT INTO users (username, name, password_hash, role) VALUES ($1, $2, $3, $4)',
      ['admin', 'Administrador', hashPassword('admin123'), 'admin']
    )
    await pool.query(
      'INSERT INTO users (username, name, password_hash, role) VALUES ($1, $2, $3, $4)',
      ['maitre', 'Carlos Maitre', hashPassword('123'), 'maitre']
    )
    await pool.query(
      'INSERT INTO users (username, name, password_hash, role) VALUES ($1, $2, $3, $4)',
      ['mesero', 'Ana Mesera', hashPassword('123'), 'mesero']
    )

    for (let i = 1; i <= 5; i++) {
      await pool.query(
        'INSERT INTO users (username, name, password_hash, role, especialidad) VALUES ($1, $2, $3, $4, $5)',
        [`c_entrada${i}`, `Cocinero Entrada ${i}`, hashPassword('123'), 'cocinero', 'entrada']
      )
    }
    for (let i = 1; i <= 8; i++) {
      await pool.query(
        'INSERT INTO users (username, name, password_hash, role, especialidad) VALUES ($1, $2, $3, $4, $5)',
        [`c_fuerte${i}`, `Cocinero Fuerte ${i}`, hashPassword('123'), 'cocinero', 'plato_fuerte']
      )
    }
    for (let i = 1; i <= 5; i++) {
      await pool.query(
        'INSERT INTO users (username, name, password_hash, role, especialidad) VALUES ($1, $2, $3, $4, $5)',
        [`c_postre${i}`, `Cocinero Postre ${i}`, hashPassword('123'), 'cocinero', 'postre']
      )
    }
    for (let i = 1; i <= 3; i++) {
      await pool.query(
        'INSERT INTO users (username, name, password_hash, role, especialidad) VALUES ($1, $2, $3, $4, $5)',
        [`c_bebida${i}`, `Cocinero Bebida ${i}`, hashPassword('123'), 'cocinero', 'bebida']
      )
    }

    const configMesas = [4, 4, 4, 4, 4, 6, 6, 6, 12];
    for (let i = 0; i < configMesas.length; i++) {
      await pool.query('INSERT INTO mesas (numero, capacidad) VALUES ($1, $2)', [i + 1, configMesas[i]])
    }

    const menuItems = [
      { nombre: 'Empanadas de Pipían', desc: 'Con ají de maní (3 uds)', precio: 6000, t: 10, cat: 'entrada' },
      { nombre: 'Arepa de Choclo', desc: 'Con queso cuajada', precio: 8000, t: 12, cat: 'entrada' },
      { nombre: 'Patacones con Hogao', desc: 'Crujientes con guiso criollo', precio: 7500, t: 15, cat: 'entrada' },
      { nombre: 'Carimañolas', desc: 'Rellenas de carne molida', precio: 9000, t: 15, cat: 'entrada' },
      { nombre: 'Aborrajados', desc: 'Plátano maduro relleno de queso', precio: 8500, t: 12, cat: 'entrada' },
      { nombre: 'Chorizo Santarrosano', desc: 'Con arepa blanca', precio: 12000, t: 10, cat: 'entrada' },
      { nombre: 'Marranitas', desc: 'Plátano relleno de chicharrón', precio: 9500, t: 15, cat: 'entrada' },
      { nombre: 'Ceviche de Chicharrón', desc: 'Con suero costeño', precio: 15000, t: 10, cat: 'entrada' },
      { nombre: 'Buñuelos Rellenos', desc: 'De queso crema', precio: 5000, t: 8, cat: 'entrada' },
      { nombre: 'Morcilla Envigadeña', desc: 'Con papitas criollas', precio: 11000, t: 10, cat: 'entrada' },
      
      { nombre: 'Bandeja Paisa', desc: 'Frijol, arroz, chicharrón, carne molida, huevo, plátano, arepa, chorizo', precio: 35000, t: 25, cat: 'plato_fuerte' },
      { nombre: 'Ajiaco Santafereño', desc: 'Sopa con 3 papas, pollo, guasca, crema y alcaparras', precio: 28000, t: 20, cat: 'plato_fuerte' },
      { nombre: 'Sancocho de Gallina', desc: 'Con arroz y aguacate', precio: 30000, t: 30, cat: 'plato_fuerte' },
      { nombre: 'Lechona Tolimense', desc: 'Porción con arepa e insulso', precio: 25000, t: 10, cat: 'plato_fuerte' },
      { nombre: 'Mote de Queso', desc: 'Sopa espesa de ñame con queso costeño', precio: 26000, t: 20, cat: 'plato_fuerte' },
      { nombre: 'Pusandao de Bagre', desc: 'Típico del pacífico', precio: 32000, t: 25, cat: 'plato_fuerte' },
      { nombre: 'Cazuela de Mariscos', desc: 'Con arroz con coco', precio: 45000, t: 30, cat: 'plato_fuerte' },
      { nombre: 'Mamona', desc: 'Ternera a la llanera con yuca', precio: 38000, t: 25, cat: 'plato_fuerte' },
      { nombre: 'Sobrebarriga al Horno', desc: 'Con papas chorreadas', precio: 31000, t: 25, cat: 'plato_fuerte' },
      { nombre: 'Posta Negra Cartagenera', desc: 'Con arroz con coco y patacón', precio: 36000, t: 30, cat: 'plato_fuerte' },
      { nombre: 'Sancocho Trifásico', desc: 'Res, cerdo y gallina', precio: 33000, t: 35, cat: 'plato_fuerte' },
      { nombre: 'Fritanga Bogotana', desc: 'Picada típica para compartir', precio: 50000, t: 25, cat: 'plato_fuerte' },
      { nombre: 'Mondongo', desc: 'Sopa tradicional de tripas', precio: 24000, t: 20, cat: 'plato_fuerte' },
      { nombre: 'Arroz Atollado', desc: 'Arroz húmedo con cerdo y pollo', precio: 29000, t: 25, cat: 'plato_fuerte' },
      { nombre: 'Viudo de Pescado', desc: 'Pescado cocido al vapor', precio: 34000, t: 30, cat: 'plato_fuerte' },
      { nombre: 'Pepitoria', desc: 'Plato santandereano con arroz', precio: 28000, t: 20, cat: 'plato_fuerte' },
      { nombre: 'Cabrito al Horno', desc: 'Con yuca y arepa', precio: 39000, t: 30, cat: 'plato_fuerte' },
      { nombre: 'Tamal Tolimense', desc: 'Con arepa y chocolate', precio: 18000, t: 15, cat: 'plato_fuerte' },
      { nombre: 'Cuchuco con Espinazo', desc: 'Sopa espesa de trigo', precio: 22000, t: 20, cat: 'plato_fuerte' },
      { nombre: 'Mojarra Frita', desc: 'Con arroz de coco y patacón', precio: 35000, t: 25, cat: 'plato_fuerte' },

      { nombre: 'Arroz con Leche', desc: 'Con canela y pasas', precio: 8000, t: 5, cat: 'postre' },
      { nombre: 'Postre de Natas', desc: 'Clásico bogotano', precio: 9500, t: 5, cat: 'postre' },
      { nombre: 'Brevas con Arequipe', desc: 'Y queso fresco', precio: 8500, t: 5, cat: 'postre' },
      { nombre: 'Merengón', desc: 'Con guanábana, fresas y crema', precio: 12000, t: 8, cat: 'postre' },
      { nombre: 'Cuajada con Melao', desc: 'Queso fresco con almíbar de panela', precio: 7500, t: 5, cat: 'postre' },
      { nombre: 'Enyucado', desc: 'Torta de yuca y coco', precio: 9000, t: 5, cat: 'postre' },
      { nombre: 'Arequipe con Obleas', desc: 'Con queso y mora', precio: 6000, t: 5, cat: 'postre' },

      { nombre: 'Lulada', desc: 'Bebida refrescante de lulo', precio: 7000, t: 5, cat: 'bebida' },
      { nombre: 'Refajo', desc: 'Mezcla de cerveza y colombiana', precio: 9000, t: 3, cat: 'bebida' },
      { nombre: 'Aguapanela con Limón', desc: 'Fría', precio: 4000, t: 2, cat: 'bebida' },
      { nombre: 'Jugo de Maracuyá', desc: 'En agua o leche', precio: 6000, t: 5, cat: 'bebida' },
      { nombre: 'Jugo de Guanábana', desc: 'En agua o leche', precio: 6500, t: 5, cat: 'bebida' },
      { nombre: 'Champús', desc: 'Bebida vallecaucana con maíz', precio: 8000, t: 5, cat: 'bebida' },
      { nombre: 'Limonada de Coco', desc: 'Refrescante y cremosa', precio: 8500, t: 5, cat: 'bebida' },
      { nombre: 'Cerveza Club Colombia', desc: 'Dorada, Roja o Negra', precio: 6000, t: 2, cat: 'bebida' },
      { nombre: 'Tinto', desc: 'Café negro tradicional', precio: 3000, t: 3, cat: 'bebida' },
      { nombre: 'Milo Frío', desc: 'Bebida achocolatada fría', precio: 6000, t: 3, cat: 'bebida' }
    ]
    
    for (const item of menuItems) {
      await pool.query(
        'INSERT INTO menu_items (nombre, descripcion, precio, tiempo_preparacion, categoria) VALUES ($1, $2, $3, $4, $5)',
        [item.nombre, item.desc, item.precio, item.t, item.cat]
      )
    }

    const now = new Date()
    const r1 = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    await pool.query(
      'INSERT INTO reservas (cliente, mesa_id, fecha_hora, duracion, numero_personas) VALUES ($1, $2, $3, $4, $5)',
      ['Familia Rodríguez', 1, r1.toISOString(), 2, 4]
    )

    const meseroId = (await pool.query('SELECT id FROM users WHERE username = $1', ['mesero'])).rows[0].id
    const empanadaId = (await pool.query('SELECT id FROM menu_items WHERE nombre = $1', ['Empanadas de Pipían'])).rows[0].id
    const bandejaId = (await pool.query('SELECT id FROM menu_items WHERE nombre = $1', ['Bandeja Paisa'])).rows[0].id
    const luladaId = (await pool.query('SELECT id FROM menu_items WHERE nombre = $1', ['Lulada'])).rows[0].id
    
    const pedido1 = (await pool.query(
      'INSERT INTO pedidos (mesa_id, cliente, mesero_id, estado) VALUES ($1, $2, $3, $4) RETURNING id',
      [2, 'Mesa 2', meseroId, 'en_preparacion']
    )).rows[0].id
    
    await pool.query('INSERT INTO pedido_items (pedido_id, item_menu_id, cantidad, estado) VALUES ($1, $2, $3, $4)', [pedido1, empanadaId, 1, 'en_preparacion'])
    await pool.query('INSERT INTO pedido_items (pedido_id, item_menu_id, cantidad, estado) VALUES ($1, $2, $3, $4)', [pedido1, bandejaId, 2, 'en_preparacion'])
    await pool.query('INSERT INTO pedido_items (pedido_id, item_menu_id, cantidad, estado) VALUES ($1, $2, $3, $4)', [pedido1, luladaId, 2, 'listo'])
    
    console.log('Seeding finished.');
  } else {
    console.log('Already seeded.');
  }
  
} catch(e) {
  console.error('ERROR:', e);
} finally {
  await pool.end();
}
}
run();
