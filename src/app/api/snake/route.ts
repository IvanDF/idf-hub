import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const SCORES_FILE = path.join(process.cwd(), 'src/data/snake-scores.json')

interface ScoreEntry {
  name: string
  score: number
  created_at: string
}

async function readScores(): Promise<ScoreEntry[]> {
  try {
    const data = await fs.readFile(SCORES_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function writeScores(scores: ScoreEntry[]) {
  await fs.writeFile(SCORES_FILE, JSON.stringify(scores, null, 2))
}

export async function GET() {
  const scores = await readScores()
  const top10 = scores
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map((s, i) => ({ id: i + 1, name: s.name, score: s.score, created_at: s.created_at }))
  return NextResponse.json(top10)
}

export async function POST(request: Request) {
  const body = await request.json()
  const name = String(body.name ?? 'Anonymous').trim().slice(0, 20) || 'Anonymous'
  const score = parseInt(body.score, 10)

  if (isNaN(score) || score < 0) {
    return NextResponse.json({ error: 'Invalid score' }, { status: 400 })
  }

  const scores = await readScores()
  const entry: ScoreEntry = { name, score, created_at: new Date().toISOString() }
  scores.push(entry)
  await writeScores(scores)
  return NextResponse.json(entry, { status: 201 })
}
