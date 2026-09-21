"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "audioNudgeSeen";

/** How long the page has to be quiet before the nudge appears. */
const APPEAR_AFTER_MS = 6000;

/** How long it stays before retiring itself. */
const LINGER_MS = 9000;

interface AudioNudge {
  /** Whether the bubble should be on screen. */
  visible: boolean;
  /** Whether the control should draw attention to itself. */
  pulsing: boolean;
  /** Reveal early — the pointer came near the control. */
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
 * forward early — if you are already looking there, the timer is beside the
 * point. Either way it is shown once, ever.
 *
 * @param audioEnabled - Skip the whole thing when sound is already on.
 */
export function useAudioNudge(audioEnabled: boolean): AudioNudge {
  const [visible, setVisible] = useState(false);
  const [retired, setRetired] = useState(false);

  const dismiss = useCallback(() => {
    setVisible(false);
    setRetired(true);
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // Private mode or blocked storage: the nudge just returns next visit.
    }
  }, []);

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
    const retire = setTimeout(dismiss, APPEAR_AFTER_MS + LINGER_MS);

    return () => {
      clearTimeout(appear);
      clearTimeout(retire);
    };
  }, [audioEnabled, retired, dismiss]);

  return {
    visible: visible && !audioEnabled,
    pulsing: visible && !audioEnabled,
    reveal,
    dismiss,
  };
}
