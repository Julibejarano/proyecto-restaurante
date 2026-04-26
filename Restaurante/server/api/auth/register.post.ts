import { query } from '~/server/utils/db'
import { hashPassword } from '~/server/utils/auth'
import { readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) as { username?: string; password?: string; name?: string; role?: string; especialidad?: string }

  if (!body.username || !body.password || !body.name || !body.role) {
    throw createError({ statusCode: 400, statusMessage: 'Todos los campos son obligatorios' })
  }

  const existing = await query('SELECT id FROM users WHERE username = $1', [body.username])
  if (existing.length > 0) {
    throw createError({ statusCode: 409, statusMessage: 'Usuario ya existe' })
  }

  const especialidad = body.role === 'cocinero' ? (body.especialidad || null) : null;

  await query('INSERT INTO users (username, name, password_hash, role, especialidad) VALUES ($1, $2, $3, $4, $5)', [
    body.username,
    body.name,
    hashPassword(body.password),
    body.role,
    especialidad
  ])

  return { success: true }
})
