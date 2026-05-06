"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SecretGateway() {
  const router = useRouter();

  useEffect(() => {
    let input: string[] = [];
    const KONAMI_CODE = [
      "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
      "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
      "b", "a",
    ];
    const TIME_TRAVEL_CODE = ["t", "i", "m", "e"];

    const handleKeyDown = (e: KeyboardEvent) => {
      input.push(e.key);
      if (input.length > 20) {
        input.shift();
      }

      const last10 = input.slice(-10);
      if (JSON.stringify(last10) === JSON.stringify(KONAMI_CODE)) {
        router.push("/secrets");
        input = [];
      }

      const last4 = input.slice(-4);
      if (JSON.stringify(last4) === JSON.stringify(TIME_TRAVEL_CODE)) {
         router.push("/time-machine");
         input = [];
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return null;
}
