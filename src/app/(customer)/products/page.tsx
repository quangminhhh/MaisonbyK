import ProductList from '@/components/features/products/ProductList'
import { Suspense } from 'react'

export default function ProductsPage() {
  return (
    <div className="p-4">
      <Suspense>
        <ProductList />
      </Suspense>
    </div>
  )
}
