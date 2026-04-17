"use client";

import { createContext, useContext } from "react";
import { AudioEngineAPI, useAudioEngine } from "@/hooks/useAudioEngine";

type AudioContextType = AudioEngineAPI;

const AudioContext = createContext<AudioContextType | undefined>(undefined);

/**
 * Context provider that manages ambient music playback and UI sound effects.
 * @param children - React children to receive audio context.
 */
export function AudioProvider({ children }: { children: React.ReactNode }) {
  const engine = useAudioEngine();

  return (
    <AudioContext.Provider value={engine}>
      {children}
    </AudioContext.Provider>
  );
}

/**
 * Hook to access the AudioContext value; must be used within an AudioProvider.
 */
export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}

