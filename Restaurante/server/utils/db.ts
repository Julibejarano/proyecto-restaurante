import { Pool } from 'pg'
import { hashPassword } from './auth'
import { useRuntimeConfig } from '#imports'

const config = useRuntimeConfig()

// Pool para conectar a la DB por defecto para crear la DB si no existe
const adminPool = new Pool({
  host: config.pgHost,
  port: Number(config.pgPort),
  database: 'postgres', // DB por defecto
  user: config.pgUser,
  password: config.pgPassword,
})

const pool = new Pool({
  host: config.pgHost,
  port: Number(config.pgPort),
  database: config.pgDatabase,
  user: config.pgUser,
  password: config.pgPassword,
})

export async function query<T = any>(text: string, values: any[] = []) {
  const result = await pool.query<T>(text, values)
  return result.rows
}

export async function initSchema() {
  // Crear la DB si no existe
  try {
    await adminPool.query(`CREATE DATABASE ${config.pgDatabase}`)
  } catch (e) {
    // Ya existe, ignorar
  }

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
      cantidad INT NOT NULL DEFAULT 1
    );
  `)

  const existing = await pool.query('SELECT id FROM users LIMIT 1')
  if (existing.rowCount === 0) {
    // Crear admin
    await pool.query(
      'INSERT INTO users (username, name, password_hash, role) VALUES ($1, $2, $3, $4)',
      ['admin', 'Administrador', hashPassword('admin123'), 'admin'],
    )

    // Crear empleados
    const empleados = [
      { username: 'maitre', name: 'Carlos Maitre', password: '123', role: 'maitre' },
      { username: 'mesero', name: 'Ana Mesera', password: '123', role: 'mesero' },
      { username: 'cocinero', name: 'Chef Gomez', password: '123', role: 'cocinero' },
    ]
    for (const e of empleados) {
      await pool.query(
        'INSERT INTO users (username, name, password_hash, role) VALUES ($1, $2, $3, $4)',
        [e.username, e.name, hashPassword(e.password), e.role],
      )
    }

    // Crear mesas
    for (let i = 1; i <= 8; i++) {
      const capacidad = i <= 4 ? 4 : (i <= 6 ? 2 : 8)
      await pool.query('INSERT INTO mesas (numero, capacidad) VALUES ($1, $2)', [i, capacidad])
    }

    // Crear menú
    const menuItems = [
      { nombre: 'Empanadas', descripcion: 'Deliciosas empanadas de carne', precio: 5.00, tiempo_preparacion: 10, categoria: 'entrada' },
      { nombre: 'Sopa de Tomate', descripcion: 'Sopa de tomate casera con crutones', precio: 6.50, tiempo_preparacion: 15, categoria: 'entrada' },
      { nombre: 'Lomo Saltado', descripcion: 'Trozos de lomo con cebolla, tomate y papas fritas', precio: 18.00, tiempo_preparacion: 25, categoria: 'plato_fuerte' },
      { nombre: 'Salmón a la Plancha', descripcion: 'Salmón fresco con espárragos al vapor', precio: 22.00, tiempo_preparacion: 30, categoria: 'plato_fuerte' },
      { nombre: 'Tiramisú', descripcion: 'Postre italiano clásico', precio: 7.00, tiempo_preparacion: 5, categoria: 'postre' },
      { nombre: 'Limonada con Menta', descripcion: 'Limonada refrescante', precio: 3.50, tiempo_preparacion: 5, categoria: 'bebida' },
      { nombre: 'Cerveza Artesanal', descripcion: 'Cerveza IPA local', precio: 4.50, tiempo_preparacion: 2, categoria: 'bebida' },
    ]
    for (const item of menuItems) {
      await pool.query(
        'INSERT INTO menu_items (nombre, descripcion, precio, tiempo_preparacion, categoria) VALUES ($1, $2, $3, $4, $5)',
        [item.nombre, item.descripcion, item.precio, item.tiempo_preparacion, item.categoria],
      )
    }

    // Crear reservas de prueba
    const now = new Date()
    const reserva1 = new Date(now.getTime() + 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000) // +1 día +2 horas
    const reserva2 = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000) // +2 días
    await pool.query(
      'INSERT INTO reservas (cliente, mesa_id, fecha_hora, duracion, numero_personas) VALUES ($1, $2, $3, $4, $5)',
      ['Familia Pérez', 1, reserva1.toISOString(), 2, 4],
    )
    await pool.query(
      'INSERT INTO reservas (cliente, mesa_id, fecha_hora, duracion, numero_personas) VALUES ($1, $2, $3, $4, $5)',
      ['Sr. Rodriguez', 2, reserva2.toISOString(), 2, 2],
    )

    // Crear pedidos de prueba
    const meseroId = (await pool.query('SELECT id FROM users WHERE username = $1', ['mesero'])).rows[0].id
    const lomoId = (await pool.query('SELECT id FROM menu_items WHERE nombre = $1', ['Lomo Saltado'])).rows[0].id
    const limonadaId = (await pool.query('SELECT id FROM menu_items WHERE nombre = $1', ['Limonada con Menta'])).rows[0].id
    const salmonId = (await pool.query('SELECT id FROM menu_items WHERE nombre = $1', ['Salmón a la Plancha'])).rows[0].id
    const tiramisuId = (await pool.query('SELECT id FROM menu_items WHERE nombre = $1', ['Tiramisú'])).rows[0].id

    // Pedido en preparación
    const pedido1 = (await pool.query(
      'INSERT INTO pedidos (mesa_id, cliente, mesero_id, estado) VALUES ($1, $2, $3, $4) RETURNING id',
      [1, 'Mesa 1', meseroId, 'en_preparacion']
    )).rows[0].id
    await pool.query('INSERT INTO pedido_items (pedido_id, item_menu_id, cantidad) VALUES ($1, $2, $3)', [pedido1, lomoId, 2])
    await pool.query('INSERT INTO pedido_items (pedido_id, item_menu_id, cantidad) VALUES ($1, $2, $3)', [pedido1, limonadaId, 2])

    // Pedido listo
    const pedido2 = (await pool.query(
      'INSERT INTO pedidos (mesa_id, cliente, mesero_id, estado) VALUES ($1, $2, $3, $4) RETURNING id',
      [2, 'Mesa 2', meseroId, 'listo']
    )).rows[0].id
    await pool.query('INSERT INTO pedido_items (pedido_id, item_menu_id, cantidad) VALUES ($1, $2, $3)', [pedido2, salmonId, 1])
    await pool.query('INSERT INTO pedido_items (pedido_id, item_menu_id, cantidad) VALUES ($1, $2, $3)', [pedido2, limonadaId, 1])

    // Pedido entregado
    const pedido3 = (await pool.query(
      'INSERT INTO pedidos (mesa_id, cliente, mesero_id, estado) VALUES ($1, $2, $3, $4) RETURNING id',
      [5, 'Cliente VIP', meseroId, 'entregado']
    )).rows[0].id
    await pool.query('INSERT INTO pedido_items (pedido_id, item_menu_id, cantidad) VALUES ($1, $2, $3)', [pedido3, lomoId, 4])
    await pool.query('INSERT INTO pedido_items (pedido_id, item_menu_id, cantidad) VALUES ($1, $2, $3)', [pedido3, tiramisuId, 4])
  }
}
