'use client'

import { useAuth } from '@/hooks/useAuth'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (pathname === '/admin/login') return
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      router.push('/admin/login')
    }
  }, [isAuthenticated, user, pathname, router])

  if (!isAuthenticated && pathname !== '/admin/login') {
    return null
  }

  return <div>{children}</div>
}
