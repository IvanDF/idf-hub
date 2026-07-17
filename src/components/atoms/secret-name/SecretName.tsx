"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./SecretName.module.scss";

const CLICKS_NEEDED = 3;
const CLICK_WINDOW_MS = 1500;

interface SecretNameProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Secret gateway on the author's name: three quick clicks fire the
 * `idf:name-secret` event (handled by the terminal, which discovers the egg
 * and opens /secrets). Each click gives visible "knock" feedback — scale bump
 * and accent glow — so the user knows something is building up.
 */
export default function SecretName({ children, className }: SecretNameProps) {
  const clicksRef = useRef<number[]>([]);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [knock, setKnock] = useState(0);

  useEffect(
    () => () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    },
    [],
  );

  const handleClick = () => {
    const now = performance.now();
    clicksRef.current = [
      ...clicksRef.current.filter((t) => now - t < CLICK_WINDOW_MS),
      now,
    ];

    if (clicksRef.current.length >= CLICKS_NEEDED) {
      clicksRef.current = [];
      setKnock(0);
      window.dispatchEvent(new CustomEvent("idf:name-secret"));
      return;
    }

    setKnock(clicksRef.current.length);
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(() => setKnock(0), CLICK_WINDOW_MS);
  };

  return (
    // Deliberately not a button: the name must read as plain text — the
    // discovery IS the easter egg. It stays reachable by pointer only.
    <span
      className={`${styles.knockable} ${className ?? ""}`}
      data-knock={knock > 0 ? knock : undefined}
      onClick={handleClick}
    >
      {children}
    </span>
  );
}
