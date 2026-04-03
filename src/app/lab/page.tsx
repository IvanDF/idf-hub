"use client";

import ProjectCard from "@/components/portfolio/ProjectCard";
import { PROJECTS } from "@/data/projects";
import { ProjectCategory } from "@/types/project";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./page.module.scss";

const FILTERS: (ProjectCategory | "ALL")[] = [
  "ALL",
  "DEV",
  "VSCODE",
  "EXPERIMENT",
];

export default function Lab() {
  const router = useRouter();
  const [filter, setFilter] = useState<ProjectCategory | "ALL">("ALL");

  const filteredProjects = PROJECTS.filter((project) => {
    if (filter === "ALL") return true;
    return project.category === filter;
  });

  const liveCount = PROJECTS.filter(
    (project) => project.status === "live",
  ).length;
  const inProgressCount = PROJECTS.filter(
    (project) => project.status === "in-progress",
  ).length;

  return (
    <main className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          Research Lab
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Experimental playground. Concepts, prototypes, and failures.
        </motion.p>

        <div className={styles.quickStats}>
          <span>{PROJECTS.length} projects</span>
          <span>{liveCount} live</span>
          <span>{inProgressCount} in progress</span>
        </div>
      </header>

      {/* Filters */}
      <nav className={styles.filters}>
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`${styles.filterBtn} ${filter === f ? styles.active : ""}`}
          >
            {f}
          </button>
        ))}
      </nav>

      {/* Grid */}
      <motion.div layout className={styles.grid}>
        {filteredProjects.map((project) => (
          <motion.div
            key={project.id}
            layout
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className={`
              ${styles.gridItem}
              ${project.layout === "featured" ? styles.featured : ""}
              ${project.layout === "tall" ? styles.tall : ""}
              ${project.layout === "wide" ? styles.wide : ""}
            `}
          >
            <ProjectCard
              project={project}
              onClick={() => {
                router.push(`/lab/${project.id}`);
              }}
            />
          </motion.div>
        ))}
      </motion.div>
    </main>
  );
}
