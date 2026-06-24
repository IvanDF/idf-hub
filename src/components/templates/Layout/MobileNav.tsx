"use client";

import Button from "@/components/atoms/button";
import AudioToggle from "@/components/atoms/audio-toggle";
import GlitchText from "@/components/atoms/glitch-text";
import { useAudio } from "@/context/AudioContext";
import { useTheme } from "@/context/ThemeContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import styles from "./layout.module.scss";

interface MobileNavProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const socials = [
  { href: "https://www.instagram.com/idf.me/", label: "IG" },
  { href: "https://www.linkedin.com/in/ivandf/", label: "LI" },
  { href: "https://github.com/IvanDF", label: "GH" },
  { href: "https://www.figma.com/@ivandf", label: "FIG" },
  { href: "https://findpenguins.com/idf.travel", label: "FP" },
];

/**
 * Renders the mobile navigation overlay and burger toggle.
 */
export default function MobileNav({
  isOpen,
  onToggle,
  onClose,
}: MobileNavProps) {
  const pathname = usePathname();
  const { theme, toggleTheme, superDarkMode, clickHint } = useTheme();
  const { playLightOn } = useAudio();

  const exitQuote = useMemo(() => {
    const quotes = [
      "MISCHIEF MANAGED",
      "LUMOS",
      "LOOK TO THE EAST",
      "YOU SHALL PASS",
      "SKÅL",
    ];
    const index = Math.abs(superDarkMode ? clickHint : 0) % quotes.length;
    return quotes[index];
  }, [superDarkMode, clickHint]);

  let buttonText = theme === "light" ? "DARK-MODE" : "LIGHT-MODE";
  if (superDarkMode) {
    buttonText = exitQuote;
  } else if (clickHint >= 2) {
    const hints = ["?", "??", "???", "????"];
    buttonText = hints[Math.min(clickHint - 2, hints.length - 1)];
  }

  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const openTerminal = () => {
    onClose();
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
  };

  return (
    <>
      {/* Floating burger */}
      <button
        type="button"
        className={`${styles.burger} ${isOpen ? styles.open : ""}`}
        onClick={onToggle}
        aria-label={isOpen ? "Close Menu" : "Open Menu"}
        aria-expanded={isOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Full-screen overlay */}
      {isOpen && (
        <div className={styles.mobileOverlay} role="dialog" aria-modal="true">
          {/* Top: theme toggle */}
          <div className={styles.mobileOverlayTop}>
            <div className={styles.mobileTopActions}>
              <Button
                variant="chrome"
                data-super-dark={superDarkMode}
                data-hint={clickHint >= 2 && !superDarkMode ? Math.min(clickHint - 1, 4) : undefined}
                onClick={() => {
                  playLightOn();
                  toggleTheme();
                }}
              >
                <span className={styles.mobileThemeLabel}>
                  {buttonText}
                </span>
                <div
                  className={styles.mobileThemePill}
                  data-dark={theme === "dark"}
                  data-super-dark={superDarkMode}
                >
                  <div className={styles.mobileThemeDot} />
                </div>
              </Button>
            </div>
          </div>

          {/* Center: nav links */}
          <nav className={styles.mobileOverlayCenter} aria-label="Mobile navigation">
            <div className={styles.mobileNavLinks}>
              <Link
                href="/"
                className={`${styles.mobileNavLink} ${pathname === "/" ? styles.mobileNavLinkActive : ""}`}
                onClick={onClose}
              >
                Home
              </Link>
              <Link
                href="/lab"
                className={`${styles.mobileNavLink} ${pathname.startsWith("/lab") ? styles.mobileNavLinkActive : ""}`}
                onClick={onClose}
              >
                Work
              </Link>
              <Link
                href="/about"
                className={`${styles.mobileNavLink} ${pathname.startsWith("/about") ? styles.mobileNavLinkActive : ""}`}
                onClick={onClose}
              >
                About
              </Link>
            </div>
          </nav>

          {/* Bottom: identity + actions */}
          <div className={styles.mobileOverlayBottom}>
            <div className={styles.mobileOverlayMeta}>
              <AudioToggle className={styles.mobileAudioToggle} />
              <div className={styles.mobileOverlayName}>
                <GlitchText text="IVAN DEL FATTI" />
                <Button
                  variant="chrome"
                  onClick={openTerminal}
                  aria-label="Open command palette"
                >
                  <span className={styles.mobileCmdPromptIcon}>&lt;_</span>
                  <span>⌘K</span>
                </Button>
              </div>
            </div>

            <div className={styles.mobileOverlaySocials}>
              {socials.map(({ href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.mobileSocialLink}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
