'use client'

import { useState } from 'react'

export interface GalleryImage {
  url: string
  altText?: string
}

export default function ProductImageGallery({ images }: { images: GalleryImage[] }) {
  const [current, setCurrent] = useState(0)
  if (!images.length) return null
  const main = images[current]
  return (
    <div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={main.url} alt={main.altText || ''} className="w-full h-80 object-cover rounded" />
      <div className="flex mt-2 gap-2">
        {images.map((img, idx) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={idx}
            src={img.url}
            alt={img.altText || ''}
            onClick={() => setCurrent(idx)}
            className={
              'w-16 h-16 object-cover rounded cursor-pointer border' +
              (idx === current ? ' border-sky-600' : '')
            }
          />
        ))}
      </div>
    </div>
  )
}
