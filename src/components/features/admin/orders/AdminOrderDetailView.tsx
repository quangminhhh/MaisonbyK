'use client'

import { useParams } from 'next/navigation'
import useSWR from 'swr'
import { apiFetch } from '@/lib/api'
import OrderSummary from '../../orders/OrderSummary'
import { type OrderItemData } from '../../orders/OrderItem'
import OrderStatusUpdater from './OrderStatusUpdater'

interface Response {
  order: {
    id: string
    orderCode: string
    createdAt: string
    totalAmount: number
    status: string
    user: { name: string; id: string }
    items: OrderItemData[]
  }
}

export default function AdminOrderDetailView() {
  const params = useParams<{ orderId: string }>()
  const { data, mutate } = useSWR<Response>(
    params?.orderId ? `/api/orders/${params.orderId}` : null,
    (url: string) => apiFetch<Response>(url)
  )

  if (!data) return <div>Loading...</div>

  const { order } = data

  return (
    <div className="space-y-3 text-sm">
      <div className="font-medium text-lg">Mã đơn: {order.orderCode}</div>
      <div>Khách hàng: {order.user.name}</div>
      <div>Trạng thái: {order.status}</div>
      <OrderStatusUpdater orderId={order.id} status={order.status} onUpdated={() => mutate()} />
      <OrderSummary items={order.items} totalAmount={order.totalAmount} />
    </div>
  )
}
