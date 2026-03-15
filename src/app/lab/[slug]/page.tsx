import { PROJECTS } from "@/data/projects";
import { ArrowLeft, ExternalLink, Github, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./ProjectDetail.module.scss";

// In Next.js 15, params is a Promise. We need to await it.
// However, since we are using static params, we can just access it.
// But to be safe and compatible with newer Next.js versions:

export function generateStaticParams() {
  return PROJECTS.map((project) => ({
    slug: project.id,
  }));
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  // Decode the slug just in case
  const slug = decodeURIComponent(params.slug);
  const project = PROJECTS.find((p) => p.id === slug);

  if (!project) {
    notFound();
  }

  return (
    <main className={styles.container}>
      <Link href="/lab" className={styles.backLink}>
        <ArrowLeft size={16} />
        Return to Lab
      </Link>

      <header className={styles.header}>
        <div className={styles.meta}>
          <span className={styles.category}>{project.category}</span>
          {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
          <span>//</span>
          <span>{project.year}</span>
        </div>
        <h1>{project.title}</h1>

        <div className={styles.tags}>
          {project.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      </header>

      <div className={styles.mainContent}>
        <div className={styles.leftColumn}>
          <div className={styles.description}>
            <p>{project.description}</p>
          </div>

          <div className={styles.mediaSection}>
            <div className={styles.mediaContainer}>
              {project.media?.thumbnail ? (
                <Image
                  src={project.media.thumbnail}
                  alt={project.title}
                  fill
                  className={styles.image}
                  sizes="(max-width: 768px) 100vw, 800px"
                  priority
                />
              ) : (
                <div className={styles.placeholder}>No Media Available</div>
              )}
            </div>
          </div>
        </div>

        <aside className={styles.sidebar}>
          <h3>Project Links</h3>

          {/* Launch Experiment / Demo */}
          {project.links?.demo && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.actionButton} ${styles.primary}`}
            >
              <Play size={18} />
              Launch Experiment
            </a>
          )}

          {/* View Source */}
          {project.links?.repo && (
            <a
              href={project.links.repo}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.actionButton} ${styles.secondary}`}
            >
              <Github size={18} />
              View Source
            </a>
          )}

          {/* Live Site (if different from demo) */}
          {project.links?.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.actionButton} ${styles.secondary}`}
            >
              <ExternalLink size={18} />
              Visit Live Site
            </a>
          )}
        </aside>
      </div>
    </main>
  );
}
