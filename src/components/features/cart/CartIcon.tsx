'use client'

import Link from 'next/link'
import { useCart } from '@/hooks/useCart'

export default function CartIcon() {
  const { items } = useCart()
  const count = items.reduce((sum, it) => sum + it.quantity, 0)
  return (
    <Link href="/cart" className="relative inline-block">
      <span>🛒</span>
      {count > 0 && (
        <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
          {count}
        </span>
      )}
    </Link>
  )
}
