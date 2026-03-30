'use client';

import { useState, useRef } from 'react';
import styles from './GlitchText.module.scss';

interface GlitchTextProps {
  text: string;
  className?: string;
  scrambleSpeed?: number;
}

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

export default function GlitchText({ text, className = '', scrambleSpeed = 30 }: GlitchTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const scramble = () => {
    let iteration = 0;
    
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(() => 
        text
          .split('')
          .map((char, index) => {
            if (index < iteration) {
              return text[index];
            }
            
            // 50/50 chance of letter or symbol for more matrix-y feel
            const pool = Math.random() > 0.5 ? LETTERS : SYMBOLS;
            return pool[Math.floor(Math.random() * pool.length)];
          })
          .join('')
      );

      if (iteration >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }

      iteration += 1 / 3;
    }, scrambleSpeed);
  };


  return (
    <span 
      className={`${styles.glitchText} ${className}`}
      onMouseEnter={scramble}
      onTouchStart={scramble}
    >
      {displayText}
    </span>
  );
}
