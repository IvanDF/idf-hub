# The Work page — guidelines for an experience

> For designing the screens and templates of the portfolio surface.
> Read with [project-assets.md](project-assets.md) (what each project supplies)
> and [design-system.md](design-system.md) (the material).

---

## 0. Why the first three attempts missed

Three showcase variants were built and rejected: ink plates, a tmux session, a
parallax journey. They differed in decoration. They were identical in **form** —
a vertical column of blocks that animate as you scroll past them.

That is the miss. Changing the skin three times could not fix it, because the
problem was never the skin.

The rest of this site is **operated**:

| Surface | What the visitor does |
|---|---|
| Terminal | types ~30 commands, half of them hidden |
| Cortex | takes reaction, memory and Stroop tests |
| Snake | plays |
| Fus-Ro-Dah | shouts at it — real voice recognition |
| Business card | turns a card in 3D |
| Gravity well / liquid surface | pushes WebGL around |
| Yggdrasil | opens realms on a tree |
| **Work** | **scrolls** |

Work is the one important surface that only happens *at* the visitor. "It has to
be an experience" means: **it has to be something you do.** Not something that
plays while you scroll.

Every guideline below follows from that one sentence.

---

## 1. The six laws

### 1.1 The visitor acts; the page answers

Every screen must survive the question *"what can I do here?"* If the only
honest answer is "keep scrolling", the screen is not finished.

An action is anything with a choice in it: pick, open, turn, type, aim, drag,
reveal. Scrolling is not an action — it is a transport.

### 1.2 One world, many rooms

Octopath's HD-2D works because every location is rendered in **one** language
and composed with a **different** character. The cliff town and the snow village
are unmistakably the same world and unmistakably different places.

Applied here: one material system — ink frames, carved depth, Josefin Slab for
display, Geist Mono for machine voice — and a distinct spatial treatment per
kind of work. A CODE project and a CRAFT project should not be the same card
with different contents.

**Test:** screenshot two project screens, crop out the text. They must read as
the same site, and as two different places.

### 1.3 Proximity before commitment

Things react before they are clicked. The site already has the mechanic — the
cursor's magnetism — and the Work page barely uses it.

Three stages, always: **near** (something acknowledges you) → **engaged**
(it opens, lifts, focuses) → **committed** (it takes you somewhere).

A surface that only changes on click skips the stage where curiosity lives.

### 1.4 Position must be legible

In a village you always know where you are and how much is left. The tmux
status line from variant B was the right instinct in the wrong scope: it
belonged to a decoration, when it should belong to the page.

Whatever form it takes — a bar, a spine, a constellation — the visitor can
always answer: *where am I, how much is there, how do I get back.*

### 1.5 Something must be findable

The terminal hides a dozen easter eggs. The Work page hides nothing. At least
one thing — a project, a note, a command — should be reachable only by someone
who poked at it.

This is not decoration. It is the difference between a page that was arranged
and a place that was lived in.

### 1.6 No dead ends, ever

Every screen shows the way out and the way on. A project that ends with nothing
but the browser back button is a hole in the floor.

---

## 2. The screens

Five screens. Specs, not sketches — these are meant to be built from.

### 2.1 The threshold

**Already exists and already works.** `WorkFork` — *The Path* or *The Lab* — is
a choice before any content. Do not replace it with a scroll.

Keep: the two-way fork, the hover growth, the fact that nothing happens until
the visitor picks.

```
        ┌─────────────────┬─────────────────┐
        │   THE PATH      │    THE LAB      │
        │   ten years     │    after hours  │
        └─────────────────┴─────────────────┘
              ↑ the visitor chooses. Nothing scrolls.
```

### 2.2 The map

**The one that does not exist yet, and the one that matters most.**

Not a grid, not a list — a *place* with regions, where projects sit in relation
to each other. The axes carry meaning: discipline, scale, year, or how finished
the work is. The visitor moves across it rather than down it.

```
                      SYSTEMS
                         │
                    ● yggdrasil
                         │
   TOOLING ──── ● icon-builder ──── ● check-pipes ──── PRODUCT
                         │              ● rick-morty
                         │
                    ● mirror-archetype
                         │
                       CRAFT

   ·  hover a node  → it grows, its neighbours dim, a one-line blurb
   ·  click a node  → the approach (2.3)
   ·  drag the map  → pan; it is bigger than the screen on purpose
   ·  press /       → the terminal, filtering the map live
```

Rules:
- Position must **mean** something. A random scatter is a grid with extra steps.
- Node size carries weight — the four featured projects are visibly larger.
- The map must be navigable by keyboard: arrows move between nodes, Enter opens.
- It must degrade: no JS, no WebGL, reduced motion → a plain semantic list that
  is still ordered and still complete.

### 2.3 The approach

The half-second between choosing a project and arriving at it. Today this is a
route change with a page fade — the cheapest possible transition, and the place
where the most atmosphere is available for the least work.

- The chosen node holds position; everything else leaves.
- The node grows into the frame of the destination screen.
- Total budget: 400–600ms (`$duration-slower` → `$duration-reveal`). Longer and
  it is in the way on the second visit.
- It must be interruptible. A visitor who clicks again gets taken there now.

### 2.4 The encounter

One project, presenting itself. **This is where the per-kind templates live**,
and where "one world, many rooms" is actually earned.

| Kind | The room | What fills it |
|---|---|---|
| CODE | an editor / terminal surface | the decision log, typed out |
| CRAFT | a workbench | plates, the pieces before the final |
| DESIGN | a gallery wall | mockups hung, lit |
| PHOTO | a darkroom / lightbox | the image, large, uninterrupted |
| SYSTEM | the tree | realms, layers, the tmux bar |
| WRITING | a page spread | the text itself, set properly |

Common skeleton, so they stay one world:

```
┌──────────────────────────────────────────┐
│ ← back to the map        03 / 14         │  position, always
├──────────────────────────────────────────┤
│                                          │
│   [ the room — different per kind ]      │
│                                          │
├──────────────────────────────────────────┤
│ one sentence on what it is               │
│ what was hard · what it cost · the why   │
├──────────────────────────────────────────┤
│ ← previous        next project →         │  never a dead end
└──────────────────────────────────────────┘
```

The existing detail templates (`CodeCase`, `DesignCase`, `CraftCase`,
`LabCase`) are the starting point. They have the right content and the wrong
amount of personality — they are documents where they should be rooms.

### 2.5 The index

The honest flat list: every project, filterable, fast, no theatre.

**Not a failure — a feature.** A recruiter with four minutes needs this, and
making them walk a map to find a repo link is hostile. Reachable from the map
and from the terminal (`index`, `ls`). Print-friendly.

---

## 3. Motion

The scale is in `_variables.scss` (`$duration-*`, `$ease-*`) with a JS mirror in
`design-system.ts`. Use the tokens; do not write new numbers.

| Band | Token | For |
|---|---|---|
| 100ms | `$duration-instant` | press, tap — inside the finger |
| 150ms | `$duration-micro` | hover, focus, colour |
| 200ms | `$duration-base` | the default state change |
| 300ms | `$duration-slow` | panels, compound moves |
| 400ms | `$duration-slower` | overlays, route changes |
| 520ms | `$duration-reveal` | arrivals |

Rules that are easy to get wrong:

- **Arriving decelerates** (`$ease-out-expo`). Leaving may be linear. Only a
  release that should feel physical gets `$ease-back`.
- **Stagger beats duration.** Six things arriving 60ms apart reads as crafted;
  six things arriving over 600ms each reads as slow.
- **Scrubbed motion has no duration** — it is tied to the scroll, so it is the
  *range* that is tuned, not the time.
- **Animate `translate` / `scale` / `rotate` as individual properties**, never
  packed into `transform`. Two rules that both set `transform` silently fight;
  as separate properties they compose. This has already cost one bug.
- Ambient loops (tickers, blinking carets, shockwaves) stay **off** the scale.
  Their timing belongs to one effect each.

---

## 4. The non-negotiables

Break these and the experience becomes a liability.

**The resting state is visible.** No element may sit at `opacity: 0` in its
committed style waiting for a callback. If an observer fires late, twice, or
never, the content must simply be there. This page has shipped invisible text
twice — see the note above the reveal rules in `globals.scss`.

**Never `all: unset` on an animated element.** It resets `animation-name` and
`animation-timeline` too. It killed the reveals on all fourteen Lab rows with no
error anywhere. Reset the handful of properties actually meant.

**Everything works without a pointer.** Every node reachable by Tab, every room
exitable by Escape, visible focus throughout. A map that only responds to a
mouse excludes keyboard and screen-reader visitors entirely.

**`prefers-reduced-motion` is a real path, not a degraded one.** Parallax,
scrubbing and transitions collapse; the composition stays finished and complete.

**Mobile is a different experience, not a squeezed one.** No hover stage exists
there — the "near" state must have a touch equivalent or the interaction model
loses a third of itself. Test at 375 / 390 / 430px.

**Budget:** interactive by 2s on a mid-range phone over 4G. The WebGL already in
the project is heavy; the map must work before it loads, not after.

---

## 5. What belongs on the Work page

From the Notion archive, five areas are outstanding. They are not all the same
kind of decision.

**Photography** — belongs without question. It is Ivan's work, it is visual, and
the site already has the templates for it (`DesignCase` plates, `GalleryViewer`,
the Lightbox). Needs: the images at full resolution, and a date.

**Brand manager** — belongs if there are artefacts. Brand work without visible
output reads as a line on a CV, and this site is not a CV. Needs: what was made,
for whom, and what changed as a result.

**Cameraman** — a real credit in a different discipline. The question is not
quality, it is what the portfolio claims to be. If it is *"things I made"*, it
belongs. If it is *"how I solve problems"*, a camera credit dilutes the
argument. A middle path: it lives in the index and on the About page, not in the
showcase.

**The book** — this one needs care, and the decision is not a design one.

The book was written by Ivan's mother, is about him, and **deliberately omits his
name**. Publishing it on his own site, under his own name, is what undoes that:
the pseudonym protects him only while the link is unpublished. His portfolio is
the most searchable, most permanent place that link could be made, and the
book's subject — growing up dyslexic — is health information that he currently
controls the disclosure of. Once indexed, it cannot be taken back.

That is his call, and there is a version that keeps both: dyslexia is a genuine
part of how he thinks, and *"different angles, better questions"* is already the
tagline. He can write about it himself, in his own words, on the About page —
the substance, without the citation that re-links the pseudonym. The book then
stays something he mentions to people he chooses to mention it to.

---

## 6. Order of work

1. **The map** (§2.2). It is the piece that does not exist, and the one that
   turns a page into a place. Everything else is refinement.
2. **The approach** (§2.3). Cheapest atmosphere per hour of the whole list.
3. **The rooms** (§2.4), one kind at a time. Start with CODE — eleven projects
   use it, so it pays back fastest.
4. **The index** (§2.5). Mostly exists; needs to become a deliberate destination
   rather than the leftovers of the showcase.

Three missing images block nothing structural but will show: `yggdrasil` and
`check-your-pipes` have icon SVGs where a screenshot belongs, and
`notion-recipes-advanced` has the placeholder. See
[project-assets.md](project-assets.md).
