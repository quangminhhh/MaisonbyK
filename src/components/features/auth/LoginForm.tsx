'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginInput } from '@/lib/validators/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface LoginFormProps {
  isAdminLogin?: boolean
}

export default function LoginForm({ isAdminLogin = false }: LoginFormProps) {
  const { login } = useAuth()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginInput) => {
    setError(null)
    try {
      await login(data)
      router.push(isAdminLogin ? '/admin/dashboard' : '/')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed'
      setError(message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input type="email" placeholder="Email" {...register('email')} />
      {errors.email && (
        <div className="text-red-500 text-sm">{errors.email.message}</div>
      )}
      <Input type="password" placeholder="Password" {...register('password')} />
      {errors.password && (
        <div className="text-red-500 text-sm">{errors.password.message}</div>
      )}
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        Đăng nhập
      </Button>
      {!isAdminLogin && (
        <div className="text-center text-sm">
          <Link href="/register" className="text-sky-600 hover:underline">
            Đăng ký
          </Link>
        </div>
      )}
    </form>
  )
}
