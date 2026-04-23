"use client";

import Magnetic from "@/components/atoms/magnetic";
import SocialIconLink from "@/components/atoms/social-icon-link";
import { useAudio } from "@/context/AudioContext";
import { useTheme } from "@/context/ThemeContext";
import { useIsLabRoute } from "@/hooks/useIsLabRoute";
import { useMemo } from "react";
import styles from "./layout.module.scss";

/**
 * Right sidebar column containing theme toggle and social links.
 * Contains inline styles for dynamic animations (scale, rotate, transform)
 * that depend on runtime state values - these cannot be achieved via CSS modules.
 */

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

export default function RightColumn() {
  const isLab = useIsLabRoute();
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

  // Determine button text
  let buttonText = theme === "light" ? "DARK-MODE" : "LIGHT-MODE";
  if (superDarkMode) {
    buttonText = exitQuote;
  } else if (clickHint >= 2) {
    const hints = ["?", "??", "???", "????"];
    buttonText = hints[Math.min(clickHint - 2, hints.length - 1)];
  }

  return (
    <aside className={`${styles.rightColumn} ${isLab ? styles.autoHide : ""}`}>
      {/* 1. Theme Toggle */}
      <Magnetic>
        <div
          className={styles.themeToggle}
          onClick={() => {
            playLightOn();
            toggleTheme();
          }}
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition:
              "transform 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            transform:
              clickHint > 0 && !superDarkMode
                ? `scale(${1 + clickHint * 0.05}) rotate(${
                    clickHint % 2 === 0 ? 2 : -2
                  }deg)`
                : "none",
            color: superDarkMode ? "var(--color-super-dark)" : "inherit",
          }}
        >
          <span
            style={{
              fontSize: "12px",
              fontWeight: superDarkMode ? "bold" : "normal",
            }}
          >
            {buttonText}
          </span>
          <div
            style={{
              width: 32,
              height: 16,
              borderRadius: 16,
              border: `1px solid ${
                superDarkMode
                  ? "var(--color-super-dark)"
                  : "var(--color-divider)"
              }`,
              display: "flex",
              alignItems: "center",
              justifyContent: theme === "dark" ? "flex-end" : "flex-start",
              padding: "0 2px",
              background: superDarkMode
                ? "rgba(var(--color-super-dark-rgb), 0.1)"
                : "transparent",
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                background: superDarkMode
                  ? "var(--color-super-dark)"
                  : "var(--color-text)",
                borderRadius: "50%",
                boxShadow: superDarkMode
                  ? "0 0 8px var(--color-super-dark)"
                  : "none",
              }}
            ></div>
          </div>
        </div>
      </Magnetic>

      {/* 2. Divider */}
      <div className={styles.divider}></div>

      {/* 3. Social List */}
      <div className={styles.socials}>
        {socials.map(({ href, src, alt }) => (
          <Magnetic key={alt}>
            <SocialIconLink
              href={href}
              src={src}
              alt={alt}
              className={styles.socialIcon}
              iconSize={20}
              invertOnDark={theme === "dark"}
            />
          </Magnetic>
        ))}
      </div>
    </aside>
  );
}
