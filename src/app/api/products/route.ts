import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '10', 10)
  const category = searchParams.get('category')
  const search = searchParams.get('search') || ''
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const sizes = searchParams.get('sizes')
  const colors = searchParams.get('colors')
  const material = searchParams.get('material')
  const sortBy = searchParams.get('sortBy') || 'createdAt_desc'

  const where: Prisma.ProductWhereInput = {
    NOT: { status: 'UNLISTED' },
  }
  const andConditions: Prisma.ProductWhereInput[] = []
  if (category) {
    where.OR = [
      { category: { slug: category } },
      { categoryId: category },
    ]
  }
  if (search) {
    andConditions.push({
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ],
    })
  }
  if (minPrice || maxPrice) {
    const priceCond: Prisma.FloatFilter = {}
    if (minPrice) priceCond.gte = parseFloat(minPrice)
    if (maxPrice) priceCond.lte = parseFloat(maxPrice)
    andConditions.push({ price: priceCond })
  }
  if (sizes) {
    andConditions.push({ sizes: { hasSome: sizes.split(',') } })
  }
  if (colors) {
    andConditions.push({ colors: { hasSome: colors.split(',') } })
  }
  if (material) {
    andConditions.push({ material: { contains: material, mode: 'insensitive' } })
  }

  if (andConditions.length) {
    where.AND = andConditions
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' }
  if (sortBy === 'price_asc') orderBy = { price: 'asc' }
  else if (sortBy === 'price_desc') orderBy = { price: 'desc' }
  else if (sortBy === 'createdAt_asc') orderBy = { createdAt: 'asc' }

  const [data, totalItems] = await Promise.all([
    prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy,
      include: {
        images: { orderBy: { isDefault: 'desc' }, take: 1 },
        category: { select: { id: true, name: true, slug: true } },
      },
    }),
    prisma.product.count({ where }),
  ])
  const totalPages = Math.ceil(totalItems / limit)
  return NextResponse.json({ data, pagination: { page, limit, totalItems, totalPages } })
}
