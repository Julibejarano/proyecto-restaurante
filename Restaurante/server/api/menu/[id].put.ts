import { query } from '~/server/utils/db'
import { readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params?.id || '0')
  const body = await readBody(event) as { nombre?: string; descripcion?: string; precio?: number; tiempo_preparacion?: number; categoria?: string }

  if (!id || !body.nombre || body.precio == null || body.tiempo_preparacion == null || !body.categoria) {
    throw createError({ statusCode: 400, statusMessage: 'Datos inválidos o incompletos' })
  }

  await query(
    'UPDATE menu_items SET nombre = $1, descripcion = $2, precio = $3, tiempo_preparacion = $4, categoria = $5 WHERE id = $6',
    [body.nombre, body.descripcion || '', body.precio, body.tiempo_preparacion, body.categoria, id]
  )
  
  return { success: true }
})
