"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "@/context/AudioContext";
import styles from "./AudioPrompt.module.scss";

export default function AudioPrompt() {
  const { requestAudioAccess, isEnabled, playClick } = useAudio();
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const hasSeenPrompt = localStorage.getItem("audioPromptSeen");
    if (!hasSeenPrompt) {
      const timer = setTimeout(() => setShowPrompt(true), 3500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = async () => {
    playClick();
    await requestAudioAccess();
    localStorage.setItem("audioPromptSeen", "true");
    setShowPrompt(false);
  };

  const handleDecline = () => {
    playClick();
    localStorage.setItem("audioPromptSeen", "true");
    setShowPrompt(false);
  };

  const shouldShow = showPrompt && !isEnabled;
  
  if (!shouldShow) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className={styles.modal}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <div className={styles.icon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          </div>

          <h2>Immersive Audio</h2>
          <p>Enable ambient soundscapes and interactive audio feedback for a complete experience.</p>

          <div className={styles.features}>
            <span>4 Ambient Tracks</span>
            <span>•</span>
            <span>Sound Effects</span>
          </div>

          <div className={styles.buttons}>
            <button onClick={handleAccept} className={styles.acceptBtn}>
              Enable Audio
            </button>
            <button onClick={handleDecline} className={styles.declineBtn}>
              Maybe Later
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
