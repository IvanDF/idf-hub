import GalleryViewer from "@/components/molecules/GalleryViewer";
import { mapDbRowToProject } from "@/lib/mappers/project";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  categoryPanelByCategory,
  fallbackPanelByPlatform,
  panelByProjectId,
} from "./ProjectDetail.data";
import { ProjectDetailPanel } from "./ProjectDetailPanel";
import { ProjectDetailSidebar } from "./ProjectDetailSidebar";
import styles from "./ProjectDetail.module.scss";

export async function generateStaticParams() {
  // Graceful fallback: if env vars are missing (e.g. first Vercel build before
  // env vars are set), return [] and let Next.js render pages on demand (SSR).
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return [];
  }
  try {
    const supabase = createAdminClient();
    const { data } = await supabase.from("projects").select("id");
    return (data ?? []).map((row) => ({ slug: row.id }));
  } catch {
    return [];
  }
}

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ filter?: string }>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  const decodedSlug = decodeURIComponent(slug);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", decodedSlug)
    .single();

  if (error || !data) notFound();
  const project = mapDbRowToProject(data);

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
  const platform = project.platform || "web";
  const category = project.category;

  const galleryImages = project.media?.gallery || [];
  const mediaFrames = Array.from(
    new Set(
      [project.media.thumbnail, ...galleryImages].filter(
        (frame): frame is string =>
          Boolean(frame) && frame !== "/assets/placeholder.svg",
      ),
    ),
  );
  const mediaFit = project.media.fit || "contain";
  const primaryUrl = project.links?.demo || project.links?.live;
  const backHref = resolvedSearchParams.filter
    ? `/lab?filter=${encodeURIComponent(resolvedSearchParams.filter)}`
    : "/lab";
  const hasDistinctLiveLink = Boolean(
    project.links?.live && project.links.live !== primaryUrl,
  );
  const hasDistinctFigmaLink = Boolean(
    project.links?.figma &&
    project.links.figma !== primaryUrl &&
    project.links.figma !== project.links?.live,
  );

  const primaryLabelByPlatform: Record<string, string> = {
    codepen: "Open Playground",
    notion: "Open Workspace",
    "apple-shortcuts": "Get Shortcut",
    github: "Launch Project",
    figma: "Open Figma Plugin",
    "vscode-marketplace": "Open Extension",
  };

  const primaryLabel =
    primaryLabelByPlatform[platform] ||
    (project.links?.demo ? "Launch Experiment" : "Visit Live Site");

  const selectedPanel =
    panelByProjectId[project.id] ||
    categoryPanelByCategory[category] ||
    fallbackPanelByPlatform[platform];

  const categoryLensPanel = selectedPanel ? (
    <ProjectDetailPanel panel={selectedPanel} />
  ) : null;

  return (
    <main className={`${styles.container} ${styles[platform]}`}>
      <Link href={backHref} className={styles.backLink}>
        <ArrowLeft size={16} />
        Return to Lab
      </Link>

      <header className={styles.header}>
        <div className={styles.meta}>
          <span className={styles.category}>{project.category}</span>
          <span className={styles.categoryLens}>{selectedPanel?.badge}</span>
          <span className={styles.platform}>{platform.replace(/-/g, " ")}</span>
          <span>{"//"}</span>
          <span>{project.year}</span>
          {project.status && (
            <span
              className={`${styles.status} ${project.status === "live" ? styles.statusLive : ""}`}
            >
              {project.status}
            </span>
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
            <h3>Focus Areas</h3>
            <ul>
              {detailHighlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </section>

          {categoryLensPanel}

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
            {mediaFrames.length > 1 ? (
              <GalleryViewer
                images={mediaFrames}
                projectTitle={project.title}
                mediaFit={mediaFit}
              />
            ) : mediaFrames.length === 1 ? (
              <div className={styles.mediaContainer}>
                <Image
                  src={mediaFrames[0]}
                  alt={`${project.title} media`}
                  fill
                  className={styles.image}
                  style={{ objectFit: mediaFit }}
                  sizes="(max-width: 768px) 100vw, 900px"
                  priority
                />
              </div>
            ) : (
              <div className={styles.mediaContainer}>
                <div className={`${styles.generatedCover} ${styles[platform]}`}>
                  <span className={styles.coverPlatform}>
                    {platform.replace(/-/g, " ")}
                  </span>
                  <strong>{project.title}</strong>
                  <p>{project.longDescription || project.description}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <ProjectDetailSidebar
            detailStack={detailStack}
            primaryUrl={primaryUrl}
            primaryLabel={primaryLabel}
            repoUrl={project.links?.repo}
            figmaUrl={project.links?.figma}
            liveUrl={project.links?.live}
            marketplaceUrl={project.links?.marketplace}
            caseStudyUrl={project.links?.caseStudy}
            hasDistinctFigmaLink={hasDistinctFigmaLink}
            hasDistinctLiveLink={hasDistinctLiveLink}
          />
      </div>
    </main>
  );
}
