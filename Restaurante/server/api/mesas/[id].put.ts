import { query } from '~/server/utils/db'
import { readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params?.id)
  const body = await readBody(event) as { numero?: number; capacidad?: number }

  if (!id || !body.numero || !body.capacidad) {
    throw createError({ statusCode: 400, statusMessage: 'Datos inválidos' })
  }

  await query('UPDATE mesas SET numero = $1, capacidad = $2 WHERE id = $3', [body.numero, body.capacidad, id])
  return { success: true }
})
