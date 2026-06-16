"use client";

import { useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#&";

interface Props {
  text: string;
  className?: string;
  delay?: number;
  as?: keyof React.JSX.IntrinsicElements;
}

export default function TextScramble({ text, className, delay = 0, as: Tag = "span" }: Props) {
  const [display, setDisplay] = useState(() => text.replace(/\S/g, CHARS[0]));
  const frameRef = useRef(0);
  const resolvedRef = useRef<boolean[]>([]);

  useEffect(() => {
    resolvedRef.current = Array(text.length).fill(false);
    let iteration = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    const step = () => {
      let allDone = true;
      const next = text
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";
          if (resolvedRef.current[i]) return char;
          if (Math.random() < iteration / (text.length * 1.8)) {
            resolvedRef.current[i] = true;
            return char;
          }
          allDone = false;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join("");

      setDisplay(next);
      iteration++;
      if (!allDone) frameRef.current = requestAnimationFrame(step);
    };

    timeoutId = setTimeout(() => {
      frameRef.current = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(frameRef.current);
    };
  }, [text, delay]);

  return <Tag className={className}>{display}</Tag>;
}
