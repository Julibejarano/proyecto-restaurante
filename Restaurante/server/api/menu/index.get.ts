import { query } from '~/server/utils/db'
export default defineEventHandler(async () => {
  return await query('SELECT id, nombre, descripcion, precio, tiempo_preparacion, categoria FROM menu_items ORDER BY id')
})
