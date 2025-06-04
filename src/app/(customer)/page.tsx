'use client'

import { Button } from '@/components/ui/Button'
import { useCart } from '@/hooks/useCart'

export default function Home() {
  const { items, addItem } = useCart()

  return (
    <div className="p-4 space-y-4">
      <div>Items in cart: {items.length}</div>
      <Button
        onClick={() =>
          addItem({ productId: Date.now().toString(), quantity: 1 })
        }
      >
        Add Sample Item
      </Button>
    </div>
  )
}
