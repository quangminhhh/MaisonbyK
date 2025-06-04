import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { authenticateToken, authorizeRole } from '@/lib/auth'
import { updateProductSchema } from '@/lib/validators/product'
import slugify from 'slugify'
import { Prisma } from '@prisma/client'

export async function PUT(
  req: NextRequest,
  { params }: { params: { productId: string } },
) {
  const payload = authenticateToken(req)
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!authorizeRole(payload, 'ADMIN')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const data = await req.json()
  const parsed = updateProductSchema.safeParse(data)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const updateData: Prisma.ProductUncheckedUpdateInput = { ...parsed.data }
  if (parsed.data.name && !parsed.data.slug) {
    updateData.slug = slugify(parsed.data.name, { lower: true, strict: true })
  } else if (parsed.data.slug) {
    updateData.slug = slugify(parsed.data.slug, { lower: true, strict: true })
  }

  if (updateData.slug || updateData.name) {
    const or: Prisma.ProductWhereInput[] = []
    if (updateData.slug) or.push({ slug: updateData.slug as string })
    if (updateData.name) or.push({ name: updateData.name as string })
    const exist = await prisma.product.findFirst({
      where: { OR: or, NOT: { id: params.productId } },
    })
    if (exist) {
      return NextResponse.json({ error: 'Product already exists' }, { status: 409 })
    }
  }

  const product = await prisma.product.update({
    where: { id: params.productId },
    data: updateData,
  })
  return NextResponse.json({ product })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { productId: string } },
) {
  const payload = authenticateToken(req)
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!authorizeRole(payload, 'ADMIN')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const orderItemCount = await prisma.orderItem.count({ where: { productId: params.productId } })
  if (orderItemCount > 0) {
    return NextResponse.json({ error: 'Product is referenced in orders' }, { status: 400 })
  }

  await prisma.product.delete({ where: { id: params.productId } })
  return NextResponse.json({}, { status: 204 })
}
