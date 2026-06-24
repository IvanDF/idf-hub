"use client";

import Button from "@/components/atoms/button";
import { useAudio } from "@/context/AudioContext";
import styles from "./AudioToggle.module.scss";

interface AudioToggleProps {
  className?: string;
}

export default function AudioToggle({ className }: AudioToggleProps) {
  const {
    isEnabled,
    isMuted,
    isPlaying,
    isStarting,
    toggleAudio,
    toggleMute,
    playClick,
  } = useAudio();

  const handleMainClick = () => {
    playClick();
    toggleAudio();
  };

  const handleMuteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playClick();
    toggleMute();
  };

  const isActuallyPlaying = isPlaying || isStarting;

  if (!isEnabled) {
    return (
      <Button
        variant="ghost"
        stamp={false}
        onClick={handleMainClick}
        className={className}
        aria-label="Enable audio"
      >
        PLAY
      </Button>
    );
  }

  return (
    <div className={`${styles.container} ${className || ""}`}>
      <Button
        variant="ghost"
        stamp={false}
        onClick={handleMainClick}
        className={isActuallyPlaying ? styles.playing : ""}
        aria-label={isActuallyPlaying ? "Pause music" : "Play music"}
      >
        {isActuallyPlaying ? "PAUSE" : "PLAY"}
      </Button>

      <span className={styles.sep}>/</span>

      <Button
        variant="ghost"
        stamp={false}
        onClick={handleMuteClick}
        className={isMuted ? styles.muted : ""}
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? "SOUND" : "MUTE"}
      </Button>
    </div>
  );
}
