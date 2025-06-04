'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { apiFetch } from '@/lib/api'
import ProductForm from '@/components/features/admin/products/ProductForm'
import type { CreateProductInput } from '@/lib/validators/product'

export default function AdminProductEditPage() {
  const params = useParams<{ productId: string }>()
  const router = useRouter()
  const [product, setProduct] = useState<CreateProductInput & { id: string } | null>(null)

  useEffect(() => {
    if (!params?.productId) return
    apiFetch<{ product: CreateProductInput & { id: string } }>(`/api/products/${params.productId}`).then((res) => setProduct(res.product))
  }, [params?.productId])

  if (!product) return <div>Loading...</div>

  return (
    <div className="p-4">
      <ProductForm initialData={product} onSubmitSuccess={() => router.push('/admin/products')} />
    </div>
  )
}
