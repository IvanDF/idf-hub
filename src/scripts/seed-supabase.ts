// Run with: npx ts-node --project tsconfig.json src/scripts/seed-supabase.ts
// (requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local)
import { createClient } from '@supabase/supabase-js'
import { PROJECTS } from '../data/projects'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

async function seed() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const rows = PROJECTS.map(p => ({
    id: p.id,
    title: p.title,
    description: p.description,
    long_description: p.longDescription,
    category: p.category,
    platform: p.platform,
    tags: p.tags,
    year: p.year,
    duration: p.duration,
    role: p.role,
    status: p.status,
    stack: p.stack ?? [],
    highlights: p.highlights ?? [],
    problem: p.problem,
    solution: p.solution,
    metrics: p.metrics ?? [],
    links: p.links ?? {},
    media: p.media,
    interaction: p.interaction,
    layout: p.layout,
  }))

  const { error } = await supabase.from('projects').upsert(rows, { onConflict: 'id' })
  if (error) {
    console.error('Seed failed:', error)
    process.exit(1)
  }
  console.log(`✅ Seeded ${rows.length} projects successfully`)
}

seed()
