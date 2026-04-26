import { query } from '~/server/utils/db'

export default defineEventHandler(async () => {
  return await query('SELECT id, numero, capacidad FROM mesas ORDER BY numero')
})
