// src/components/portfolio/ProjectCard.tsx

'use client';

import { Project } from '@/types/project';
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import styles from './ProjectCard.module.scss';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  className?: string;
}

export default function ProjectCard({ project, onClick, className = '' }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // --- Interaction State ---
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // --- Tilt Logic ---
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 20 });

  // --- Spotlight Logic ---
  // Using mouseX/mouseY from interaction state
  // We'll calculate percentage for CSS radial-gradient
  const spotlightX = useSpring(0, { stiffness: 50, damping: 10 });
  const spotlightY = useSpring(0, { stiffness: 50, damping: 10 });

  useEffect(() => {
    if (!cardRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      // Update basic mouse position for interactions
      mouseX.set(clientX);
      mouseY.set(clientY);

      // Tilt calculations (normalized -0.5 to 0.5)
      const width = rect.width;
      const height = rect.height;
      const normalizedX = (clientX / width) - 0.5;
      const normalizedY = (clientY / height) - 0.5;
      x.set(normalizedX);
      y.set(normalizedY);

      // Spotlight calculations (pixels)
      spotlightX.set(clientX);
      spotlightY.set(clientY);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      x.set(0);
      y.set(0);
      rotateX.set(0);
      rotateY.set(0);
    };

    const element = cardRef.current;
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('mouseenter', () => setIsHovered(true));

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
      // Remove mouseenter listener? No need for separate removal if we add it inline or here.
      // Let's rely on standard React events for simplicity if possible, but for 
      // consistent animation frame updates native listeners are sometimes smoother.
      // Actually, React onMouseMove is fine for this scale.
    };
  }, [x, y, mouseX, mouseY, rotateX, rotateY, spotlightX, spotlightY]);


  // --- Render Logic ---

  return (
    <motion.div
      ref={cardRef}
      className={`${styles.card} ${styles[project.interaction || 'default']} ${styles[project.category.toLowerCase()]} ${className}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
      style={{
        perspective: 1000,
        rotateX: project.interaction === 'tilt' ? rotateX : 0,
        rotateY: project.interaction === 'tilt' ? rotateY : 0,
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Spotlight Overlay (Only for 'spotlight' interaction) */}
      {project.interaction === 'spotlight' && (
        <motion.div
          className={styles.spotlightOverlay}
          style={{
            background: useMotionTemplate`radial-gradient(
              600px circle at ${spotlightX}px ${spotlightY}px,
              rgba(255, 255, 255, 0.1),
              transparent 40%
            )`,
          }}
        />
      )}

      {/* Glitch Overlay (Only for 'glitch' interaction) */}
      {project.interaction === 'glitch' && isHovered && (
        <div className={styles.glitchEffect}>
          <div className={styles.glitchSlice}></div>
          <div className={styles.glitchSlice}></div>
          <div className={styles.glitchSlice}></div>
        </div>
      )}


      {/* Content */}
      <div className={styles.imageContainer}>
        {project.media.thumbnail ? (
          <Image
            src={project.media.thumbnail}
            alt={project.title}
            fill
            className={styles.image}
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div className={styles.placeholder} />
        )}
      </div>

      <div className={styles.info}>
        <div className={styles.header}>
            <span className={styles.category}>{project.category}</span>
            <span className={styles.year}>{project.year}</span>
        </div>
        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.description}>{project.description}</p>
        <div className={styles.tags}>
          {project.tags.map(tag => (
            <span key={tag} className={styles.tag}>#{tag}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
