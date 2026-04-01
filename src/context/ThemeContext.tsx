"use client";

/**
 * Theme Context
 *
 * Provides global theme management (light/dark mode) for the application.
 * Handles persistence via localStorage and system preference detection.
 */

import { createContext, useContext, useEffect, useRef, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  superDarkMode: boolean;
  toggleSuperDarkMode: () => void;
  clickHint: number;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Internal component for the spotlight effect.
 */
function SpotlightOverlay() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 9999,
        background: `radial-gradient(circle 350px at ${position.x}px ${position.y}px, transparent 0%, rgba(0,0,0,0.98) 100%)`,
      }}
    />
  );
}

/**
 * ThemeProvider Component
 */
function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const saved = localStorage.getItem("theme") as Theme | null;
  if (saved) return saved;
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return systemDark ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [mounted, setMounted] = useState<boolean | null>(null);
  const [superDarkMode, setSuperDarkMode] = useState(false);
  const [clickHint, setClickHint] = useState(0);
  const clickCount = useRef(0);
  const clickTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
    }
  }, [theme, mounted]);

  useEffect(() => {
    if (superDarkMode) {
      document.body.classList.add("super-dark-mode");
    } else {
      document.body.classList.remove("super-dark-mode");
    }
  }, [superDarkMode]);

  const toggleTheme = () => {
    if (superDarkMode) {
      setSuperDarkMode(false);
      setClickHint(0);
      clickCount.current = 0;
      return;
    }

    setTheme((prev) => (prev === "light" ? "dark" : "light"));

    clickCount.current += 1;
    setClickHint(clickCount.current);

    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
    }

    if (clickCount.current >= 5) {
      setSuperDarkMode(true);
      clickCount.current = 0;
      setClickHint(0);
      setTheme("dark");
    } else {
      clickTimer.current = setTimeout(() => {
        clickCount.current = 0;
        setClickHint(0);
      }, 1000);
    }
  };

  const toggleSuperDarkMode = () => setSuperDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        superDarkMode,
        toggleSuperDarkMode,
        clickHint,
      }}
    >
      {mounted === null ? null : children}
      {superDarkMode && <SpotlightOverlay />}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
