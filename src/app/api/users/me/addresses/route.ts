import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { authenticateToken } from '@/lib/auth'
import { addressSchema } from '@/lib/validators/user'

export async function GET(req: NextRequest) {
  const payload = authenticateToken(req)
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const addresses = await prisma.address.findMany({
    where: { userId: payload.userId },
    select: {
      id: true,
      recipientName: true,
      street: true,
      city: true,
      phone: true,
      isDefault: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ addresses })
}

export async function POST(req: NextRequest) {
  const payload = authenticateToken(req)
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await req.json()
  const parsed = addressSchema.safeParse(data)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const address = await prisma.address.create({
    data: { ...parsed.data, userId: payload.userId },
    select: { id: true, recipientName: true, street: true, city: true, phone: true, isDefault: true },
  })

  return NextResponse.json({ address }, { status: 201 })
}
