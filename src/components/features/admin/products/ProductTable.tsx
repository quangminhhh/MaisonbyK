'use client'

import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

interface ProductRow {
  id: string
  name: string
  slug: string
  price: number
  stockQuantity: number
  category: { name: string }
}

interface Props {
  refreshKey: number
}

export default function ProductTable({ refreshKey }: Props) {
  const [data, setData] = useState<ProductRow[]>([])

  useEffect(() => {
    apiFetch<{ data: ProductRow[] }>('/api/admin/products').then((res) => setData(res.data))
  }, [refreshKey])

  const remove = async (id: string) => {
    if (!confirm('Xóa sản phẩm?')) return
    await apiFetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    setData((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <table className="min-w-full border text-sm">
      <thead>
        <tr className="bg-gray-100 text-left">
          <th className="p-2">Tên</th>
          <th className="p-2">Slug</th>
          <th className="p-2">Giá</th>
          <th className="p-2">Tồn kho</th>
          <th className="p-2">Danh mục</th>
          <th className="p-2"></th>
        </tr>
      </thead>
      <tbody>
        {data.map((p) => (
          <tr key={p.id} className="border-t">
            <td className="p-2">{p.name}</td>
            <td className="p-2">{p.slug}</td>
            <td className="p-2">{p.price}</td>
            <td className="p-2">{p.stockQuantity}</td>
            <td className="p-2">{p.category?.name}</td>
            <td className="p-2 space-x-2">
              <Link href={`/admin/products/${p.id}/edit`} className="text-sky-600 hover:underline">Sửa</Link>
              <Button size="sm" variant="danger" onClick={() => remove(p.id)}>
                Xóa
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
