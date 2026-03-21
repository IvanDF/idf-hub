'use client';

import { useState } from 'react';
import styles from './layout.module.scss';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Magnetic from '@/components/ui/Magnetic';
import RotatingTitle from '@/components/ui/RotatingTitle';
import GlitchText from '@/components/ui/GlitchText';

export default function LeftColumn() {
  const pathname = usePathname();
  const isLab = pathname.startsWith('/lab');

  return (
    <aside className={`${styles.leftColumn} ${isLab ? styles.autoHide : ''}`}>
      {/* Command Palette Trigger */}
      <nav className={styles.navbar}>
        <Magnetic>
          <button 
            className={styles.terminalLink}
            onClick={() => {
              const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true });
              window.dispatchEvent(event);
            }}
          >
            <span className={styles.prompt}>&lt;_</span>
            <span className={styles.label}>cmd</span>
          </button>
        </Magnetic>
      </nav>

      {/* 2. Divider */}
      <div className={styles.divider}></div>

      {/* 3. Footer: Name + Role */}
      <footer className={styles.footer}>
        <div className={styles.name}>
          <GlitchText text="IVAN DEL FATTI" />
        </div>
        <RotatingTitle className={styles.role} />
      </footer>
    </aside>
  );
}
