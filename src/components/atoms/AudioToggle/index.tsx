"use client";

import { useAudio } from "@/context/AudioContext";
import styles from "./AudioToggle.module.scss";

interface AudioToggleProps {
  className?: string;
}

/**
 * Audio control widget with play/pause and mute toggle buttons.
 * @param className - Optional CSS class to apply to the root element
 */
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

  if (!isEnabled) {
    return (
      <button
        onClick={handleMainClick}
        className={`${styles.toggle} ${className || ""}`}
        aria-label="Enable audio"
        title="Enable audio"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      </button>
    );
  }

  const isActuallyPlaying = isPlaying || isStarting;

  return (
    <div className={`${styles.container} ${className || ""}`}>
      <button
        onClick={handleMainClick}
        className={`${styles.toggle} ${isActuallyPlaying ? styles.playing : ""}`}
        aria-label={isActuallyPlaying ? "Pause music" : "Play music"}
        title={isActuallyPlaying ? "Pause" : "Play"}
      >
        {isActuallyPlaying ? (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        )}
      </button>

      <button
        onClick={handleMuteClick}
        className={`${styles.muteBtn} ${isMuted ? styles.muted : ""}`}
        aria-label={isMuted ? "Unmute" : "Mute"}
        title={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        )}
      </button>
    </div>
  );
}
