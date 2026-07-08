"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// ── Adaptive soundtrack ──────────────────────────────────────────────────────
// The music is not a playlist: it is one piece split into synchronized stems
// (same tempo/key/loop length, see public/audio/stems/README.md). All stems
// loop together all the time; a "scene" is just a set of per-stem volumes,
// and scene changes ramp the gains so the soundtrack morphs instead of
// cutting.

const MUSIC_STEMS = [
  { id: "base", file: "/audio/stems/base.wav" },
  { id: "home", file: "/audio/stems/home.wav" },
  { id: "bit", file: "/audio/stems/bit.wav" },
  { id: "air", file: "/audio/stems/air.wav" },
] as const;

type StemId = (typeof MUSIC_STEMS)[number]["id"];
type SceneMix = Record<StemId, number>;

// Per-stem volumes per scene. base = warm pad (bed), home = reed melody,
// bit = chiptune arps (playful), air = ethereal high pad (inspirational).
// Terminal/work lean on a softened bit at a lower level than before; about
// is carried by the airy pad.
const SCENES: Record<string, SceneMix> = {
  home: { base: 1, home: 0.85, bit: 0, air: 0.35 },
  lab: { base: 0.9, home: 0.4, bit: 0.18, air: 0.1 },
  about: { base: 0.7, home: 0.35, bit: 0, air: 0.9 },
  time: { base: 0.9, home: 0.15, bit: 0.5, air: 0.2 },
  admin: { base: 0.75, home: 0, bit: 0.55, air: 0.1 },
  terminal: { base: 0.65, home: 0, bit: 0.7, air: 0 },
  quiet: { base: 1, home: 0.3, bit: 0, air: 0.25 },
};

/** Maps a pathname to its soundtrack scene. */
export function sceneForPath(path: string): string {
  if (path === "/") return "home";
  if (path.startsWith("/lab")) return "lab";
  if (path.startsWith("/about")) return "about";
  if (path.startsWith("/time-machine")) return "time";
  if (path.startsWith("/admin")) return "admin";
  return "quiet";
}

// Exponential approach time constant: gains reach ~95% of the new scene in
// three time constants (~4s) - slow enough to read as a morph, fast enough
// to register as a response to navigating.
const MIX_TIME_CONSTANT = 1.4;
const MUSIC_BUS_GAIN = 0.14;

export interface AdaptiveMusicAPI {
  isPlaying: boolean;
  isStarting: boolean;
  startMusic: () => Promise<void>;
  stopMusic: () => void;
  setMusicScene: (scene: string) => void;
  setMusicOverride: (scene: string | null) => void;
  setMusicMuted: (muted: boolean) => void;
}

/**
 * Adaptive soundtrack engine: keeps every stem looping in sync on its own
 * AudioContext and morphs per-stem gains between scenes.
 */
export function useAdaptiveMusic(): AdaptiveMusicAPI {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  const musicCtxRef = useRef<AudioContext | null>(null);
  const musicBusRef = useRef<GainNode | null>(null);
  const stemBuffersRef = useRef<Map<StemId, AudioBuffer> | null>(null);
  const stemSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const stemGainsRef = useRef<Map<StemId, GainNode>>(new Map());
  const routeSceneRef = useRef<string>("home");
  const overrideSceneRef = useRef<string | null>(null);
  const isPlayingRef = useRef(false);
  const isMutedRef = useRef(false);

  /** Current target mix: the terminal override wins over the route scene. */
  const activeMix = useCallback((): SceneMix => {
    const scene = overrideSceneRef.current ?? routeSceneRef.current;
    return SCENES[scene] ?? SCENES.quiet;
  }, []);

  /** Ramps every stem gain toward the active scene (the morph itself). */
  const applyMix = useCallback(
    (immediate = false) => {
      const ctx = musicCtxRef.current;
      if (!ctx) return;
      const mix = activeMix();
      for (const [id, gain] of stemGainsRef.current) {
        const target = mix[id] ?? 0;
        gain.gain.cancelScheduledValues(ctx.currentTime);
        if (immediate) {
          gain.gain.setValueAtTime(target, ctx.currentTime);
        } else {
          gain.gain.setTargetAtTime(target, ctx.currentTime, MIX_TIME_CONSTANT);
        }
      }
    },
    [activeMix],
  );

  const loadStems = useCallback(async (ctx: AudioContext) => {
    if (stemBuffersRef.current) return stemBuffersRef.current;
    const entries = await Promise.all(
      MUSIC_STEMS.map(async ({ id, file }) => {
        const res = await fetch(file);
        const buffer = await ctx.decodeAudioData(await res.arrayBuffer());
        return [id, buffer] as const;
      }),
    );
    stemBuffersRef.current = new Map(entries);
    return stemBuffersRef.current;
  }, []);

  const startMusic = useCallback(async () => {
    setIsStarting(true);
    try {
      if (!musicCtxRef.current) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        musicCtxRef.current = new AudioCtx();
        musicBusRef.current = musicCtxRef.current.createGain();
        musicBusRef.current.connect(musicCtxRef.current.destination);
      }
      const ctx = musicCtxRef.current;
      const bus = musicBusRef.current!;
      await ctx.resume();
      const buffers = await loadStems(ctx);

      // Stop any previous sources before rebuilding the graph.
      for (const src of stemSourcesRef.current) {
        try { src.stop(); } catch { /* already stopped */ }
      }
      stemSourcesRef.current = [];
      stemGainsRef.current = new Map();

      // All stems start at the same clock tick and loop forever; staying in
      // sync is what makes any gain mix of them musical.
      const t0 = ctx.currentTime + 0.05;
      for (const { id } of MUSIC_STEMS) {
        const src = ctx.createBufferSource();
        src.buffer = buffers.get(id)!;
        src.loop = true;
        const gain = ctx.createGain();
        src.connect(gain);
        gain.connect(bus);
        src.start(t0);
        stemSourcesRef.current.push(src);
        stemGainsRef.current.set(id, gain);
      }
      applyMix(true);
      bus.gain.cancelScheduledValues(ctx.currentTime);
      bus.gain.setValueAtTime(0, ctx.currentTime);
      bus.gain.setTargetAtTime(
        isMutedRef.current ? 0 : MUSIC_BUS_GAIN,
        ctx.currentTime,
        0.5,
      );
      isPlayingRef.current = true;
      setIsPlaying(true);
    } catch {
      // Fetch/decode/resume can fail (offline, autoplay policy): stay stopped.
    } finally {
      setIsStarting(false);
    }
  }, [applyMix, loadStems]);

  const stopMusic = useCallback(() => {
    const ctx = musicCtxRef.current;
    const bus = musicBusRef.current;
    isPlayingRef.current = false;
    setIsPlaying(false);
    setIsStarting(false);
    if (!ctx || !bus) return;
    // Quick fade, then silence the graph entirely.
    bus.gain.cancelScheduledValues(ctx.currentTime);
    bus.gain.setTargetAtTime(0, ctx.currentTime, 0.1);
    const sources = stemSourcesRef.current;
    stemSourcesRef.current = [];
    setTimeout(() => {
      for (const src of sources) {
        try { src.stop(); } catch { /* already stopped */ }
      }
      // Suspend only if nothing restarted meanwhile.
      if (!isPlayingRef.current) musicCtxRef.current?.suspend().catch(() => {});
    }, 600);
  }, []);

  const setMusicScene = useCallback(
    (scene: string) => {
      routeSceneRef.current = scene;
      if (isPlayingRef.current) applyMix();
    },
    [applyMix],
  );

  const setMusicOverride = useCallback(
    (scene: string | null) => {
      overrideSceneRef.current = scene;
      if (isPlayingRef.current) applyMix();
    },
    [applyMix],
  );

  const setMusicMuted = useCallback((muted: boolean) => {
    isMutedRef.current = muted;
    const ctx = musicCtxRef.current;
    const bus = musicBusRef.current;
    if (ctx && bus && isPlayingRef.current) {
      bus.gain.cancelScheduledValues(ctx.currentTime);
      bus.gain.setTargetAtTime(muted ? 0 : MUSIC_BUS_GAIN, ctx.currentTime, 0.15);
    }
  }, []);

  // Save battery: silence the music context while the tab is hidden.
  useEffect(() => {
    const onVisibility = () => {
      const ctx = musicCtxRef.current;
      if (!ctx || !isPlayingRef.current) return;
      if (document.hidden) ctx.suspend().catch(() => {});
      else ctx.resume().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // Dev-only probe so headless checks can observe the live mix.
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    (window as unknown as Record<string, unknown>).__idfMusic = () => ({
      playing: isPlayingRef.current,
      scene: overrideSceneRef.current ?? routeSceneRef.current,
      gains: Object.fromEntries(
        [...stemGainsRef.current].map(([id, g]) => [id, +g.gain.value.toFixed(3)]),
      ),
    });
  }, []);

  useEffect(() => {
    return () => {
      for (const src of stemSourcesRef.current) {
        try { src.stop(); } catch { /* already stopped */ }
      }
      stemSourcesRef.current = [];
      musicCtxRef.current?.close().catch(() => {});
      musicCtxRef.current = null;
    };
  }, []);

  return {
    isPlaying,
    isStarting,
    startMusic,
    stopMusic,
    setMusicScene,
    setMusicOverride,
    setMusicMuted,
  };
}
