import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { authenticateToken } from '@/lib/auth'
import { addCartItemSchema } from '@/lib/validators/cart'
import { fetchCart } from '../route'

export async function POST(req: NextRequest) {
  const payload = authenticateToken(req)
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await req.json()
  const parsed = addCartItemSchema.safeParse(data)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const { productId, quantity, size, color } = parsed.data
  const product = await prisma.product.findFirst({
    where: { id: productId, NOT: { status: 'UNLISTED' } },
    select: { price: true, promotionalPrice: true, stockQuantity: true }
  })
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }
  if (quantity > product.stockQuantity) {
    return NextResponse.json({ error: 'Out of stock' }, { status: 400 })
  }

  const cart = await prisma.cart.upsert({
    where: { userId: payload.userId },
    update: {},
    create: { userId: payload.userId }
  })

  const existing = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId, size: size || null, color: color || null }
  })

  if (existing) {
    const newQty = existing.quantity + quantity
    if (newQty > product.stockQuantity) {
      return NextResponse.json({ error: 'Exceeds stock' }, { status: 400 })
    }
    await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: newQty } })
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
        size,
        color,
        price: product.promotionalPrice ?? product.price,
      }
    })
  }

  const updated = await fetchCart(payload.userId)
  return NextResponse.json(updated)
}
