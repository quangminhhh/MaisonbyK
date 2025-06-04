'use client'

import Link from 'next/link'
import { useCategoryTree, type CategoryNode } from '@/hooks/useCategories'

function renderMenu(categories: CategoryNode[]): JSX.Element {
  return (
    <ul className="pl-4 space-y-1">
      {categories.map((c) => (
        <li key={c.id}>
          <Link href={`/products?category=${c.slug}`}>{c.name}</Link>
          {c.children && c.children.length > 0 && renderMenu(c.children)}
        </li>
      ))}
    </ul>
  )
}

export default function CategoryNavigation() {
  const { data } = useCategoryTree()

  if (!data) return <div>Loading...</div>

  return <nav>{renderMenu(data)}</nav>
}
