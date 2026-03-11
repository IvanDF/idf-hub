"use client";

import { useTheme } from "@/context/ThemeContext";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./layout.module.scss";

/**
 * MobileNav Component
 *
 * Completely overhauled to match Desktop Layout structure but adapted for mobile.
 * Uses Framer Motion for smooth transitions.
 *
 * Structure:
 * - Header: Logo (Left) + Burger (Right)
 * - Overlay: Full screen
 *   - Left Column: Navigation Links
 *   - Right Column: Theme Toggle, Socials, Footer Info
 */
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

  return (
    <>
      {/* Fixed Header (Always Visible) */}
      <header className={styles.mobileHeader}>
        <Link href="/" className={styles.logo} aria-label="iDF Home">
          <Image
            src="/assets/idf-logo.svg"
            alt="iDF Logo"
            width={40}
            height={40}
            className={theme === "dark" ? styles.logoInvert : ""}
          />
        </Link>
        <div
          className={`${styles.burger} ${isOpen ? styles.open : ""}`}
          onClick={toggleMenu}
          role="button"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          tabIndex={0}
          style={{ cursor: "pointer", pointerEvents: "auto" }}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </header>

      {/* Full Screen Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.mobileMenuOverlay}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "tween",
              duration: 0.4,
              ease: [0.16, 1, 0.3, 1],
            }} // Apple-like ease
          >
            {/* Inner Container to mimic Desktop Grid */}
            <div className={styles.mobileMenuContent}>
              {/* Top Section: Navigation (Mimics Left Column) */}
              <div className={styles.mobileNavSection}>
                <nav className={styles.navLinks}>
                  <Link
                    href="/"
                    className={`${styles.navLink} ${pathname === "/" ? styles.active : ""}`}
                  >
                    HOME
                  </Link>
                  <Link
                    href="/portfolio"
                    className={`${styles.navLink} ${pathname === "/portfolio" ? styles.active : ""}`}
                  >
                    PORTFOLIO
                  </Link>
                  <Link
                    href="/about"
                    className={`${styles.navLink} ${pathname === "/about" ? styles.active : ""}`}
                  >
                    ABOUT
                  </Link>
                </nav>
              </div>

              {/* Middle Section: Center Logo (Optional, can keep for branding) */}
              <div className={styles.mobileCenterLogo}>
                <div className={styles.logoCircle}>
                  <Image
                    src="/assets/idf-logo.svg"
                    alt=""
                    width={100}
                    height={100}
                    className={styles.logoImage}
                  />
                </div>
              </div>

              {/* Bottom Section: Theme & Footer (Mimics Right Column) */}
              <div className={styles.mobileFooterSection}>
                {/* Theme Toggle */}
                <div
                  role="button"
                  className={styles.themeToggle}
                  onClick={toggleTheme}
                >
                  <span>{theme === "dark" ? "LIGHT-MODE" : "DARK-MODE"}</span>
                  <div className={styles.themeIcon}>
                    {theme === "dark" ? (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="5"></circle>
                        <line x1="12" y1="1" x2="12" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="23"></line>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                        <line
                          x1="18.36"
                          y1="18.36"
                          x2="19.78"
                          y2="19.78"
                        ></line>
                        <line x1="1" y1="12" x2="3" y2="12"></line>
                        <line x1="21" y1="12" x2="23" y2="12"></line>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                      </svg>
                    ) : (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                      </svg>
                    )}
                  </div>
                </div>

                <div className={styles.divider} />

                {/* Info & Socials */}
                <div className={styles.footerInfo}>
                  <div className={styles.personalInfo}>
                    <span className={styles.name}>IVAN DEL FATTI</span>
                    <span className={styles.role}>CREATIVO</span>
                  </div>

                  <div className={styles.socialsRow}>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        src="/assets/instagram.svg"
                        alt="IG"
                        width={24}
                        height={24}
                        className={styles.socialIcon}
                      />
                    </a>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        src="/assets/linkedin.svg"
                        alt="LI"
                        width={24}
                        height={24}
                        className={styles.socialIcon}
                      />
                    </a>
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        src="/assets/github.svg"
                        alt="GH"
                        width={24}
                        height={24}
                        className={styles.socialIcon}
                      />
                    </a>
                    <a
                      href="https://figma.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        src="/assets/figma.svg"
                        alt="FI"
                        width={24}
                        height={24}
                        className={styles.socialIcon}
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
