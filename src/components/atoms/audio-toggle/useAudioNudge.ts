"use client";

import { useCallback, useEffect, useState } from "react";

// Version 2. The first key was written by a timer as well as by the visitor,
// so anyone who was simply looking elsewhere for fifteen seconds had it set
// permanently without ever reading the bubble. Those people get one more
// chance under the corrected rule; a new key is the whole migration.
const STORAGE_KEY = "audioNudgeSeen.v2";

/** How long the page has to be quiet before the nudge appears. */
const APPEAR_AFTER_MS = 6000;

/** How long it stays before retiring itself. */
const LINGER_MS = 9000;

interface AudioNudge {
  /** Whether the bubble should be on screen. */
  visible: boolean;
  /** Whether the control should draw attention to itself. */
  pulsing: boolean;
  /** Reveal early, because the pointer came near the control. */
  reveal: () => void;
  /** Retire it for good. */
  dismiss: () => void;
}

/**
 * Decides when to point out that the site has sound.
 *
 * This replaces a modal that covered the page on first visit. That modal was
 * not merely in the way: its overlay swallowed pointer events, so nothing on
 * the site could be clicked until it was answered. A soundtrack is an offer,
 * not a permission request, and it should not hold the page hostage.
 *
 * The bubble waits for the page to settle, says its piece near the control it
 * is talking about, and retires on its own. Coming near the control brings it
 * forward early, since if you are already looking there the timer is beside
 * the point.
 *
 * It is only retired for good when the visitor answers it, by dismissing it or
 * by turning sound on. A bubble that times out unseen comes back next visit.
 *
 * @param audioEnabled - Skip the whole thing when sound is already on.
 */
export function useAudioNudge(audioEnabled: boolean): AudioNudge {
  const [visible, setVisible] = useState(false);
  const [retired, setRetired] = useState(false);

  /**
   * Dismissed by the visitor: gone for good.
   *
   * Only an actual answer writes the flag. The timer below used to call this
   * too, which meant a bubble nobody was looking at retired itself permanently
   * fifteen seconds after it appeared. Being away from the screen is not the
   * same as saying no.
   */
  const dismiss = useCallback(() => {
    setVisible(false);
    setRetired(true);
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // Private mode or blocked storage: the nudge just returns next visit.
    }
  }, []);

  /** Timed out unanswered: off the screen, but it may come back another visit. */
  const retire = useCallback(() => setVisible(false), []);

  const reveal = useCallback(() => {
    if (retired || audioEnabled) return;
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      // Unreadable storage is not a reason to stay silent.
    }
    setVisible(true);
  }, [retired, audioEnabled]);

  useEffect(() => {
    if (audioEnabled || retired) return;
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      // See above.
    }

    // setState inside a timer, not in the effect body: this is a scheduled
    // event, not state derived from a render.
    const appear = setTimeout(() => setVisible(true), APPEAR_AFTER_MS);
    const timeout = setTimeout(retire, APPEAR_AFTER_MS + LINGER_MS);

    return () => {
      clearTimeout(appear);
      clearTimeout(timeout);
    };
  }, [audioEnabled, retired, retire]);

  return {
    visible: visible && !audioEnabled,
    pulsing: visible && !audioEnabled,
    reveal,
    dismiss,
  };
}
