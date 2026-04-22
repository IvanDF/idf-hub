"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import styles from "./PageTransition.module.scss";

/**
 * Page transition wrapper that animates opacity and vertical position on route changes.
 * Uses Framer Motion for enter/exit animations.
 */
export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={styles.container}
    >
      {children}
    </motion.div>
  );
}
