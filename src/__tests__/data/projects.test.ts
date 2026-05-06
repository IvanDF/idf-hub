import { PROJECTS } from '@/data/projects'
import type { ProjectCategory } from '@/types/project'

const VALID_CATEGORIES: ProjectCategory[] = [
  'DEV', 'VSCODE', 'CREATIVE', 'MAKER', 'APPLE', 'CODEPEN', 'EXPERIMENT',
]
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
})
