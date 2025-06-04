import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { authenticateToken } from '@/lib/auth'
import { updateProfileSchema } from '@/lib/validators/user'

export async function GET(req: NextRequest) {
  const payload = authenticateToken(req)
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      addresses: {
        where: { isDefault: true },
        take: 1,
        select: {
          id: true,
          recipientName: true,
          street: true,
          city: true,
          phone: true,
        },
      },
    },
  })

  if (!user) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const { addresses, ...rest } = user
  const defaultAddress = addresses[0] || null
  return NextResponse.json({ user: { ...rest, defaultAddress } })
}

export async function PUT(req: NextRequest) {
  const payload = authenticateToken(req)
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await req.json()
  const parsed = updateProfileSchema.safeParse(data)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const user = await prisma.user.update({
    where: { id: payload.userId },
    data: parsed.data,
    select: { id: true, name: true, email: true, phone: true, role: true },
  })

  return NextResponse.json({ user })
}
