"use client";

import ProjectCard from "@/components/molecules/project-card";
import { PROJECTS } from "@/data/projects";
import type { Project } from "@/types/project";
import { AnimatePresence, motion } from "framer-motion";
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

  const go = (project: Project) => {
    const p = new URLSearchParams();
    if (filter !== "all") p.set("filter", filter);
    const q = p.toString();
    router.push(q ? `/lab/${project.id}?${q}` : `/lab/${project.id}`);
  };

  const live = LIVE.filter((p) => matchesGroup(p, filter));
  const archived = ARCHIVED.filter((p) => matchesGroup(p, filter));

  const showBento = filter === "all";
  const bentoProjects = showBento ? live.slice(0, 3) : [];
  const gridProjects = showBento ? live.slice(3) : live;

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <motion.h1
          className={styles.pageTitle}
          initial={{ scaleY: 1.08, y: -14, opacity: 0 }}
          animate={{ scaleY: 1, y: 0, opacity: 1 }}
          transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
        >
          Work
        </motion.h1>
        <motion.p
          className={styles.pageSubtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.18, duration: 0.5 }}
        >
          Design, code, and craft — selected projects.
        </motion.p>
        <div className={styles.headerMeta}>
          <span>{LIVE.length} live</span>
          <span className={styles.metaDivider}>/</span>
          <span>{ARCHIVED.length} archived</span>
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
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        {/* Bento hero — only on "All" */}
        {showBento && bentoProjects.length > 0 && (
          <section className={styles.bento} aria-label="Featured work">
            {bentoProjects.map((project, i) => (
              <div
                key={project.id}
                className={`${styles.bentoItem} ${styles[`bentoPos${i}`]}`}
              >
                <ProjectCard
                  project={project}
                  onClick={() => go(project)}
                  compact={i > 0}
                />
              </div>
            ))}
          </section>
        )}

        {/* Main grid */}
        {gridProjects.length > 0 && (
          <section className={styles.section}>
            {showBento && (
              <p className={styles.sectionLabel}>More work</p>
            )}
            <div className={styles.grid}>
              {gridProjects.map((project) => (
                <div key={project.id} className={styles.gridItem}>
                  <ProjectCard project={project} onClick={() => go(project)} />
                </div>
              ))}
            </div>
          </section>
        )}

        {live.length === 0 && archived.length === 0 && (
          <p className={styles.empty}>Nothing here yet.</p>
        )}

        {/* Archive */}
        {archived.length > 0 && (
          <div className={styles.archive}>
            <button
              className={styles.archiveToggle}
              onClick={() => setShowArchived((v) => !v)}
              aria-expanded={showArchived}
            >
              <span className={styles.archiveToggleIcon} aria-hidden>
                {showArchived ? "−" : "+"}
              </span>
              {showArchived ? "Hide" : "Show"} archive
              <span className={styles.archiveCount}>{archived.length}</span>
            </button>

            <AnimatePresence>
              {showArchived && (
                <motion.div
                  className={styles.archiveGrid}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {archived.map((project) => (
                    <div key={project.id} className={styles.archiveItem}>
                      <ProjectCard
                        project={project}
                        onClick={() => go(project)}
                        compact
                      />
                    </div>
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
