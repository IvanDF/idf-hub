// src/components/layout/MobileNav.tsx
"use client";

import { useTheme } from "@/context/ThemeContext";
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

  // Close menu when route changes
  useEffect(() => {
    if (isOpen) {
      setIsOpen(false);
    }
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
    closed: { x: "100%", transition: { type: "tween", duration: 0.3 } },
    open: { 
      x: 0, 
      transition: { 
        type: "spring", 
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

  const LINKS = [
    { href: "/", label: "HOME" },
    { href: "/lab", label: "LAB" },
    { href: "/about", label: "ABOUT" }
  ];

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
            className={theme === 'dark' ? styles.logoInvert : ''}
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
                {/* Navigation Links */}
                <nav className={styles.sidebarNav}>
                  {LINKS.map((link) => (
                    <motion.div key={link.href} variants={itemVariants}>
                      <Link
                        href={link.href}
                        className={`${styles.sidebarNavLink} ${pathname === link.href ? styles.active : ''}`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Footer Section (Theme & Socials) */}
                <motion.div className={styles.sidebarFooter} variants={itemVariants}>
                    <div className={styles.divider} />
                    
                    <button onClick={toggleTheme} className={styles.themeToggle}>
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
