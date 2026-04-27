import { query } from '~/server/utils/db'
import { readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params?.id || '0')
  const body = await readBody(event) as { numero?: number; capacidad?: number }

  if (!id || !body.numero || !body.capacidad) {
    throw createError({ statusCode: 400, statusMessage: 'Datos inválidos' })
  }

  const existingMesa = await query('SELECT 1 FROM mesas WHERE numero = $1 AND id != $2', [body.numero, id])
  if (existingMesa.length > 0) {
    throw createError({ statusCode: 409, statusMessage: `Ya existe otra mesa con el número ${body.numero}` })
  }

  const capacityTotalRows = await query('SELECT COALESCE(SUM(capacidad), 0) AS total FROM mesas WHERE id != $1', [id])
  const totalCapacity = Number(capacityTotalRows[0]?.total || 0)
  
  if (totalCapacity + body.capacidad > 50) {
    throw createError({ statusCode: 409, statusMessage: `La capacidad total del restaurante no puede superar los 50 asientos. Ocupación de otras mesas: ${totalCapacity}` })
  }

  await query('UPDATE mesas SET numero = $1, capacidad = $2 WHERE id = $3', [body.numero, body.capacidad, id])
  return { success: true }
})
