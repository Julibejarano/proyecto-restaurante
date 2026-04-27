import { query } from '~/server/utils/db'
import { readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) as { numero?: number; capacidad?: number }
  if (!body.numero || !body.capacidad) {
    throw createError({ statusCode: 400, statusMessage: 'Número y capacidad son obligatorios' })
  }

  const existingMesa = await query('SELECT 1 FROM mesas WHERE numero = $1', [body.numero])
  if (existingMesa.length > 0) {
    throw createError({ statusCode: 409, statusMessage: `Ya existe una mesa con el número ${body.numero}` })
  }

  const capacityTotalRows = await query('SELECT COALESCE(SUM(capacidad), 0) AS total FROM mesas')
  const totalCapacity = Number(capacityTotalRows[0]?.total || 0)
  
  if (totalCapacity + body.capacidad > 50) {
    throw createError({ statusCode: 409, statusMessage: `La capacidad total del restaurante no puede superar los 50 asientos. Ocupación actual: ${totalCapacity}` })
  }

  await query('INSERT INTO mesas (numero, capacidad) VALUES ($1, $2)', [body.numero, body.capacidad])
  return { success: true }
})
