"use client";

import Button from "@/components/atoms/button";
import { useAudio } from "@/context/AudioContext";
import styles from "./AudioToggle.module.scss";
import { useAudioNudge } from "./useAudioNudge";

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
  const nudge = useAudioNudge(isEnabled);

  if (!isEnabled) {
    return (
      <span
        data-no-sound
        className={`${styles.nudgeAnchor} ${className || ""}`}
        onPointerEnter={nudge.reveal}
      >
        <Button
          variant="ghost"
          stamp={false}
          onClick={() => {
            nudge.dismiss();
            handleMainClick();
          }}
          className={nudge.pulsing ? styles.beckoning : ""}
          aria-label="Enable audio"
        >
          PLAY
        </Button>

        {nudge.visible && (
          <span className={styles.bubble} role="status">
            This place has a soundtrack.
            <button
              type="button"
              className={styles.bubbleDismiss}
              onClick={nudge.dismiss}
              aria-label="Dismiss"
            >
              ×
            </button>
          </span>
        )}
      </span>
    );
  }

  return (
    <div data-no-sound className={`${styles.container} ${className || ""}`}>
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
