'use client'

import { useEffect } from 'react'
import { useCart } from '@/hooks/useCart'
import CartItem from './CartItem'
import CartSummary from './CartSummary'

export default function CartView() {
  const { items, fetchCart, isLoading } = useCart()

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        {items.length === 0 ? (
          <div>Giỏ hàng trống</div>
        ) : (
          items.map((it) => <CartItem key={it.id} item={it} />)
        )}
      </div>
      <CartSummary />
    </div>
  )
}
