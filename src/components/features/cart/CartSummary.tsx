'use client'

import Link from 'next/link'
import { useCart } from '@/hooks/useCart'
import { formatCurrency } from '@/lib/utils'

export default function CartSummary() {
  const { totalAmount, items } = useCart()
  const disabled = items.length === 0

  return (
    <div className="border p-4 rounded-md space-y-2">
      <div className="text-right font-medium">
        Tổng tiền: {formatCurrency(totalAmount)}
      </div>
      <Link
        href="/checkout"
        className={`block text-center text-white px-4 py-2 rounded ${disabled ? 'bg-gray-300 pointer-events-none' : 'bg-sky-600'}`}
      >
        Tiến hành thanh toán
      </Link>
    </div>
  )
}
