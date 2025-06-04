import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { authenticateToken, authorizeRole } from '@/lib/auth'
import { updateOrderStatusSchema } from '@/lib/validators/order'
import { OrderStatus } from '@prisma/client'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { orderId: string } },
) {
  const payload = authenticateToken(req)
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!authorizeRole(payload, 'ADMIN')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const data = await req.json()
  const parsed = updateOrderStatusSchema.safeParse(data)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const order = await prisma.order.findUnique({
    where: { id: params.orderId },
    include: { items: true },
  })
  if (!order) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const newStatus = parsed.data.status as OrderStatus

  try {
    const result = await prisma.$transaction(async (tx) => {
      const updated = await tx.order.update({
        where: { id: order.id },
        data: { status: newStatus },
      })

      await tx.orderStatusUpdate.create({
        data: { orderId: order.id, status: newStatus, updatedBy: payload.userId },
      })

      if (newStatus === 'CANCELLED') {
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stockQuantity: { increment: item.quantity } },
          })
        }
      }

      return updated
    })

    return NextResponse.json({ order: result })
  } catch {
    return NextResponse.json({ error: 'Update failed' }, { status: 400 })
  }
}
