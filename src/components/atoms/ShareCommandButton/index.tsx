"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import styles from "./ShareCommandButton.module.scss";

interface ShareCommandButtonProps {
  /** The terminal command to generate a deep link for. */
  command: string;
  /** Button label shown in standalone variant (defaults to "Share"). */
  label?: string;
  /** Display variant: icon-only inline or full standalone button. */
  variant?: "inline" | "standalone";
}

/**
 * Generates a shareable deep-link URL for a terminal command and copies it
 * to the clipboard (or triggers the Web Share API if available).
 *
 * Inline variant: icon-only, suitable for tight toolbars.
 * Standalone variant: icon + label, suitable for feature areas.
 *
 * @param command  - Terminal command string to encode in the URL
 * @param label    - Optional button text for standalone variant
 * @param variant  - "inline" (default) or "standalone"
 */
export default function ShareCommandButton({
  command,
  label,
  variant = "inline",
}: ShareCommandButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = `${window.location.origin}?cmd=${encodeURIComponent(command.trim())}`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ url, title: `Run: ${command.trim()}` });
        return;
      } catch {
        // Fall through to clipboard fallback
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — silently ignore
    }
  };

  return (
    <button
      type="button"
      className={`${styles.shareButton} ${styles[variant]} ${copied ? styles.copied : ""}`}
      onClick={handleShare}
      aria-label={`Copy shareable link for command: ${command.trim()}`}
      title={copied ? "Link copied!" : `Share "${command.trim()}" link`}
    >
      <Share2 size={14} aria-hidden="true" />
      {variant === "standalone" && (
        <span className={styles.label}>
          {copied ? "Link copied!" : (label ?? "Share")}
        </span>
      )}
      {/* Announce copy success to screen readers */}
      <span role="status" aria-live="polite" className={styles.srOnly}>
        {copied ? "Link copied to clipboard" : ""}
      </span>
    </button>
  );
}
