'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createProductSchema, type CreateProductInput } from '@/lib/validators/product'
import { apiFetch } from '@/lib/api'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import ImageUploader from './ImageUploader'
import { useCategories } from '@/hooks/useCategories'

interface ProductFormProps {
  initialData?: CreateProductInput & { id: string }
  onSubmitSuccess: () => void
}

export default function ProductForm({ initialData, onSubmitSuccess }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: initialData,
  })
  const { data: categories } = useCategories()
  const imageUrls = watch('imageUrls') || []

  useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([k, v]) => {
        setValue(
          k as keyof CreateProductInput,
          v as CreateProductInput[keyof CreateProductInput],
        )
      })
    }
  }, [initialData, setValue])

  const onSubmit = async (values: CreateProductInput) => {
    if (initialData?.id) {
      await apiFetch(`/api/admin/products/${initialData.id}`, {
        method: 'PUT',
        body: JSON.stringify(values),
      })
    } else {
      await apiFetch('/api/admin/products', {
        method: 'POST',
        body: JSON.stringify(values),
      })
    }
    onSubmitSuccess()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 w-full max-w-xl">
      <Input placeholder="Tên sản phẩm" {...register('name')} />
      {errors.name && <div className="text-red-500 text-sm">{errors.name.message}</div>}
      <Input placeholder="Mô tả" {...register('description')} />
      <Input type="number" placeholder="Giá" {...register('price', { valueAsNumber: true })} />
      <Input
        type="number"
        placeholder="Giá khuyến mãi"
        {...register('promotionalPrice', { valueAsNumber: true })}
      />
      <select {...register('categoryId')} className="border p-2 rounded-md w-full text-sm">
        <option value="">Chọn danh mục</option>
        {categories?.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <Input placeholder="Sizes (comma separated)" {...register('sizes', { setValueAs: (v) => v.split(',').map((s: string) => s.trim()).filter(Boolean) })} />
      <Input placeholder="Colors (comma separated)" {...register('colors', { setValueAs: (v) => v.split(',').map((s: string) => s.trim()).filter(Boolean) })} />
      <Input placeholder="Chất liệu" {...register('material')} />
      <Input type="number" placeholder="Số lượng" {...register('stockQuantity', { valueAsNumber: true })} />
      <ImageUploader
        value={imageUrls}
        onChange={(urls) =>
          setValue('imageUrls', urls as CreateProductInput['imageUrls'])
        }
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>{initialData ? 'Cập nhật' : 'Tạo mới'}</Button>
      </div>
    </form>
  )
}
