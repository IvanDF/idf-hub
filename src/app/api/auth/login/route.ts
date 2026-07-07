import { checkPassword, setSession } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { password } = await request.json()
  if (!checkPassword(password)) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }
  if (!(await setSession())) {
    return NextResponse.json(
      { error: 'Auth not configured (missing SESSION_SECRET)' },
      { status: 503 },
    )
  }
  return NextResponse.json({ success: true })
}
