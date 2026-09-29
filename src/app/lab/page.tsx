"use client";

import { PROJECTS } from "@/data/projects";
import { hrefForProject, labelFor } from "@/types/project";
import type { Project, ProjectCategory, ProjectKind } from "@/types/project";
import CareerPath from "@/components/organisms/career-path";
import FeaturedWork, {
  FEATURED,
  InkCards,
} from "@/components/organisms/featured-work";
import WorkFork from "@/components/organisms/work-fork";
import Text from "@/components/atoms/text";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./page.module.scss";

type FilterGroup = "all" | "code" | "design" | "craft";
type View = "career" | "lab";

const FILTERS: { label: string; group: FilterGroup; category?: ProjectCategory }[] = [
  { label: "All", group: "all" },
  { label: "Code", group: "code", category: "CODE" },
  { label: "Design", group: "design", category: "DESIGN" },
  { label: "Craft", group: "craft", category: "CRAFT" },
];

/**
 * Craft covers several kinds of work, so it is the one group that subdivides.
 * The second row only appears once Craft is chosen — the top level stays at
 * three, and these can grow without crowding it.
 */
const KIND_FILTERS: { label: string; kind: ProjectKind }[] = [
  { label: "Photo", kind: "photo" },
  { label: "Templates", kind: "template" },
  { label: "Shortcuts", kind: "shortcut" },
  { label: "Experiments", kind: "experiment" },
];

function matchesGroup(p: Project, group: FilterGroup, kind: ProjectKind | null): boolean {
  const filter = FILTERS.find((f) => f.group === group);
  if (filter?.category && p.category !== filter.category) return false;
  // `kind` only ever narrows within Craft; the UI does not offer it elsewhere.
  return !kind || p.kind === kind;
}

/**
 * Newest first, by the precise date where there is one. The list numbers its
 * rows, so it has to run in an order those numbers actually mean something in.
 */
const byNewestFirst = (a: Project, b: Project) =>
  (b.date ?? `${b.year}-06`).localeCompare(a.date ?? `${a.year}-06`);

// The showcase carries the featured projects, so the index below is everything
// else. Listing them in both places would make the page repeat itself, and the
// showcase is already above the filters where it cannot be scrolled past.
const LIVE = PROJECTS.filter((p) => p.status === "live" && !p.featured).sort(
  byNewestFirst,
);
const ARCHIVED = PROJECTS.filter((p) => p.status !== "live").sort(byNewestFirst);

const VIEW_TABS: { view: View; label: string }[] = [
  { view: "career", label: "The Path" },
  { view: "lab", label: "The Lab" },
];

export default function Lab() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [archiveOpened, setArchiveOpened] = useState(false);

  const rawFilter = searchParams.get("filter") as FilterGroup | null;
  const filter: FilterGroup =
    rawFilter && FILTERS.some((f) => f.group === rawFilter) ? rawFilter : "all";

  // Only meaningful inside Craft: a stale ?kind on another group is ignored
  // rather than silently emptying the list.
  const rawKind = searchParams.get("kind") as ProjectKind | null;
  const kind: ProjectKind | null =
    filter === "craft" && rawKind && KIND_FILTERS.some((k) => k.kind === rawKind)
      ? rawKind
      : null;

  // Two work stories, one route: no view param shows the fork; old deep links
  // with only ?filter keep landing straight in the lab.
  const rawView = searchParams.get("view");
  const view: View | null =
    rawView === "career" || rawView === "lab"
      ? rawView
      : rawFilter
        ? "lab"
        : null;

  const setView = (v: View) => {
    const p = new URLSearchParams(searchParams.toString());
    p.set("view", v);
    if (v !== "lab") p.delete("filter");
    router.replace(`${pathname}?${p.toString()}`, { scroll: false });
  };

  const setFilter = (group: FilterGroup) => {
    const p = new URLSearchParams(searchParams.toString());
    if (group === "all") p.delete("filter");
    else p.set("filter", group);
    // Craft owns the second row, so the subcategory leaves with it.
    if (group !== "craft") p.delete("kind");
    const q = p.toString();
    router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
  };

  const setKind = (next: ProjectKind | null) => {
    const p = new URLSearchParams(searchParams.toString());
    if (next) p.set("kind", next);
    else p.delete("kind");
    router.replace(`${pathname}?${p.toString()}`, { scroll: false });
  };

  // Real links instead of router.push-on-click: the detail pages are static,
  // so Link prefetches them in-viewport and navigation is instant.
  const hrefFor = (project: Project) => {
    // A project with its own page owns its address; the filter state would
    // mean nothing there, and /lab/[slug] redirects to it anyway.
    if (project.detailHref) return hrefForProject(project);
    const p = new URLSearchParams();
    if (filter !== "all") p.set("filter", filter);
    if (kind) p.set("kind", kind);
    const q = p.toString();
    return q ? `/lab/${project.id}?${q}` : `/lab/${project.id}`;
  };

  // Experiments live in the same list as client/product work but carry a
  // subtle visual marker so the two read differently at a glance.
  const markerFor = (p: Project) =>
    p.kind === "experiment" ? "experiment" : undefined;

  const live = LIVE.filter((p) => matchesGroup(p, filter, kind));
  const archived = ARCHIVED.filter((p) => matchesGroup(p, filter, kind));

  // Which row the visitor just came back from, if any.
  const returningTo = searchParams.get("from");

  // Derived, not set in an effect: an archived project's row is only in the
  // DOM while the Archive is open, so it has to be open on the render that
  // the scroll below then measures.
  const showArchived =
    archiveOpened || (returningTo ? ARCHIVED.some((p) => p.id === returningTo) : false);

  // Put that row under the eye instead of dumping the visitor at the top. The
  // list is client-rendered, so the browser cannot restore this itself.
  const restored = useRef(false);
  useEffect(() => {
    if (restored.current || view !== "lab" || !returningTo) return;

    const row = document.getElementById(returningTo);
    if (!row) return;

    restored.current = true;
    row.scrollIntoView({ block: "center", behavior: "auto" });
  }, [view, returningTo, live.length, showArchived]);

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>
          <Text as="span" variant="inherit">Work</Text>
        </h1>
        <div className={styles.headerRow}>
          <Text as="p" variant="mono" className={styles.pageSubtitle}>
            {view === "career"
              ? "Ten years, no straight line."
              : view === "lab"
                ? "Where the curiosity goes after hours."
                : "Two stories. Pick an angle."}
          </Text>
          {view !== null && (
            <nav className={styles.viewTabs} aria-label="Work views">
              {VIEW_TABS.map((t) => (
                <button
                  key={t.view}
                  onClick={() => setView(t.view)}
                  className={`${styles.viewTab} ${view === t.view ? styles.viewTabActive : ""}`}
                  aria-pressed={view === t.view}
                >
                  {t.label}
                </button>
              ))}
            </nav>
          )}
        </div>
      </header>

      <AnimatePresence mode="wait">
        {view === null && (
          <motion.div
            key="fork"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <WorkFork
              liveCount={LIVE.length}
              archivedCount={ARCHIVED.length}
              onPick={setView}
            />
          </motion.div>
        )}

        {view === "career" && (
          // Plain section, no entrance opacity/transform: the timeline must be
          // visible the instant it mounts. A framer initial={opacity:0} here
          // relied on the mount animation completing — on Safari an interrupted
          // animation could pin the whole section invisible.
          <section key="career" aria-label="Career">
            <CareerPath />
          </section>
        )}

        {/* Outside the filter-keyed wrapper below on purpose. The showcase is
            the selection, not a view of the collection, so a filter change must
            not re-mount it — and that wrapper animates from opacity 0, which is
            the one thing the reveals are not allowed to depend on. */}
        {view === "lab" && <FeaturedWork />}

        {view === "lab" && (
          <motion.div
            key={`lab-${filter}-${kind ?? ""}`}
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {/* No heading between the plates above and the cards below: the
                weight stepping down is what marks the change, and a title here
                put a seam back in the page. The filters are a quiet row rather
                than a block for the same reason — they are a utility, not a
                chapter break.

                They stay above the work they filter even though the rest of the
                descent argues for burying them: controls under their own
                results mean filtering scrolls the answer off screen. */}
            <nav className={styles.filters} aria-label="Project filters">
              {FILTERS.map(({ label, group }) => (
                <button
                  key={group}
                  onClick={() => setFilter(group)}
                  className={`${styles.filterBtn} ${filter === group ? styles.active : ""}`}
                  aria-pressed={filter === group}
                >
                  {label}
                </button>
              ))}
            </nav>

            {/* Craft is the one group with subcategories, so this row exists
                only while Craft is chosen. The top level stays at three. */}
            {filter === "craft" && (
              <nav
                className={`${styles.filters} ${styles.subFilters}`}
                aria-label="Craft subcategories"
              >
                <button
                  onClick={() => setKind(null)}
                  className={`${styles.filterBtn} ${!kind ? styles.active : ""}`}
                  aria-pressed={!kind}
                >
                  All
                </button>
                {KIND_FILTERS.map((k) => (
                  <button
                    key={k.kind}
                    onClick={() => setKind(k.kind)}
                    className={`${styles.filterBtn} ${kind === k.kind ? styles.active : ""}`}
                    aria-pressed={kind === k.kind}
                  >
                    {k.label}
                  </button>
                ))}
              </nav>
            )}

            {/* The middle of the descent. Same ink frame and the same
                typography as the plates above, at half the weight and two to a
                row — the step down is the hierarchy, so no heading or rule is
                needed to announce it. Numbering carries on from the showcase
                rather than restarting, because this is the same sequence. */}
            <InkCards projects={live} startIndex={FEATURED.length + 1} />

            {live.length === 0 && <Text as="p" variant="body" className={styles.empty}>Nothing here yet.</Text>}

            {archived.length > 0 && (
              <div className={styles.archive}>
                <button
                  className={styles.archiveToggle}
                  onClick={() => setArchiveOpened((v) => !v)}
                  aria-expanded={showArchived}
                >
                  <span aria-hidden>{showArchived ? "−" : "+"}</span>
                  Archive
                  <span className={styles.archiveCount}>{archived.length}</span>
                </button>

                {/* initial={false} when restoring: the expand animation would
                    still be running when the scroll below measures the row, and
                    it would land hundreds of pixels off. */}
                <AnimatePresence initial={!returningTo}>
                  {showArchived && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className={styles.archiveList}
                      role="list"
                    >
                      {archived.map((project, i) => (
                        <Link
                          key={project.id}
                          id={project.id}
                          role="listitem"
                          className={`${styles.projectRow} ${styles.archivedRow}`}
                          data-reveal=""
                          data-kind={markerFor(project)}
                          data-own-page={project.detailHref ? "true" : undefined}
                          href={hrefFor(project)}
                        >
                          <span className={styles.rowNum}>{String(i + 1).padStart(2, "0")}</span>
                          <div className={styles.rowMain}>
                            <span className={styles.rowTitle}>{project.title}</span>
                            <span className={styles.rowDesc}>{project.description}</span>
                          </div>
                          <div className={styles.rowMeta}>
                            <span className={styles.rowCategory}>{labelFor(project)}</span>
                            <span className={styles.rowYear}>{project.year}</span>
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
