import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { authenticateToken } from '@/lib/auth'
import { createOrderSchema } from '@/lib/validators/order'
import { Prisma } from '@prisma/client'

export async function POST(req: NextRequest) {
  const payload = authenticateToken(req)
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await req.json()
  const parsed = createOrderSchema.safeParse(data)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const { shippingAddressId, shippingAddress, paymentMethod, notes } = parsed.data

  const cart = await prisma.cart.findUnique({
    where: { userId: payload.userId },
    include: {
      items: {
        include: {
          product: {
            include: { images: { where: { isDefault: true }, take: 1 } },
          },
        },
      },
    },
  })

  if (!cart || cart.items.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
  }

  let address: {
    recipientName: string
    street: string
    city: string
    phone: string
  }
  if (shippingAddressId) {
    const found = await prisma.address.findFirst({
      where: { id: shippingAddressId, userId: payload.userId },
    })
    if (!found) {
      return NextResponse.json({ error: 'Invalid address' }, { status: 400 })
    }
    address = {
      recipientName: found.recipientName,
      street: found.street,
      city: found.city,
      phone: found.phone,
    }
  } else if (shippingAddress) {
    address = shippingAddress
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      for (const item of cart.items) {
        if (!item.product || item.quantity > item.product.stockQuantity) {
          throw new Error('Out of stock')
        }
      }

      const order = await tx.order.create({
        data: {
          userId: payload.userId,
          shippingAddress: {
            recipientName: address.recipientName,
            street: address.street,
            city: address.city,
            phone: address.phone,
          },
          paymentMethod,
          notes,
          totalAmount: 0,
        },
      })

      let total = 0
      for (const item of cart.items) {
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            size: item.size,
            color: item.color,
            productSnapshot: {
              name: item.product.name,
              image: item.product.images[0]?.url || '',
            } as Prisma.InputJsonValue,
          },
        })
        await tx.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { decrement: item.quantity } },
        })
        total += item.price * item.quantity
      }

      await tx.order.update({
        where: { id: order.id },
        data: { totalAmount: total },
      })

      await tx.orderStatusUpdate.create({
        data: { orderId: order.id, status: 'PENDING' },
      })

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } })
      await tx.cart.delete({ where: { id: cart.id } })

      return {
        orderId: order.id,
        orderCode: order.orderCode,
        status: order.status,
        totalAmount: total,
      }
    })

    return NextResponse.json(result, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 400 })
  }
}
