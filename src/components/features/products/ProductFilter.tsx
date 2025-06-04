'use client'

import { useCategories } from '@/hooks/useCategories'
import { useSearchParams, useRouter } from 'next/navigation'

export default function ProductFilter() {
  const { data } = useCategories()
  const search = useSearchParams()
  const router = useRouter()
  const category = search.get('category') || ''

  const update = (cat: string) => {
    const params = new URLSearchParams(search.toString())
    if (cat) params.set('category', cat)
    else params.delete('category')
    params.delete('page')
    router.push(`/products?${params.toString()}`)
  }

  return (
    <select
      value={category}
      onChange={(e) => update(e.target.value)}
      className="border p-2 rounded-md text-sm"
    >
      <option value="">Tất cả danh mục</option>
      {data?.map((c) => (
        <option key={c.id} value={c.slug}>
          {c.name}
        </option>
      ))}
    </select>
  )
}
