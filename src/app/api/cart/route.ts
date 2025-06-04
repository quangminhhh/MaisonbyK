import { NextRequest, NextResponse } from 'next/server'
import { authenticateToken } from '@/lib/auth'
import { fetchCart } from '@/lib/cart'

export async function GET(req: NextRequest) {
  const payload = authenticateToken(req)
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await fetchCart(payload.userId)
  return NextResponse.json(data)
}
