"use client";

import { useEffect } from "react";

/**
 * Plays the scroll reveal on browsers without `animation-timeline: view()`.
 *
 * The CSS path in globals.scss is the good one — no JavaScript, nothing to
 * miss — but it is Chrome 115+ and Safari 26+ only. Without this, everyone
 * else sees no motion whatsoever, which is precisely what happened: the
 * reveals were verified in Chrome and were invisible in Safari.
 *
 * The safety property that made the *previous* reveals unusable is preserved
 * here, and it rests on one detail: `fill: "none"`. The element's committed
 * style is never touched. Nothing sets opacity to 0 and waits for a callback
 * to undo it — the animation is played over a resting state that is already
 * visible, so if the observer fires late, fires twice, or never fires at all,
 * the content is simply there. That is the whole difference from the framer
 * `initial={{opacity: 0}}` version that left text invisible forever.
 */
/** Identifies the scripted reveal in `element.getAnimations()`. */
export const REVEAL_ID = "scroll-reveal";

export function useScrollReveal() {
  useEffect(() => {
    // The native path is better where it exists: it scrubs with the scroll
    // rather than firing once, and it costs no JavaScript at all.
    if (CSS.supports("animation-timeline: view()")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;

    const seen = new WeakSet<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || seen.has(entry.target)) continue;
          seen.add(entry.target);
          observer.unobserve(entry.target);

          entry.target.animate(
            [
              { opacity: 0, transform: "translateY(14px)" },
              { opacity: 1, transform: "none" },
            ],
            {
              duration: 520,
              easing: "cubic-bezier(0.16, 1, 0.3, 1)",
              // Never `both` or `backwards`: a fill would write the hidden
              // first frame onto the element and leave it there if anything
              // interrupted the animation.
              fill: "none",
              // Named so `getAnimations()` can tell this apart from the CSS
              // path and from every other animation on the page — otherwise
              // there is no way to check this branch actually ran.
              id: REVEAL_ID,
            },
          );
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );

    // Elements already on screen at mount are left alone: animating them in
    // after the page has painted reads as a glitch, not as an arrival.
    const viewportBottom = window.innerHeight;
    for (const el of document.querySelectorAll("[data-reveal]")) {
      if (el.getBoundingClientRect().top < viewportBottom) {
        seen.add(el);
        continue;
      }
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);
}
