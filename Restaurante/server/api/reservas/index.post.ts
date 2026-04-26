import { query } from '~/server/utils/db'
import { readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) as { cliente?: string; mesa_id?: number; fecha_hora?: string; numero_personas?: number }

  if (!body.cliente || !body.mesa_id || !body.fecha_hora || !body.numero_personas) {
    throw createError({ statusCode: 400, statusMessage: 'Todos los campos de la reserva son obligatorios' })
  }

  const mesa = await query('SELECT capacidad FROM mesas WHERE id = $1', [body.mesa_id])
  if (mesa.length === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Mesa no encontrada' })
  }
  if (body.numero_personas > mesa[0].capacidad) {
    throw createError({ statusCode: 400, statusMessage: `La mesa seleccionada sólo tiene capacidad para ${mesa[0].capacidad} personas` })
  }

  const start = new Date(body.fecha_hora)
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000)

  const mesaOverlapping = await query(
    `SELECT 1 FROM reservas WHERE mesa_id = $1 AND fecha_hora < $2 AND (fecha_hora + interval '2 hour') > $3 LIMIT 1`,
    [body.mesa_id, end.toISOString(), start.toISOString()],
  )
  if (mesaOverlapping.length > 0) {
    throw createError({ statusCode: 409, statusMessage: 'La mesa no está disponible en ese horario' })
  }

  const capacityRows = await query(
    `SELECT COALESCE(SUM(numero_personas), 0) AS ocupacion FROM reservas
     WHERE fecha_hora < $2 AND (fecha_hora + interval '2 hour') > $1`,
    [start.toISOString(), end.toISOString()],
  )
  const totalReserved = Number(capacityRows[0]?.ocupacion || 0)
  const capacityTotalRows = await query('SELECT COALESCE(SUM(capacidad), 0) AS total FROM mesas')
  const totalCapacity = Number(capacityTotalRows[0]?.total || 0)

  if (totalReserved + body.numero_personas > totalCapacity) {
    throw createError({ statusCode: 409, statusMessage: 'No se puede superar el cupo total del restaurante' })
  }

  await query(
    'INSERT INTO reservas (cliente, mesa_id, fecha_hora, duracion, numero_personas) VALUES ($1, $2, $3, 2, $4)',
    [body.cliente, body.mesa_id, start.toISOString(), body.numero_personas],
  )

  return { success: true }
})
