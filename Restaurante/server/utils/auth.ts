import { createHash } from 'crypto'
import jwt from 'jsonwebtoken'
import { useRuntimeConfig } from '#imports'

const config = useRuntimeConfig()

export function hashPassword(password: string) {
  return createHash('sha256').update(password).digest('hex')
}

export function createToken(payload: Record<string, any>) {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '8h' })
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, config.jwtSecret) as Record<string, any>
  } catch {
    return null
  }
}
