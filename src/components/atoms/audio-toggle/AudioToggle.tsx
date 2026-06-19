"use client";

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
      <button
        data-no-stamp
        onClick={handleMainClick}
        className={`${styles.toggle} ${className || ""}`}
        aria-label="Enable audio"
      >
        PLAY
      </button>
    );
  }

  return (
    <div className={`${styles.container} ${className || ""}`}>
      <button
        data-no-stamp
        onClick={handleMainClick}
        className={`${styles.toggle} ${isActuallyPlaying ? styles.playing : ""}`}
        aria-label={isActuallyPlaying ? "Pause music" : "Play music"}
      >
        {isActuallyPlaying ? "PAUSE" : "PLAY"}
      </button>

      <span className={styles.sep}>/</span>

      <button
        data-no-stamp
        onClick={handleMuteClick}
        className={`${styles.muteBtn} ${isMuted ? styles.muted : ""}`}
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? "SOUND" : "MUTE"}
      </button>
    </div>
  );
}
