import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { authenticateToken } from '@/lib/auth'
import { updateCartItemSchema } from '@/lib/validators/cart'
import { fetchCart } from '@/lib/cart'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ cartItemId: string }> },
): Promise<NextResponse> {
  const { cartItemId } = await params
  const payload = authenticateToken(req)
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await req.json()
  const parsed = updateCartItemSchema.safeParse(data)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const item = await prisma.cartItem.findFirst({
    where: { id: cartItemId, cart: { userId: payload.userId } },
    include: { product: { select: { stockQuantity: true } } },
  })
  if (!item) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  if (parsed.data.quantity === 0) {
    await prisma.cartItem.delete({ where: { id: item.id } })
  } else {
    if (parsed.data.quantity > item.product.stockQuantity) {
      return NextResponse.json({ error: 'Exceeds stock' }, { status: 400 })
    }
    await prisma.cartItem.update({ where: { id: item.id }, data: { quantity: parsed.data.quantity } })
  }

  const updated = await fetchCart(payload.userId)
  return NextResponse.json(updated)
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ cartItemId: string }> },
): Promise<NextResponse> {
  const { cartItemId } = await params
  const payload = authenticateToken(req)
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const deleted = await prisma.cartItem.deleteMany({
    where: { id: cartItemId, cart: { userId: payload.userId } },
  })
  if (deleted.count === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const updated = await fetchCart(payload.userId)
  return NextResponse.json(updated)
}
