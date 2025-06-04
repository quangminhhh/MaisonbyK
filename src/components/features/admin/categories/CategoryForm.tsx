'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { apiFetch } from '@/lib/api'
import {
  createCategorySchema,
  type CreateCategoryInput,
} from '@/lib/validators/category'
import type { CategoryNode } from '@/hooks/useCategories'

interface CategoryFormProps {
  initialData?: CreateCategoryInput & { id: string }
  onSubmitSuccess: () => void
}

export default function CategoryForm({ initialData, onSubmitSuccess }: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: initialData,
  })
  const [parents, setParents] = useState<CategoryNode[]>([])

  useEffect(() => {
    apiFetch<{ categories: CategoryNode[] }>('/api/categories?tree=true').then((res) =>
      setParents(res.categories)
    )
  }, [])

  const onSubmit = async (values: CreateCategoryInput) => {
    if (initialData?.id) {
      await apiFetch(`/api/admin/categories/${initialData.id}`, {
        method: 'PUT',
        body: JSON.stringify(values),
      })
    } else {
      await apiFetch('/api/admin/categories', {
        method: 'POST',
        body: JSON.stringify(values),
      })
    }
    onSubmitSuccess()
    reset()
  }

  const renderOptions = (cats: CategoryNode[], level = 0) =>
    cats.map((c) => (
      <>
        <option key={c.id} value={c.id}>
          {`${'--'.repeat(level)} ${c.name}`}
        </option>
        {c.children && renderOptions(c.children, level + 1)}
      </>
    ))

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 w-80">
      <Input placeholder="Tên danh mục" {...register('name')} />
      {errors.name && <div className="text-red-500 text-sm">{errors.name.message}</div>}
      <Input placeholder="Mô tả" {...register('description')} />
      <select {...register('parentId')} className="border p-2 rounded-md w-full text-sm">
        <option value="">Chọn danh mục cha</option>
        {renderOptions(parents)}
      </select>
      <Input placeholder="URL hình ảnh" {...register('imageUrl')} />
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>{initialData ? 'Cập nhật' : 'Tạo mới'}</Button>
      </div>
    </form>
  )
}
