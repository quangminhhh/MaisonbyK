import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { loginSchema } from '@/lib/validators/auth'
import { createToken } from '@/lib/auth'

export async function POST(req: Request) {
  const data = await req.json()
  const parsed = loginSchema.safeParse(data)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const { email, password } = parsed.data
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const token = createToken({ userId: user.id, role: user.role })

  const { password: passwordHash, ...rest } = user
  void passwordHash
  return NextResponse.json({ user: rest, token })
}
