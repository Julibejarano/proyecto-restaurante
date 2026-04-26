import { query } from '~/server/utils/db'
export default defineEventHandler(async () => {
  return await query(
    `SELECT r.id, r.cliente, r.mesa_id, m.numero AS mesa_numero, r.fecha_hora, r.duracion, r.numero_personas
     FROM reservas r
     JOIN mesas m ON m.id = r.mesa_id
     ORDER BY r.fecha_hora DESC`,
  )
})
