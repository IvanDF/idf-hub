/**
 * The thread that runs through the Work page.
 *
 * ⚠️ DRAFT COPY — written from the project records and the tone-of-voice rules,
 * not from Ivan. The structure is the deliverable; the words are a starting
 * point and should be replaced with his own. Nothing here is a fact about a
 * project (those live in projects.ts) — these lines exist only to carry the
 * reader from one plate to the next.
 *
 * Voice, per ai_rules/Personal Brand Tone of Voice.md: short sentences, every
 * one revealing a belief, explaining a process, or demonstrating expertise.
 * Clarity over cleverness. Never self-congratulatory.
 */

export interface StoryBeat {
  /** The project this line introduces, by id. */
  before: string;
  /** One or two short sentences. The connective tissue, not a description. */
  text: string;
}

/** Sets up the question the four projects answer. */
export const OPENING = {
  lead: "Most of this started as a problem that already had a workaround.",
  line: "The workaround was the problem.",
};

/**
 * One beat per featured project, in showcase order. A beat says why this
 * project follows the last one — the job a description cannot do.
 */
export const BEATS: StoryBeat[] = [
  {
    before: "yggdrasil",
    text: "Start with what everything else runs on.",
  },
  {
    before: "figma-icon-builder",
    text: "Owning a system teaches you what a system should ask of the people using it. The next one asked less.",
  },
  {
    before: "rick-and-morty-theme",
    text: "Tools shape the hours spent inside them.",
  },
  {
    before: "mirror-archetype-cosplay",
    text: "Same assembly. A camera instead of a compiler.",
  },
];

/** Lands the thread and hands the reader on to the rest of the work. */
export const CLOSING = {
  line: "None of it was commissioned.",
  lead: "Curiosity picks different problems than a brief does. That is the whole method.",
};
