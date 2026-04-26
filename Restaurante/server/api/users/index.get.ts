import { query } from '~/server/utils/db'

export default defineEventHandler(async () => {
  const rows = await query('SELECT id, username, name, role FROM users ORDER BY id')
  return rows
})
