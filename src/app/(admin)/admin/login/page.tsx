'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import LoginForm from '@/components/features/auth/LoginForm'

export default function AdminLogin() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated && user?.role === 'ADMIN') {
      router.push('/admin/dashboard')
    }
  }, [isAuthenticated, user, router])

  return (
    <div className="max-w-sm mx-auto py-10">
      <LoginForm isAdminLogin />
    </div>
  )
}
