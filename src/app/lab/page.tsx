"use client";

import ProjectCard from "@/components/portfolio/ProjectCard";
import { PROJECTS } from "@/data/projects";
import { ProjectCategory } from "@/types/project";
import { motion } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.scss";

const FILTERS: (ProjectCategory | "ALL")[] = [
  "ALL",
  ...Array.from(new Set(PROJECTS.map((project) => project.category))),
];

export default function Lab() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const searchFilter = searchParams.get("filter");
  const filter: ProjectCategory | "ALL" = FILTERS.includes(
    searchFilter as ProjectCategory | "ALL",
  )
    ? (searchFilter as ProjectCategory | "ALL")
    : "ALL";

  const updateFilter = (nextFilter: ProjectCategory | "ALL") => {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (nextFilter === "ALL") {
      nextParams.delete("filter");
    } else {
      nextParams.set("filter", nextFilter);
    }

    const query = nextParams.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

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
            onClick={() => updateFilter(f)}
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
                const detailParams = new URLSearchParams();

                if (filter !== "ALL") {
                  detailParams.set("filter", filter);
                }

                const query = detailParams.toString();
                router.push(
                  query ? `/lab/${project.id}?${query}` : `/lab/${project.id}`,
                );
              }}
            />
          </motion.div>
        ))}
      </motion.div>
    </main>
  );
}
