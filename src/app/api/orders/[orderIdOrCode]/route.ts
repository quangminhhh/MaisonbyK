import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { authenticateToken } from '@/lib/auth'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderIdOrCode: string }> },
): Promise<NextResponse> {
  const { orderIdOrCode } = await params
  const payload = authenticateToken(req)
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const order = await prisma.order.findFirst({
    where: {
      OR: [{ id: orderIdOrCode }, { orderCode: orderIdOrCode }],
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
