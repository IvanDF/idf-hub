# Project assets — what to produce, and what the code does with it

Guidelines for every project that goes in the Lab. Written so the same brief
works for the next ten, not just the ones open today.

The principle underneath all of it: **the code never invents what you make.**
No generated mockups, no placeholder art dressed up as a product shot, no
stand-in photography. If an asset is missing the page renders without it and
says nothing, which is always better than saying something false.

---

## 1. Where a project lives

Two shapes, and the choice is about how much there is to say.

| | Route | When |
|---|---|---|
| **Entry** | `/lab/[id]` | The default. A template renders it from the project record. |
| **Its own page** | `/yggdrasil`, and anything after it | The work outgrew a template: it has its own structure, its own palette, its own rules. |

To give a project its own page, set `detailHref` on the record. The list links
straight there, `/lab/[id]` becomes a 308 to it, and the row is marked so a
visitor can see before clicking that this one is different. Nothing else
changes — the project still filters, still sorts, still appears in the archive.

Do not build a bespoke page and a template entry for the same work. That was
the Yggdrasil mistake: two pages saying the same thing, cross-linking to each
other, with the better writing on the one nobody would find.

---

## 2. The four templates

A project's `category` and `kind` decide how its page reads. Pick by **what
the work is**, not by where it runs — the platform is already its own field.

| Template | For | Leads with |
|---|---|---|
| `code` | Software, tools, infrastructure | The decision log |
| `design` | Print, apparel, photography, composed images | The artwork, large |
| `craft` | Systems and automations | What it removes from a day |
| `lab` | Experiments and playground pieces | The live thing, then the finding |

### What each one needs from you

**Code** wants `decisions[]`. Each is `choice` / `why` / `tradeoff`, and the
trade-off is the half that makes it worth reading — a decision with no cost
attached is a slogan. Three to six. Screenshots go last: on a code project
they are evidence, not argument.

**Design** wants images, in two roles:

- `mockup.frames[]` — the finished product shot. **Your render or your
  photograph.** The code does not draw products.
- `plates[]` — the working: separations, rejected directions, texture studies.
  Each takes a `label` and an optional `note` saying what job it does.

**Craft** wants `highlights[]` — what the system actually does, in plain
sentences — plus `why` / `problem` / `solution`. Screenshots of the thing
running.

**Lab** wants a live embed if there is one (a CodePen URL is detected
automatically), plus `why` as the question you were testing and `solution` as
what came back. Keep it short: an experiment needing three sections of
explanation was not an experiment.

---

## 3. Image specifications

### Product mockups

```ts
mockup: {
  kind: "tee",        // "tee" → 4:5 frame   ·   "phone-case" → 1:2 frame
  frames: [
    { src: "/projects/<id>/mockup-front.png", label: "Front" },
    { src: "/projects/<id>/mockup-back.png",  label: "Back"  },
  ],
},
```

- **PNG with alpha**, or a neutral background you are happy to show.
- **Long edge ~1400px.** The frame renders at most 420px; double for Retina.
- **Product centred with air around it.** The frame adds no margin of its own.
- `object-fit: contain` — your composition is never cropped.
- Two or three per project. `label` is the caption: keep it short.

### Plates

```ts
plates: [
  { src: "...", label: "Variant 01", note: "First direction shown to the client." },
],
```

Rendered in a **4:3 grid, cropped to fill**, so keep the subject away from the
edges. Same resolution guidance as above.

### Photography

Goes in `media.gallery` with `fit: "cover"`, and the source frames go in
`plates[]` with a note explaining each one's job in the final image. The first
gallery image is the hero and renders full width.

### Thumbnails

`media.thumbnail` is required and is what social previews use. **SVG and the
shared placeholder are skipped** for Open Graph — a real raster image or the
card falls back to the site default. Landscape, 1200×630 is ideal.

### File naming and placement

```
public/projects/<project-id>/
  thumb.png          the social preview
  mockup-front.png   product shots
  plate-01.png       the working
```

A test walks every local image path against `public/` on every run. A wrong
path fails the build rather than shipping a broken image, which is how a
missing cosplay plate survived in the data for months before there was one.

---

## 4. Dates

Every project carries `year`, and `date` as `YYYY-MM` where the month is
known. `date` is what sorts the list.

**Source it, do not remember it.** Nine of fourteen hand-written years were
wrong by up to three years.

| Where it lives | How to get the date |
|---|---|
| A GitHub repo | `gh api repos/IvanDF/<repo> --jq .created_at` |
| A photo or a scan | EXIF: `strings -a <file> \| grep -oE '20[0-9]{2}[:-][0-9]{2}'` |
| A published extension or plugin | The marketplace listing |
| Anywhere with no record | Leave `date` unset. The year alone is a claim; adding a month you guessed makes it a false one. |

---

## 5. Audio

The soundtrack is not a playlist. It is **one piece in synchronized stems**,
and a "scene" is a set of per-stem volumes, so moving through the site morphs
the mix instead of cutting between tracks.

To give a room its own music you either add a stem or write a new mix. A new
stem must share the grid exactly — same key, same tempo, same length to the
sample, no silence padding at either end, or the layers drift apart audibly
after a few loops. `public/audio/stems/README.md` has the full brief, and
`scripts/generate-stems.mjs` shows the shape.

Every stem currently in the repo is **synthesized placeholder**. Real
recordings drop in under the same filenames with no code change.

---

## 6. What the code will not do

Worth stating plainly, because it has come up more than once:

- **It will not draw your products.** An SVG t-shirt with your artwork pasted
  on it is a guess about a thing you made. Supply the render.
- **It will not invent dates**, or fill a gap with a plausible year.
- **It will not present flat artwork as a product shot.** Print files go in
  `plates`, where they are labelled as what they are.
- **It will not use a placeholder that looks like content.** A missing image
  is a missing image; the section simply does not render.

---

## 7. Before a project ships

- [ ] `date` sourced from somewhere, or deliberately absent
- [ ] `category` and `kind` describe the work, not the platform
- [ ] Every image path exists in `public/` — the test will say otherwise
- [ ] `media.thumbnail` is a raster, not an SVG, if the social card matters
- [ ] Code projects: every decision states its cost
- [ ] Design projects: mockups are yours, plates are labelled
- [ ] `npm run build && npx jest` clean
