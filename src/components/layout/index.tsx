import styles from './layout.module.scss';
import LeftColumn from './LeftColumn';
import RightColumn from './RightColumn';
import MobileNav from './MobileNav';
import Terminal from '@/components/home/Terminal';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.container}>
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
