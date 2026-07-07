"use client";

import { PROJECTS } from "@/data/projects";
import type { Project } from "@/types/project";
import Text from "@/components/atoms/text";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import styles from "./page.module.scss";

type FilterGroup = "all" | "code" | "design" | "craft" | "lab";

const FILTERS: { label: string; group: FilterGroup }[] = [
  { label: "All", group: "all" },
  { label: "Code", group: "code" },
  { label: "Design", group: "design" },
  { label: "Craft", group: "craft" },
  { label: "Lab", group: "lab" },
];

function matchesGroup(p: Project, group: FilterGroup): boolean {
  if (group === "all") return true;
  const c = p.category;
  if (group === "code") return c === "DEV" || c === "VSCODE";
  if (group === "design") return c === "CREATIVE";
  if (group === "craft") return c === "MAKER" || c === "APPLE";
  if (group === "lab") return c === "EXPERIMENT" || c === "CODEPEN";
  return false;
}

const LIVE = PROJECTS.filter((p) => p.status === "live");
const ARCHIVED = PROJECTS.filter((p) => p.status !== "live");

export default function Lab() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showArchived, setShowArchived] = useState(false);

  const rawFilter = searchParams.get("filter") as FilterGroup | null;
  const filter: FilterGroup =
    rawFilter && FILTERS.some((f) => f.group === rawFilter) ? rawFilter : "all";

  const setFilter = (group: FilterGroup) => {
    const p = new URLSearchParams(searchParams.toString());
    if (group === "all") p.delete("filter");
    else p.set("filter", group);
    const q = p.toString();
    router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
  };

  // Real links instead of router.push-on-click: the detail pages are static,
  // so Link prefetches them in-viewport and navigation is instant.
  const hrefFor = (project: Project) => {
    const p = new URLSearchParams();
    if (filter !== "all") p.set("filter", filter);
    const q = p.toString();
    return q ? `/lab/${project.id}?${q}` : `/lab/${project.id}`;
  };

  // Experiments live in the same list as client/product work but carry a
  // subtle visual marker so the two read differently at a glance.
  const kindOf = (p: Project) =>
    matchesGroup(p, "lab") ? "experiment" : undefined;

  const live = LIVE.filter((p) => matchesGroup(p, filter));
  const archived = ARCHIVED.filter((p) => matchesGroup(p, filter));

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <motion.h1
          className={styles.pageTitle}
          initial={{ scaleY: 1.08, y: -14, opacity: 0 }}
          animate={{ scaleY: 1, y: 0, opacity: 1 }}
          transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <Text as="span" variant="inherit">Work</Text>
        </motion.h1>
        <div className={styles.headerRow}>
          <Text as="p" variant="mono" className={styles.pageSubtitle}>Design, code, and craft.</Text>
          <Text as="span" variant="label" className={styles.headerCount}>
            {LIVE.length} live · {ARCHIVED.length} archived
          </Text>
        </div>
      </header>

      <nav className={styles.filters} aria-label="Project filters">
        {FILTERS.map(({ label, group }) => (
          <button
            key={group}
            onClick={() => setFilter(group)}
            className={`${styles.filterBtn} ${filter === group ? styles.active : ""}`}
            aria-pressed={filter === group}
          >
            {label}
          </button>
        ))}
      </nav>

      <motion.div
        key={filter}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <div className={styles.projectList} role="list">
          {live.map((project, i) => (
            <Link
              key={project.id}
              role="listitem"
              className={styles.projectRow}
              data-kind={kindOf(project)}
              href={hrefFor(project)}
            >
              <span className={styles.rowNum}>{String(i + 1).padStart(2, "0")}</span>
              <div className={styles.rowMain}>
                <span className={styles.rowTitle}>{project.title}</span>
                <span className={styles.rowDesc}>{project.description}</span>
              </div>
              <div className={styles.rowMeta}>
                <span className={styles.rowCategory}>{project.category}</span>
                <span className={styles.rowYear}>{project.year}</span>
                {/* ︎ forces text presentation: without it iOS falls back
                    to Apple Color Emoji when the webfont lacks the glyph */}
                {project.status === "live" && <span className={styles.rowArrow}>{"↗︎"}</span>}
              </div>
            </Link>
          ))}
        </div>

        {live.length === 0 && <Text as="p" variant="body" className={styles.empty}>Nothing here yet.</Text>}

        {archived.length > 0 && (
          <div className={styles.archive}>
            <button
              className={styles.archiveToggle}
              onClick={() => setShowArchived((v) => !v)}
              aria-expanded={showArchived}
            >
              <span aria-hidden>{showArchived ? "−" : "+"}</span>
              Archive
              <span className={styles.archiveCount}>{archived.length}</span>
            </button>

            <AnimatePresence>
              {showArchived && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className={styles.archiveList}
                  role="list"
                >
                  {archived.map((project, i) => (
                    <Link
                      key={project.id}
                      role="listitem"
                      className={`${styles.projectRow} ${styles.archivedRow}`}
                      data-kind={kindOf(project)}
                      href={hrefFor(project)}
                    >
                      <span className={styles.rowNum}>{String(i + 1).padStart(2, "0")}</span>
                      <div className={styles.rowMain}>
                        <span className={styles.rowTitle}>{project.title}</span>
                        <span className={styles.rowDesc}>{project.description}</span>
                      </div>
                      <div className={styles.rowMeta}>
                        <span className={styles.rowCategory}>{project.category}</span>
                        <span className={styles.rowYear}>{project.year}</span>
                      </div>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </main>
  );
}
