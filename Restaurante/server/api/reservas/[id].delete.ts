import { query } from '~/server/utils/db'
export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params?.id)
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Identificador inválido' })
  }
  await query('DELETE FROM reservas WHERE id = $1', [id])
  return { success: true }
})
