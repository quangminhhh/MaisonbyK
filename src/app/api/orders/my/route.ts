import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { authenticateToken } from '@/lib/auth'
import { OrderStatus, Prisma } from '@prisma/client'

export async function GET(req: NextRequest) {
  const payload = authenticateToken(req)
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '10', 10)
  const status = searchParams.get('status') as OrderStatus | null

  const where: Prisma.OrderWhereInput = { userId: payload.userId }
  if (status) where.status = status

  const [data, totalItems] = await Promise.all([
    prisma.order.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: { id: true, orderCode: true, createdAt: true, totalAmount: true, status: true },
    }),
    prisma.order.count({ where }),
  ])

  const totalPages = Math.ceil(totalItems / limit)
  return NextResponse.json({ data, pagination: { page, limit, totalItems, totalPages } })
}
