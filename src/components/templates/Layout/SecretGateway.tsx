"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SecretGateway() {
  const router = useRouter();

  useEffect(() => {
    // The Konami code is retired: /secrets now opens by triple-clicking the
    // author's name (see SecretName). Typing "time" still time-travels.
    let input: string[] = [];
    const TIME_TRAVEL_CODE = ["t", "i", "m", "e"];

    const handleKeyDown = (e: KeyboardEvent) => {
      input.push(e.key);
      if (input.length > 20) {
        input.shift();
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
