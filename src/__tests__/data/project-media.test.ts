import { existsSync } from 'fs'
import { join } from 'path'
import { PROJECTS } from '@/data/projects'

const PUBLIC_DIR = join(process.cwd(), 'public')

/** Every local image path a project references, tagged with where it came from. */
function localImageRefs() {
  return PROJECTS.flatMap(p => [
    { project: p.id, field: 'media.thumbnail', src: p.media.thumbnail },
    ...(p.media.gallery ?? []).map(src => ({
      project: p.id,
      field: 'media.gallery',
      src,
    })),
    ...(p.mockup?.frames ?? []).map(f => ({
      project: p.id,
      field: 'mockup.frames',
      src: f.src,
    })),
    ...(p.plates ?? []).map(pl => ({
      project: p.id,
      field: 'plates',
      src: pl.src,
    })),
  ]).filter(ref => ref.src.startsWith('/'))
}

describe('project media references', () => {
  // A wrong path renders as a silently broken image in production, which is
  // exactly how a missing cosplay plate survived in the data for months.
  it('every local image path exists in public/', () => {
    const missing = localImageRefs().filter(
      ref => !existsSync(join(PUBLIC_DIR, decodeURIComponent(ref.src))),
    )

    expect(
      missing.map(m => `${m.project} · ${m.field} → ${m.src}`),
    ).toEqual([])
  })

  it('remote thumbnails are https', () => {
    PROJECTS.map(p => p.media.thumbnail)
      .filter(src => !src.startsWith('/'))
      .forEach(src => expect(src.startsWith('https://')).toBe(true))
  })
})
