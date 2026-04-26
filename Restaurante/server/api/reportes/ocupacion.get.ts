import { query } from '~/server/utils/db'

export default defineEventHandler(async () => {
  const mesas = await query(`
    SELECT m.numero, m.capacidad, COUNT(r.id) as total_reservas
    FROM mesas m
    LEFT JOIN reservas r ON m.id = r.mesa_id
    GROUP BY m.id, m.numero, m.capacidad
    ORDER BY total_reservas DESC
  `)

  return mesas
})
