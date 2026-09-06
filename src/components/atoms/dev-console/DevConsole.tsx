"use client";

import { createConsoleApi, printBanner } from "@/lib/console";
import { useEffect } from "react";

/**
 * Mounts the devtools companion: exposes the frozen `window.idf` API and
 * prints the ASCII banner once per page load. Renders nothing.
 *
 * The `window.idf` check is the idempotence guard — it also absorbs React
 * StrictMode's double effect invocation in development.
 */
export default function DevConsole() {
  useEffect(() => {
    if (window.idf) return;
    window.idf = createConsoleApi();
    printBanner();
  }, []);

  return null;
}
