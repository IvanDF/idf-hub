'use client';

import styles from './layout.module.scss';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Magnetic from '@/components/ui/Magnetic';

export default function LeftColumn() {
  const pathname = usePathname();

  return (
    <aside className={styles.leftColumn}>
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
            href="/portfolio" 
            className={`${styles.navLink} ${pathname === '/portfolio' ? styles.active : ''}`}
          >
            PORTFOLIO
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
        <div className={styles.name}>IVAN DEL FATTI</div>
        <div className={styles.role}>CREATIVO</div>
      </footer>
    </aside>
  );
}
