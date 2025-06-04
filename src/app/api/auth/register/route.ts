import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { registerSchema } from '@/lib/validators/auth'
import { createToken } from '@/lib/auth'

export async function POST(req: Request) {
  const data = await req.json()
  const parsed = registerSchema.safeParse(data)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const { name, email, password, phone } = parsed.data
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: 'Email already exists' }, { status: 409 })
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, phone, role: 'CUSTOMER' },
  })

  const token = createToken({ userId: user.id, role: user.role })

  const { password: passwordHash, ...rest } = user
  void passwordHash
  return NextResponse.json({ user: rest, token }, { status: 201 })
}
