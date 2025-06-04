'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { apiFetch } from '@/lib/api'

interface UserDetail {
  id: string
  name: string
  email: string
  phone?: string
  role: string
  addresses?: { id: string; line: string }[]
}

export default function UserDetailView() {
  const params = useParams<{ userId: string }>()
  const [user, setUser] = useState<UserDetail | null>(null)

  useEffect(() => {
    if (!params?.userId) return
    apiFetch<UserDetail>(`/api/admin/users/${params.userId}`).then(setUser)
  }, [params?.userId])

  if (!user) return <div>Loading...</div>

  return (
    <div className="space-y-2">
      <div>ID: {user.id}</div>
      <div>Tên: {user.name}</div>
      <div>Email: {user.email}</div>
      {user.phone && <div>SĐT: {user.phone}</div>}
      <div>Vai trò: {user.role}</div>
      {user.addresses && (
        <div>
          <div className="font-medium mt-2">Địa chỉ:</div>
          <ul className="list-disc pl-6">
            {user.addresses.map((a) => (
              <li key={a.id}>{a.line}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
