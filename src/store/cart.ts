import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface CartState {
  items: CartItem[]
  totalAmount: number
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  clear: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      totalAmount: 0,
      addItem: (item) =>
        set((state) => ({
          items: [...state.items, item],
          totalAmount: state.totalAmount + item.price * item.quantity,
        })),
      removeItem: (id) =>
        set((state) => {
          const items = state.items.filter((it) => it.id !== id)
          const totalAmount = items.reduce(
            (sum, it) => sum + it.price * it.quantity,
            0
          )
          return { items, totalAmount }
        }),
      clear: () => set({ items: [], totalAmount: 0 }),
    }),
    { name: 'cart' }
  )
)
