# Adaptive soundtrack stems

The background music is mixed live from these layers. All of them play in a
synchronized loop all the time; moving through the site only changes their
volumes (see SCENES in `src/hooks/useAdaptiveMusic.ts`), so transitions morph
instead of cutting.

Current files are synthesized placeholders (see `scripts/generate-stems.mjs`):
C major, progression C | G | Am | F, 80 BPM, 24s seamless loop.

`rune.wav` holds a C–G drone through the whole progression instead of
following it. An open fifth with no third in it is what reads as Norse — the
third is what decides major or minor — and C and G stay consonant over every
chord in the grid, so it never has to move.

| file | role |
|---|---|
| `base.wav` | harmonic bed, audible in every scene |
| `home.wav` | calm melodic layer (home) |
| `bit.wav` | chiptune layer (terminal/time-machine/admin), softened triangle tone |
| `air.wav` | ethereal high pad — the inspirational layer that carries About |
| `rune.wav` | bowed open-fifth drone on C–G, the Norse layer for /yggdrasil |

## Replacing them with real recordings

Record every stem over the same click and the same chord grid:

- same tempo, same key, same length: the loop must be an exact number of
  bars with no silence padding at either end (any offset drifts the layers
  apart audibly after a few loops);
- export at the same length to the sample if possible; trim reverb tails or
  bake them into the loop start (tail wraps around);
- keep the filenames (`base.wav`, `home.wav`, `bit.wav`, `air.wav`,
  `rune.wav`) and
  nothing in the code needs to change; to add a scene or a fifth stem, extend
  `MUSIC_STEMS` and `SCENES` in `useAdaptiveMusic`;
- WAV always loops perfectly. MP3 adds encoder padding and will click at the
  loop point - avoid it. OGG Vorbis is compact and gapless but Safari does
  not decode it; if file size matters use AAC (.m4a) and trim the priming
  samples, or just ship WAV.
