'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'

interface AccountLayoutProps {
  children: ReactNode
}

export default function AccountLayout({ children }: AccountLayoutProps) {
  const pathname = usePathname()
  const { logout } = useAuth()

  const links = [
    { href: '/account/profile', label: 'Thông tin cá nhân' },
    { href: '/account/addresses', label: 'Địa chỉ' },
    { href: '/account/orders', label: 'Đơn hàng' },
  ]

  return (
    <div className="flex gap-6 py-6">
      <aside className="w-64 space-y-2">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={
              pathname === l.href
                ? 'block p-2 rounded-md bg-sky-600 text-white'
                : 'block p-2 rounded-md hover:bg-gray-100'
            }
          >
            {l.label}
          </Link>
        ))}
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          onClick={logout}
        >
          Đăng xuất
        </Button>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  )
}
