// src/app/portfolio/page.tsx

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROJECTS } from '@/data/projects';
import { ProjectCategory } from '@/types/project';
import ProjectCard from '@/components/portfolio/ProjectCard';
import styles from './page.module.scss';

const FILTERS: (ProjectCategory | 'ALL')[] = ['ALL', 'DEV', 'MAKER', 'DESIGN', 'EXPERIMENT'];

export default function Portfolio() {
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
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          PROJECTS
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Selected works, experiments, and digital toys.
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
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
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
                  if (project.links?.caseStudy) {
                    // Navigate to internal case study
                    // router.push(project.links.caseStudy);
                  } else if (project.links?.repo) {
                    window.open(project.links.repo, '_blank');
                  } else if (project.links?.demo) {
                    window.open(project.links.demo, '_blank');
                  }
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}
