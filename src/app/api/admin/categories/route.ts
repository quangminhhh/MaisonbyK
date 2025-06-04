import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { authenticateToken, authorizeRole } from '@/lib/auth'
import { createCategorySchema } from '@/lib/validators/category'
import slugify from 'slugify'

export async function POST(req: NextRequest) {
  const payload = authenticateToken(req)
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!authorizeRole(payload, 'ADMIN')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const data = await req.json()
  const parsed = createCategorySchema.safeParse(data)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const slug = slugify(parsed.data.name, { lower: true, strict: true })
  const exists = await prisma.category.findFirst({ where: { OR: [ { name: parsed.data.name }, { slug } ] } })
  if (exists) {
    return NextResponse.json({ error: 'Category already exists' }, { status: 409 })
  }

  const category = await prisma.category.create({
    data: {
      ...parsed.data,
      slug,
      parentId: parsed.data.parentId || null,
    },
  })
  return NextResponse.json({ category }, { status: 201 })
}
