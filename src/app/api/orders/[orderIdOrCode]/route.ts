import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { authenticateToken } from '@/lib/auth'

export async function GET(
  req: NextRequest,
  { params }: { params: { orderIdOrCode: string } },
) {
  const payload = authenticateToken(req)
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const order = await prisma.order.findFirst({
    where: {
      OR: [{ id: params.orderIdOrCode }, { orderCode: params.orderIdOrCode }],
    },
    include: {
      items: true,
      statusHistory: true,
    },
  })

  if (!order) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  if (payload.role !== 'ADMIN' && order.userId !== payload.userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return NextResponse.json({ order })
}
