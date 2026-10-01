# The Work page — guidelines for an experience

> Read with [project-assets.md](project-assets.md) (what each project supplies)
> and [design-system.md](design-system.md) (the material).

## Why three attempts missed

Three showcase variants were built and rejected: ink plates, a tmux session, a
parallax journey. All three were the same form with a different skin — a
vertical column of blocks that animate as you scroll past.

The rest of this site is operated. Work is the one surface that is only watched.

| Surface | What the visitor does |
|---|---|
| Terminal | types ~30 commands, half hidden |
| Cortex | takes reaction, memory, Stroop tests |
| Snake | plays |
| Fus-Ro-Dah | shouts at it — real voice recognition |
| Yggdrasil | opens realms on a tree |
| **Work** | **scrolls** |

"It has to be an experience" means: it has to be something you do. Everything
below follows from that.

## The six laws

1. **The visitor acts; the page answers.** Every screen must survive "what can I
   do here?" If the only honest answer is "scroll", it is not finished.
2. **One world, many rooms.** One material language — ink, carved depth, Slab +
   Mono — and a different spatial treatment per kind of work. Test: crop the
   text off two project screens; they must read as the same site and as two
   different places.
3. **Proximity before commitment.** Near → engaged → committed. The cursor
   magnetism already does this and Work barely uses it. A surface that only
   reacts on click skips the stage where curiosity lives.
4. **Position must be legible.** Always answerable: where am I, how much is
   left, how do I get back.
5. **Something must be findable.** The terminal hides a dozen easter eggs; Work
   hides nothing. One thing should be reachable only by someone who poked at it.
6. **No dead ends.** Every screen shows the way out and the way on.

## The five screens

**1. The threshold** — already exists and already works. `WorkFork` is a choice
before any content. Do not replace it with a scroll.

**2. The map** — the one that does not exist, and the one that matters. Not a
grid: a place with regions, where position *means* something (discipline, scale,
year, how finished). The visitor moves across it, not down it.

```
                      SYSTEMS
                         │
                    ● yggdrasil
                         │
   TOOLING ──── ● icon-builder ──── ● check-pipes ──── PRODUCT
                         │              ● rick-morty
                    ● mirror-archetype
                         │
                       CRAFT

   hover a node  → it grows, neighbours dim, one-line blurb
   click         → the approach
   drag          → pan; bigger than the screen on purpose
   press /       → the terminal, filtering the map live
```

Node size carries weight — the four featured are visibly larger.
Keyboard-navigable: arrows move, Enter opens. Degrades to a plain ordered list
with no JS.

**3. The approach** — the half-second between choosing and arriving. Today it is
a page fade: the cheapest possible transition, and the most atmosphere available
for the least work. The chosen node holds position, everything else leaves, it
grows into the destination frame. 400–600ms, interruptible.

**4. The encounter** — one project presenting itself. Where the per-kind
templates live.

| Kind | The room | What fills it |
|---|---|---|
| CODE | editor / terminal surface | the decision log, typed out |
| CRAFT | a workbench | plates, the pieces before the final |
| DESIGN | a gallery wall | mockups hung, lit |
| PHOTO | a darkroom | the image, large, uninterrupted |
| SYSTEM | the tree | realms, layers, the tmux bar |
| WRITING | a page spread | the text, set properly |

Common skeleton so they stay one world: position indicator, the room, one
sentence on what it is, what was hard · what it cost · why, then previous /
next. The existing detail templates have the right content and the wrong amount
of personality — they are documents where they should be rooms.

**5. The index** — the honest flat list. Not a failure: a recruiter with four
minutes needs it, and making them walk a map to find a repo link is hostile.
Reachable from the map and from the terminal.

## Motion

The scale is in `_variables.scss`, mirrored in `design-system.ts`. Use the
tokens; do not write new numbers.

| Token | Value | For |
|---|---|---|
| `$duration-instant` | 100ms | press, tap — inside the finger |
| `$duration-micro` | 150ms | hover, focus, colour |
| `$duration-base` | 200ms | the default state change |
| `$duration-slow` | 300ms | panels, compound moves |
| `$duration-slower` | 400ms | overlays, route changes |
| `$duration-reveal` | 520ms | arrivals |

- **Arriving decelerates** (`$ease-out-expo`). Leaving can be linear. Only a
  release that should feel physical gets `$ease-back`.
- **Stagger beats duration.** Six things 60ms apart reads as crafted; six things
  at 600ms each reads as slow.
- **Scrubbed motion has no duration** — tune the range, not the time.
- **Animate `translate` / `scale` / `rotate` separately**, never packed into
  `transform`. Two rules setting `transform` fight silently; as separate
  properties they compose. This already cost one bug.

## Non-negotiables

The first two are scars this repo already paid for.

- **The resting state is visible.** Nothing sits at `opacity: 0` in its
  committed style waiting for a callback. If an observer fires late, twice, or
  never, the content is simply there. This page has shipped invisible text
  twice — see the note above the reveal rules in `globals.scss`.
- **Never `all: unset` on an animated element.** It resets `animation-name` and
  `animation-timeline` too — it killed the reveals on all fourteen Lab rows with
  no error anywhere.
- **Everything works without a pointer.** Tab reaches every node, Escape exits
  every room, focus is visible throughout.
- **`prefers-reduced-motion` is a real path**, not a degraded one. Parallax and
  scrubbing collapse; the composition stays finished.
- **Mobile is a different experience, not a squeezed one.** There is no hover
  stage on touch — the "near" state needs an equivalent or the model loses a
  third of itself. Test at 375 / 390 / 430px.
- **Interactive by 2s** on a mid-range phone over 4G. The map must work before
  the WebGL loads, not after.

## What belongs on the page

Five areas outstanding in the Notion archive.

| Area | Verdict | Needs |
|---|---|---|
| Photography | In, no question | images at full res, a date |
| Brand manager | In if there are artefacts | what was made, for whom, what changed |
| Cameraman | Depends on the claim | see below |
| Book | Flagged — not a design decision | see below |

**Cameraman** — a real credit in a different discipline. The question is not
quality, it is what the portfolio claims to be. If it is "things I made", it
belongs. If it is "how I solve problems", a camera credit dilutes the argument.
Middle path: the index and the About page, not the showcase.

**The book** — written by Ivan's mother, about him, and it deliberately omits
his name. Publishing it on his own site under his own name is what undoes that:
the pseudonym protects him only while the link is unpublished. A portfolio is
the most searchable, most permanent place that link could be made, and the
subject — growing up dyslexic — is health information whose disclosure he
currently controls. Once indexed, it cannot be taken back.

His call, and there is a version that keeps both: dyslexia is a real part of how
he thinks, and "different angles, better questions" is already the tagline. He
can write about it himself, in his own words, on the About page — the substance
without the citation that re-links the pseudonym.

## Order of work

1. **The map.** The piece that does not exist, and the one that turns a page
   into a place. Everything else is refinement.
2. **The approach.** Cheapest atmosphere per hour on the list.
3. **The rooms**, one kind at a time. Start with CODE — eleven projects use it,
   so it pays back fastest.
4. **The index.** Mostly exists; needs to become a deliberate destination rather
   than the leftovers of the showcase.

Three missing images block nothing structural but will show: `yggdrasil` and
`check-your-pipes` have icon SVGs where a screenshot belongs,
`notion-recipes-advanced` has the placeholder. See
[project-assets.md](project-assets.md).

**Open question:** which axis carries the meaning on the map — discipline, year,
or scale of the work? That choice decides what shape the place has.
