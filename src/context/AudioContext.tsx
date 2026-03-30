"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface AudioContextType {
  isEnabled: boolean;
  isMuted: boolean;
  isPlaying: boolean;
  isStarting: boolean;
  currentTrack: string;
  availableTracks: string[];
  toggleAudio: () => void;
  toggleMute: () => void;
  playTrack: (track: string) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  playClick: () => void;
  playHover: () => void;
  playSuccess: () => void;
  playError: () => void;
  playType: () => void;
  playCommand: () => void;
  playEasterEgg: (type: string) => void;
  playGlitch: () => void;
  playLightOn: () => void;
  requestAudioAccess: () => Promise<void>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

type SoundType =
  | "click"
  | "hover"
  | "success"
  | "error"
  | "type"
  | "command"
  | "glitch"
  | "light";

interface SoundConfig {
  frequency: number;
  duration: number;
  type: OscillatorType;
  volume: number;
}

const SOUNDS: Record<SoundType, SoundConfig> = {
  click: { frequency: 800, duration: 0.04, type: "sine", volume: 0.12 },
  hover: { frequency: 600, duration: 0.02, type: "sine", volume: 0.06 },
  success: { frequency: 523.25, duration: 0.06, type: "sine", volume: 0.1 },
  error: { frequency: 180, duration: 0.1, type: "sawtooth", volume: 0.08 },
  type: { frequency: 1200, duration: 0.015, type: "sine", volume: 0.04 },
  command: { frequency: 440, duration: 0.03, type: "triangle", volume: 0.06 },
  glitch: { frequency: 200, duration: 0.15, type: "sawtooth", volume: 0.15 },
  light: { frequency: 880, duration: 0.12, type: "sine", volume: 0.1 },
};

const EASTER_EGG_SOUNDS: Record<string, number> = {
  playbook: 440,
  legendary: 587.33,
  pickle_rick: 880,
  wubba: 146.83,
  ragnar: 196,
  skol: 293.66,
  theme_toggle: 220,
  konami: 330,
};

const AVAILABLE_TRACKS = [
  { id: "glass-canopy", name: "Glass Canopy", file: "/audio/Glass_Canopy.mp3" },
  {
    id: "gravity-deep",
    name: "Gravity in the Deep",
    file: "/audio/Gravity_in_the_Deep.mp3",
  },
  {
    id: "weight-light",
    name: "The Weight of Light",
    file: "/audio/The_Weight_of_Light.mp3",
  },
];

const MUSIC_VOLUME = 0.1;

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(AVAILABLE_TRACKS[0].file);

  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const glitchAudioRef = useRef<HTMLAudioElement | null>(null);
  const lightAudioRef = useRef<HTMLAudioElement | null>(null);
  const isInitializedRef = useRef(false);

  const initAudio = useCallback(() => {
    if (isInitializedRef.current) return;

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      audioContextRef.current = new AudioCtx();
      masterGainRef.current = audioContextRef.current.createGain();
      masterGainRef.current.gain.value = 0.5;
      masterGainRef.current.connect(audioContextRef.current.destination);

      glitchAudioRef.current = new Audio("/audio/glitch_classified.wav");
      glitchAudioRef.current.volume = 0.3;

      lightAudioRef.current = new Audio("/audio/light_on.wav");
      lightAudioRef.current.volume = 0.2;

      isInitializedRef.current = true;
    } catch (e) {
      console.error("Failed to initialize audio:", e);
    }
  }, []);

  const playSound = useCallback(
    (type: SoundType) => {
      if (isMuted || !audioContextRef.current || !masterGainRef.current) return;

      try {
        const ctx = audioContextRef.current;
        const config = SOUNDS[type];

        const oscillator = ctx.createOscillator();
        const soundGain = ctx.createGain();

        oscillator.type = config.type;
        oscillator.frequency.setValueAtTime(config.frequency, ctx.currentTime);

        soundGain.gain.setValueAtTime(config.volume, ctx.currentTime);
        soundGain.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + config.duration,
        );

        oscillator.connect(soundGain);
        soundGain.connect(masterGainRef.current);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + config.duration);
      } catch {
        // Silent fail
      }
    },
    [isMuted],
  );

  const playGlitch = useCallback(() => {
    if (isMuted || !glitchAudioRef.current) return;
    glitchAudioRef.current.currentTime = 0;
    glitchAudioRef.current.play().catch(() => {});
  }, [isMuted]);

  const playLightOn = useCallback(() => {
    if (isMuted || !lightAudioRef.current) return;
    lightAudioRef.current.currentTime = 0;
    lightAudioRef.current.play().catch(() => {});
  }, [isMuted]);

  const startMusic = useCallback(() => {
    setIsStarting(true);
    if (musicRef.current) {
      musicRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsStarting(false);
        })
        .catch(() => {
          setIsStarting(false);
        });
      return;
    }

    const audio = new Audio(currentTrack);
    audio.loop = true;
    audio.volume = MUSIC_VOLUME;
    audio.preload = "auto";

    audio
      .play()
      .then(() => {
        setIsPlaying(true);
        setIsStarting(false);
      })
      .catch(() => {
        setIsStarting(false);
      });

    musicRef.current = audio;
  }, [currentTrack]);

  const stopMusic = useCallback(() => {
    if (musicRef.current) {
      musicRef.current.pause();
      setIsPlaying(false);
      setIsStarting(false);
    }
  }, []);

  const toggleAudio = useCallback(() => {
    if (!isEnabled) {
      initAudio();
      setIsEnabled(true);
      setTimeout(() => startMusic(), 100);
    } else {
      if (isPlaying || isStarting) {
        stopMusic();
      } else {
        startMusic();
      }
    }
  }, [isEnabled, isPlaying, isStarting, initAudio, startMusic, stopMusic]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const newMuted = !prev;
      if (musicRef.current) {
        musicRef.current.volume = newMuted ? 0 : MUSIC_VOLUME;
      }
      return newMuted;
    });
  }, []);

  const playTrack = useCallback(
    (track: string) => {
      initAudio();
      setCurrentTrack(track);

      if (musicRef.current) {
        musicRef.current.src = track;
        musicRef.current.load();
        if (isEnabled && !isMuted) {
          musicRef.current.play().catch(() => {});
        }
      }
    },
    [initAudio, isEnabled, isMuted],
  );

  const nextTrack = useCallback(() => {
    const currentIndex = AVAILABLE_TRACKS.findIndex(
      (t) => t.file === currentTrack,
    );
    const nextIndex = (currentIndex + 1) % AVAILABLE_TRACKS.length;
    playTrack(AVAILABLE_TRACKS[nextIndex].file);
  }, [currentTrack, playTrack]);

  const prevTrack = useCallback(() => {
    const currentIndex = AVAILABLE_TRACKS.findIndex(
      (t) => t.file === currentTrack,
    );
    const prevIndex =
      (currentIndex - 1 + AVAILABLE_TRACKS.length) % AVAILABLE_TRACKS.length;
    playTrack(AVAILABLE_TRACKS[prevIndex].file);
  }, [currentTrack, playTrack]);

  const requestAudioAccess = useCallback(async () => {
    initAudio();
    setIsEnabled(true);
    setTimeout(() => startMusic(), 100);
  }, [initAudio, startMusic]);

  const playEasterEgg = useCallback(
    (type: string) => {
      if (isMuted || !audioContextRef.current || !masterGainRef.current) return;

      const freq = EASTER_EGG_SOUNDS[type] || 440;

      try {
        const ctx = audioContextRef.current;
        const oscillator = ctx.createOscillator();
        const soundGain = ctx.createGain();

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
          freq * 1.5,
          ctx.currentTime + 0.1,
        );
        oscillator.frequency.exponentialRampToValueAtTime(
          freq * 2,
          ctx.currentTime + 0.2,
        );

        soundGain.gain.setValueAtTime(0.12, ctx.currentTime);
        soundGain.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + 0.4,
        );

        oscillator.connect(soundGain);
        soundGain.connect(masterGainRef.current);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.4);
      } catch {
        // Silent fail
      }
    },
    [isMuted],
  );

  useEffect(() => {
    return () => {
      if (musicRef.current) {
        musicRef.current.pause();
        musicRef.current = null;
      }
    };
  }, []);

  return (
    <AudioContext.Provider
      value={{
        isEnabled,
        isMuted,
        isPlaying,
        isStarting,
        currentTrack,
        availableTracks: AVAILABLE_TRACKS.map((t) => t.name),
        toggleAudio,
        toggleMute,
        playTrack,
        nextTrack,
        prevTrack,
        playClick: () => playSound("click"),
        playHover: () => playSound("hover"),
        playSuccess: () => playSound("success"),
        playError: () => playSound("error"),
        playType: () => playSound("type"),
        playCommand: () => playSound("command"),
        playEasterEgg,
        playGlitch,
        playLightOn,
        requestAudioAccess,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
