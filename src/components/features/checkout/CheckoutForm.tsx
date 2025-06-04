'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/useCart'
import { apiFetch } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import OrderSummary from '../orders/OrderSummary'
import type { OrderItemData } from '../orders/OrderItem'

interface Address {
  id: string
  recipientName: string
  street: string
  city: string
  phone: string
}

export default function CheckoutForm() {
  const { items, totalAmount, clearCart } = useCart()
  const router = useRouter()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selected, setSelected] = useState<string>('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    apiFetch<Address[]>('/api/users/me/addresses').then(setAddresses)
  }, [])

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await apiFetch<{ orderId: string }>(
        '/api/orders',
        {
          method: 'POST',
          body: JSON.stringify({ shippingAddressId: selected })
        }
      )
      clearCart()
      router.push(`/order/confirmation/${res.orderId}`)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) return <div>Giỏ hàng trống</div>

  const orderItems: OrderItemData[] = items.map((it) => ({
    id: it.id,
    productId: it.product.id,
    quantity: it.quantity,
    price: it.price,
    size: it.size,
    color: it.color,
    productSnapshot: {
      name: it.product.name,
      image: it.product.images?.[0]?.url,
    },
  }))

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-3">
        <h2 className="text-lg font-medium">Địa chỉ giao hàng</h2>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">Chọn địa chỉ</option>
          {addresses.map((a) => (
            <option key={a.id} value={a.id}>
              {a.recipientName} - {a.street} - {a.city}
            </option>
          ))}
        </select>
        <Button onClick={handleSubmit} disabled={loading || !selected} className="mt-4">
          Đặt hàng
        </Button>
      </div>
      <OrderSummary items={orderItems} totalAmount={totalAmount} />
    </div>
  )
}
