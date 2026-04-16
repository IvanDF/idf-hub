import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('snake_scores')
    .select('id, name, score, created_at')
    .order('score', { ascending: false })
    .limit(10)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(request: Request) {
  const body = await request.json()
  const name = String(body.name ?? 'Anonymous').trim().slice(0, 20) || 'Anonymous'
  const score = parseInt(body.score, 10)

  if (isNaN(score) || score < 0) {
    return NextResponse.json({ error: 'Invalid score' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('snake_scores')
    .insert({ name, score })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
