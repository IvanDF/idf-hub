"use client";

import { useInterfaceSounds } from "@/hooks/useInterfaceSounds";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { usePathname } from "next/navigation";
import styles from "./PageTransition.module.scss";

/**
 * Page wrapper, with an entrance that cannot hide anything.
 *
 * The framer version of this held every route at `initial={{opacity: 0}}` and
 * waited for JavaScript to animate it up. On WebKit that animation could be
 * dropped mid-flight, pinning the whole page at opacity:0 — blank on arrival,
 * and blank forever. The rule that came out of it: the resting state must be
 * visible without JavaScript.
 *
 * So this is a CSS animation with no fill-mode. Before it runs and after it
 * ends the page is simply itself; the motion is added on top and can be lost
 * without costing anything. The pathname key restarts it on navigation.
 */
export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Covers the browsers the CSS path does not reach. No-op where it does.
  useScrollReveal();
  useInterfaceSounds();

  return (
    <div key={pathname} className={styles.container}>
      {children}
    </div>
  );
}
