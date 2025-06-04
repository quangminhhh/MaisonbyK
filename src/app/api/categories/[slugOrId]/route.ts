import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  _req: Request,
  { params }: { params: { slugOrId: string } }
) {
  const category = await prisma.category.findFirst({
    where: {
      OR: [{ slug: params.slugOrId }, { id: params.slugOrId }],
    },
    include: { _count: { select: { products: true } } },
  })
  if (!category) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json({ category })
}
