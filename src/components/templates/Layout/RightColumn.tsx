"use client";

import Magnetic from "@/components/atoms/magnetic";
import { useAudio } from "@/context/AudioContext";
import { useTheme } from "@/context/ThemeContext";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import styles from "./layout.module.scss";

const socials = [
  { href: "https://www.instagram.com/idf.me/", label: "IG" },
  { href: "https://www.linkedin.com/in/ivandf/", label: "LI" },
  { href: "https://github.com/IvanDF", label: "GH" },
  { href: "https://www.figma.com/@ivandf", label: "FIG" },
  { href: "https://findpenguins.com/idf.travel", label: "FP" },
];

export default function RightColumn() {
  const pathname = usePathname();
  const isLab = pathname.startsWith("/lab") || pathname.startsWith("/about");
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

  return (
    <aside className={`${styles.rightColumn} ${isLab ? styles.autoHide : ""}`}>
      {/* 1. Theme Toggle */}
      <Magnetic>
        <button
          type="button"
          className={styles.themeToggle}
          onClick={() => {
            playLightOn();
            toggleTheme();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              playLightOn();
              toggleTheme();
            }
          }}
          style={{
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
        </button>
      </Magnetic>

      {/* 2. Divider */}
      <div className={styles.divider}></div>

      {/* 3. Social List — typographic */}
      <nav className={styles.socialLinks}>
        {socials.map(({ href, label }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
          >
            {label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
