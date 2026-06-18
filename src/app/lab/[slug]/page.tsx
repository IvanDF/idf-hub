import GalleryViewer from "@/components/molecules/gallery-viewer";
import { PROJECTS } from "@/data/projects";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./ProjectDetail.module.scss";

export async function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.id }));
}

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ filter?: string }>;
}) {
  const { slug } = await params;
  const { filter } = await searchParams;
  const project = PROJECTS.find((p) => p.id === decodeURIComponent(slug));
  if (!project) notFound();

  const backHref = filter ? `/lab?filter=${encodeURIComponent(filter)}` : "/lab";
  const stack = project.stack && project.stack.length > 0 ? project.stack : project.tags;

  const mediaFrames = Array.from(
    new Set(
      [project.media.thumbnail, ...(project.media.gallery ?? [])].filter(
        (f): f is string => Boolean(f) && f !== "/assets/placeholder.svg",
      ),
    ),
  );
  const mediaFit = project.media.fit ?? "contain";

  const primaryUrl = project.links?.demo ?? project.links?.live;
  const platformLabels: Record<string, string> = {
    codepen: "Open Playground",
    notion: "Open Workspace",
    "apple-shortcuts": "Get Shortcut",
    github: "View on GitHub",
    figma: "Open in Figma",
    "vscode-marketplace": "Get Extension",
  };
  const primaryLabel =
    platformLabels[project.platform ?? ""] ??
    (project.links?.demo ? "Launch Experiment" : "Visit Live Site");

  const acts: { label: string; body: string }[] = [];
  if (project.why) acts.push({ label: "The Idea", body: project.why });
  if (project.problem) acts.push({ label: "The Problem", body: project.problem });
  if (project.solution) acts.push({ label: "The Craft", body: project.solution });

  const extraLinks = [
    project.links?.repo && { href: project.links.repo, label: "Source code" },
    project.links?.figma && project.links.figma !== primaryUrl && { href: project.links.figma, label: "Figma file" },
    project.links?.marketplace && { href: project.links.marketplace, label: "Marketplace" },
    project.links?.caseStudy && { href: project.links.caseStudy, label: "Case study" },
  ].filter(Boolean) as { href: string; label: string }[];

  return (
    <main className={styles.container}>
      <Link href={backHref} className={styles.backLink}>
        <ArrowLeft size={14} />
        Work
      </Link>

      <header className={styles.header}>
        <div className={styles.meta}>
          <span className={styles.metaChip}>{project.category}</span>
          <span className={styles.metaSep}>/</span>
          <span className={styles.metaYear}>{project.year}</span>
          {project.status === "live" && (
            <span className={styles.metaLive}>live</span>
          )}
        </div>

        <h1 className={styles.title}>{project.title}</h1>
        <p className={styles.lead}>{project.longDescription ?? project.description}</p>
      </header>

      {acts.length > 0 && (
        <section className={styles.acts}>
          {acts.map((act, i) => (
            <div key={act.label} className={styles.act}>
              <div className={styles.actNum}>{String(i + 1).padStart(2, "0")}</div>
              <div className={styles.actBody}>
                <h2 className={styles.actTitle}>{act.label}</h2>
                <p className={styles.actText}>{act.body}</p>
              </div>
            </div>
          ))}
        </section>
      )}

      {mediaFrames.length > 0 && (
        <div className={styles.media}>
          {mediaFrames.length > 1 ? (
            <GalleryViewer
              images={mediaFrames}
              projectTitle={project.title}
              mediaFit={mediaFit}
            />
          ) : (
            <div className={styles.mediaFrame}>
              <Image
                src={mediaFrames[0]}
                alt={project.title}
                fill
                className={styles.mediaImg}
                style={{ objectFit: mediaFit }}
                sizes="(max-width: 768px) 100vw, 900px"
                priority
              />
            </div>
          )}
        </div>
      )}

      <footer className={styles.footer}>
        <div className={styles.stack}>
          {stack.map((t) => (
            <span key={t} className={styles.stackTag}>{t}</span>
          ))}
        </div>

        <div className={styles.links}>
          {primaryUrl && (
            <a
              href={primaryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.primaryLink}
            >
              {primaryLabel}
              <ExternalLink size={13} />
            </a>
          )}
          {extraLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.secondaryLink}
            >
              {label}
              <ExternalLink size={12} />
            </a>
          ))}
        </div>
      </footer>
    </main>
  );
}
