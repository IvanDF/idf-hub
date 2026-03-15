'use client';

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
      {/* 1. Navbar: HOME, PORTFOLIO, ABOUT */}
      <nav className={styles.navbar}>
        <Magnetic>
          <Link 
            href="/" 
            className={`${styles.navLink} ${pathname === '/' ? styles.active : ''}`}
          >
            HOME
          </Link>
        </Magnetic>
        <Magnetic>
          <Link 
            href="/lab" 
            className={`${styles.navLink} ${pathname === '/lab' ? styles.active : ''}`}
          >
            LAB
          </Link>
        </Magnetic>
        <Magnetic>
          <Link 
            href="/about" 
            className={`${styles.navLink} ${pathname === '/about' ? styles.active : ''}`}
          >
            ABOUT
          </Link>
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
