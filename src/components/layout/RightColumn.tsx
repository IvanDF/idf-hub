'use client';

import styles from './layout.module.scss';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
import Magnetic from '@/components/ui/Magnetic';

export default function RightColumn() {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className={styles.rightColumn}>
      {/* 1. Theme Toggle */}
      <Magnetic>
        <div className={styles.themeToggle} onClick={toggleTheme} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px' }}>
            {theme === 'light' ? 'DARK-MODE' : 'LIGHT-MODE'}
          </span>
          <div style={{ 
            width: 32, 
            height: 16, 
            borderRadius: 16, 
            border: '1px solid var(--color-divider)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: theme === 'dark' ? 'flex-end' : 'flex-start', 
            padding: '0 2px' 
          }}>
            <div style={{ width: 10, height: 10, background: 'var(--color-text)', borderRadius: '50%' }}></div>
          </div>
        </div>
      </Magnetic>

      {/* 2. Divider */}
      <div className={styles.divider}></div>

      {/* 3. Social List */}
      <div className={styles.socials} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Magnetic>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, border: '1px solid var(--color-divider)', borderRadius: '50%' }}>
            <Image src="/assets/instagram.svg" alt="Instagram" width={20} height={20} style={{ filter: theme === 'dark' ? 'invert(1)' : 'none' }} />
          </a>
        </Magnetic>
        <Magnetic>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, border: '1px solid var(--color-divider)', borderRadius: '50%' }}>
            <Image src="/assets/linkedin.svg" alt="LinkedIn" width={20} height={20} style={{ filter: theme === 'dark' ? 'invert(1)' : 'none' }} />
          </a>
        </Magnetic>
        <Magnetic>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, border: '1px solid var(--color-divider)', borderRadius: '50%' }}>
            <Image src="/assets/github.svg" alt="GitHub" width={20} height={20} style={{ filter: theme === 'dark' ? 'invert(1)' : 'none' }} />
          </a>
        </Magnetic>
        <Magnetic>
          <a href="https://figma.com" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, border: '1px solid var(--color-divider)', borderRadius: '50%' }}>
            <Image src="/assets/figma.svg" alt="Figma" width={20} height={20} style={{ filter: theme === 'dark' ? 'invert(1)' : 'none' }} />
          </a>
        </Magnetic>
      </div>
    </aside>
  );
}
