/** Classic two-row DP edit distance — small inputs only (command names). */
function editDistance(a: string, b: string): number {
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const curr = [i];
    for (let j = 1; j <= b.length; j++) {
      curr[j] = Math.min(
        prev[j] + 1,
        curr[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
    prev = curr;
  }
  return prev[b.length];
}

/**
 * "Did you mean" candidate for a mistyped command — closest valid command
 * within edit distance 2, or null when nothing is plausibly close.
 */
export function closestCommand(
  input: string,
  commands: readonly string[],
): string | null {
  if (input.length < 2) return null;
  let best: string | null = null;
  let bestDist = 3;
  for (const c of commands) {
    const d = editDistance(input, c);
    if (d < bestDist) {
      bestDist = d;
      best = c;
    }
  }
  return best;
}
