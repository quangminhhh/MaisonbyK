'use client'

import { useParams, useRouter } from 'next/navigation'
import useSWR from 'swr'
import { apiFetch } from '@/lib/api'
import OrderSummary from './OrderSummary'
import { type OrderItemData } from './OrderItem'
import { Button } from '@/components/ui/Button'

interface Response {
  order: {
    id: string
    orderCode: string
    totalAmount: number
    items: OrderItemData[]
  }
}

export default function OrderConfirmation() {
  const params = useParams<{ orderId: string }>()
  const router = useRouter()
  const { data } = useSWR<Response>(
    params?.orderId ? `/api/orders/${params.orderId}` : null,
    (url: string) => apiFetch<Response>(url)
  )

  if (!data) return <div>Loading...</div>

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-medium">Đặt hàng thành công</h1>
      <div>Mã đơn hàng: {data.order.orderCode}</div>
      <OrderSummary items={data.order.items} totalAmount={data.order.totalAmount} />
      <Button onClick={() => router.push('/')} className="mt-4">Tiếp tục mua sắm</Button>
    </div>
  )
}
