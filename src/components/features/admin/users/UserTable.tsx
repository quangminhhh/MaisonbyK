'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { apiFetch } from '@/lib/api'

interface UserRow {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
}

export default function UserTable() {
  const [data, setData] = useState<UserRow[]>([])

  useEffect(() => {
    apiFetch<UserRow[]>('/api/admin/users').then(setData)
  }, [])

  return (
    <table className="min-w-full border text-sm">
      <thead>
        <tr className="bg-gray-100 text-left">
          <th className="p-2">ID</th>
          <th className="p-2">Tên</th>
          <th className="p-2">Email</th>
          <th className="p-2">Vai trò</th>
          <th className="p-2">Ngày tạo</th>
        </tr>
      </thead>
      <tbody>
        {data.map((u) => (
          <tr key={u.id} className="border-t">
            <td className="p-2">
              <Link href={`/admin/users/${u.id}`} className="text-sky-600 hover:underline">
                {u.id}
              </Link>
            </td>
            <td className="p-2">{u.name}</td>
            <td className="p-2">{u.email}</td>
            <td className="p-2">{u.role}</td>
            <td className="p-2">{new Date(u.createdAt).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
