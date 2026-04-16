"use client";

import ProjectCard from "@/components/molecules/ProjectCard";
import type { Project, ProjectCategory } from "@/types/project";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.scss";

const ALL_FILTERS: (ProjectCategory | "ALL")[] = [
  "ALL",
  "DEV",
  "VSCODE",
  "CREATIVE",
  "MAKER",
  "APPLE",
  "CODEPEN",
  "EXPERIMENT",
];

export default function Lab() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data: Project[]) => {
        setProjects(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const searchFilter = searchParams.get("filter");
  const filter: ProjectCategory | "ALL" = ALL_FILTERS.includes(
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
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const filteredProjects = projects.filter((project) => {
    if (filter === "ALL") return true;
    return project.category === filter;
  });

  const liveCount = projects.filter((p) => p.status === "live").length;
  const inProgressCount = projects.filter((p) => p.status === "in-progress").length;

  return (
    <main className={styles.container}>
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
          <span>{loading ? "..." : `${projects.length} projects`}</span>
          <span>{loading ? "..." : `${liveCount} live`}</span>
          <span>{loading ? "..." : `${inProgressCount} in progress`}</span>
        </div>
      </header>

      <nav className={styles.filters}>
        {ALL_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => updateFilter(f)}
            className={`${styles.filterBtn} ${filter === f ? styles.active : ""}`}
          >
            {f}
          </button>
        ))}
      </nav>

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
                if (filter !== "ALL") detailParams.set("filter", filter);
                const query = detailParams.toString();
                router.push(query ? `/lab/${project.id}?${query}` : `/lab/${project.id}`);
              }}
            />
          </motion.div>
        ))}
      </motion.div>
    </main>
  );
}


