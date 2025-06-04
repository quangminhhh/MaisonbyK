'use client'

import { useParams } from 'next/navigation'
import useSWR from 'swr'
import { apiFetch } from '@/lib/api'
import OrderSummary, { type OrderItemData } from '../orders/OrderSummary'

interface Response {
  order: {
    id: string
    orderCode: string
    createdAt: string
    status: string
    shippingAddress: {
      recipientName: string
      street: string
      city: string
      phone: string
    }
    items: OrderItemData[]
    totalAmount: number
  }
}

export default function CustomerOrderDetailView() {
  const params = useParams<{ orderId: string }>()
  const { data } = useSWR<Response>(
    params?.orderId ? `/api/orders/${params.orderId}` : null,
    (url) => apiFetch<Response>(url)
  )

  if (!data) return <div>Loading...</div>

  const { order } = data

  return (
    <div className="space-y-3 text-sm">
      <div className="font-medium text-lg">Mã đơn: {order.orderCode}</div>
      <div>Ngày đặt: {order.createdAt}</div>
      <div>Trạng thái: {order.status}</div>
      <div>
        Giao đến: {order.shippingAddress.recipientName} - {order.shippingAddress.street} - {order.shippingAddress.city}
      </div>
      <OrderSummary items={order.items} totalAmount={order.totalAmount} />
    </div>
  )
}
