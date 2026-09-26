import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slugOrId: string }> },
): Promise<NextResponse> {
  const { slugOrId } = await params
  const category = await prisma.category.findFirst({
    where: {
      OR: [{ slug: slugOrId }, { id: slugOrId }],
    },
    include: { _count: { select: { products: true } } },
  })
  if (!category) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json({ category })
}
