'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { PROJECTS } from '@/data/projects';
import { ProjectCategory } from '@/types/project';
import ProjectCard from '@/components/portfolio/ProjectCard';
import styles from './page.module.scss';

const FILTERS: (ProjectCategory | 'ALL')[] = ['ALL', 'DEV', 'MAKER', 'DESIGN', 'EXPERIMENT'];

export default function Lab() {
  const router = useRouter();
  const [filter, setFilter] = useState<ProjectCategory | 'ALL'>('ALL');

  const filteredProjects = PROJECTS.filter((project) => {
    if (filter === 'ALL') return true;
    return project.category === filter;
  });

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
      </header>

      {/* Filters */}
      <nav className={styles.filters}>
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`}
          >
            {f}
          </button>
        ))}
      </nav>

      {/* Grid */}
      <motion.div 
        layout 
        className={styles.grid}
      >
        <AnimatePresence mode='popLayout'>
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`
                ${styles.gridItem} 
                ${project.layout === 'featured' ? styles.featured : ''}
                ${project.layout === 'tall' ? styles.tall : ''}
                ${project.layout === 'wide' ? styles.wide : ''}
              `}
            >
              <ProjectCard 
                project={project} 
                onClick={() => {
                  // Default to the dynamic project page for all items
                  // This ensures a consistent "Case Study" experience
                  router.push(`/lab/${project.id}`);
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}
