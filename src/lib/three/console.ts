import { getConsoleFunction, setConsoleFunction } from "three";

/**
 * Warnings three.js emits that we have already triaged and cannot act on.
 *
 * `THREE.Clock` was deprecated in r183 in favour of `THREE.Timer`, but the
 * call site belongs to @react-three/fiber, which builds one for every store
 * (`clock: new THREE.Clock()`); 9.7.0, the latest at the time of writing,
 * still does. Nothing in this codebase constructs a Clock.
 *
 * Delete the entry — and this whole module once the list empties — as soon as
 * fiber moves to Timer. The match is on the exact wording on purpose: if
 * three rephrases the message, the warning comes back rather than staying
 * quietly swallowed.
 *
 * (The doubled prefix is not a typo. `warn()` prepends "THREE." to a message
 * that already carries one, so the console really does print "THREE.THREE.".)
 */
const SILENCED_WARNINGS: readonly string[] = [
  "THREE.THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.",
];

/**
 * Routes three.js logging through its own `setConsoleFunction` hook so the
 * triaged deprecations above stop reaching the console. Everything else is
 * forwarded untouched — this filters a known-noisy line, it does not mute the
 * library.
 *
 * Safe to call more than once: the hook is installed only if nothing holds it
 * yet, so competing Canvas modules cannot stack wrappers on each other.
 */
export function filterKnownThreeWarnings(): void {
  if (getConsoleFunction()) return;

  setConsoleFunction((type, message, ...params) => {
    if (type === "warn" && SILENCED_WARNINGS.includes(message)) return;
    console[type](message, ...params);
  });
}
