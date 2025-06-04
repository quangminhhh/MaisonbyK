import { z } from 'zod'

export const updateProfileSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
})
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

export const addressSchema = z.object({
  recipientName: z.string().min(1),
  street: z.string().min(1),
  city: z.string().min(1),
  phone: z.string().min(1),
})
export type AddressInput = z.infer<typeof addressSchema>

export const adminUpdateUserSchema = updateProfileSchema.extend({
  role: z.enum(['CUSTOMER', 'ADMIN']).optional(),
})
export type AdminUpdateUserInput = z.infer<typeof adminUpdateUserSchema>
