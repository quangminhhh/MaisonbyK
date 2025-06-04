'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/hooks/useAuth'

export default function AdminLogin() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // demo login
    login({ id: '1', name: 'Admin', role: 'ADMIN' }, 'demo-token')
  }

  return (
    <div className="max-w-sm mx-auto py-10">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />
        <Input
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </div>
  )
}
