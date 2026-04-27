import { query } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const itemId = getRouterParam(event, 'id')
  const body = await readBody(event)
  
  if (!body.estado) {
    throw createError({ statusCode: 400, message: 'Estado es requerido' })
  }

  await query('UPDATE pedido_items SET estado = $1 WHERE id = $2', [body.estado, itemId])
  
  const items = await query('SELECT pedido_id FROM pedido_items WHERE id = $1', [itemId])
  if (items.length > 0) {
    const pedidoId = items[0].pedido_id
    const allItems = await query('SELECT estado FROM pedido_items WHERE pedido_id = $1', [pedidoId])
    const allReady = allItems.every(i => i.estado === 'listo' || i.estado === 'entregado')
    if (allReady) {
      await query('UPDATE pedidos SET estado = $1, actualizado_en = NOW() WHERE id = $2', ['listo', pedidoId])
    } else {
      await query('UPDATE pedidos SET estado = $1, actualizado_en = NOW() WHERE id = $2', ['en_preparacion', pedidoId])
    }
  }

  return { success: true }
})
