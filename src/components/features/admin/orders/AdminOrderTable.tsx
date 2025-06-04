'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { apiFetch } from '@/lib/api'
import { formatCurrency, formatDate } from '@/lib/utils'

interface OrderRow {
  id: string
  orderCode: string
  createdAt: string
  totalAmount: number
  status: string
  user: { name: string }
}

export default function AdminOrderTable() {
  const [data, setData] = useState<OrderRow[]>([])

  useEffect(() => {
    apiFetch<{ data: OrderRow[] }>('/api/admin/orders').then((res) => setData(res.data))
  }, [])

  return (
    <table className="min-w-full border text-sm">
      <thead>
        <tr className="bg-gray-100 text-left">
          <th className="p-2">Mã đơn</th>
          <th className="p-2">Khách hàng</th>
          <th className="p-2">Ngày đặt</th>
          <th className="p-2">Tổng tiền</th>
          <th className="p-2">Trạng thái</th>
          <th className="p-2"></th>
        </tr>
      </thead>
      <tbody>
        {data.map((o) => (
          <tr key={o.id} className="border-t">
            <td className="p-2">{o.orderCode}</td>
            <td className="p-2">{o.user?.name}</td>
            <td className="p-2">{formatDate(o.createdAt)}</td>
            <td className="p-2">{formatCurrency(o.totalAmount)}</td>
            <td className="p-2">{o.status}</td>
            <td className="p-2">
              <Link href={`/admin/orders/${o.id}`} className="text-sky-600 hover:underline">Xem</Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
