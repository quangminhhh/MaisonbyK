import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  _req: Request,
  { params }: { params: { slugOrId: string } },
) {
  const product = await prisma.product.findFirst({
    where: {
      OR: [{ slug: params.slugOrId }, { id: params.slugOrId }],
      NOT: { status: 'UNLISTED' },
    },
    include: {
      images: true,
      category: { select: { id: true, name: true, slug: true } },
    },
  })
  if (!product) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json({ product })
}
