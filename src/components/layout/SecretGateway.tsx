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

    const TIME_TRAVEL_CODE = [
      "t", "i", "m", "e"
    ];

    const handleKeyDown = (e: KeyboardEvent) => {
      // Add the key to the buffer
      input.push(e.key);
      
      // Limit buffer to max needed length (10 for Konami)
      if (input.length > 20) {
        input.shift();
      }

      // Check for Konami Code match (last 10 keys)
      // We need to compare only the last 10
      const relevantInput = input.slice(-10);
      if (JSON.stringify(relevantInput) === JSON.stringify(KONAMI_CODE)) {
        router.push("/secrets");
        input = []; // Reset
      }

      // Check for 'time' code match (last 4 keys)
      const last4 = input.slice(-4);
      if (JSON.stringify(last4) === JSON.stringify(TIME_TRAVEL_CODE)) {
         router.push("/time-machine");
         input = [];
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return null; // Render nothing visible
}
