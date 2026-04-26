import { query } from '~/server/utils/db'

export default defineEventHandler(async () => {
  // Total ingresos de pedidos entregados
  const ventas = await query(`
    SELECT COALESCE(SUM(pi.cantidad * mi.precio), 0) as total_ingresos
    FROM pedido_items pi
    JOIN pedidos p ON pi.pedido_id = p.id
    JOIN menu_items mi ON pi.item_menu_id = mi.id
    WHERE p.estado = 'entregado'
  `)

  // Pedidos completados
  const pedidosCompletados = await query(`
    SELECT COUNT(*) as count FROM pedidos WHERE estado = 'entregado'
  `)

  return {
    total_ingresos: parseFloat(ventas[0].total_ingresos),
    pedidos_completados: parseInt(pedidosCompletados[0].count)
  }
})
