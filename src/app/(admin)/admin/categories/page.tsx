'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import CategoryTable from '@/components/features/admin/categories/CategoryTable'
import CategoryForm from '@/components/features/admin/categories/CategoryForm'
import type { CategoryNode } from '@/hooks/useCategories'

export default function AdminCategoriesPage() {
  const [editing, setEditing] = useState<CategoryNode | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleSuccess = () => {
    setRefreshKey((k) => k + 1)
    setShowForm(false)
    setEditing(null)
  }

  return (
    <div className="p-4">
      <div className="mb-4 text-right">
        <Button onClick={() => { setEditing(null); setShowForm(true) }}>Thêm mới</Button>
      </div>
      <CategoryTable
        onEdit={(cat) => { setEditing(cat); setShowForm(true) }}
        refreshKey={refreshKey}
      />
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md">
            <CategoryForm
              initialData={editing ?? undefined}
              onSubmitSuccess={handleSuccess}
            />
            <div className="flex justify-end mt-2">
              <Button variant="secondary" onClick={() => { setShowForm(false); setEditing(null) }}>
                Đóng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
