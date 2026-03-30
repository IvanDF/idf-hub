// src/components/layout/MobileNav.tsx
"use client";

import { useTheme } from "@/context/ThemeContext";
import { useAudio } from "@/context/AudioContext";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./layout.module.scss";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { playLightOn } = useAudio();

  // Close menu when route changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(false);
  }, [pathname]);

  // Lock scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Animation variants
  const backdropVariants = {
    closed: { opacity: 0, pointerEvents: "none" as const },
    open: { opacity: 1, pointerEvents: "auto" as const }
  };

  const sidebarVariants = {
    closed: { x: "100%", transition: { type: "tween" as const, duration: 0.3 } },
    open: { 
      x: 0, 
      transition: { 
        type: "spring" as const, 
        stiffness: 300, 
        damping: 30,
        staggerChildren: 0.1,
        delayChildren: 0.2
      } 
    }
  };

  const itemVariants = {
    closed: { x: 20, opacity: 0 },
    open: { x: 0, opacity: 1 }
  };

  const openTerminal = () => {
    const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true });
    window.dispatchEvent(event);
    setIsOpen(false);
  };

  return (
    <>
      {/* Header - Always visible on mobile */}
      <header className={styles.mobileHeader}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/assets/idf-logo.svg"
            alt="iDF"
            width={28}
            height={28}
            className={theme === 'light' ? styles.logoInvert : ''}
          />
        </Link>
        
        <button 
          className={`${styles.burger} ${isOpen ? styles.open : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </header>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.mobileBackdrop}
            initial="closed"
            animate="open"
            exit="closed"
            variants={backdropVariants}
            onClick={toggleMenu} // Close when clicking outside
          >
            <motion.div 
              className={styles.mobileSidebar}
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside sidebar
            >
              
              <div className={styles.sidebarContent}>
                {/* Command Palette Trigger */}
                <motion.button 
                  className={styles.terminalBtn}
                  onClick={openTerminal}
                  variants={itemVariants}
                >
                  <span className={styles.prompt}>&lt;_</span>
                  <span className={styles.label}>cmd</span>
                  <span className={styles.shortcutHint}>cmd + k</span>
                </motion.button>

                {/* Footer Section (Theme & Socials) */}
                <motion.div className={styles.sidebarFooter} variants={itemVariants}>
                    <div className={styles.divider} />
                    
                    <button onClick={() => { playLightOn(); toggleTheme(); }} className={styles.themeToggle}>
                        {theme === 'dark' ? 'LIGHT MODE' : 'DARK MODE'}
                    </button>

                    <div className={styles.socials}>
                        <a href="https://github.com/IvanDF" target="_blank" rel="noopener noreferrer">GH</a>
                        <a href="https://www.linkedin.com/in/ivandf/" target="_blank" rel="noopener noreferrer">LI</a>
                        <a href="https://www.instagram.com/idf.me/" target="_blank" rel="noopener noreferrer">IG</a>
                    </div>
                    
                    <div className={styles.copyright}>
                        © 2024 IDF
                    </div>
                </motion.div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
