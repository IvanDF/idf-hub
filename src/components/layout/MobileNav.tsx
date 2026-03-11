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
    if (isOpen) {
      // eslint-disable-next-line
      setIsOpen(false);
    }
  }, [pathname, isOpen]);

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
          className={styles.burger} 
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </header>

      <div className={`${styles.mobileMenu} ${isOpen ? styles.open : ''}`}>
        
        {/* Menu Header: Close Button (Left) & Theme Toggle (Right) */}
        <div className={styles.menuHeader}>
          <button className={styles.closeButton} onClick={toggleMenu}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div className={styles.themeToggle} onClick={toggleTheme}>
            <span>{theme === 'dark' ? 'LIGHT-MODE' : 'DARK-MODE'}</span>
            <div className={styles.themeIcon}>
              {theme === 'dark' ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </div>
          </div>
        </div>

        <div className={styles.menuBody}>
          {/* Navigation Links (Left) */}
          <nav className={styles.navLinks}>
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

          {/* Large Center Logo */}
            <div className={styles.centerLogo}>
             <div className={styles.logoCircle}>
               <Image 
                 src="/assets/idf-logo.svg" 
                 alt="iDF Logo" 
                 width={120} 
                 height={120}
                 className={styles.logoImage}
               />
             </div>
          </div>
        </div>

        {/* Footer Info & Socials */}
        <div className={styles.menuFooter}>
          <div className={styles.personalInfo}>
            <span className={styles.name}>IVAN DEL FATTI</span>
            <span className={styles.role}>CREATIVO</span>
          </div>

          <div className={styles.socialsRow}>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <Image src="/assets/instagram.svg" alt="Instagram" width={24} height={24} className={styles.socialIcon} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <Image src="/assets/linkedin.svg" alt="LinkedIn" width={24} height={24} className={styles.socialIcon} />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Image src="/assets/github.svg" alt="GitHub" width={24} height={24} className={styles.socialIcon} />
            </a>
            <a href="https://figma.com" target="_blank" rel="noopener noreferrer">
              <Image src="/assets/figma.svg" alt="Figma" width={24} height={24} className={styles.socialIcon} />
            </a>
          </div>
        </div>

      </div>
    </>
  );
}
