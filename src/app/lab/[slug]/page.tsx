import Text from "@/components/atoms/text";
import { PROJECTS } from "@/data/projects";
import { ArrowLeft, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import BackLink from "./BackLink";
import ProjectMedia from "./ProjectMedia";
import styles from "./ProjectDetail.module.scss";

export async function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.id === decodeURIComponent(slug));
  if (!project) return { title: "Not found" };

  const description = project.description;
  const url = `/lab/${project.id}`;
  // SVG and placeholder thumbnails don't work as social preview images;
  // in those cases fall back to the default /opengraph-image.
  const thumb = project.media.thumbnail;
  const images =
    thumb && thumb !== "/assets/placeholder.svg" && !thumb.endsWith(".svg")
      ? [thumb]
      : undefined;

  return {
    title: project.title,
    description,
    alternates: { canonical: url },
    openGraph: { title: project.title, description, url, type: "article", images },
    twitter: { card: "summary_large_image", title: project.title, description, images },
  };
}

// No `searchParams` here: awaiting it would make the route dynamic (a server
// render per click). The filter-aware back link reads it client-side instead.
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.id === decodeURIComponent(slug));
  if (!project) notFound();

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
  // CodePen pens get embedded live on the page (pen/full URL → embed URL)
  const codepen = (project.links?.demo ?? project.links?.live ?? "").match(
    /codepen\.io\/([^/]+)\/(?:pen|full)\/([A-Za-z0-9]+)/,
  );
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
      <Suspense
        fallback={
          <Link href="/lab" className={styles.backLink}>
            <ArrowLeft size={14} />
            Work
          </Link>
        }
      >
        <BackLink />
      </Suspense>

      <header className={styles.header}>
        <div className={styles.meta}>
          <Text as="span" variant="label" className={styles.metaChip}>{project.category}</Text>
          <Text as="span" variant="label" className={styles.metaSep}>/</Text>
          <Text as="span" variant="label" className={styles.metaYear}>{project.year}</Text>
          {project.status === "live" && (
            <Text as="span" variant="label" className={styles.metaLive}>live</Text>
          )}
        </div>

        <Text as="h1" variant="h1" className={styles.title}>{project.title}</Text>
        <Text as="p" variant="mono" className={styles.lead}>{project.longDescription ?? project.description}</Text>
      </header>

      {acts.length > 0 && (
        <section className={styles.acts}>
          {acts.map((act, i) => (
            <div key={act.label} className={styles.act}>
              <div className={styles.actNum}>{String(i + 1).padStart(2, "0")}</div>
              <div className={styles.actBody}>
                <Text as="h2" variant="h2" className={styles.actTitle}>{act.label}</Text>
                <Text as="p" variant="body" className={styles.actText}>{act.body}</Text>
              </div>
            </div>
          ))}
        </section>
      )}

      {codepen && (
        <section className={styles.embed}>
          {/* Live pen instead of screenshots: the work IS the interaction */}
          <iframe
            className={styles.embedFrame}
            src={`https://codepen.io/${codepen[1]}/embed/${codepen[2]}?default-tab=result&theme-id=dark`}
            title={`${project.title} — live on CodePen`}
            loading="lazy"
            allowFullScreen
          />
        </section>
      )}

      <ProjectMedia frames={mediaFrames} title={project.title} fit={mediaFit} />

      <footer className={styles.footer}>
        <div className={styles.stack}>
          {stack.map((t) => (
            <Text as="span" key={t} variant="label" className={styles.stackTag}>{t}</Text>
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
