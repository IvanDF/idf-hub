"use client";

import { useEffect, useState } from "react";

/**
 * Current local time as `HH:MM`, refreshed every 30 seconds like a tmux status
 * line. Starts empty so server and client render the same markup.
 */
export function useClock(): string {
  const [time, setTime] = useState("");

  useEffect(() => {
    const format = () =>
      new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    const tick = () => setTime(format());
    const first = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, 30_000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, []);

  return time;
}
