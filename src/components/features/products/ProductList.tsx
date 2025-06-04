'use client'

import useSWR from 'swr'
import { useSearchParams, useRouter } from 'next/navigation'
import { apiFetch } from '@/lib/api'
import ProductCard, { type ProductBrief } from './ProductCard'
import Pagination from '@/components/ui/Pagination'
import ProductFilter from './ProductFilter'
import ProductSort from './ProductSort'

interface Response {
  data: ProductBrief[]
  pagination: { page: number; totalPages: number }
}

export default function ProductList() {
  const search = useSearchParams()
  const router = useRouter()
  const query = search.toString()
  const { data } = useSWR(`/api/products?${query}`, (url) => apiFetch<Response>(url))

  const changePage = (p: number) => {
    const params = new URLSearchParams(search.toString())
    params.set('page', String(p))
    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <ProductFilter />
        <ProductSort />
      </div>
      {!data ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.data.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <Pagination
            page={data.pagination.page}
            totalPages={data.pagination.totalPages}
            onPageChange={changePage}
          />
        </>
      )}
    </div>
  )
}
