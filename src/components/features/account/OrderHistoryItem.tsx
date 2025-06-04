'use client'

import Link from 'next/link'
import { formatCurrency, formatDate } from '@/lib/utils'

export interface OrderBrief {
  id: string
  orderCode: string
  createdAt: string
  totalAmount: number
  status: string
}

export default function OrderHistoryItem({ order }: { order: OrderBrief }) {
  return (
    <div className="p-4 border rounded-md space-y-1 text-sm">
      <div className="font-medium">Mã đơn: {order.orderCode}</div>
      <div>Ngày đặt: {formatDate(order.createdAt)}</div>
      <div>Tổng tiền: {formatCurrency(order.totalAmount)}</div>
      <div>Trạng thái: {order.status}</div>
      <Link href={`/account/orders/${order.id}`} className="text-sky-600 hover:underline text-sm">
        Xem chi tiết
      </Link>
    </div>
  )
}
