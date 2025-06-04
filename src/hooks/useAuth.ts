import { useAuthStore, type User } from '@/store/auth'
import { apiFetch } from '@/lib/api'
import type { LoginInput, RegisterInput } from '@/lib/validators/auth'

export function useAuth() {
  const { user, token, isAuthenticated, login: setLogin, logout: clear } = useAuthStore()

  const login = async (data: LoginInput) => {
    const res = await apiFetch<{ user: User; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
      auth: false,
    })
    setLogin(res.user, res.token)
  }

  const register = async (data: RegisterInput) => {
    const res = await apiFetch<{ user: User; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
      auth: false,
    })
    setLogin(res.user, res.token)
  }

  const logout = () => {
    clear()
  }

  return { user, token, isAuthenticated, login, register, logout }
}
