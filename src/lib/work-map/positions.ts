import type { Project, ProjectCategory } from "@/types/project";

/** The two readings of the same work. */
export type MapAxis = "discipline" | "time";

export interface MapNode {
  project: Project;
  /** 0–1 across the plane, left to right. */
  x: number;
  /** 0–1 down the plane, top to bottom. */
  y: number;
  /** 0–1, how much visual weight the node carries. */
  weight: number;
  /** Near a wall, so its label can turn inward instead of off the plane. */
  edge: "left" | "right" | null;
  /**
   * Labelled at rest. A map labels its cities and leaves the villages to be
   * found: labelling all fourteen at once overlapped them into noise, and
   * every node is still a link with its title as accessible text.
   */
  landmark: boolean;
}

/** Nodes within this of a wall get their label turned inward. */
const EDGE_BAND = 0.18;

function edgeOf(x: number): "left" | "right" | null {
  if (x < EDGE_BAND) return "left";
  if (x > 1 - EDGE_BAND) return "right";
  return null;
}

/** Left to right in the discipline reading; top to bottom in the time reading. */
const LANES: ProjectCategory[] = ["CODE", "DESIGN", "CRAFT"];

/**
 * How much a project carries, from what the record already proves rather than
 * from an opinion typed in afterwards.
 *
 * Written decisions count double: they are the most expensive thing in a
 * project record and the best evidence that the work had real problems in it.
 * A page of its own and a place in the showcase are both editorial judgements
 * already made elsewhere, so they are counted once, not re-argued here.
 */
function rawWeight(p: Project): number {
  return (
    (p.highlights?.length ?? 0) +
    (p.decisions?.length ?? 0) * 2 +
    (p.detailHref ? 6 : 0) +
    (p.featured ? 4 : 0)
  );
}

/** `YYYY-MM` or a bare year, as a sortable number. Mid-year when only a year. */
function monthsSince2000(p: Project): number {
  const [year, month] = (p.date ?? `${p.year}-06`).split("-");
  return Number(year) * 12 + (Number(month) || 6);
}

function normalise(values: number[]): (v: number) => number {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  return (v) => (v - min) / span;
}

/**
 * Position by rank, size by value.
 *
 * Weight is heavily skewed — Yggdrasil scores 42 and most projects sit under
 * 12 — so placing nodes at their raw weight piles thirteen of them along the
 * bottom edge with one alone at the top. That is an honest picture and an
 * unusable map.
 *
 * Rank spreads them evenly so every node is reachable, and the size scale
 * (which stays on the raw value) keeps the truth about depth visible. Order is
 * preserved either way; only the spacing changes.
 */
function rankScale(values: number[]): (index: number) => number {
  const order = values
    .map((v, i) => ({ v, i }))
    .sort((a, b) => a.v - b.v)
    .map((entry) => entry.i);
  const rank = new Map(order.map((originalIndex, r) => [originalIndex, r]));
  const last = values.length - 1 || 1;
  return (index) => (rank.get(index) ?? 0) / last;
}

/**
 * Places every project on a unit plane, one reading per axis.
 *
 * **discipline** — a column per discipline, height by weight. Reads as three
 * constellations of different depths: what the work is, and how far each one
 * goes.
 *
 * **time** — a lane per discipline, position by date. Reads as three tracks
 * running across the years: where the work came from.
 *
 * Both are deterministic and derived from the project records. Nothing is
 * scattered to fill space: a random position would be a grid with extra steps,
 * and would say something untrue about the work.
 */
export function layout(projects: Project[], axis: MapAxis): MapNode[] {
  const weights = projects.map(rawWeight);
  const toWeight = normalise(weights);

  if (axis === "time") {
    const dates = projects.map(monthsSince2000);
    const toDate = normalise(dates);

    // Within a lane, consecutive projects alternate above and below its centre
    // line. Eleven of these cluster in 2022–23, and a drift proportional to
    // weight left them stacked on each other — alternating guarantees that two
    // projects adjacent in time are never adjacent in space.
    const seatInLane = new Map<string, number>();
    const laneCounts = new Map<ProjectCategory, number>();
    for (const project of [...projects].sort(
      (a, b) => monthsSince2000(a) - monthsSince2000(b),
    )) {
      const key = LANES.includes(project.category) ? project.category : "CRAFT";
      const n = laneCounts.get(key) ?? 0;
      laneCounts.set(key, n + 1);
      seatInLane.set(project.id, n);
    }

    return projects.map((project, i) => {
      const key = LANES.includes(project.category) ? project.category : "CRAFT";
      const lane = LANES.indexOf(key);
      const laneCentre = (lane * 2 + 1) / (LANES.length * 2);
      const seat = seatInLane.get(project.id) ?? 0;
      // -1, +1, -2, +2, … stepping further out as a lane fills up.
      const step = Math.ceil((seat + 1) / 2) * (seat % 2 === 0 ? -1 : 1);
      const drift = step * 0.052;
      const x = toDate(dates[i]);
      const weight = toWeight(weights[i]);
      return {
        project,
        x,
        y: Math.min(0.97, Math.max(0.03, laneCentre + drift)),
        weight,
        edge: edgeOf(x),
        landmark: Boolean(project.featured) || weight > 0.45,
      };
    });
  }

  // Discipline reading. Count how many share a column so they can be spread
  // across its width rather than stacked on its centre line.
  const perLane = new Map<ProjectCategory, Project[]>();
  for (const project of projects) {
    const key = LANES.includes(project.category) ? project.category : "CRAFT";
    perLane.set(key, [...(perLane.get(key) ?? []), project]);
  }

  const toRank = rankScale(weights);

  return projects.map((project, i) => {
    const key = LANES.includes(project.category) ? project.category : "CRAFT";
    const lane = LANES.indexOf(key);
    const siblings = perLane.get(key) ?? [];
    // Ordered by date inside the column, not by position in the source array.
    // The array order tracks weight, and spreading by it put every lane on a
    // diagonal — the picture read as a line rather than a constellation.
    const byDate = [...siblings].sort(
      (a, b) => monthsSince2000(a) - monthsSince2000(b),
    );
    const place = byDate.indexOf(project);
    const laneWidth = 1 / LANES.length;

    const offset =
      byDate.length > 1 ? (place / (byDate.length - 1) - 0.5) * 0.72 : 0;

    const x = laneWidth * (lane + 0.5) + offset * laneWidth;
    const weight = toWeight(weights[i]);

    return {
      project,
      x,
      // Heaviest at the top: the eye starts where the work goes deepest.
      // Rank, not raw weight — see rankScale.
      y: 1 - toRank(i),
      weight,
      edge: edgeOf(x),
      landmark: Boolean(project.featured) || weight > 0.45,
    };
  });
}

/** Axis captions, so the plane says what it means instead of implying it. */
export const AXIS_LABELS: Record<
  MapAxis,
  { title: string; x: string[]; y: [string, string] }
> = {
  discipline: {
    title: "What the work is, and how deep it goes",
    x: ["CODE", "DESIGN", "CRAFT"],
    y: ["systems", "sketches"],
  },
  time: {
    title: "Where the work came from",
    x: [],
    y: ["CODE", "CRAFT"],
  },
};
