"use client";

import { useEffect, useState } from "react";
import TextScramble from "@/components/atoms/text-scramble/TextScramble";

export interface Quote {
  text: string;
  author: string;
}

interface Props {
  quotes: Quote[];
  interval?: number;
  className?: string;
  quoteClassName?: string;
  authorClassName?: string;
}

/**
 * Cycles through an array of quotes with a scramble text reveal effect.
 * Each quote reveals itself via TextScramble, stays visible, then advances.
 * @param quotes - Array of { text, author } objects
 * @param interval - Time in ms before cycling to the next quote (default: 6000)
 */
export default function RotatingQuote({
  quotes,
  interval = 6000,
  className,
  quoteClassName,
  authorClassName,
}: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % quotes.length);
    }, interval);
    return () => clearInterval(timer);
  }, [quotes.length, interval]);

  const quote = quotes[index];

  return (
    <div className={className}>
      <blockquote className={quoteClassName}>
        &ldquo;<TextScramble key={index} text={quote.text} />&rdquo;
      </blockquote>
      <cite className={authorClassName}>&mdash; {quote.author}</cite>
    </div>
  );
}
