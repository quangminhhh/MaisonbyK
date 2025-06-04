import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { authenticateToken } from '@/lib/auth'

export async function fetchCart(userId: string) {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              images: { where: { isDefault: true }, take: 1, select: { url: true } },
              price: true,
              promotionalPrice: true,
              stockQuantity: true,
              status: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  })

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: { items: true },
    })
    return { ...cart, items: [], totalAmount: 0 }
  }

  const validItems = [] as typeof cart.items
  for (const item of cart.items) {
    if (!item.product || item.product.status === 'UNLISTED' || item.product.stockQuantity <= 0) {
      await prisma.cartItem.delete({ where: { id: item.id } })
      continue
    }
    validItems.push(item)
  }
  const totalAmount = validItems.reduce((sum, item) => sum + item.quantity * item.price, 0)
  return { ...cart, items: validItems, totalAmount }
}

export async function GET(req: NextRequest) {
  const payload = authenticateToken(req)
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await fetchCart(payload.userId)
  return NextResponse.json(data)
}
