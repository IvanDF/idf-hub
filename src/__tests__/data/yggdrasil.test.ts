import { existsSync } from 'fs'
import { join } from 'path'
import { YGG_DAY, YGG_FORGE, YGG_LAWS, YGG_PALETTE, YGG_REALMS, YGG_STATS } from '@/data/yggdrasil'

const PUBLIC_DIR = join(process.cwd(), 'public')

describe('YGG_REALMS', () => {
  it('all realm ids are unique', () => {
    const ids = YGG_REALMS.map(r => r.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every realm is complete', () => {
    YGG_REALMS.forEach(r => {
      expect(r.id).toBeTruthy()
      expect(r.rune).toBeTruthy()
      expect(r.name).toBeTruthy()
      expect(r.myth).toBeTruthy()
      expect(r.role).toBeTruthy()
      expect(r.detail).toBeTruthy()
    })
  })

  // The tree draws itself from the layers: one ground, one trunk, the rest branches.
  it('has exactly one root layer and one trunk', () => {
    expect(YGG_REALMS.filter(r => r.layer === 'roots')).toHaveLength(1)
    expect(YGG_REALMS.filter(r => r.layer === 'trunk')).toHaveLength(1)
    expect(YGG_REALMS.filter(r => r.layer === 'branches').length).toBeGreaterThan(0)
  })
})

describe('YGG_FORGE', () => {
  it('all forge ids are unique', () => {
    const ids = YGG_FORGE.map(f => f.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  // A download that 404s is the one failure a visitor notices immediately.
  it('every download exists in public/', () => {
    const missing = YGG_FORGE.flatMap(f =>
      f.downloads.filter(d => !existsSync(join(PUBLIC_DIR, decodeURIComponent(d.href)))).map(d => `${f.id} → ${d.href}`),
    )
    expect(missing).toEqual([])
  })

  it('a ready item ships at least one file, one still forging ships none', () => {
    YGG_FORGE.forEach(f => {
      if (f.status === 'ready') expect(f.downloads.length).toBeGreaterThan(0)
      else expect(f.downloads).toEqual([])
    })
  })
})

describe('YGG_LAWS, YGG_DAY and the status line', () => {
  it('every law states a rule and explains it', () => {
    expect(YGG_LAWS.length).toBeGreaterThan(0)
    YGG_LAWS.forEach(l => {
      expect(l.title).toBeTruthy()
      expect(l.body).toBeTruthy()
    })
  })

  it('every moment of the day carries a time', () => {
    expect(YGG_DAY.length).toBeGreaterThan(0)
    YGG_DAY.forEach(m => {
      expect(m.time).toBeTruthy()
      expect(m.title).toBeTruthy()
      expect(m.body).toBeTruthy()
    })
  })

  it('the palette is made of hex colours', () => {
    YGG_PALETTE.forEach(c => {
      expect(c.name).toBeTruthy()
      expect(c.hex).toMatch(/^#[0-9a-f]{6}$/)
    })
  })

  // The service count is derived, not typed by hand: it must follow the data.
  it('the service count matches the branches', () => {
    const services = YGG_STATS.find(s => s.label === 'services')
    expect(services?.value).toBe(String(YGG_REALMS.filter(r => r.layer === 'branches').length))
  })
})
