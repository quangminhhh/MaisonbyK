import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import { Role } from '@prisma/client'

export interface TokenPayload {
  userId: string
  role: Role
}

export function createToken(payload: TokenPayload) {
  return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '7d' })
}

export function authenticateToken(req: NextRequest): TokenPayload | null {
  const authHeader = req.headers.get('authorization')
  if (!authHeader) return null
  const [, token] = authHeader.split(' ')
  if (!token) return null
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload
  } catch {
    return null
  }
}

export function authorizeRole(user: TokenPayload | null, role: Role) {
  return user && user.role === role
}
