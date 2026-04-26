import { query } from '~/server/utils/db'
import { readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) as { nombre?: string; descripcion?: string; precio?: number; tiempo_preparacion?: number; categoria?: string }

  if (!body.nombre || body.precio == null || body.tiempo_preparacion == null || !body.categoria) {
    throw createError({ statusCode: 400, statusMessage: 'Todos los campos del menú son obligatorios' })
  }

  await query(
    'INSERT INTO menu_items (nombre, descripcion, precio, tiempo_preparacion, categoria) VALUES ($1, $2, $3, $4, $5)',
    [body.nombre, body.descripcion || '', body.precio, body.tiempo_preparacion, body.categoria],
  )
  return { success: true }
})
