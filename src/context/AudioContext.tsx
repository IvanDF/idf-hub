"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect } from "react";
import { AudioEngineAPI, sceneForPath, useAudioEngine } from "@/hooks/useAudioEngine";

type AudioContextType = AudioEngineAPI;

const AudioContext = createContext<AudioContextType | undefined>(undefined);

/**
 * Context provider that manages the adaptive soundtrack and UI sound effects.
 * The current route drives the soundtrack scene: navigating morphs the stem
 * mix instead of switching tracks.
 * @param children - React children to receive audio context.
 */
export function AudioProvider({ children }: { children: React.ReactNode }) {
  const engine = useAudioEngine();
  const pathname = usePathname();
  const { setMusicScene } = engine;

  useEffect(() => {
    setMusicScene(sceneForPath(pathname));
  }, [pathname, setMusicScene]);

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

