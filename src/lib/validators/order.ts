import { z } from 'zod'
import { addressSchema } from './user'

export const createOrderSchema = z.object({
  shippingAddressId: z.string().min(1).optional(),
  shippingAddress: addressSchema.optional(),
  paymentMethod: z.enum(['COD']).default('COD'),
  notes: z.string().optional(),
}).refine(data => data.shippingAddressId || data.shippingAddress, {
  message: 'Shipping address required',
  path: ['shippingAddressId'],
})
export type CreateOrderInput = z.infer<typeof createOrderSchema>

export const updateOrderStatusSchema = z.object({
  status: z.enum(['PROCESSING', 'SHIPPING', 'DELIVERED', 'CANCELLED']),
})
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>
