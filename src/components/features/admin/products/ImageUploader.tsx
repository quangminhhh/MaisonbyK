'use client'

import { useRef } from 'react'
import { apiFetch } from '@/lib/api'

interface Props {
  value: string[]
  onChange: (urls: string[]) => void
}

export default function ImageUploader({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  const upload = async (file: File) => {
    const form = new FormData()
    form.append('image', file)
    const res = await apiFetch<{ imageUrl: string }>('/api/admin/products/upload-image', {
      method: 'POST',
      body: form,
    })
    onChange([...value, res.imageUrl])
  }

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    Array.from(files).forEach(upload)
    if (inputRef.current) inputRef.current.value = ''
  }

  const remove = (url: string) => {
    onChange(value.filter((u) => u !== url))
  }

  return (
    <div>
      <input type="file" multiple ref={inputRef} onChange={handleFiles} className="mb-2" />
      <div className="flex gap-2 flex-wrap">
        {value.map((url) => (
          <div key={url} className="relative group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="w-20 h-20 object-cover rounded" />
            <button
              type="button"
              onClick={() => remove(url)}
              className="absolute top-0 right-0 bg-black/60 text-white text-xs px-1 opacity-0 group-hover:opacity-100"
            >
              x
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
