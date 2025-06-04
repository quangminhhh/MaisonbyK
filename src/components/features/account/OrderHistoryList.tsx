'use client'

import useSWR from 'swr'
import { apiFetch } from '@/lib/api'
import Pagination from '@/components/ui/Pagination'
import OrderHistoryItem, { type OrderBrief } from './OrderHistoryItem'

interface Response {
  data: OrderBrief[]
  pagination: { page: number; totalPages: number }
}

export default function OrderHistoryList() {
  const { data, mutate } = useSWR<Response>('/api/orders/my', (url) => apiFetch<Response>(url))

  const changePage = (p: number) => {
    apiFetch<Response>(`/api/orders/my?page=${p}`).then((res) => mutate(res, false))
  }

  if (!data) return <div>Loading...</div>

  return (
    <div className="space-y-4">
      {data.data.map((o) => (
        <OrderHistoryItem key={o.id} order={o} />
      ))}
      <Pagination
        page={data.pagination.page}
        totalPages={data.pagination.totalPages}
        onPageChange={changePage}
      />
    </div>
  )
}
