'use client'

import OrderItem, { type OrderItemData } from './OrderItem'
import { formatCurrency } from '@/lib/utils'

interface Props {
  items: OrderItemData[]
  totalAmount: number
}

export default function OrderSummary({ items, totalAmount }: Props) {
  return (
    <div className="space-y-3">
      <div className="border rounded-md divide-y">
        {items.map((it) => (
          <OrderItem key={it.id} item={it} />
        ))}
      </div>
      <div className="text-right font-medium">
        Tổng cộng: {formatCurrency(totalAmount)}
      </div>
    </div>
  )
}
