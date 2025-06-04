'use client'

import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

export interface ProductBrief {
  id: string
  slug: string
  name: string
  price: number
  promotionalPrice?: number
  images?: { url: string }[]
}

export default function ProductCard({ product }: { product: ProductBrief }) {
  const image = product.images && product.images[0]?.url
  return (
    <Link href={`/products/${product.slug}`} className="block border rounded-md p-2 hover:shadow">
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={product.name} className="w-full h-40 object-cover rounded" />
      )}
      <div className="mt-2 space-y-1 text-sm">
        <div className="font-medium truncate" title={product.name}>{product.name}</div>
        <div className="text-sky-600">
          {formatCurrency(product.promotionalPrice ?? product.price)}
          {product.promotionalPrice && (
            <span className="ml-2 line-through text-gray-500">
              {formatCurrency(product.price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
