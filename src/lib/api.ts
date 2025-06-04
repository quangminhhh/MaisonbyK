const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''

export interface ApiOptions extends RequestInit {
  auth?: boolean
}

export async function apiFetch<T>(endpoint: string, { auth = true, headers, ...options }: ApiOptions = {}): Promise<T> {
  const token = auth && typeof window !== 'undefined' ? localStorage.getItem('token') : null

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  })

  if (!res.ok) {
    if (res.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
      }
    }
    const errorText = await res.text()
    throw new Error(errorText || 'API Error')
  }

  return res.json() as Promise<T>
}
