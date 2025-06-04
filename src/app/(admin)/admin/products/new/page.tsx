'use client'

import ProductForm from '@/components/features/admin/products/ProductForm'
import { useRouter } from 'next/navigation'

export default function AdminProductNewPage() {
  const router = useRouter()
  return (
    <div className="p-4">
      <ProductForm onSubmitSuccess={() => router.push('/admin/products')} />
    </div>
  )
}
