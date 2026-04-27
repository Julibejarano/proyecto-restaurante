import { query } from '~/server/utils/db'
import { readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) as { mesa_id?: number; cliente?: string; items?: number[] }

  const clienteName = body.cliente || 'Anónimo'

  if (!body.mesa_id || !body.items?.length) {
    throw createError({ statusCode: 400, statusMessage: 'Mesa e ítems son obligatorios' })
  }

  const result = await query('INSERT INTO pedidos (mesa_id, cliente, estado) VALUES ($1, $2, $3) RETURNING id', [body.mesa_id, clienteName, 'en_preparacion'])
  const pedidoId = result[0]?.id
  if (!pedidoId) {
    throw createError({ statusCode: 500, statusMessage: 'No se pudo crear el pedido' })
  }

  for (const itemId of body.items) {
    await query('INSERT INTO pedido_items (pedido_id, item_menu_id, cantidad) VALUES ($1, $2, 1)', [pedidoId, itemId])
  }

  return { success: true }
})
