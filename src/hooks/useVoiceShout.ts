"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type ShoutLevel = 1 | 2 | 3;

const LISTEN_WINDOW_MS = 12000;
// it-IT first — Italian speaker gets better phoneme coverage for Dragon Language
const LANGS = ["it-IT", "en-US"] as const;

// ── Energy detector tuning ───────────────────────────────────────────────────
// A shout is energy, not vocabulary: the PRIMARY detector counts loud bursts
// (1 = fus, 2 = fus ro, 3 = fus ro dah) so any language — or a wordless yell —
// works. Speech recognition stays as a bonus channel only.
const CALIBRATION_MS = 500; // sample ambient noise before arming the detector
const MIN_BURST_MS = 90; // ignore clicks/pops shorter than this
const MIN_GAP_MS = 150; // two bursts must be separated by silence this long
const MIN_THRESHOLD = 0.055; // RMS floor a burst must exceed (0..1)
const HYSTERESIS = 0.6; // burst ends below threshold * this (avoids flicker)

/**
 * Bonus channel: fuzzy transcript matching. Dragon Language words don't exist
 * in any real language, so we match the mis-transcriptions Chrome actually
 * produces ("force", "roda", "rider"...). Kept as an instant-win shortcut —
 * the energy detector is the reliable path.
 */
function detectLevel(combined: string): ShoutLevel | null {
  const t = combined.toLowerCase().replace(/[',.\-!?]/g, " ");

  // Chrome often fuses "ro dah" into one token
  const hasRoDahCompound =
    /\broda\b/.test(t) ||
    /\broder\b/.test(t) ||
    /\brodar\b/.test(t) ||
    /\brider\b/.test(t) ||
    /\brodah\b/.test(t) ||
    /\brudah\b/.test(t);

  const hasFus =
    /\bfus+\b/.test(t) ||
    /\bfuzz\b/.test(t) ||
    /\bfuse\b/.test(t) ||
    /\bfoose\b/.test(t) ||
    /\bforce\b/.test(t) ||
    /\bfoos\b/.test(t) ||
    /\bfaz\b/.test(t) ||
    /\bfas\b/.test(t) ||
    /\bfuso\b/.test(t) ||
    /\bfai\b/.test(t) ||
    /\bfu\b/.test(t);

  const hasRo =
    /\bro\b/.test(t) ||
    /\brow\b/.test(t) ||
    /\broe\b/.test(t) ||
    /\brho\b/.test(t) ||
    /\braw\b/.test(t) ||
    /\blo\b/.test(t) ||
    /\bre\b/.test(t) ||
    hasRoDahCompound;

  const hasDah =
    /\bdah?\b/.test(t) ||
    /\bduh\b/.test(t) ||
    /\bdot\b/.test(t) ||
    /\bta\b/.test(t) ||
    /\bda\b/.test(t) ||
    /\bfa\b/.test(t) ||
    /\bha\b/.test(t) ||
    /\bah\b/.test(t) ||
    hasRoDahCompound;

  if (hasFus && hasRo && hasDah) return 3;
  if (hasFus && hasRo) return 2;
  if (hasFus) return 1;
  return null;
}

export interface UseVoiceShoutReturn {
  /** True while the microphone is open and waiting for input. */
  isListening: boolean;
  /** Final shout level emitted at session end (highest level detected). */
  shoutLevel: ShoutLevel | null;
  /** Current best level detected so far in this session (live). */
  detectedLevel: ShoutLevel | null;
  /** Increments on each session start — use as a React key to reset CSS animations. */
  sessionId: number;
  /** Start a new listening session (requests mic permission implicitly). */
  startListening: () => void;
  /** Any error string, e.g. mic permission denied. */
  error: string | null;
  /** Combined live transcript from the bonus recognisers (admin debug UI). */
  transcript: string;
  /** Live microphone loudness 0..1 — drives the VU meter. */
  volume: number;
}

/**
 * Detects Skyrim "Fus / Fus Ro / Fus Ro Dah" shouts.
 *
 * Primary: Web Audio energy detection — counts distinct loud bursts against a
 * calibrated noise floor, fully local (no audio leaves the device) and
 * language-independent. Bonus: two SpeechRecognition instances (it-IT + en-US)
 * whose fuzzy-matched transcript can grant a level instantly; their errors
 * (e.g. Chrome's network requirement on plain http) never kill the session.
 */
export function useVoiceShout(): UseVoiceShoutReturn {
  const [isListening, setIsListening] = useState(false);
  const [shoutLevel, setShoutLevel] = useState<ShoutLevel | null>(null);
  const [detectedLevel, setDetectedLevel] = useState<ShoutLevel | null>(null);
  const [sessionId, setSessionId] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState("");
  const [volume, setVolume] = useState(0);

  const recogsRef = useRef<(SpeechRecognition | null)[]>([null, null]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxLevelRef = useRef<ShoutLevel | null>(null);
  const textsRef = useRef<string[]>(["", ""]);
  const stoppingRef = useRef(false);
  const sessionActiveRef = useRef(false);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number>(0);

  const finalizeAndStop = useCallback(() => {
    if (stoppingRef.current) return;
    stoppingRef.current = true;
    recogsRef.current.forEach((r) => { try { r?.stop(); } catch { /* ok */ } });
    recogsRef.current = [null, null];
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsListening(false);
    setVolume(0);
    if (maxLevelRef.current) {
      setShoutLevel(maxLevelRef.current);
    } else if (sessionActiveRef.current) {
      // A real session closed silently — say so instead of just vanishing.
      setError((prev) => prev ?? "No shout detected — louder, three bursts.");
    }
    sessionActiveRef.current = false;
    maxLevelRef.current = null;
  }, []);

  const registerLevel = useCallback(
    (level: ShoutLevel) => {
      if (!maxLevelRef.current || level > maxLevelRef.current) {
        maxLevelRef.current = level;
        setDetectedLevel(level);
      }
      if (level === 3) finalizeAndStop();
    },
    [finalizeAndStop],
  );

  /** Primary detector: RMS burst counting against a calibrated noise floor. */
  const startEnergyDetector = useCallback(async (): Promise<boolean> => {
    if (!navigator.mediaDevices?.getUserMedia) return false;
    try {
      // Raw audio: AGC/noise suppression would flatten exactly the loudness
      // spikes the burst detector needs.
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });
      if (stoppingRef.current) {
        stream.getTracks().forEach((t) => t.stop());
        return true;
      }
      streamRef.current = stream;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      // Autoplay policy: a context created outside a direct user gesture (we
      // are async, after the mic prompt) starts suspended — resume or the
      // analyser reads eternal silence.
      if (ctx.state === "suspended") await ctx.resume();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      ctx.createMediaStreamSource(stream).connect(analyser);
      const buf = new Uint8Array(analyser.fftSize);

      const startedAt = performance.now();
      let noiseSum = 0;
      let noiseSamples = 0;
      let inBurst = false;
      let burstStart = 0;
      let lastBurstEnd = -Infinity;
      let bursts = 0;
      let frame = 0;

      const tick = () => {
        if (stoppingRef.current) return;
        analyser.getByteTimeDomainData(buf);
        let sum = 0;
        for (let i = 0; i < buf.length; i++) {
          const v = (buf[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / buf.length);
        // ~30fps, quantised: silence produces identical values, so React
        // skips those re-renders entirely.
        if (frame++ % 2 === 0) setVolume(Math.round(rms * 100) / 100);

        const now = performance.now();
        if (now - startedAt < CALIBRATION_MS) {
          noiseSum += rms;
          noiseSamples++;
        } else {
          const noiseFloor = noiseSamples ? noiseSum / noiseSamples : 0;
          const threshold = Math.max(MIN_THRESHOLD, noiseFloor * 3);
          if (!inBurst && rms > threshold && now - lastBurstEnd >= MIN_GAP_MS) {
            inBurst = true;
            burstStart = now;
          } else if (inBurst && rms < threshold * HYSTERESIS) {
            inBurst = false;
            if (now - burstStart >= MIN_BURST_MS) {
              bursts++;
              lastBurstEnd = now;
              registerLevel(Math.min(3, bursts) as ShoutLevel);
            }
          }
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
      return true;
    } catch (e) {
      // Permission denied is fatal (recognition needs the mic too)
      if (e instanceof DOMException && e.name === "NotAllowedError") {
        setError("Microphone permission denied.");
        finalizeAndStop();
        return true; // handled — don't fall back
      }
      return false;
    }
  }, [registerLevel, finalizeAndStop]);

  /** Bonus channel: one SpeechRecognition instance per language slot. */
  const buildRecognizer = useCallback(
    (lang: string, slotIndex: number) => {
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
        setTranscript(
          textsRef.current
            .map((tx, i) => (tx ? `[${LANGS[i]}] ${tx}` : ""))
            .filter(Boolean)
            .join("  ·  "),
        );
        const level = detectLevel(textsRef.current.filter(Boolean).join("  "));
        if (level) registerLevel(level);
      };

      // Bonus channel failures (Chrome needs HTTPS + network for speech) must
      // not end the session — the energy detector keeps listening.
      r.onerror = () => {};

      r.onend = () => {
        if (!stoppingRef.current && recogsRef.current[slotIndex] !== null) {
          try { r.start(); } catch { /* already stopping */ }
        }
      };

      return r;
    },
    [registerLevel],
  );

  const startListening = useCallback(() => {
    stoppingRef.current = false;
    sessionActiveRef.current = true;
    textsRef.current = ["", ""];
    maxLevelRef.current = null;

    setIsListening(true);
    setShoutLevel(null);
    setDetectedLevel(null);
    setTranscript("");
    setError(null);
    setVolume(0);
    setSessionId((n) => n + 1);

    const recogs = LANGS.map((lang, i) => buildRecognizer(lang, i));
    recogsRef.current = recogs;
    recogs.forEach((r) => { try { r?.start(); } catch { /* ignore per-lang start failures */ } });

    void startEnergyDetector().then((energyOk) => {
      // No mic API and no recognition either → nothing can listen
      if (!energyOk && recogs.every((r) => r === null)) {
        setError("Voice input is not supported in this browser.");
        finalizeAndStop();
      }
    });

    timerRef.current = setTimeout(finalizeAndStop, LISTEN_WINDOW_MS);
  }, [buildRecognizer, startEnergyDetector, finalizeAndStop]);

  useEffect(() => () => finalizeAndStop(), [finalizeAndStop]);

  return { isListening, shoutLevel, detectedLevel, sessionId, startListening, error, transcript, volume };
}
