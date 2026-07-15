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
  /** While the snake game runs, Escape belongs to the game, not the overlay. */
  gameActive?: boolean;
};

/**
 * Registers global keyboard shortcuts for the terminal:
 * Cmd/Ctrl+K to toggle, D for theme, Escape to close, 1/2/3 for navigation.
 * Also listens for the name-click secret (dispatched by SecretName).
 */
export function useTerminalKeyboard({
  isOpen,
  setIsOpen,
  toggleTheme,
  playLightOn,
  router,
  discoverEgg,
  playEasterEgg,
  gameActive = false,
}: UseTerminalKeyboardOptions): void {
  // Name-click secret: SecretName (rail + About hero) fires this after three
  // quick clicks on "IVAN DEL FATTI" — discover the egg and open the archive.
  useEffect(() => {
    const handleNameSecret = () => {
      discoverEgg("name_click");
      playEasterEgg("konami");
      router.push("/secrets");
    };
    window.addEventListener("idf:name-secret", handleNameSecret);
    return () => window.removeEventListener("idf:name-secret", handleNameSecret);
  }, [discoverEgg, playEasterEgg, router]);

  // Global shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isToggle = (e.metaKey || e.ctrlKey) && e.key === "k";
      const isTyping =
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement;
      // While typing, only the palette toggle and Escape stay global —
      // otherwise the terminal could never be closed from its own input.
      if (isTyping && !isToggle && e.key !== "Escape") return;
      if (isToggle) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        return;
      }
      if (e.key === "Escape") {
        // The snake game owns Escape (exits to the prompt, not the site).
        if (isOpen && !gameActive) setIsOpen(false);
        return;
      }
      if (isTyping) return;
      // The snake game owns the rest of the keyboard too: "d" is WASD-right,
      // digits would navigate away mid-game.
      if (gameActive) return;
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
      if (e.key === "1" && !e.metaKey && !e.ctrlKey) router.push("/");
      if (e.key === "2" && !e.metaKey && !e.ctrlKey) router.push("/lab");
      if (e.key === "3" && !e.metaKey && !e.ctrlKey) router.push("/about");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, toggleTheme, gameActive]);
}
