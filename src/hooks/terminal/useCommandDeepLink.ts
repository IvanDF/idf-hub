"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Parses the `?cmd=` query parameter from the URL on initial mount,
 * strips it from the address bar, and returns the pending command string.
 *
 * @returns `pendingCommand` – the decoded command string (or `null` if absent),
 *          and `clearPendingCommand` to reset after execution.
 */
export function useCommandDeepLink(): {
  pendingCommand: string | null;
  clearPendingCommand: () => void;
} {
  const [pendingCommand, setPendingCommand] = useState<string | null>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const params = new URLSearchParams(window.location.search);
    const cmd = params.get("cmd");

    if (cmd) {
      setPendingCommand(cmd);

      params.delete("cmd");
      const newSearch = params.toString();
      const newUrl =
        window.location.pathname +
        (newSearch ? `?${newSearch}` : "") +
        window.location.hash;
      window.history.replaceState(null, "", newUrl);
    }
  }, []);

  const clearPendingCommand = useCallback(() => setPendingCommand(null), []);

  return { pendingCommand, clearPendingCommand };
}
