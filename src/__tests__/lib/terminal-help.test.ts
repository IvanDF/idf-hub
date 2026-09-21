import { EASTER_EGGS, VALID_COMMANDS } from '@/lib/terminal/Terminal.constants'
import {
  COMMANDS,
  buildCategoryHelp,
  buildHelpOutput,
  buildInfoOutput,
  isHelpCategory,
} from '@/lib/terminal/Terminal.help'

describe('terminal help catalogue', () => {
  it('lists every command exactly once', () => {
    const names = COMMANDS.map(c => c.name)
    expect(new Set(names).size).toBe(names.length)
  })

  it('never gives the same alias to two commands', () => {
    const aliases = COMMANDS.flatMap(c => c.aliases ?? [])
    expect(new Set(aliases).size).toBe(aliases.length)
  })

  // The old listing was written by hand and drifted from the switch that
  // handles the commands. Catching that drift is the point of this file: it
  // already found `about` advertised while missing from VALID_COMMANDS, so
  // typo suggestions had never heard of it.
  it('only advertises words the terminal can actually reach', () => {
    const reachable = new Set<string>([
      ...(VALID_COMMANDS as readonly string[]),
      // Easter eggs are reached by name without being listed as commands.
      ...EASTER_EGGS.flatMap(e => e.aliases),
      // Handled in the switch as bare aliases of a listed command.
      'progetti', 'easter', 'badges', 'start', '?',
    ])
    const advertised = COMMANDS.flatMap(c => [c.name, ...(c.aliases ?? [])])
    expect(advertised.filter(name => !reachable.has(name))).toEqual([])
  })

  it('every call-to-action runs a command that is advertised', () => {
    const advertised = new Set(COMMANDS.flatMap(c => [c.name, ...(c.aliases ?? [])]))
    COMMANDS.filter(c => c.cta).forEach(c => {
      expect(advertised.has(c.cta!.cmd.split(' ')[0])).toBe(true)
    })
  })

  it('the full listing covers every command', () => {
    const text = buildHelpOutput().map(o => String(o.content)).join('\n')
    COMMANDS.forEach(c => expect(text).toContain(c.name))
  })

  it('a category page covers that category and nothing else', () => {
    const text = buildCategoryHelp('play').map(o => String(o.content)).join('\n')
    COMMANDS.filter(c => c.category === 'play').forEach(c => expect(text).toContain(c.name))
    expect(text).not.toContain('whoami')
  })

  it('recognises the four categories and nothing more', () => {
    expect(['navigate', 'explore', 'play', 'system'].every(isHelpCategory)).toBe(true)
    expect(isHelpCategory('nonsense')).toBe(false)
  })
})

describe('informational commands', () => {
  const eggs = new Set<string>()

  it('handles help with and without a category', () => {
    const all = buildInfoOutput('help', [], eggs)
    const one = buildInfoOutput('help', ['explore'], eggs)
    expect(all).not.toBeNull()
    expect(one).not.toBeNull()
    expect(one!.length).toBeLessThan(all!.length)
  })

  it('falls back to the full listing for an unknown category', () => {
    const bogus = buildInfoOutput('help', ['banana'], eggs)
    expect(bogus).toEqual(buildInfoOutput('help', [], eggs))
  })

  it('returns null for commands with side effects, so the hook still runs them', () => {
    expect(buildInfoOutput('sound', [], eggs)).toBeNull()
    expect(buildInfoOutput('theme', [], eggs)).toBeNull()
    expect(buildInfoOutput('lab', [], eggs)).toBeNull()
  })
})
