'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/hooks/useAuth'
import { apiFetch } from '@/lib/api'
import * as z from 'zod'

const profileSchema = z.object({
  name: z.string().min(1, 'Vui lòng nhập tên'),
  phone: z.string().min(1, 'Vui lòng nhập số điện thoại'),
})

export type ProfileInput = z.infer<typeof profileSchema>

export default function ProfileForm() {
  const { user } = useAuth()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileInput>({ resolver: zodResolver(profileSchema) })

  useEffect(() => {
    async function fetchData() {
      const data = await apiFetch<{ name: string; phone: string }>('/api/users/me')
      reset(data)
    }
    fetchData().catch(() => null)
  }, [reset])

  const onSubmit = async (values: ProfileInput) => {
    await apiFetch('/api/users/me', {
      method: 'PUT',
      body: JSON.stringify(values),
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
      <Input placeholder="Họ tên" {...register('name')} />
      {errors.name && <div className="text-red-500 text-sm">{errors.name.message}</div>}
      <Input value={user?.email || ''} readOnly className="opacity-50" />
      <Input placeholder="Số điện thoại" {...register('phone')} />
      {errors.phone && <div className="text-red-500 text-sm">{errors.phone.message}</div>}
      <Button type="submit" disabled={isSubmitting}>Lưu thay đổi</Button>
    </form>
  )
}
