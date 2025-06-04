import { NextRequest, NextResponse } from 'next/server'
import { authenticateToken, authorizeRole } from '@/lib/auth'
import { promises as fs } from 'fs'
import path from 'path'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  const payload = authenticateToken(req)
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!authorizeRole(payload, 'ADMIN')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const form = await req.formData()
  const file = form.get('image') as File | null
  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const ext = path.extname(file.name).toLowerCase()
  if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
    return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
  }

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'products')
  await fs.mkdir(uploadsDir, { recursive: true })
  const filename = `${crypto.randomUUID()}${ext}`
  await fs.writeFile(path.join(uploadsDir, filename), buffer)
  const imageUrl = `/uploads/products/${filename}`
  return NextResponse.json({ imageUrl })
}
