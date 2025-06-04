'use client'

import { useEffect, useState, Fragment } from 'react'
import { Button } from '@/components/ui/Button'
import { apiFetch } from '@/lib/api'
import type { CategoryNode } from '@/hooks/useCategories'

interface CategoryTableProps {
  onEdit: (category: CategoryNode) => void
  refreshKey: number
}

export default function CategoryTable({ onEdit, refreshKey }: CategoryTableProps) {
  const [data, setData] = useState<CategoryNode[]>([])

  useEffect(() => {
    apiFetch<{ categories: CategoryNode[] }>(
      '/api/categories?tree=true'
    ).then((res) => setData(res.categories))
  }, [refreshKey])

  const remove = async (id: string) => {
    if (!confirm('Xóa danh mục?')) return
    await apiFetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
    setData((prev) => prev.filter((c) => c.id !== id))
  }

  const renderRows = (cats: CategoryNode[], level = 0) =>
    cats.map((c) => (
      <Fragment key={c.id}>
        <tr className="border-t">
          <td className="p-2" style={{ paddingLeft: level * 16 }}>{c.name}</td>
          <td className="p-2">{c.slug}</td>
          <td className="p-2">{c.description || ''}</td>
          <td className="p-2">{c._count?.products ?? 0}</td>
          <td className="p-2 space-x-2">
            <Button size="sm" variant="secondary" onClick={() => onEdit(c)}>
              Sửa
            </Button>
            <Button size="sm" variant="danger" onClick={() => remove(c.id)}>
              Xóa
            </Button>
          </td>
        </tr>
        {c.children && renderRows(c.children, level + 1)}
      </Fragment>
    ))

  return (
    <table className="min-w-full border text-sm">
      <thead>
        <tr className="bg-gray-100 text-left">
          <th className="p-2">Tên</th>
          <th className="p-2">Slug</th>
          <th className="p-2">Mô tả</th>
          <th className="p-2">Sản phẩm</th>
          <th className="p-2"></th>
        </tr>
      </thead>
      <tbody>{renderRows(data)}</tbody>
    </table>
  )
}
