"use client";

import { useEffect } from "react";

type UseTerminalKeyboardOptions = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleTheme: () => void;
  playLightOn: () => void;
  router: { push: (href: string) => void };
  discoverEgg: (eggId: string) => void;
  playEasterEgg: (id: string) => void;
};

/**
 * Registers global keyboard shortcuts for the terminal:
 * Cmd/Ctrl+K to toggle, D for theme, Escape to close, 1/2 for navigation.
 * Also listens for the Konami code easter egg.
 */
export function useTerminalKeyboard({
  isOpen,
  setIsOpen,
  toggleTheme,
  playLightOn,
  router,
  discoverEgg,
  playEasterEgg,
}: UseTerminalKeyboardOptions): void {
  // Konami code
  useEffect(() => {
    const KONAMI = [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "b",
      "a",
    ];
    let pos = 0;
    const handleKonami = (e: KeyboardEvent) => {
      if (e.key === KONAMI[pos]) {
        pos++;
        if (pos === KONAMI.length) {
          pos = 0;
          discoverEgg("konami");
          playEasterEgg("konami");
        }
      } else {
        pos = e.key === KONAMI[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", handleKonami);
    return () => window.removeEventListener("keydown", handleKonami);
  }, [discoverEgg, playEasterEgg]);

  // Global shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (
        (e.key === "d" || e.key === "D") &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey
      ) {
        e.preventDefault();
        playLightOn();
        toggleTheme();
      }
      if (e.key === "Escape" && isOpen) setIsOpen(false);
      if (e.key === "1" && !e.metaKey && !e.ctrlKey) router.push("/");
      if (e.key === "2" && !e.metaKey && !e.ctrlKey) router.push("/lab");
      if (e.key === "3" && !e.metaKey && !e.ctrlKey) router.push("/about");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, toggleTheme]);
}
