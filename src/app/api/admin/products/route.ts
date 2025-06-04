import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { authenticateToken, authorizeRole } from '@/lib/auth'
import { createProductSchema } from '@/lib/validators/product'
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
  const parsed = createProductSchema.safeParse(data)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const slug = slugify(parsed.data.name, { lower: true, strict: true })
  const exists = await prisma.product.findFirst({ where: { OR: [{ name: parsed.data.name }, { slug }] } })
  if (exists) {
    return NextResponse.json({ error: 'Product already exists' }, { status: 409 })
  }

  const { imageUrls = [], ...rest } = parsed.data
  const product = await prisma.product.create({
    data: {
      ...rest,
      slug,
    },
  })

  if (imageUrls.length) {
    await prisma.image.createMany({
      data: imageUrls.map((url, idx) => ({
        url,
        productId: product.id,
        isDefault: idx === 0,
      })),
    })
  }

  return NextResponse.json({ product }, { status: 201 })
}
