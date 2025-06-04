'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { apiFetch } from '@/lib/api'

const schema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  line: z.string().min(1),
  city: z.string().min(1),
})

export type AddressInput = z.infer<typeof schema>

interface AddressFormProps {
  initialData?: AddressInput & { id: string }
  onSubmitSuccess: () => void
  onCancel: () => void
}

export default function AddressForm({ initialData, onSubmitSuccess, onCancel }: AddressFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AddressInput>({ resolver: zodResolver(schema), defaultValues: initialData })

  const onSubmit = async (values: AddressInput) => {
    if (initialData?.id) {
      await apiFetch(`/api/users/me/addresses/${initialData.id}`, {
        method: 'PUT',
        body: JSON.stringify(values),
      })
    } else {
      await apiFetch('/api/users/me/addresses', {
        method: 'POST',
        body: JSON.stringify(values),
      })
    }
    onSubmitSuccess()
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 w-80">
      <Input placeholder="Tên người nhận" {...register('name')} />
      {errors.name && <div className="text-red-500 text-sm">{errors.name.message}</div>}
      <Input placeholder="Số điện thoại" {...register('phone')} />
      {errors.phone && <div className="text-red-500 text-sm">{errors.phone.message}</div>}
      <Input placeholder="Đường" {...register('line')} />
      {errors.line && <div className="text-red-500 text-sm">{errors.line.message}</div>}
      <Input placeholder="Thành phố" {...register('city')} />
      {errors.city && <div className="text-red-500 text-sm">{errors.city.message}</div>}
      <div className="flex gap-2 justify-end mt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          Lưu
        </Button>
      </div>
    </form>
  )
}
