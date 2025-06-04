'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'
import { useCategory, type CategoryNode } from '@/hooks/useCategories'

interface CategoryBreadcrumbProps {
  slugOrId: string
}

export default function CategoryBreadcrumb({ slugOrId }: CategoryBreadcrumbProps) {
  const { data: category } = useCategory(slugOrId)
  const [parents, setParents] = useState<CategoryNode[]>([])

  useEffect(() => {
    async function fetchParents(parentId?: string) {
      const arr: CategoryNode[] = []
      let pid = parentId
      while (pid) {
        const res = await apiFetch<{ category: CategoryNode }>(`/api/categories/${pid}`)
        arr.unshift(res.category)
        pid = res.category.parentId
      }
      setParents(arr)
    }
    if (category) {
      fetchParents(category.parentId).catch(() => null)
    }
  }, [category])

  if (!category) return null

  const chain = [...parents, category]

  return (
    <nav className="text-sm">
      <Link href="/">Trang chủ</Link>
      {chain.map((c) => (
        <span key={c.id}>
          {' > '}
          <Link href={`/products?category=${c.slug}`}>{c.name}</Link>
        </span>
      ))}
    </nav>
  )
}
