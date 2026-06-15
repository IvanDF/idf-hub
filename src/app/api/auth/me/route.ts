import { getUser } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const user = await getUser()
  if (!user) return NextResponse.json({ user: null })
  return NextResponse.json({ user })
}
