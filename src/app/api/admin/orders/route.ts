import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { authenticateToken, authorizeRole } from '@/lib/auth'
import { OrderStatus, Prisma } from '@prisma/client'

export async function GET(req: NextRequest) {
  const payload = authenticateToken(req)
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!authorizeRole(payload, 'ADMIN')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '10', 10)
  const status = searchParams.get('status') as OrderStatus | null
  const search = searchParams.get('search') || ''

  const where: Prisma.OrderWhereInput = {}
  if (status) where.status = status
  if (search) {
    where.OR = [
      { orderCode: { contains: search, mode: 'insensitive' } },
      { user: { name: { contains: search, mode: 'insensitive' } } },
      { user: { email: { contains: search, mode: 'insensitive' } } },
    ]
  }

  const [data, totalItems] = await Promise.all([
    prisma.order.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, name: true, email: true } } },
    }),
    prisma.order.count({ where }),
  ])

  const totalPages = Math.ceil(totalItems / limit)
  return NextResponse.json({ data, pagination: { page, limit, totalItems, totalPages } })
}
