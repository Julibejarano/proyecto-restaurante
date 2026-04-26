import { getCookie } from 'h3'
import { verifyToken } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token')
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'No autorizado' })
  }

  const payload = verifyToken(token as string)
  if (!payload) {
    throw createError({ statusCode: 401, statusMessage: 'Token inválido' })
  }

  return {
    user: {
      id: payload.id,
      username: payload.username,
      name: payload.name,
      role: payload.role,
      especialidad: payload.especialidad,
      roleLabel: payload.role === 'admin' ? 'Administrador' : payload.role === 'maitre' ? 'Maitre' : payload.role === 'mesero' ? 'Mesero' : 'Cocinero',
    },
  }
})
