import { PROJECTS } from '@/data/projects'
import { NextResponse } from 'next/server'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = PROJECTS.find(p => p.id === id)
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(project)
}

export async function PUT(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = PROJECTS.find(p => p.id === id)
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(project)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = PROJECTS.find(p => p.id === id)
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return new NextResponse(null, { status: 204 })
}
