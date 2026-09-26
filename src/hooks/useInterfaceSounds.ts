"use client";

import { useAudio } from "@/context/AudioContext";
import { useEffect } from "react";

/** Anything that should answer to a pointer. */
const INTERACTIVE = 'a, button, [role="button"], summary';

/**
 * How close together two hover notes may fall. A pointer crossing a list
 * touches a dozen rows in a second, and without this the site chirps like a
 * cash register.
 */
const HOVER_GAP_MS = 90;

/**
 * Gives the whole interface its click and hover notes.
 *
 * One pair of delegated listeners rather than a prop threaded through every
 * button: the sounds are a property of the interface, not of any component,
 * and wiring them per-component means the next button someone adds is silent
 * for no reason anyone can see.
 *
 * Nothing is audible until the visitor turns audio on — `playSound` returns
 * early while the context is missing or muted — so this is inert by default
 * and costs two listeners.
 *
 * Opt out with `data-no-sound` on an element or any ancestor: the audio
 * control plays its own note, and the terminal has its own vocabulary.
 */
export function useInterfaceSounds() {
  const { playClick, playHover } = useAudio();

  useEffect(() => {
    // Deliberately not gated on `prefers-reduced-motion`: that setting is
    // about vestibular comfort, not hearing. Someone who asked for less
    // motion and then turned audio on should still get the notes — the
    // opt-in toggle is the consent here.

    const target = (e: Event): HTMLElement | null => {
      const el = e.target;
      if (!(el instanceof Element)) return null;
      const hit = el.closest<HTMLElement>(INTERACTIVE);
      if (!hit || hit.closest("[data-no-sound]")) return null;
      return hit;
    };

    const onClick = (e: Event) => {
      if (target(e)) playClick();
    };

    // Hover only where there is a real pointer: on a touchscreen the enter
    // event arrives together with the tap, so the two notes would collide.
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    let last = 0;
    let previous: HTMLElement | null = null;

    const onOver = (e: Event) => {
      if (!fine.matches) return;
      const hit = target(e);
      // Moving within the same control is not a new hover.
      if (!hit || hit === previous) return;
      previous = hit;

      const now = performance.now();
      if (now - last < HOVER_GAP_MS) return;
      last = now;
      playHover();
    };

    const onOut = (e: Event) => {
      if (!target(e)) previous = null;
    };

    document.addEventListener("click", onClick, true);
    document.addEventListener("pointerover", onOver, true);
    document.addEventListener("pointerout", onOut, true);

    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("pointerover", onOver, true);
      document.removeEventListener("pointerout", onOut, true);
    };
  }, [playClick, playHover]);
}
