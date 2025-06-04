import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { authenticateToken, authorizeRole } from '@/lib/auth'
import { updateCategorySchema } from '@/lib/validators/category'
import slugify from 'slugify'
import { Prisma } from '@prisma/client'

export async function PUT(
  req: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  const payload = authenticateToken(req)
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!authorizeRole(payload, 'ADMIN')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const data = await req.json()
  const parsed = updateCategorySchema.safeParse(data)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const updateData: Prisma.CategoryUpdateInput = { ...parsed.data }
  if (parsed.data.name && !parsed.data.slug) {
    updateData.slug = slugify(parsed.data.name, { lower: true, strict: true })
  } else if (parsed.data.slug) {
    updateData.slug = slugify(parsed.data.slug, { lower: true, strict: true })
  }

  if (updateData.slug || updateData.name) {
    const orConditions: Prisma.CategoryWhereInput[] = []
    if (updateData.slug) orConditions.push({ slug: updateData.slug as string })
    if (updateData.name) orConditions.push({ name: updateData.name as string })
    const exist = await prisma.category.findFirst({
      where: {
        OR: orConditions,
        NOT: { id: params.categoryId },
      },
    })
    if (exist) {
      return NextResponse.json({ error: 'Category already exists' }, { status: 409 })
    }
  }

  const category = await prisma.category.update({
    where: { id: params.categoryId },
    data: { ...updateData, parentId: parsed.data.parentId ?? undefined },
  })
  return NextResponse.json({ category })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  const payload = authenticateToken(req)
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!authorizeRole(payload, 'ADMIN')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const childCount = await prisma.category.count({ where: { parentId: params.categoryId } })
  if (childCount > 0) {
    return NextResponse.json({ error: 'Category has subcategories' }, { status: 400 })
  }
  const productCount = await prisma.product.count({ where: { categoryId: params.categoryId } })
  if (productCount > 0) {
    return NextResponse.json({ error: 'Category has products' }, { status: 400 })
  }

  await prisma.category.delete({ where: { id: params.categoryId } })
  return NextResponse.json({}, { status: 204 })
}
