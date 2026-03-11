'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
import styles from './layout.module.scss';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <header className={styles.mobileHeader}>
        <Link href="/" className={styles.logo}>iDF</Link>
        <div 
          className={`${styles.burger} ${isOpen ? styles.open : ''}`} 
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </header>

      <div className={`${styles.mobileMenu} ${isOpen ? styles.open : ''}`}>
        <nav className={styles.navbar} style={{ alignItems: 'center', gap: '40px' }}>
          <Link 
            href="/" 
            className={`${styles.navLink} ${pathname === '/' ? styles.active : ''}`}
          >
            HOME
          </Link>
          <Link 
            href="/portfolio" 
            className={`${styles.navLink} ${pathname === '/portfolio' ? styles.active : ''}`}
          >
            PORTFOLIO
          </Link>
          <Link 
            href="/about" 
            className={`${styles.navLink} ${pathname === '/about' ? styles.active : ''}`}
          >
            ABOUT
          </Link>
        </nav>

        <div className={styles.divider} style={{ width: '60px', flexGrow: 0, margin: '20px 0' }}></div>

        {/* Theme Toggle */}
        <div 
            className={styles.themeToggle} 
            onClick={toggleTheme}
            style={{ flexDirection: 'column', gap: '8px' }}
        >
            <span style={{ fontSize: '14px' }}>
            {theme === 'light' ? 'DARK-MODE' : 'LIGHT-MODE'}
            </span>
            <div 
            className={styles.toggleSwitch} 
            style={{ 
                justifyContent: theme === 'dark' ? 'flex-end' : 'flex-start',
                borderColor: 'var(--color-divider)'
            }}
            >
            <div style={{ background: 'var(--color-text)' }}></div>
            </div>
        </div>

        {/* Socials */}
        <div className={styles.socials} style={{ marginTop: '20px' }}>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <Image src="/assets/instagram.svg" alt="Instagram" width={24} height={24} style={{ filter: theme === 'dark' ? 'invert(1)' : 'none' }} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <Image src="/assets/linkedin.svg" alt="LinkedIn" width={24} height={24} style={{ filter: theme === 'dark' ? 'invert(1)' : 'none' }} />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            <Image src="/assets/github.svg" alt="GitHub" width={24} height={24} style={{ filter: theme === 'dark' ? 'invert(1)' : 'none' }} />
            </a>
            <a href="https://figma.com" target="_blank" rel="noopener noreferrer">
            <Image src="/assets/figma.svg" alt="Figma" width={24} height={24} style={{ filter: theme === 'dark' ? 'invert(1)' : 'none' }} />
            </a>
        </div>
      </div>
    </>
  );
}
