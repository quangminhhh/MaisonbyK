'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/hooks/useCart'
import { formatCurrency } from '@/lib/utils'
import type { CartItem as Item } from '@/store/cart'

interface Props {
  item: Item
}

export default function CartItem({ item }: Props) {
  const { updateItemQuantity, removeItem, isLoading } = useCart()
  const [qty, setQty] = useState(item.quantity)

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    setQty(value)
    await updateItemQuantity(item.id, value)
  }

  const handleRemove = async () => {
    if (confirm('Xóa sản phẩm?')) {
      await removeItem(item.id)
    }
  }

  return (
    <div className="flex gap-4 border-b py-4">
      {item.product.images?.[0]?.url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.product.images[0].url}
          alt={item.product.name}
          className="w-20 h-20 object-cover rounded"
        />
      )}
      <div className="flex-1 space-y-1 text-sm">
        <Link href={`/products/${item.product.slug}`} className="font-medium hover:underline">
          {item.product.name}
        </Link>
        {item.size && <div>Size: {item.size}</div>}
        {item.color && <div>Màu: {item.color}</div>}
        <div>Đơn giá: {formatCurrency(item.price)}</div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            className="w-16 border p-1"
            min={1}
            value={qty}
            onChange={handleChange}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={handleRemove}
            className="text-red-600 text-sm"
            disabled={isLoading}
          >
            Xóa
          </button>
        </div>
        <div>Thành tiền: {formatCurrency(item.price * item.quantity)}</div>
      </div>
    </div>
  )
}
