import { query } from '~/server/utils/db'

export default defineEventHandler(async () => {
  const mesas = await query(`
    SELECT m.id, m.numero, m.capacidad, 
           COUNT(r.id) as total_reservas,
           (
             EXISTS(SELECT 1 FROM pedidos p WHERE p.mesa_id = m.id AND p.estado IN ('en_preparacion', 'listo'))
             OR 
             EXISTS(SELECT 1 FROM reservas r2 WHERE r2.mesa_id = m.id AND r2.fecha_hora <= NOW() AND (r2.fecha_hora + interval '2 hour') > NOW())
           ) as ocupada
    FROM mesas m
    LEFT JOIN reservas r ON m.id = r.mesa_id
    GROUP BY m.id, m.numero, m.capacidad
    ORDER BY m.numero ASC
  `)

  let personasOcupando = 0;
  let capacidadTotal = 0;

  mesas.forEach(m => {
    capacidadTotal += Number(m.capacidad);
    if (m.ocupada) {
      personasOcupando += Number(m.capacidad);
    }
  })

  return {
    mesas,
    ocupacion_actual: personasOcupando,
    capacidad_total: capacidadTotal,
    porcentaje: Math.round((personasOcupando / (capacidadTotal || 1)) * 100)
  }
})
