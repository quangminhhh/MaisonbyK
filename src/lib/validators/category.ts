import { z } from 'zod'

export const createCategorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  parentId: z.string().optional(),
  imageUrl: z.string().url().optional(),
})
export type CreateCategoryInput = z.infer<typeof createCategorySchema>

export const updateCategorySchema = createCategorySchema.partial().extend({
  slug: z.string().min(1).optional(),
})
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
