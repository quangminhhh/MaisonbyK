import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Category } from '@prisma/client'

interface CategoryNode extends Category {
  children: CategoryNode[]
  _count: { products: number }
}

function buildTree(categories: CategoryNode[]) {
  const map = new Map<string, CategoryNode>()
  const roots: CategoryNode[] = []
  for (const cat of categories) {
    cat.children = []
    map.set(cat.id, cat)
  }
  for (const cat of categories) {
    if (cat.parentId) {
      const parent = map.get(cat.parentId)
      if (parent) parent.children.push(cat)
    } else {
      roots.push(cat)
    }
  }
  return roots
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const parentId = searchParams.get('parentId')
  const tree = searchParams.get('tree') === 'true'

  if (tree) {
    const categories = (await prisma.category.findMany({
      orderBy: { createdAt: 'asc' },
      include: { _count: { select: { products: true } } },
    })) as CategoryNode[]
    const data = buildTree(categories)
    return NextResponse.json({ categories: data })
  }

  const categories = (await prisma.category.findMany({
    where: { parentId: parentId || null },
    orderBy: { createdAt: 'asc' },
    include: { _count: { select: { products: true } } },
  })) as CategoryNode[]

  return NextResponse.json({ categories })
}
