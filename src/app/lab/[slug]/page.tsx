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

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Decode the slug just in case
  const { slug } = await params;

  const decodedSlug = decodeURIComponent(slug);
  const project = PROJECTS.find((p) => p.id === decodedSlug);

  if (!project) {
    notFound();
  }

  const detailHighlights =
    project.highlights && project.highlights.length > 0
      ? project.highlights
      : [
          "Crafted as part of an iterative portfolio R&D process",
          "Built with focus on visual identity and interaction quality",
          "Continuously refined based on usability feedback",
        ];

  const detailStack =
    project.stack && project.stack.length > 0 ? project.stack : project.tags;

  return (
    <main className={styles.container}>
      <Link href="/lab" className={styles.backLink}>
        <ArrowLeft size={16} />
        Return to Lab
      </Link>

      <header className={styles.header}>
        <div className={styles.meta}>
          <span className={styles.category}>{project.category}</span>
          <span>{"//"}</span>
          <span>{project.year}</span>
          {project.status && (
            <span className={styles.status}>{project.status}</span>
          )}
        </div>
        <h1>{project.title}</h1>

        <p className={styles.lead}>
          {project.longDescription || project.description}
        </p>

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

          <div className={styles.detailGrid}>
            {project.problem && (
              <section className={styles.infoBlock}>
                <h3>Problem</h3>
                <p>{project.problem}</p>
              </section>
            )}

            {project.solution && (
              <section className={styles.infoBlock}>
                <h3>Approach</h3>
                <p>{project.solution}</p>
              </section>
            )}

            {project.role && (
              <section className={styles.infoBlock}>
                <h3>Role</h3>
                <p>{project.role}</p>
              </section>
            )}

            {project.duration && (
              <section className={styles.infoBlock}>
                <h3>Duration</h3>
                <p>{project.duration}</p>
              </section>
            )}
          </div>

          <section className={styles.highlights}>
            <h3>Highlights</h3>
            <ul>
              {detailHighlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </section>

          {project.metrics && project.metrics.length > 0 && (
            <section className={styles.metrics}>
              <h3>Key Metrics</h3>
              <div className={styles.metricGrid}>
                {project.metrics.map((metric) => (
                  <div
                    key={`${metric.label}-${metric.value}`}
                    className={styles.metricItem}
                  >
                    <span>{metric.label}</span>
                    <strong>{metric.value}</strong>
                  </div>
                ))}
              </div>
            </section>
          )}

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

          <div className={styles.stackSection}>
            <h4>Stack</h4>
            <div className={styles.stackTags}>
              {detailStack.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>

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

          {project.links?.marketplace && (
            <a
              href={project.links.marketplace}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.actionButton} ${styles.secondary}`}
            >
              <ExternalLink size={18} />
              Open Marketplace
            </a>
          )}

          {project.links?.caseStudy && (
            <Link
              href={project.links.caseStudy}
              className={`${styles.actionButton} ${styles.secondary}`}
            >
              <Play size={18} />
              Open Case Study
            </Link>
          )}
        </aside>
      </div>
    </main>
  );
}
