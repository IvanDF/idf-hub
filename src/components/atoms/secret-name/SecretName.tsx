"use client";

import { useRef } from "react";

const CLICKS_NEEDED = 3;
const CLICK_WINDOW_MS = 1500;

interface SecretNameProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Secret gateway on the author's name: three quick clicks fire the
 * `idf:name-secret` event (handled by the terminal, which discovers the egg
 * and opens /secrets). Wraps the name in the rail and the About hero.
 */
export default function SecretName({ children, className }: SecretNameProps) {
  const clicksRef = useRef<number[]>([]);

  const handleClick = () => {
    const now = performance.now();
    clicksRef.current = [
      ...clicksRef.current.filter((t) => now - t < CLICK_WINDOW_MS),
      now,
    ];
    if (clicksRef.current.length >= CLICKS_NEEDED) {
      clicksRef.current = [];
      window.dispatchEvent(new CustomEvent("idf:name-secret"));
    }
  };

  return (
    // Deliberately not a button: the name must read as plain text — the
    // discovery IS the easter egg. It stays reachable by pointer only.
    <span className={className} onClick={handleClick} aria-hidden="false">
      {children}
    </span>
  );
}
