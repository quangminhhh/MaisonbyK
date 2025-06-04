'use client'

import { useState } from 'react'
import { apiFetch } from '@/lib/api'
import { Button } from '@/components/ui/Button'

interface Props {
  orderId: string
  status: string
  onUpdated: () => void
}

export default function OrderStatusUpdater({ orderId, status, onUpdated }: Props) {
  const [value, setValue] = useState(status)
  const [loading, setLoading] = useState(false)

  const update = async () => {
    setLoading(true)
    await apiFetch(`/api/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: value })
    })
    setLoading(false)
    onUpdated()
  }

  return (
    <div className="flex items-center gap-2">
      <select value={value} onChange={(e) => setValue(e.target.value)} className="border p-1 rounded">
        <option value="PROCESSING">PROCESSING</option>
        <option value="SHIPPING">SHIPPING</option>
        <option value="DELIVERED">DELIVERED</option>
        <option value="CANCELLED">CANCELLED</option>
      </select>
      <Button size="sm" onClick={update} disabled={loading}>Cập nhật</Button>
    </div>
  )
}
