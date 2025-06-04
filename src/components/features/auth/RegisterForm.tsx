'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, type RegisterInput } from '@/lib/validators/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const formSchema = registerSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type FormData = z.infer<typeof formSchema>

export default function RegisterForm() {
  const { register: registerUser } = useAuth()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(formSchema) })

  const onSubmit = async (data: FormData) => {
    setError(null)
    const { confirmPassword: _confirm, ...payload } = data
    void _confirm
    try {
      await registerUser(payload as RegisterInput)
      router.push('/')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Register failed'
      setError(message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input placeholder="Họ tên" {...register('name')} />
      {errors.name && (
        <div className="text-red-500 text-sm">{errors.name.message}</div>
      )}
      <Input type="email" placeholder="Email" {...register('email')} />
      {errors.email && (
        <div className="text-red-500 text-sm">{errors.email.message}</div>
      )}
      <Input type="password" placeholder="Mật khẩu" {...register('password')} />
      {errors.password && (
        <div className="text-red-500 text-sm">{errors.password.message}</div>
      )}
      <Input
        type="password"
        placeholder="Nhập lại mật khẩu"
        {...register('confirmPassword')}
      />
      {errors.confirmPassword && (
        <div className="text-red-500 text-sm">{errors.confirmPassword.message}</div>
      )}
      <Input placeholder="Số điện thoại" {...register('phone')} />
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        Đăng ký
      </Button>
      <div className="text-center text-sm">
        <Link href="/login" className="text-sky-600 hover:underline">
          Đã có tài khoản? Đăng nhập
        </Link>
      </div>
    </form>
  )
}
