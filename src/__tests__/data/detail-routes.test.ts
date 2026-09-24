import { readFileSync } from 'fs'
import { join } from 'path'
import { PROJECTS } from '@/data/projects'
import { hrefForProject } from '@/types/project'

const CONFIG = readFileSync(join(process.cwd(), 'next.config.ts'), 'utf8')

/** Projects that answer on a route of their own rather than /lab/[slug]. */
const OWN_PAGE = PROJECTS.filter(p => p.detailHref)

describe('projects with a page of their own', () => {
  it('points at an absolute path inside the site', () => {
    OWN_PAGE.forEach(p => {
      expect(p.detailHref).toMatch(/^\//)
      expect(p.detailHref).not.toMatch(/^\/lab\//)
    })
  })

  // The route's own `redirect()` only produces a client-side hop on a
  // prerendered page, so the real 308 lives in next.config.ts. Nothing links
  // the two, which is exactly why this checks they have not drifted.
  it('has a matching redirect in next.config.ts', () => {
    OWN_PAGE.forEach(p => {
      expect(CONFIG).toContain(`source: "/lab/${p.id}"`)
      expect(CONFIG).toContain(`destination: "${p.detailHref}"`)
    })
  })

  it('declares no redirect for a project that does not have its own page', () => {
    const redirected = [...CONFIG.matchAll(/source: "\/lab\/([^"]+)"/g)].map(m => m[1])
    const expected = OWN_PAGE.map(p => p.id)
    expect(redirected.sort()).toEqual(expected.sort())
  })

  // Two pages saying the same thing is what this whole arrangement removes.
  it('keeps no case-study link pointing at its own page', () => {
    OWN_PAGE.forEach(p => {
      expect(p.links?.caseStudy).not.toBe(p.detailHref)
    })
  })
})

describe('hrefForProject', () => {
  it('sends a project with its own page there, and everything else to /lab', () => {
    PROJECTS.forEach(p => {
      expect(hrefForProject(p)).toBe(p.detailHref ?? `/lab/${p.id}`)
    })
  })

  // The terminal's `open` and the Lab list both used to build this string by
  // hand, so one of them would always be the last to learn about a new route.
  it('never returns a /lab path for a project with its own page', () => {
    OWN_PAGE.forEach(p => expect(hrefForProject(p)).not.toMatch(/^\/lab\//))
  })
})
