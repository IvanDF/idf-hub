"use client";

import Magnetic from "@/components/ui/Magnetic";
import { useTheme } from "@/context/ThemeContext";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import styles from "./layout.module.scss";

export default function RightColumn() {
  const pathname = usePathname();
  const isLab = pathname.startsWith('/lab');
  const { theme, toggleTheme, superDarkMode, clickHint } = useTheme();

  // Randomize the exit text when entering Super Dark Mode
  const exitQuote = useMemo(() => {
    const quotes = [
      "MISCHIEF MANAGED", // Harry Potter
      "LUMOS",            // Harry Potter
      "LOOK TO THE EAST", // Lord of the Rings
      "YOU SHALL PASS",   // Lord of the Rings
      "SKÅL",             // Viking
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  }, [superDarkMode]);

  // Determine button text
  let buttonText = theme === "light" ? "DARK-MODE" : "LIGHT-MODE";
  if (superDarkMode) {
    buttonText = exitQuote;
  } else if (clickHint >= 2) {
    const hints = ["?", "??", "???", "????"];
    buttonText = hints[Math.min(clickHint - 2, hints.length - 1)];
  }

  return (
    <aside className={`${styles.rightColumn} ${isLab ? styles.autoHide : ''}`}>
      {/* 1. Theme Toggle */}
      <Magnetic>
        <div
          className={styles.themeToggle}
          onClick={toggleTheme}
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
            color: superDarkMode ? "#ff4d4d" : "inherit",
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
                superDarkMode ? "#ff4d4d" : "var(--color-divider)"
              }`,
              display: "flex",
              alignItems: "center",
              justifyContent: theme === "dark" ? "flex-end" : "flex-start",
              padding: "0 2px",
              background: superDarkMode
                ? "rgba(255, 77, 77, 0.1)"
                : "transparent",
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                background: superDarkMode ? "#ff4d4d" : "var(--color-text)",
                borderRadius: "50%",
                boxShadow: superDarkMode ? "0 0 8px #ff4d4d" : "none",
              }}
            ></div>
          </div>
        </div>
      </Magnetic>

      {/* 2. Divider */}
      <div className={styles.divider}></div>

      {/* 3. Social List */}
      <div
        className={styles.socials}
        style={{ display: "flex", gap: "16px", alignItems: "center" }}
      >
        <Magnetic>
          <a
            href="https://www.instagram.com/idf.me/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              border: "1px solid var(--color-divider)",
              borderRadius: "50%",
            }}
          >
            <Image
              src="/assets/instagram.svg"
              alt="Instagram"
              width={20}
              height={20}
              style={{ filter: theme === "dark" ? "invert(1)" : "none" }}
            />
          </a>
        </Magnetic>
        <Magnetic>
          <a
            href="https://www.linkedin.com/in/ivandf/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              border: "1px solid var(--color-divider)",
              borderRadius: "50%",
            }}
          >
            <Image
              src="/assets/linkedin.svg"
              alt="LinkedIn"
              width={20}
              height={20}
              style={{ filter: theme === "dark" ? "invert(1)" : "none" }}
            />
          </a>
        </Magnetic>
        <Magnetic>
          <a
            href="hhttps://github.com/IvanDF"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              border: "1px solid var(--color-divider)",
              borderRadius: "50%",
            }}
          >
            <Image
              src="/assets/github.svg"
              alt="GitHub"
              width={20}
              height={20}
              style={{ filter: theme === "dark" ? "invert(1)" : "none" }}
            />
          </a>
        </Magnetic>
        <Magnetic>
          <a
            href="https://www.figma.com/@ivandf"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              border: "1px solid var(--color-divider)",
              borderRadius: "50%",
            }}
          >
            <Image
              src="/assets/figma.svg"
              alt="Figma"
              width={20}
              height={20}
              style={{ filter: theme === "dark" ? "invert(1)" : "none" }}
            />
          </a>
        </Magnetic>
      </div>
    </aside>
  );
}
