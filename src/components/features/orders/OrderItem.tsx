'use client'

import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

export interface OrderItemData {
  id: string
  productId: string
  quantity: number
  price: number
  size?: string | null
  color?: string | null
  productSnapshot: { name: string; image?: string }
}

export default function OrderItem({ item }: { item: OrderItemData }) {
  return (
    <div className="flex gap-4 border-b py-3 text-sm">
      {item.productSnapshot.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.productSnapshot.image} alt={item.productSnapshot.name} className="w-16 h-16 object-cover rounded" />
      )}
      <div className="flex-1 space-y-1">
        <Link href={`/products/${item.productId}`} className="font-medium hover:underline">
          {item.productSnapshot.name}
        </Link>
        {item.size && <div>Size: {item.size}</div>}
        {item.color && <div>Màu: {item.color}</div>}
        <div>Số lượng: {item.quantity}</div>
        <div>Đơn giá: {formatCurrency(item.price)}</div>
        <div>Thành tiền: {formatCurrency(item.price * item.quantity)}</div>
      </div>
    </div>
  )
}
