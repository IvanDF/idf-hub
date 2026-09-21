import { PROJECTS } from "@/data/projects";
import { templateFor } from "@/types/project";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import BackLink from "./BackLink";
import ProjectFooter from "./ProjectFooter";
import ProjectHeader from "./ProjectHeader";
import CodeCase from "./templates/CodeCase";
import CraftCase from "./templates/CraftCase";
import DesignCase from "./templates/DesignCase";
import LabCase from "./templates/LabCase";
import styles from "./ProjectDetail.module.scss";

/** Human label per template, shown instead of the raw category enum. */
const KIND_LABEL = {
  code: "Code",
  design: "Design",
  craft: "System",
  lab: "Experiment",
} as const;

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

  const template = templateFor(project);

  // Artwork promoted into a mockup or a plate is already on the page; showing
  // it again in the generic grid would just repeat it.
  const promoted = new Set([
    ...(project.mockup?.frames ?? []).map((f) => f.src),
    ...(project.plates ?? []).map((p) => p.src),
  ]);

  const frames = Array.from(
    new Set(
      [project.media.thumbnail, ...(project.media.gallery ?? [])].filter(
        (f): f is string =>
          Boolean(f) && f !== "/assets/placeholder.svg" && !promoted.has(f),
      ),
    ),
  );

  // CodePen pens get embedded live on the page (pen/full URL → embed URL)
  const penMatch = (project.links?.demo ?? project.links?.live ?? "").match(
    /codepen\.io\/([^/]+)\/(?:pen|full)\/([A-Za-z0-9]+)/,
  );
  const codepen = penMatch ? { user: penMatch[1], hash: penMatch[2] } : null;

  return (
    <main className={styles.container} data-template={template}>
      <Suspense
        fallback={
          <Link href="/lab?view=lab" className={styles.backLink}>
            <ArrowLeft size={14} />
            Work
          </Link>
        }
      >
        <BackLink projectId={project.id} />
      </Suspense>

      <ProjectHeader project={project} kind={KIND_LABEL[template]} />

      {template === "code" && <CodeCase project={project} frames={frames} />}
      {template === "design" && <DesignCase project={project} frames={frames} />}
      {template === "craft" && <CraftCase project={project} frames={frames} />}
      {template === "lab" && (
        <LabCase project={project} frames={frames} codepen={codepen} />
      )}

      <ProjectFooter project={project} />
    </main>
  );
}
