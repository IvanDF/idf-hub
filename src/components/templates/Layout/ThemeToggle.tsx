"use client";

import Button from "@/components/atoms/button";
import Text from "@/components/atoms/text";
import { useAudio } from "@/context/AudioContext";
import { useTheme } from "@/context/ThemeContext";
import { useMemo } from "react";
import styles from "./layout.module.scss";

const EXIT_QUOTES = [
  "MISCHIEF MANAGED",
  "LUMOS",
  "LOOK TO THE EAST",
  "YOU SHALL PASS",
  "SKÅL",
];

/**
 * Theme toggle pill with its label/easter-egg logic. Single source for the
 * control — used by the desktop right rail and the mobile overlay.
 */
export default function ThemeToggle() {
  const { theme, toggleTheme, superDarkMode, clickHint } = useTheme();
  const { playLightOn } = useAudio();

  const exitQuote = useMemo(() => {
    const index = Math.abs(superDarkMode ? clickHint : 0) % EXIT_QUOTES.length;
    return EXIT_QUOTES[index];
  }, [superDarkMode, clickHint]);

  let buttonText = theme === "light" ? "DARK-MODE" : "LIGHT-MODE";
  if (superDarkMode) {
    buttonText = exitQuote;
  } else if (clickHint >= 2) {
    const hints = ["?", "??", "???", "????"];
    buttonText = hints[Math.min(clickHint - 2, hints.length - 1)];
  }

  const activate = () => {
    playLightOn();
    toggleTheme();
  };

  return (
    <Button
      variant="chrome"
      data-super-dark={superDarkMode}
      data-hint={
        clickHint >= 2 && !superDarkMode
          ? Math.min(clickHint - 1, 4)
          : undefined
      }
      onClick={activate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          activate();
        }
      }}
    >
      <Text as="span" variant="label" className={styles.themeLabel}>
        {buttonText}
      </Text>
      <div
        className={styles.themePill}
        data-dark={theme === "dark"}
        data-super-dark={superDarkMode}
      >
        <div className={styles.themeDot}></div>
      </div>
    </Button>
  );
}
