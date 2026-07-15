import type { CommandOutput } from "@/types/terminal";

/**
 * Neuroscience facts surfaced by the `brain` command — one per invocation.
 * Kept short and true; each reframes a well-established finding through the
 * "different angles, better questions" lens.
 */
export const BRAIN_FACTS: string[] = [
  "Your brain runs on ~20 watts — a dim lightbulb outthinking any datacenter.",
  "You don't see the world; you see your brain's best guess, corrected on the fly.",
  "Neurons that fire together wire together — attention is literally sculpting.",
  "The 'gut feeling' is real: ~90% of vagus-nerve fibers report up to the brain.",
  "Working memory holds ~4 chunks. Good design respects that ceiling.",
  "Dopamine tracks prediction error, not pleasure — it fires on the surprise.",
  "Your brain rewrites a memory every time you recall it. Recall is editing.",
  "Change blindness: attention, not the eye, decides what you actually notice.",
  "The brain fills your blind spot with invention — and you never notice the seam.",
  "Sleep isn't idle: the glymphatic system flushes the day's metabolic waste.",
];

/** Terminal output for the `brain` command: one random fact + a way in. */
export function buildBrainOutput(): CommandOutput[] {
  const fact = BRAIN_FACTS[Math.floor(Math.random() * BRAIN_FACTS.length)];
  return [
    { type: "system", content: "⬡ NEURO — a fact from the reading pile" },
    { type: "success", content: fact },
    {
      type: "text",
      content: "Curious how yours performs? There's a hidden lab.",
      cta: { label: "→ enter the cortex", cmd: "cortex" },
    },
  ];
}

/** Output for the `play` hub — everything playable in the terminal. */
export const PLAY_OUTPUT: CommandOutput[] = [
  { type: "system", content: "── ARCADE ──" },
  {
    type: "text",
    content: "snake — ASCII snake, arrows/WASD or swipe",
    cta: { label: "→ play", cmd: "snake" },
  },
  {
    type: "text",
    content: "cortex — cognitive tests: reaction, stroop, memory",
    cta: { label: "→ play", cmd: "play cortex" },
  },
  { type: "text", content: "Usage: play [game]" },
];
