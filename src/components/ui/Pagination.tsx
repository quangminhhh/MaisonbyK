'use client'

import { cn } from '@/lib/utils'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange?: (page: number) => void
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null
  const pages = []
  for (let p = 1; p <= totalPages; p++) {
    pages.push(
      <button
        key={p}
        className={cn(
          'px-3 py-1 rounded-md',
          p === page ? 'bg-sky-600 text-white' : 'bg-gray-200'
        )}
        onClick={() => onPageChange?.(p)}
      >
        {p}
      </button>
    )
  }
  return <div className="flex gap-2">{pages}</div>
}
