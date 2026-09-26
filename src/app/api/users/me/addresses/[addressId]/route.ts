import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { authenticateToken } from '@/lib/auth'
import { addressSchema } from '@/lib/validators/user'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ addressId: string }> },
): Promise<NextResponse> {
  const { addressId } = await params
  const payload = authenticateToken(req)
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await req.json()
  const parsed = addressSchema.safeParse(data)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const updated = await prisma.address.updateMany({
    where: { id: addressId, userId: payload.userId },
    data: parsed.data,
  })
  if (updated.count === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  const address = await prisma.address.findUnique({
    where: { id: addressId },
    select: { id: true, recipientName: true, street: true, city: true, phone: true, isDefault: true },
  })

  return NextResponse.json({ address })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ addressId: string }> },
): Promise<NextResponse> {
  const { addressId } = await params
  const payload = authenticateToken(req)
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const deleted = await prisma.address.deleteMany({ where: { id: addressId, userId: payload.userId } })
  if (deleted.count === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json({})
}
