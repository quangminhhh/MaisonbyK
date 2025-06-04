'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function ProductSort() {
  const router = useRouter()
  const search = useSearchParams()
  const sortBy = search.get('sortBy') || 'createdAt_desc'

  const update = (value: string) => {
    const params = new URLSearchParams(search.toString())
    params.set('sortBy', value)
    params.delete('page')
    router.push(`/products?${params.toString()}`)
  }

  return (
    <select
      value={sortBy}
      onChange={(e) => update(e.target.value)}
      className="border p-2 rounded-md text-sm"
    >
      <option value="createdAt_desc">Mới nhất</option>
      <option value="price_asc">Giá tăng dần</option>
      <option value="price_desc">Giá giảm dần</option>
    </select>
  )
}
