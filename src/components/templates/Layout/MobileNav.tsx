"use client";

import AudioToggle from "@/components/atoms/audio-toggle";
import GlitchText from "@/components/atoms/glitch-text";
import RotatingTitle from "@/components/atoms/rotating-title";
import SocialIconLink from "@/components/atoms/social-icon-link";
import { useAudio } from "@/context/AudioContext";
import { useTheme } from "@/context/ThemeContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import styles from "./layout.module.scss";

/**
 * Mobile navigation overlay with theme toggle and menu items.
 * Contains inline styles for dynamic animations (scale, rotate, transform)
 * that depend on runtime state values - these cannot be achieved via CSS modules.
 */

interface MobileNavProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const socials = [
  {
    href: "https://www.instagram.com/idf.me/",
    src: "/assets/instagram.svg",
    alt: "Instagram",
  },
  {
    href: "https://www.linkedin.com/in/ivandf/",
    src: "/assets/linkedin.svg",
    alt: "LinkedIn",
  },
  {
    href: "https://github.com/IvanDF",
    src: "/assets/github.svg",
    alt: "GitHub",
  },
  {
    href: "https://www.figma.com/@ivandf",
    src: "/assets/figma.svg",
    alt: "Figma",
  },
];

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
    const event = new KeyboardEvent("keydown", {
      key: "k",
      metaKey: true,
    });
    window.dispatchEvent(event);
  };

  return (
    <>
      {/* Single floating burger — animates for both open and close */}
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
          {/* Top bar */}
          <div className={styles.mobileOverlayTop}>
            <button
              type="button"
              className={styles.mobileCmdBtn}
              onClick={openTerminal}
              aria-label="Open Command Palette"
            >
              <span className={styles.prompt}>&lt;_</span>
              <span className={styles.label}>cmd</span>
            </button>

            <div className={styles.mobileTopActions}>
              <button
                type="button"
                className={styles.mobileThemeToggle}
                onClick={() => {
                  playLightOn();
                  toggleTheme();
                }}
                style={{
                  transition:
                    "transform 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  transform:
                    clickHint > 0 && !superDarkMode
                      ? `scale(${1 + clickHint * 0.05}) rotate(${clickHint % 2 === 0 ? 2 : -2}deg)`
                      : "none",
                  color: superDarkMode ? "var(--color-super-dark)" : undefined,
                }}
              >
                <span
                  style={{
                    fontWeight: superDarkMode ? "bold" : "normal",
                  }}
                >
                  {buttonText}
                </span>
                <div
                  className={styles.mobileThemePill}
                  data-dark={theme === "dark"}
                  style={{
                    borderColor: superDarkMode
                      ? "var(--color-super-dark)"
                      : undefined,
                    background: superDarkMode
                      ? "rgba(var(--color-super-dark-rgb), 0.1)"
                      : undefined,
                    justifyContent:
                      theme === "dark" ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    className={styles.mobileThemeDot}
                    style={{
                      background: superDarkMode
                        ? "var(--color-super-dark)"
                        : undefined,
                      boxShadow: superDarkMode
                        ? "0 0 8px var(--color-super-dark)"
                        : undefined,
                    }}
                  />
                </div>
              </button>
            </div>
          </div>

          {/* Center: nav links */}
          <nav className={styles.mobileOverlayCenter} aria-label="Mobile navigation">
            <div className={styles.mobileNavLinks}>
              <Link href="/lab" className={styles.mobileNavLink} onClick={onClose}>
                Work
              </Link>
              <Link href="/time-machine" className={styles.mobileNavLink} onClick={onClose}>
                Time Machine
              </Link>
            </div>
          </nav>

          {/* Bottom: name+role + socials */}
          <div className={styles.mobileOverlayBottom}>
            <div className={styles.mobileOverlayMeta}>
              <AudioToggle className={styles.mobileAudioToggle} />

              <div className={styles.mobileOverlayName}>
                <GlitchText text="IVAN DEL FATTI" />
                <RotatingTitle className={styles.mobileOverlayRole} />
              </div>
            </div>

            <div className={styles.mobileOverlaySocials}>
              {socials.map(({ href, src, alt }) => (
                <SocialIconLink
                  key={alt}
                  href={href}
                  src={src}
                  alt={alt}
                  className={styles.mobileOverlaySocialIcon}
                  iconSize={20}
                  invertOnDark={theme === "dark"}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
