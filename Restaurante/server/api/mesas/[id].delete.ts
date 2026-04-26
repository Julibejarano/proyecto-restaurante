import { query } from '~/server/utils/db'
export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params?.id)
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Identificador no válido' })
  }
  await query('DELETE FROM mesas WHERE id = $1', [id])
  return { success: true }
})
