'use client';

import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';
import styles from './SuperDarkMode.module.scss';

export default function SuperDarkMode() {
  const { theme } = useTheme();
  const [isActive, setIsActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    const activateCamera = async () => {
      try {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraError(false);
        setIsActive(true);
      } catch (err) {
        console.log('Camera access denied or not available');
        setCameraError(true);
        setIsActive(true);
      }
    };

    if (theme === 'light' && isMobile) {
      activateCamera();
    } else {
      setIsActive(false);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [theme, isMobile]);

  if (!isMobile || !isActive) return null;

  return (
    <div className={styles.overlay}>
      <video
        ref={videoRef}
        className={styles.cameraFeed}
        autoPlay
        playsInline
        muted
      />
      <div className={styles.darkLayer} />
      <div className={styles.scanlines} />
    </div>
  );
}
