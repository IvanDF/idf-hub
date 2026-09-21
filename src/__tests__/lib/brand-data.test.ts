import { MARKS, buildBrandOutput } from '@/lib/terminal/brand.data'

const ART_WIDTH = 20

describe('brand marks', () => {
  // The columns are built by padding the art to a fixed width. A line that is
  // longer than the rest, or longer than ART_WIDTH, pushes the right-hand
  // column out on that row only — which reads as a broken layout.
  it('every mark has lines of equal length', () => {
    MARKS.forEach((mark, i) => {
      const widths = new Set(mark.map(l => [...l].length))
      expect(`mark ${i}: ${[...widths].join()}`).toBe(`mark ${i}: ${[...widths][0]}`)
    })
  })

  it('no mark is wider than the facts column starts', () => {
    MARKS.forEach(mark => {
      mark.forEach(line => expect([...line].length).toBeLessThanOrEqual(ART_WIDTH))
    })
  })

  it('there is more than one, since it picks at random', () => {
    expect(MARKS.length).toBeGreaterThan(1)
  })
})

describe('brand output', () => {
  it('puts the facts in the same column on every row', () => {
    const rows = buildBrandOutput(0)
      .map(o => String(o.content))
      .filter(c => c.includes('#') || c.includes('iDF'))

    rows.forEach(row => {
      // Everything before the facts is art plus padding, never the facts.
      expect([...row.slice(0, ART_WIDTH)].join('').trimEnd()).not.toMatch(/[#—]/)
    })
  })

  it('marks every line preformatted so nothing wraps mid-layout', () => {
    expect(buildBrandOutput(0).every(o => o.pre)).toBe(true)
  })

  it('renders each mark without dropping a fact', () => {
    MARKS.forEach((_, i) => {
      const text = buildBrandOutput(i).map(o => String(o.content)).join('\n')
      expect(text).toContain('#8b5cf6')
      expect(text).toContain('Geist Mono')
      expect(text).toContain('DRIVEN BY CURIOSITY.')
    })
  })

  it('no longer advertises the assets section', () => {
    const text = buildBrandOutput(0).map(o => String(o.content)).join('\n')
    expect(text).not.toContain('ASSETS')
  })
})
