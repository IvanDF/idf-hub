'use client';

import styles from './layout.module.scss';
import LeftColumn from './LeftColumn';
import RightColumn from './RightColumn';
import MobileNav from './MobileNav';
import Terminal from '@/components/home/Terminal';
import { FutureModeProvider, useFutureMode } from '@/context/FutureModeContext';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isFutureMode } = useFutureMode();
  
  return (
    <div className={`${styles.container} ${isFutureMode ? styles.futureModeActive : ''}`}>
      <Terminal />
      <MobileNav />
      <LeftColumn />
      <main className={styles.main}>
        {children}
      </main>
      <RightColumn />
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <FutureModeProvider>
      <LayoutContent>{children}</LayoutContent>
    </FutureModeProvider>
  );
}
