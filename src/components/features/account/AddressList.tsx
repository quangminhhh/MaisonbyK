'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { apiFetch } from '@/lib/api'
import AddressForm from './AddressForm'

interface Address {
  id: string
  name: string
  phone: string
  line: string
  city: string
  isDefault: boolean
}

export default function AddressList() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [editing, setEditing] = useState<Address | null>(null)

  useEffect(() => {
    apiFetch<Address[]>('/api/users/me/addresses').then(setAddresses)
  }, [])

  const remove = async (id: string) => {
    await apiFetch(`/api/users/me/addresses/${id}`, { method: 'DELETE' })
    setAddresses((prev) => prev.filter((a) => a.id !== id))
  }

  const setDefault = async (id: string) => {
    await apiFetch(`/api/users/me/addresses/${id}/default`, { method: 'POST' })
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    )
  }

  const closeForm = () => setEditing(null)
  const handleSaved = () => {
    apiFetch<Address[]>('/api/users/me/addresses').then(setAddresses)
    closeForm()
  }

  return (
    <div>
      <div className="space-y-4">
        {addresses.map((a) => (
          <div key={a.id} className="p-4 border rounded-md">
            <div>{a.name}</div>
            <div>{a.phone}</div>
            <div>{a.line}</div>
            <div>{a.city}</div>
            <div className="flex gap-2 mt-2">
              <Button size="sm" variant="secondary" onClick={() => setEditing(a)}>
                Sửa
              </Button>
              <Button size="sm" variant="danger" onClick={() => remove(a.id)}>
                Xóa
              </Button>
              {!a.isDefault && (
                <Button size="sm" onClick={() => setDefault(a.id)}>
                  Đặt mặc định
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      <Button className="mt-4" onClick={() => setEditing({
        id: '', name: '', phone: '', line: '', city: '', isDefault: false })}>
        Thêm địa chỉ mới
      </Button>
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md">
            <AddressForm
              initialData={editing.id ? editing : undefined}
              onSubmitSuccess={handleSaved}
              onCancel={closeForm}
            />
          </div>
        </div>
      )}
    </div>
  )
}
