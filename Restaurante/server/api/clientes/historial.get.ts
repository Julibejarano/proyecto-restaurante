import { query } from '~/server/utils/db'
import { getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  const { cliente } = getQuery(event) as { cliente?: string }

  if (!cliente || cliente.trim() === '') {
    return { reservas: [], pedidos: [] }
  }

  const searchTerm = `%${cliente}%`

  const reservas = await query(
    `SELECT r.id, r.fecha_hora, r.numero_personas, m.numero as mesa_numero 
     FROM reservas r
     JOIN mesas m ON r.mesa_id = m.id
     WHERE r.cliente ILIKE $1
     ORDER BY r.fecha_hora DESC`,
    [searchTerm]
  )

  const pedidos = await query(
    `SELECT p.id, p.estado, p.creado_en, m.numero as mesa_numero,
      COALESCE(json_agg(json_build_object('nombre', mi.nombre, 'cantidad', pi.cantidad)) FILTER (WHERE pi.id IS NOT NULL), '[]') AS items
     FROM pedidos p
     JOIN mesas m ON p.mesa_id = m.id
     LEFT JOIN pedido_items pi ON p.id = pi.pedido_id
     LEFT JOIN menu_items mi ON pi.item_menu_id = mi.id
     WHERE p.cliente ILIKE $1
     GROUP BY p.id, m.numero
     ORDER BY p.creado_en DESC`,
    [searchTerm]
  )

  return { reservas, pedidos }
})
