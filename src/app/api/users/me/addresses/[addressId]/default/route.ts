import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { authenticateToken } from '@/lib/auth'

export async function PATCH(req: NextRequest, { params }: { params: { addressId: string } }) {
  const payload = authenticateToken(req)
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // set all addresses isDefault false and set given address true
  const address = await prisma.address.findFirst({ where: { id: params.addressId, userId: payload.userId } })
  if (!address) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  await prisma.address.updateMany({ where: { userId: payload.userId }, data: { isDefault: false } })
  await prisma.address.update({ where: { id: params.addressId }, data: { isDefault: true } })

  return NextResponse.json({})
}
