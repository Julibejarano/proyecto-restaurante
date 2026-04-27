import { query } from '~/server/utils/db'
import { readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params?.id || '0')
  const body = await readBody(event) as { cliente?: string; mesa_id?: number; fecha_hora?: string; numero_personas?: number }

  if (!id || !body.cliente || !body.mesa_id || !body.fecha_hora || !body.numero_personas) {
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

  if (start.getTime() < Date.now()) {
    throw createError({ statusCode: 400, statusMessage: 'La reserva no puede ser en el pasado' })
  }

  const day = start.getDay() // 0: Dom, 1: Lun, 2: Mar, 3: Mie, 4: Jue, 5: Vie, 6: Sab
  const timeFloat = start.getHours() + (start.getMinutes() / 60.0)

  // Temporalmente Domingo (0) es 24 horas para pruebas
  if (day !== 0) {
    if (timeFloat < 11) {
      throw createError({ statusCode: 400, statusMessage: 'El restaurante abre a las 11:00 AM' })
    }

    if (day >= 4 && day <= 6) { // Jueves, Viernes, Sábado
      if (timeFloat > 22) {
        throw createError({ statusCode: 400, statusMessage: 'Las reservas los Jueves, Viernes y Sábados son máximo hasta las 10:00 PM' })
      }
    } else { // Lunes, Martes, Miércoles
      if (timeFloat > 19) {
        throw createError({ statusCode: 400, statusMessage: 'Las reservas de Lunes a Miércoles son máximo hasta las 7:00 PM' })
      }
    }
  }
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000)

  // Validar cruce de reservas en la misma mesa (excluyendo la reserva actual)
  const mesaOverlapping = await query(
    `SELECT 1 FROM reservas WHERE id != $4 AND mesa_id = $1 AND fecha_hora < $2 AND (fecha_hora + interval '2 hour') > $3 LIMIT 1`,
    [body.mesa_id, end.toISOString(), start.toISOString(), id],
  )
  if (mesaOverlapping.length > 0) {
    throw createError({ statusCode: 409, statusMessage: 'La mesa no está disponible en ese horario' })
  }

  // Validar que la mesa seleccionada sea estrictamente la de capacidad más cercana al grupo
  const allMesasQueCaben = await query(`SELECT capacidad FROM mesas WHERE capacidad >= $1`, [body.numero_personas])
  
  if (allMesasQueCaben.length > 0) {
    const minCap = Math.min(...allMesasQueCaben.map(m => Number(m.capacidad)))
    if (Number(mesa[0].capacidad) > minCap) {
      throw createError({ statusCode: 400, statusMessage: `Regla de optimización: Para ${body.numero_personas} personas, solo puedes reservar mesas de ${minCap} asientos (la capacidad mayor más cercana).` })
    }
  }

  // Validar capacidad total del restaurante en ese rango de tiempo (excluyendo la reserva actual)
  const capacityRows = await query(
    `SELECT COALESCE(SUM(numero_personas), 0) AS ocupacion FROM reservas
     WHERE id != $3 AND fecha_hora < $2 AND (fecha_hora + interval '2 hour') > $1`,
    [start.toISOString(), end.toISOString(), id],
  )
  const totalReserved = Number(capacityRows[0]?.ocupacion || 0)
  const capacityTotalRows = await query('SELECT COALESCE(SUM(capacidad), 0) AS total FROM mesas')
  const totalCapacity = Number(capacityTotalRows[0]?.total || 0)

  if (totalReserved + body.numero_personas > totalCapacity) {
    throw createError({ statusCode: 409, statusMessage: 'No se puede superar el cupo total del restaurante' })
  }

  // Actualizar la reserva
  await query(
    'UPDATE reservas SET cliente = $1, mesa_id = $2, fecha_hora = $3, numero_personas = $4 WHERE id = $5',
    [body.cliente, body.mesa_id, start.toISOString(), body.numero_personas, id],
  )

  return { success: true }
})
