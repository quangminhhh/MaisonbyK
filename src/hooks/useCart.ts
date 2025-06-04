import { useCartStore } from '@/store/cart'

export function useCart() {
  const { items, totalAmount, addItem, removeItem, clear } = useCartStore()
  return { items, totalAmount, addItem, removeItem, clear }
}
