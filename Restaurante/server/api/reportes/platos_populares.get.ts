import { query } from '~/server/utils/db'

export default defineEventHandler(async () => {
  const platos = await query(`
    SELECT mi.nombre, mi.categoria, SUM(pi.cantidad) as total_pedidos
    FROM pedido_items pi
    JOIN menu_items mi ON pi.item_menu_id = mi.id
    GROUP BY mi.id, mi.nombre, mi.categoria
    ORDER BY total_pedidos DESC
    LIMIT 10
  `)

  return platos
})
