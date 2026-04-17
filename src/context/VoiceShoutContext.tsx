"use client";

import { useVoiceShout, type UseVoiceShoutReturn } from "@/hooks/useVoiceShout";
import { createContext, useContext, useEffect } from "react";

const VoiceShoutContext = createContext<UseVoiceShoutReturn | null>(null);

/**
 * Provides global voice shout state (Skyrim Thu'um easter egg).
 * Listens for the `fus:activate` DOM event dispatched by the terminal
 * and automatically starts the microphone session.
 */
export function VoiceShoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const shout = useVoiceShout();

  useEffect(() => {
    const handler = () => shout.startListening();
    window.addEventListener("fus:activate", handler);
    return () => window.removeEventListener("fus:activate", handler);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shout.startListening]);

  return (
    <VoiceShoutContext.Provider value={shout}>
      {children}
    </VoiceShoutContext.Provider>
  );
}

/** Consume the global voice shout state. Must be inside VoiceShoutProvider. */
export function useVoiceShoutContext(): UseVoiceShoutReturn {
  const ctx = useContext(VoiceShoutContext);
  if (!ctx)
    throw new Error(
      "useVoiceShoutContext must be used inside VoiceShoutProvider",
    );
  return ctx;
}
