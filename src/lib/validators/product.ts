import { z } from 'zod'

export const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  promotionalPrice: z.number().positive().optional(),
  categoryId: z.string().min(1),
  sizes: z.array(z.string().min(1)).nonempty(),
  colors: z.array(z.string().min(1)).nonempty(),
  material: z.string().min(1).optional(),
  stockQuantity: z.number().int().nonnegative(),
  status: z.enum(['AVAILABLE', 'OUT_OF_STOCK', 'UNLISTED']).optional(),
  imageUrls: z.array(z.string().url()).optional(),
})
export type CreateProductInput = z.infer<typeof createProductSchema>

export const updateProductSchema = createProductSchema.partial().extend({
  slug: z.string().min(1).optional(),
})
export type UpdateProductInput = z.infer<typeof updateProductSchema>
