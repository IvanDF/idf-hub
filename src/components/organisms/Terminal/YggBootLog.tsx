"use client";

import { YGG_REALMS } from "@/data/yggdrasil";
import { DESIGN_SYSTEM } from "@/styles/design-system";
import { motion } from "framer-motion";
import styles from "./Terminal.module.scss";

// Long enough to fill any line width the dots are asked to cover, then
// clipped by the flex box. Fixed-count padding breaks the moment a realm's
// name is longer than the one it was tuned against; this does not.
const DOT_FILL = ".".repeat(60);

const BRANCHES = YGG_REALMS.filter((r) => r.layer === "branches");

/**
 * What `ygg` draws when it switches the panel on: every branch of the tree
 * checking in, top to bottom, the order the Nine Realms map reads them in.
 *
 * `MotionProvider` sets framer's `reducedMotion="user"` app-wide, so anyone
 * who has told their OS they want less motion gets this fully drawn on the
 * first frame, not a slower version of the same stagger.
 */
export default function YggBootLog() {
  return (
    <motion.ul
      className={styles.bootLog}
      aria-label={`${BRANCHES.length} services, all active`}
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: DESIGN_SYSTEM.motion.duration.instant } },
      }}
    >
      {BRANCHES.map((r) => (
        <motion.li
          key={r.id}
          className={styles.bootLine}
          variants={{ hidden: { opacity: 0, x: -6 }, visible: { opacity: 1, x: 0 } }}
          transition={{ duration: DESIGN_SYSTEM.motion.duration.base, ease: DESIGN_SYSTEM.motion.ease.standard }}
        >
          <span className={styles.bootOk} aria-hidden="true">
            [ok]
          </span>
          <span className={styles.bootRune} aria-hidden="true">
            {r.rune}
          </span>
          <span className={styles.bootName}>{r.name}</span>
          <span className={styles.bootDots} aria-hidden="true">
            {DOT_FILL}
          </span>
          <span className={styles.bootStatus}>active</span>
        </motion.li>
      ))}
      <motion.li
        className={styles.bootSummary}
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        transition={{ duration: DESIGN_SYSTEM.motion.duration.slow }}
      >
        {BRANCHES.length} services · 0 ports open{" "}
        <span className={styles.bootCursor} aria-hidden="true">
          ▊
        </span>
      </motion.li>
    </motion.ul>
  );
}
