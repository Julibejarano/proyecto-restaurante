import { query } from '~/server/utils/db'
import { readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) as { numero?: number; capacidad?: number }
  if (!body.numero || !body.capacidad) {
    throw createError({ statusCode: 400, statusMessage: 'Número y capacidad son obligatorios' })
  }
  await query('INSERT INTO mesas (numero, capacidad) VALUES ($1, $2)', [body.numero, body.capacidad])
  return { success: true }
})
