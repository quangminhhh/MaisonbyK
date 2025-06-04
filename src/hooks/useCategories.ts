import useSWR from 'swr'
import { apiFetch } from '@/lib/api'

export interface CategoryNode {
  id: string
  name: string
  slug: string
  description?: string
  imageUrl?: string
  parentId?: string
  children?: CategoryNode[]
  _count?: { products: number }
}

const fetcher = (url: string) =>
  apiFetch<{ categories: CategoryNode[] }>(url).then((res) => res.categories)

export function useCategoryTree() {
  return useSWR('/api/categories?tree=true', fetcher)
}

export function useCategories(parentId?: string) {
  const url = parentId ? `/api/categories?parentId=${parentId}` : '/api/categories'
  return useSWR(url, fetcher)
}

export function useCategory(slugOrId: string | null) {
  return useSWR(
    slugOrId ? `/api/categories/${slugOrId}` : null,
    (url) => apiFetch<{ category: CategoryNode }>(url).then((res) => res.category)
  )
}
