"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type ShoutLevel = 1 | 2 | 3;

const LISTEN_WINDOW_MS = 12000;
// it-IT first — Italian speaker gets better phoneme coverage for Dragon Language
const LANGS = ["it-IT", "en-US"] as const;

/**
 * Detects which Skyrim Thu'um level was spoken.
 *
 * "Fus Ro Dah" are Dragon Language words — they don't exist in any real language.
 * We merge transcripts from TWO simultaneous recognisers (it-IT + en-US).
 *
 * Real-world observations (Italian speaker, Chrome en-US):
 *   "fus"    → "Force", "faz", "fus", "fuzz"
 *   "ro dah" → MERGED into "Roda", "Rider", "Roder", "Rodar" by the recogniser
 *
 * Strategy:
 *   1. Check for compound words that encode ro+dah in one token
 *   2. Individually match each word with broad phonetic variants
 *   3. Combine both transcripts before matching
 */
function detectLevel(combined: string): ShoutLevel | null {
  const t = combined.toLowerCase().replace(/[',.\-!?]/g, " ");

  // ── Shortcut: compound ro+dah tokens ─────────────────────────────────────────
  // Chrome often fuses "ro dah" into one word. Detect and count as both ro AND dah.
  const hasRoDahCompound =
    /\broda\b/.test(t)  ||   // "roda"  (most common observed)
    /\broder\b/.test(t) ||   // "roder"
    /\brodar\b/.test(t) ||   // "rodar"
    /\brider\b/.test(t) ||   // "rider" (en-US phonetic)
    /\brodah\b/.test(t) ||   // literal
    /\brudah\b/.test(t);     // variant

  // ── FUS (Force) ───────────────────────────────────────────────────────────────
  // en-US: force, fuzz, fuse, foose — it-IT: fus, faz, fas, fu, fuso, fai
  const hasFus =
    /\bfus+\b/.test(t)  ||
    /\bfuzz\b/.test(t)  ||
    /\bfuse\b/.test(t)  ||
    /\bfoose\b/.test(t) ||
    /\bforce\b/.test(t) ||
    /\bfoos\b/.test(t)  ||
    /\bfaz\b/.test(t)   ||
    /\bfas\b/.test(t)   ||
    /\bfuso\b/.test(t)  ||
    /\bfai\b/.test(t)   ||
    /\bfu\b/.test(t);

  // ── RO (Balance) ─────────────────────────────────────────────────────────────
  // en-US: row, roe, rho, raw — it-IT: ro, lo, re — OR first half of compound
  const hasRo =
    /\bro\b/.test(t)  ||
    /\brow\b/.test(t) ||
    /\broe\b/.test(t) ||
    /\brho\b/.test(t) ||
    /\braw\b/.test(t) ||
    /\blo\b/.test(t)  ||
    /\bre\b/.test(t)  ||
    hasRoDahCompound;

  // ── DAH (Push) ───────────────────────────────────────────────────────────────
  // en-US: dah, da, duh, dot, ta — it-IT: da, fa, ha, ah, là — OR second half of compound
  const hasDah =
    /\bdah?\b/.test(t) ||
    /\bduh\b/.test(t)  ||
    /\bdot\b/.test(t)  ||
    /\bta\b/.test(t)   ||
    /\bda\b/.test(t)   ||
    /\bfa\b/.test(t)   ||
    /\bha\b/.test(t)   ||
    /\bah\b/.test(t)   ||
    hasRoDahCompound;

  if (hasFus && hasRo && hasDah) return 3;
  if (hasFus && hasRo) return 2;
  if (hasFus) return 1;
  return null;
}

export interface UseVoiceShoutReturn {
  /** True while the microphone is open and waiting for input. */
  isListening: boolean;
  /**
   * Final shout level emitted at session end.
   * Only set once per session (highest level detected).
   */
  shoutLevel: ShoutLevel | null;
  /**
   * Current best level detected so far in this session.
   * Updates live as the user speaks — use for in-session progress UI.
   */
  detectedLevel: ShoutLevel | null;
  /**
   * Increments on each listening session start.
   * Use as a React `key` to reset CSS animations.
   */
  sessionId: number;
  /** Start a new listening session (requests mic permission implicitly). */
  startListening: () => void;
  /** Any error string, e.g. mic permission denied. */
  error: string | null;
  /**
   * Combined live transcript from all recognisers.
   * Format: "[it-IT] <text>  ·  [en-US] <text>"
   */
  transcript: string;
}

/**
 * Hooks into the Web Speech API to detect Skyrim "Fus / Fus Ro / Fus Ro Dah" shouts.
 *
 * Runs TWO SpeechRecognition instances in parallel (it-IT + en-US) and combines
 * their transcripts before matching. This maximises detection because Dragon Language
 * words have no real-language equivalents — combining multiple language models casts
 * the widest phonetic net possible.
 *
 * Key behaviour:
 * - Does NOT stop on partial matches (level 1/2) — keeps listening for the full shout.
 * - Stops immediately on level 3 or after LISTEN_WINDOW_MS.
 * - Fires `shoutLevel` once at session end with the highest level achieved.
 */
export function useVoiceShout(): UseVoiceShoutReturn {
  const [isListening, setIsListening]     = useState(false);
  const [shoutLevel, setShoutLevel]       = useState<ShoutLevel | null>(null);
  const [detectedLevel, setDetectedLevel] = useState<ShoutLevel | null>(null);
  const [sessionId, setSessionId]         = useState(0);
  const [error, setError]                 = useState<string | null>(null);
  const [transcript, setTranscript]       = useState("");

  // One recognizer per language — indexed by LANGS order
  const recogsRef   = useRef<(SpeechRecognition | null)[]>([null, null]);
  const timerRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxLevelRef = useRef<ShoutLevel | null>(null);
  // Per-language transcripts stored in a ref to avoid stale closures
  const textsRef    = useRef<string[]>(["", ""]);
  const stoppingRef = useRef(false);

  const finalizeAndStop = useCallback(() => {
    if (stoppingRef.current) return;
    stoppingRef.current = true;
    recogsRef.current.forEach((r) => { try { r?.stop(); } catch { /* ok */ } });
    recogsRef.current = [null, null];
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsListening(false);
    if (maxLevelRef.current) setShoutLevel(maxLevelRef.current);
    maxLevelRef.current = null;
  }, []);

  /** Creates one SpeechRecognition instance for the given language slot. */
  const buildRecognizer = useCallback(
    (lang: string, slotIndex: number, onDone: () => void) => {
      const Ctor =
        (window as Window).SpeechRecognition ??
        (window as Window).webkitSpeechRecognition;
      if (!Ctor) return null;

      const r = new Ctor();
      r.lang = lang;
      r.continuous = true;
      r.interimResults = true;

      r.onresult = (event: SpeechRecognitionEvent) => {
        const partial = Array.from(event.results)
          .map((res) => res[0].transcript)
          .join(" ");

        textsRef.current[slotIndex] = partial;

        const combined = textsRef.current.filter(Boolean).join("  ");
        setTranscript(
          textsRef.current
            .map((tx, i) => (tx ? `[${LANGS[i]}] ${tx}` : ""))
            .filter(Boolean)
            .join("  ·  ")
        );

        const level = detectLevel(combined);
        if (level && (!maxLevelRef.current || level > maxLevelRef.current)) {
          maxLevelRef.current = level;
          setDetectedLevel(level);
        }
        if (level === 3) onDone();
      };

      r.onerror = (e: Event) => {
        const err = (e as SpeechRecognitionErrorEvent).error;
        if (err === "no-speech" || err === "aborted") return;
        const msg =
          err === "network"
            ? "network-error"
            : err === "not-allowed"
            ? "Microphone permission denied."
            : "Microphone unavailable.";
        setError(msg);
        onDone();
      };

      r.onend = () => {
        // Restart if still within the listening window
        if (!stoppingRef.current && recogsRef.current[slotIndex] !== null) {
          try { r.start(); } catch { /* already stopping */ }
        }
      };

      return r;
    },
    []
  );

  const startListening = useCallback(() => {
    const Ctor =
      (window as Window).SpeechRecognition ??
      (window as Window).webkitSpeechRecognition;
    if (!Ctor) {
      setError("Voice recognition is not supported in this browser.");
      return;
    }

    stoppingRef.current = false;
    textsRef.current = ["", ""];
    maxLevelRef.current = null;

    setIsListening(true);
    setShoutLevel(null);
    setDetectedLevel(null);
    setTranscript("");
    setError(null);
    setSessionId((n) => n + 1);

    const recogs = LANGS.map((lang, i) => buildRecognizer(lang, i, finalizeAndStop));
    recogsRef.current = recogs;
    recogs.forEach((r) => { try { r?.start(); } catch { /* ignore per-lang start failures */ } });

    timerRef.current = setTimeout(finalizeAndStop, LISTEN_WINDOW_MS);
  }, [buildRecognizer, finalizeAndStop]);

  useEffect(() => () => finalizeAndStop(), [finalizeAndStop]);

  return { isListening, shoutLevel, detectedLevel, sessionId, startListening, error, transcript };
}
