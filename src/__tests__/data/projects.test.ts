import { PROJECTS } from '@/data/projects'
import { templateFor } from '@/types/project'
import type { ProjectCategory, ProjectKind } from '@/types/project'

const VALID_CATEGORIES: ProjectCategory[] = ['CODE', 'DESIGN', 'CRAFT']
const VALID_KINDS: ProjectKind[] = ['photo', 'template', 'shortcut', 'experiment']

// Which template every project rendered with before the taxonomy changed.
// Pinning it here is the safety property of that refactor: the categories were
// reorganised to describe the work better, not to restyle any page.
const TEMPLATE_BEFORE: Record<string, string> = {
  "yggdrasil": "code",
  "gabberg-icard": "code",
  "filteroo": "code",
  "zelda-cookbook": "code",
  "vue-boolflix": "code",
  "html-css-spotifyweb": "code",
  "todo-fullstack": "code",
  "signup-onboarding-flow": "code",
  "rick-and-morty-theme": "code",
  "check-your-pipes": "code",
  "3d-blender-animation": "lab",
  "snake-3d": "lab",
  "codepen-nintendo-switch-oled": "lab",
  "codepen-image-preview-slider": "lab",
  "codepen-navbar-animated": "lab",
  "figma-icon-builder": "code",
  "notion-payment-tracker-2": "craft",
  "notion-bookshelf-2": "craft",
  "notion-recipes-advanced": "craft",
  "shortcut-spotify-to-apple-music": "craft",
  "shortcut-tabata": "craft",
  "gin-tonic-tshirt": "design",
  "phone-covers-design": "design",
  "mirror-archetype-cosplay": "design"
}

const VALID_STATUSES = ['live', 'in-progress', 'archived', 'concept']

describe('PROJECTS data', () => {
  it('has at least one project', () => {
    expect(PROJECTS.length).toBeGreaterThan(0)
  })

  it('all project ids are unique', () => {
    const ids = PROJECTS.map(p => p.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('all projects have required fields', () => {
    PROJECTS.forEach(p => {
      expect(p.id).toBeTruthy()
      expect(p.title).toBeTruthy()
      expect(p.description).toBeTruthy()
      expect(p.year).toBeTruthy()
      expect(Array.isArray(p.tags)).toBe(true)
      expect(p.media).toBeDefined()
      expect(p.media.thumbnail).toBeTruthy()
    })
  })

  it('all categories are valid', () => {
    PROJECTS.forEach(p => {
      expect(VALID_CATEGORIES).toContain(p.category)
    })
  })

  it('all statuses are valid when present', () => {
    PROJECTS.filter(p => p.status).forEach(p => {
      expect(VALID_STATUSES).toContain(p.status)
    })
  })

  it('all media thumbnails are non-empty strings', () => {
    PROJECTS.forEach(p => {
      expect(typeof p.media.thumbnail).toBe('string')
      expect(p.media.thumbnail.length).toBeGreaterThan(0)
    })
  })

  it('all tags arrays are non-empty', () => {
    PROJECTS.forEach(p => {
      expect(p.tags.length).toBeGreaterThan(0)
    })
  })

  it('all years are valid 4-digit strings', () => {
    PROJECTS.forEach(p => {
      expect(p.year).toMatch(/^\d{4}$/)
    })
  })

  it('every precise date is a valid YYYY-MM that agrees with the year', () => {
    PROJECTS.filter(p => p.date).forEach(p => {
      expect(p.date).toMatch(/^\d{4}-(0[1-9]|1[0-2])$/)
      expect(p.date!.slice(0, 4)).toBe(p.year)
    })
  })

  it('no project is dated in the future', () => {
    const now = new Date()
    const currentYear = now.getFullYear()
    PROJECTS.forEach(p => {
      expect(Number(p.year)).toBeLessThanOrEqual(currentYear)
    })
  })

  it('mockup and plate images are distinct from each other', () => {
    PROJECTS.forEach(p => {
      const mockupSrcs = (p.mockup?.frames ?? []).map(f => f.src)
      const plateSrcs = (p.plates ?? []).map(pl => pl.src)
      const all = [...mockupSrcs, ...plateSrcs]
      expect(new Set(all).size).toBe(all.length)
    })
  })

  it('every kind is a valid one', () => {
    PROJECTS.filter(p => p.kind).forEach(p => {
      expect(VALID_KINDS).toContain(p.kind)
    })
  })

  // Craft is the bucket that subdivides; a Craft project without a kind falls
  // back to the plain craft template and disappears from every sub-filter.
  it('every Craft project declares a kind', () => {
    const missing = PROJECTS.filter(p => p.category === 'CRAFT' && !p.kind).map(p => p.id)
    expect(missing).toEqual([])
  })

  it('only Craft carries a kind, for now', () => {
    const stray = PROJECTS.filter(p => p.category !== 'CRAFT' && p.kind).map(p => p.id)
    expect(stray).toEqual([])
  })

  it('renders every project with the template it used before the remap', () => {
    const now = Object.fromEntries(PROJECTS.map(p => [p.id, templateFor(p)]))
    expect(now).toEqual(TEMPLATE_BEFORE)
  })

  it('every decision states a choice and a reason', () => {
    PROJECTS.filter(p => p.decisions).forEach(p => {
      p.decisions!.forEach(d => {
        expect(d.choice.length).toBeGreaterThan(0)
        expect(d.why.length).toBeGreaterThan(0)
      })
    })
  })
})
