import { query } from '~/server/utils/db'
import { hashPassword, createToken } from '~/server/utils/auth'
import { readBody, setCookie } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) as { username?: string; password?: string }

  if (!body.username || !body.password) {
    throw createError({ statusCode: 400, statusMessage: 'Usuario y contraseña son obligatorios' })
  }

  const rows = await query('SELECT id, username, name, password_hash, role, especialidad FROM users WHERE username = $1', [body.username])
  const user = rows[0]
  if (!user || user.password_hash !== hashPassword(body.password)) {
    throw createError({ statusCode: 401, statusMessage: 'Credenciales inválidas' })
  }

  const token = createToken({ id: user.id, username: user.username, name: user.name, role: user.role, especialidad: user.especialidad })
  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 8,
    path: '/',
  })

  return {
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      especialidad: user.especialidad,
      roleLabel: user.role === 'admin' ? 'Administrador' : user.role === 'maitre' ? 'Maitre' : user.role === 'mesero' ? 'Mesero' : 'Cocinero',
    },
  }
})
