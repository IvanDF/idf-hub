import { EASTER_EGGS } from '@/lib/terminal/Terminal.constants'
import {
  COMMANDS,
  COMMAND_WORDS,
  findCommand,
} from '@/lib/terminal/Terminal.registry'
import {
  buildCategoryHelp,
  buildHelpOutput,
  isHelpCategory,
} from '@/lib/terminal/Terminal.help'

describe('terminal command registry', () => {
  it('lists every command exactly once', () => {
    const names = COMMANDS.map(c => c.name)
    expect(new Set(names).size).toBe(names.length)
  })

  it('never gives the same word to two commands', () => {
    const words = COMMANDS.flatMap(c => [c.name, ...(c.aliases ?? [])])
    expect(new Set(words).size).toBe(words.length)
  })

  // The drift this file was written to catch, a word that runs but is
  // advertised nowhere, or advertised but runs nothing, is now impossible by
  // construction: one array feeds help, autocomplete, the suggestion pool and
  // execution. These two tests hold that property rather than re-checking two
  // hand-written lists against each other.
  it('every advertised word resolves to something that runs', () => {
    const words = COMMANDS.flatMap(c => [c.name, ...(c.aliases ?? [])])
    words.forEach(word => {
      expect(typeof findCommand(word)?.run).toBe('function')
    })
  })

  it('the suggestion pool is exactly the set of runnable words', () => {
    const words = COMMANDS.flatMap(c => [c.name, ...(c.aliases ?? [])])
    expect([...COMMAND_WORDS].sort()).toEqual([...words].sort())
  })

  // Eggs are matched before commands, so a word owned by a typeable egg can
  // never reach its command, the alias would be dead on arrival. `cortex` was
  // exactly that. platformOnly eggs are excluded: they are never matched by
  // typing, so `yoda` and the theme words reach their command normally.
  it('no command word is shadowed by a typeable easter egg', () => {
    const eggWords = new Set(
      EASTER_EGGS.filter(e => !e.platformOnly).flatMap(e => e.aliases),
    )
    expect(COMMAND_WORDS.filter(w => eggWords.has(w))).toEqual([])
  })

  it('every call-to-action runs a word that resolves', () => {
    COMMANDS.filter(c => c.cta).forEach(c => {
      expect(findCommand(c.cta!.cmd.split(' ')[0])).toBeDefined()
    })
  })

  it('every command has a summary and a category', () => {
    COMMANDS.forEach(c => {
      expect(c.summary.length).toBeGreaterThan(0)
      expect(isHelpCategory(c.category)).toBe(true)
    })
  })
})

describe('help rendering', () => {
  it('the full listing covers every command that is not hidden', () => {
    const text = buildHelpOutput(COMMANDS).map(o => String(o.content)).join('\n')
    COMMANDS.filter(c => !c.hidden).forEach(c => expect(text).toContain(c.name))
  })

  it('a category listing covers only that category', () => {
    const text = buildCategoryHelp('play', COMMANDS).map(o => String(o.content)).join('\n')
    COMMANDS.filter(c => c.category === 'play' && !c.hidden).forEach(c =>
      expect(text).toContain(c.name),
    )
  })

  it('a category listing is shorter than the full one', () => {
    expect(buildCategoryHelp('explore', COMMANDS).length).toBeLessThan(
      buildHelpOutput(COMMANDS).length,
    )
  })

  it('recognises the four categories and nothing more', () => {
    expect(['navigate', 'explore', 'play', 'system'].every(isHelpCategory)).toBe(true)
    expect(isHelpCategory('nonsense')).toBe(false)
  })
})

describe('help as a command', () => {
  const ctx = {
    args: [] as string[],
    commands: COMMANDS,
    discoveredEggs: new Set<string>(),
  }

  it('falls back to the full listing for an unknown category', async () => {
    const help = findCommand('help')!
    const bogus = await help.run({ ...ctx, args: ['banana'] } as never)
    const full = await help.run({ ...ctx, args: [] } as never)
    expect(bogus.outputs).toEqual(full.outputs)
  })

  it('narrows to one category when given a real one', async () => {
    const help = findCommand('help')!
    const one = await help.run({ ...ctx, args: ['explore'] } as never)
    const full = await help.run({ ...ctx, args: [] } as never)
    expect(one.outputs.length).toBeLessThan(full.outputs.length)
  })

  it('reaches the same command from every spelling', () => {
    expect(findCommand('?')).toBe(findCommand('help'))
    expect(findCommand('-h')).toBe(findCommand('help'))
  })
})

// Regression: `run` used to decide what to print from inside the `setSkin`
// updater, mutating a `let` the updater closed over. React calls that
// updater on its own schedule, not the next line, so the variable was still
// its initial value when `run` read it back, every single time. The command
// toggled the skin correctly but always printed the "off" message, and the
// boot log could never appear. Fixed by reading `ctx.skin`, the value this
// call actually has, instead of the setter's eventual result.
describe('ygg as a command', () => {
  const ctx = {
    args: [] as string[],
    commands: COMMANDS,
    discoveredEggs: new Set<string>(),
  }

  it('turns the skin on and shows the boot log, from default', async () => {
    const ygg = findCommand('ygg')!
    const setSkin = jest.fn()
    const result = await ygg.run({ ...ctx, skin: 'default', setSkin } as never)

    expect(setSkin).toHaveBeenCalledWith('yggdrasil')
    expect(result.outputs.length).toBeGreaterThan(1)
    expect(result.outputs[0].content).not.toBe('Back to the house style.')
  })

  it('turns the skin off, from yggdrasil, with no boot log', async () => {
    const ygg = findCommand('ygg')!
    const setSkin = jest.fn()
    const result = await ygg.run({ ...ctx, skin: 'yggdrasil', setSkin } as never)

    expect(setSkin).toHaveBeenCalledWith('default')
    expect(result.outputs).toEqual([{ type: 'success', content: 'Back to the house style.' }])
  })
})
