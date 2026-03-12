"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useKonamiCode(action: () => void) {
  useEffect(() => {
    let input: string[] = [];
    const KONAMI_CODE = [
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

    const handleKeyDown = (e: KeyboardEvent) => {
      // Add the key to the buffer
      input.push(e.key);
      if (input.length > KONAMI_CODE.length) {
        input.shift();
      }

      // Check for match
      if (JSON.stringify(input) === JSON.stringify(KONAMI_CODE)) {
        action();
        input = []; // Reset
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [action]);
}

export default function SecretGateway() {
  const router = useRouter();

  // We use a separate effect for the Konami listener
  useEffect(() => {
    let input: string[] = [];
    const KONAMI_CODE = [
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

    const handleKeyDown = (e: KeyboardEvent) => {
      // Add the key to the buffer
      input.push(e.key);
      if (input.length > KONAMI_CODE.length) {
        input.shift();
      }

      // Check for match
      if (JSON.stringify(input) === JSON.stringify(KONAMI_CODE)) {
        router.push("/secrets");
        input = []; // Reset
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return null; // Render nothing visible
}
