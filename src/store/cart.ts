import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { apiFetch } from '@/lib/api'
import type { AddCartItemInput } from '@/lib/validators/cart'

export interface CartProduct {
  id: string
  name: string
  slug: string
  images?: { url: string }[]
  price: number
  promotionalPrice?: number
}

export interface CartItem {
  id: string
  product: CartProduct
  price: number
  quantity: number
  size?: string | null
  color?: string | null
}

interface CartState {
  items: CartItem[]
  totalAmount: number
  isLoading: boolean
  fetchCart: () => Promise<void>
  addItem: (data: AddCartItemInput) => Promise<void>
  updateItemQuantity: (id: string, quantity: number) => Promise<void>
  removeItem: (id: string) => Promise<void>
  clearCart: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      totalAmount: 0,
      isLoading: false,
      async fetchCart() {
        set({ isLoading: true })
        const res = await apiFetch<{ items: CartItem[]; totalAmount: number }>(
          '/api/cart'
        )
        set({ items: res.items, totalAmount: res.totalAmount, isLoading: false })
      },
      async addItem(data) {
        set({ isLoading: true })
        const res = await apiFetch<{ items: CartItem[]; totalAmount: number }>(
          '/api/cart/items',
          { method: 'POST', body: JSON.stringify(data) }
        )
        set({ items: res.items, totalAmount: res.totalAmount, isLoading: false })
      },
      async updateItemQuantity(id, quantity) {
        set({ isLoading: true })
        const res = await apiFetch<{ items: CartItem[]; totalAmount: number }>(
          `/api/cart/items/${id}`,
          { method: 'PUT', body: JSON.stringify({ quantity }) }
        )
        set({ items: res.items, totalAmount: res.totalAmount, isLoading: false })
      },
      async removeItem(id) {
        set({ isLoading: true })
        const res = await apiFetch<{ items: CartItem[]; totalAmount: number }>(
          `/api/cart/items/${id}`,
          { method: 'DELETE' }
        )
        set({ items: res.items, totalAmount: res.totalAmount, isLoading: false })
      },
      clearCart() {
        set({ items: [], totalAmount: 0 })
      },
    }),
    { name: 'cart' }
  )
)
