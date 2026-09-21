import { execFileSync } from 'child_process'
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'

const ROOT = process.cwd()
const INK_DIR = join(ROOT, 'public', 'assets', 'ink')

const EXPECTED = [
  'frame-light.svg', 'frame-dark.svg',
  'rule-light.svg', 'rule-dark.svg',
  'rule-v-light.svg', 'rule-v-dark.svg',
]

describe('carved ink assets', () => {
  it('ships one asset per shape per theme', () => {
    expect(readdirSync(INK_DIR).sort()).toEqual([...EXPECTED].sort())
  })

  it('every asset is a single-path SVG with baked geometry', () => {
    EXPECTED.forEach(file => {
      const svg = readFileSync(join(INK_DIR, file), 'utf8')
      expect(svg).toContain('<svg')
      // The whole point: no runtime filter, the wobble is in the path data
      expect(svg).not.toContain('feTurbulence')
      expect(svg).not.toContain('filter')
      // Enough sampled points to actually read as hand-cut
      expect((svg.match(/L/g) ?? []).length).toBeGreaterThan(50)
    })
  })

  it('the frame path is closed', () => {
    const svg = readFileSync(join(INK_DIR, 'frame-light.svg'), 'utf8')
    expect(/d="[^"]*Z"/.test(svg)).toBe(true)
  })

  it('light and dark differ only by stroke colour', () => {
    const light = readFileSync(join(INK_DIR, 'frame-light.svg'), 'utf8')
    const dark = readFileSync(join(INK_DIR, 'frame-dark.svg'), 'utf8')
    expect(light).toContain('#111827')
    expect(dark).toContain('#f3f4f6')
    expect(light.replace('#111827', 'X')).toBe(dark.replace('#f3f4f6', 'X'))
  })

  // The generator is deterministic on purpose — no RNG — so a committed asset
  // that no longer matches its source means someone hand-edited the output.
  it('the committed assets match what the generator produces', () => {
    const before = EXPECTED.map(f => readFileSync(join(INK_DIR, f), 'utf8'))
    execFileSync('node', [join(ROOT, 'scripts', 'generate-ink-frames.mjs')], { stdio: 'pipe' })
    const after = EXPECTED.map(f => readFileSync(join(INK_DIR, f), 'utf8'))
    expect(after).toEqual(before)
  })
})
