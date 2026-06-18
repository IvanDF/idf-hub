"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./RotatingTitle.module.scss";

const ROLES = [
  { text: "CREATIVE BY CRAFT", duration: 4000, action: "glitch" },
  { text: "FULL-STACK DEV", duration: 2500, action: "link", value: "https://github.com/IvanDF" },
  { text: "UI/UX DESIGNER", duration: 2500, action: "link", value: "https://www.figma.com/@ivandf" },
  { text: "PROBLEM SOLVER", duration: 2500, action: "route", value: "/secrets" },
];

/**
 * Animated title cycling through professional roles, pausing on hover and navigating on click.
 * @param className - Optional CSS class to apply to the container
 */
export default function RotatingTitle({ className }: { className?: string }) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isPaused) return;

    const currentRole = ROLES[index];
    const timeout = setTimeout(() => {
      setIndex((prev) => (prev + 1) % ROLES.length);
    }, currentRole.duration);

    return () => clearTimeout(timeout);
  }, [index, isPaused]);

  const handleClick = () => {
    const role = ROLES[index];

    if (role.action === "link" && role.value) {
      window.open(role.value, "_blank");
    } else if (role.action === "route" && role.value) {
      router.push(role.value);
    } else if (role.action === "glitch") {
      // Trigger a visual glitch (we can just alert for now or add a class temporarily)
      document.body.classList.add("glitch-active");
      setTimeout(() => document.body.classList.remove("glitch-active"), 500);
    }
  };

  return (
    <div
      className={`${styles.container} ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onClick={handleClick}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className={styles.text}
          whileHover={{ scale: 1.05, color: "var(--color-accent)" }}
        >
          {ROLES[index].text}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
