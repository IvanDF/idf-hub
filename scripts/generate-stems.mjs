// Generates the placeholder music stems for the adaptive soundtrack.
// Run: node scripts/generate-stems.mjs
//
// All stems share the same grid so any mix of them stays musical:
//   key A minor - progression Am | F | C | G (2 bars each)
//   80 BPM, 4/4, 8 bars -> exactly 24s, seamless loop
//   22050 Hz mono 16-bit WAV (~1 MB each; placeholders until the real
//   clarinet recordings replace them - see public/audio/stems/README.md)

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SR = 22050;
const BPM = 80;
const BARS = 8;
const BEAT = 60 / BPM;
const DURATION = BARS * 4 * BEAT; // 24s
const N = Math.round(SR * DURATION);

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "audio", "stems");

// Note helpers (A4 = 440)
const freq = (midi) => 440 * 2 ** ((midi - 69) / 12);
const A2 = 45, C3 = 48, F3 = 53, G3 = 55, A3 = 57, C4 = 60, D4 = 62, E4 = 64, F4 = 65, G4 = 67, A4 = 69, B4 = 71;

// Progression: chord tones per 2-bar block (roots + triads, midi)
const CHORDS = [
  { root: A2, triad: [A3, C4, E4] }, // Am
  { root: F3 - 12, triad: [F3 + 12 - 12, A3, C4] }, // F  (F2 root, F3 A3 C4)
  { root: C3, triad: [G3, C4, E4] }, // C
  { root: G3 - 12, triad: [G3, B4 - 12, D4] }, // G  (G2 root, G3 B3 D4)
];
const BLOCK = 2 * 4 * BEAT; // 2 bars in seconds

// Wrap-aware envelope so loop point is seamless: everything is scheduled on
// the grid and envelopes never cross the loop boundary.
function addNote(buf, tStart, dur, f, gain, wave, attack = 0.01, release = 0.05) {
  const n0 = Math.round(tStart * SR);
  const n1 = Math.min(Math.round((tStart + dur) * SR), N);
  for (let i = n0; i < n1; i++) {
    const t = i / SR;
    const local = t - tStart;
    let env = 1;
    if (local < attack) env = local / attack;
    const tail = tStart + dur - t;
    if (tail < release) env = Math.min(env, tail / release);
    buf[i % N] += wave(f, t) * gain * env;
  }
}

const sine = (f, t) => Math.sin(2 * Math.PI * f * t);
// Soft "reed" tone: sine + quiet 2nd/3rd harmonics
const reed = (f, t) => sine(f, t) * 0.8 + sine(f * 2, t) * 0.12 + sine(f * 3, t) * 0.08;
// Chip square with fixed 50% duty
const square = (f, t) => (Math.sin(2 * Math.PI * f * t) > 0 ? 1 : -1);

function normalize(buf, peakTarget = 0.5) {
  let peak = 0;
  for (const v of buf) peak = Math.max(peak, Math.abs(v));
  const k = peak > 0 ? peakTarget / peak : 1;
  for (let i = 0; i < buf.length; i++) buf[i] *= k;
}

function writeWav(name, buf) {
  const bytes = Buffer.alloc(44 + N * 2);
  bytes.write("RIFF", 0); bytes.writeUInt32LE(36 + N * 2, 4); bytes.write("WAVE", 8);
  bytes.write("fmt ", 12); bytes.writeUInt32LE(16, 16); bytes.writeUInt16LE(1, 20);
  bytes.writeUInt16LE(1, 22); bytes.writeUInt32LE(SR, 24); bytes.writeUInt32LE(SR * 2, 28);
  bytes.writeUInt16LE(2, 32); bytes.writeUInt16LE(16, 34);
  bytes.write("data", 36); bytes.writeUInt32LE(N * 2, 40);
  for (let i = 0; i < N; i++) {
    bytes.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(buf[i] * 32767))), 44 + i * 2);
  }
  writeFileSync(join(OUT_DIR, name), bytes);
  console.log(`${name}: ${(bytes.length / 1024 / 1024).toFixed(2)} MB, ${DURATION}s`);
}

mkdirSync(OUT_DIR, { recursive: true });

// ── base: warm pad, root + triad, slow swells, always present ─────────────
{
  const buf = new Float64Array(N);
  for (let block = 0; block < 4; block++) {
    const t0 = block * BLOCK;
    const { root, triad } = CHORDS[block];
    // Long overlapping swells; slight detune for width
    addNote(buf, t0, BLOCK, freq(root), 0.5, sine, 0.8, 0.8);
    addNote(buf, t0, BLOCK, freq(root) * 1.003, 0.25, sine, 1.0, 1.0);
    for (const m of triad) {
      addNote(buf, t0, BLOCK, freq(m), 0.16, reed, 1.2, 1.2);
      addNote(buf, t0, BLOCK, freq(m) * 0.997, 0.08, sine, 1.4, 1.4);
    }
  }
  normalize(buf, 0.45);
  writeWav("base.wav", buf);
}

// ── home: calm melody, half/quarter notes, reed tone ───────────────────────
{
  const buf = new Float64Array(N);
  // One phrase per 2-bar block (beats within the block, dur in beats)
  const phrases = [
    [[0, 2, E4], [2, 1, C4], [3, 1, D4], [4, 2, E4], [6, 2, A4]],           // Am
    [[0, 2, C4], [2, 2, A3], [4, 3, F4], [7, 1, E4]],                        // F
    [[0, 2, E4], [2, 1, G4], [3, 1, E4], [4, 4, C4]],                        // C
    [[0, 2, D4], [2, 2, B4 - 12], [4, 2, G3], [6, 2, D4]],                   // G
  ];
  phrases.forEach((phrase, block) => {
    const t0 = block * BLOCK;
    for (const [beat, durBeats, m] of phrase) {
      addNote(buf, t0 + beat * BEAT, durBeats * BEAT * 0.95, freq(m), 0.4, reed, 0.06, 0.2);
      // touch of space: quiet echo a beat later
      addNote(buf, t0 + (beat + 1) * BEAT, durBeats * BEAT * 0.6, freq(m), 0.07, sine, 0.1, 0.3);
    }
  });
  normalize(buf, 0.5);
  writeWav("home.wav", buf);
}

// ── bit: chiptune 16th arpeggios one octave up, short decaying squares ─────
{
  const buf = new Float64Array(N);
  const SIXTEENTH = BEAT / 4;
  for (let block = 0; block < 4; block++) {
    const t0 = block * BLOCK;
    const { triad } = CHORDS[block];
    const arp = [...triad.map((m) => m + 12), triad[1] + 24];
    const steps = Math.round(BLOCK / SIXTEENTH);
    for (let s = 0; s < steps; s++) {
      // Skip a step now and then so it breathes
      if (s % 8 === 6) continue;
      const m = arp[s % arp.length];
      addNote(buf, t0 + s * SIXTEENTH, SIXTEENTH * 0.55, freq(m), 0.16, square, 0.002, 0.03);
      // faint echo two steps later
      addNote(buf, t0 + (s + 2) * SIXTEENTH, SIXTEENTH * 0.4, freq(m), 0.04, square, 0.002, 0.03);
    }
  }
  normalize(buf, 0.35);
  writeWav("bit.wav", buf);
}

console.log("done ->", OUT_DIR);
