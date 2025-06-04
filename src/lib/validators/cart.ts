import { z } from 'zod'

export const addCartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
  size: z.string().min(1).optional(),
  color: z.string().min(1).optional(),
})
export type AddCartItemInput = z.infer<typeof addCartItemSchema>

export const updateCartItemSchema = z.object({
  quantity: z.number().int().nonnegative(),
})
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>
