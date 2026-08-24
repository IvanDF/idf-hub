import styles from "./PageTransition.module.scss";

/**
 * Page wrapper. Deliberately renders no entrance animation: this component
 * wraps every route, and a framer initial={{opacity:0}} here gated the whole
 * page's visibility on the mount animation completing. On WebKit (Safari
 * desktop + every iOS browser) that animation could be dropped mid-flight,
 * pinning the entire page at opacity:0 — content vanished on load/scroll and
 * never came back. Resting state must be visible; animations can be layered
 * back later in a way that rests at opacity:1.
 */
export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={styles.container}>{children}</div>;
}
