"use client";

import Text from "@/components/atoms/text";
import Button from "@/components/atoms/button";
import Magnetic from "@/components/atoms/magnetic";
import { socials } from "@/data/nav";
import { useAudio } from "@/context/AudioContext";
import { useTheme } from "@/context/ThemeContext";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import styles from "./layout.module.scss";

/**
 * Renders the desktop right-side rail with theme controls and social links.
 */
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
        <Button
          variant="chrome"
          data-super-dark={superDarkMode}
          data-hint={
            clickHint >= 2 && !superDarkMode
              ? Math.min(clickHint - 1, 4)
              : undefined
          }
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
        >
          <Text as="span" variant="label" className={styles.themeLabel}>{buttonText}</Text>
          <div
            className={styles.themePill}
            data-dark={theme === "dark"}
            data-super-dark={superDarkMode}
          >
            <div className={styles.themeDot}></div>
          </div>
        </Button>
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
