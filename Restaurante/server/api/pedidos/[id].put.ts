import { query } from '~/server/utils/db'
import { readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params?.id)
  const body = await readBody(event) as { estado?: string }

  if (!id || !body.estado) {
    throw createError({ statusCode: 400, statusMessage: 'Datos inválidos' })
  }

  await query('UPDATE pedidos SET estado = $1, actualizado_en = NOW() WHERE id = $2', [body.estado, id])
  return { success: true }
})
