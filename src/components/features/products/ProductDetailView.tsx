'use client'

import { useParams } from 'next/navigation'
import useSWR from 'swr'
import { apiFetch } from '@/lib/api'
import ProductImageGallery from './ProductImageGallery'
import { formatCurrency } from '@/lib/utils'
import { useCart } from '@/hooks/useCart'

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  promotionalPrice?: number
  sizes: string[]
  colors: string[]
  material?: string
  stockQuantity: number
  images: { url: string }[]
}

export default function ProductDetailView() {
  const params = useParams<{ slug: string }>()
  const { addItem } = useCart()
  const { data } = useSWR(
    params?.slug ? `/api/products/${params.slug}` : null,
    (url) => apiFetch<{ product: Product }>(url).then((res) => res.product)
  )
  if (!data) return <div>Loading...</div>

  const handleAdd = () => {
    addItem({ id: data.id, name: data.name, price: data.promotionalPrice ?? data.price, quantity: 1 })
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <ProductImageGallery images={data.images} />
      <div className="space-y-3">
        <h1 className="text-xl font-medium">{data.name}</h1>
        <div className="text-sky-600 text-lg">
          {formatCurrency(data.promotionalPrice ?? data.price)}
          {data.promotionalPrice && (
            <span className="ml-2 line-through text-gray-500">
              {formatCurrency(data.price)}
            </span>
          )}
        </div>
        <p>{data.description}</p>
        <div>Số lượng còn lại: {data.stockQuantity}</div>
        <button onClick={handleAdd} className="bg-sky-600 text-white px-4 py-2 rounded">Thêm vào giỏ hàng</button>
      </div>
    </div>
  )
}
