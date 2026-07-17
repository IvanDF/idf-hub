export type CareerStep = {
  /** Display period — approximate labels are fine for the early, pre-CV years. */
  years: string;
  role: string;
  place: string;
  /** One growth line, not a job description. */
  note: string;
  /** Concrete work — migrations, systems, challenges. Recent roles earn more. */
  highlights?: string[];
  current?: boolean;
};

/**
 * The professional path, oldest first — the point is the arc: race timing as
 * a school kid, waiter's double shifts, then a decade climbing from quality
 * control to IT Manager in Madrid. Side projects live in PROJECTS; this is
 * the career.
 */
export const CAREER: CareerStep[] = [
  {
    years: "school years",
    role: "Race control",
    place: "OTC · sports timing, Como",
    note: "Weekends timing triathlons and endurance races. First lesson in systems: the clock does not wait.",
  },
  {
    years: "the first real one",
    role: "Waiter",
    place: "Chinese restaurant",
    note: "Full days, six days a week. Learned pace, pressure, and people — nothing since has felt too fast.",
  },
  {
    years: "2016 – 2020",
    role: "Quality control → Digital dept. manager",
    place: "Security Brands Solutions, Como",
    note: "From checking the output to owning the process.",
    highlights: [
      "Grew from quality control specialist to running the digital department",
      "Owned production workflows and trained the new hires",
      "Graphic design skills meet process optimisation — the first bridge role",
    ],
  },
  {
    years: "2020 – 2021",
    role: "Full-stack bootcamp",
    place: "Boolean Careers",
    note: "The pivot. Curiosity finally got a compiler.",
  },
  {
    years: "2021 – 2022",
    role: "Software developer",
    place: "Antlia, Milano",
    note: "First code shipped for real clients.",
    highlights: [
      "Enterprise consulting: different teams, different stacks, complex contexts",
      "The classic ladder — bug fixes, then features, then service integrations",
      "Usability and quality as the through-line, not an afterthought",
    ],
  },
  {
    years: "2023 – 2026",
    role: "Frontend developer",
    place: "Azimut Marketplace, Milano",
    note: "A financial marketplace. Junior in, technical reference out.",
    highlights: [
      "Frontend architecture and scalable components for a financial platform",
      "From bug-fixing consultant to the team's technical reference point",
      "Design background put to work: interfaces tuned on how people behave",
    ],
  },
  {
    years: "2026 – now",
    role: "IT Manager",
    place: "Romeo Founders, Madrid",
    note: "Where strategy, design and engineering meet.",
    highlights: [
      "A custom design system built from scratch — zero external UI frameworks",
      "Leading the migration of 20+ repos, libraries and Web Components into one monorepo",
      "Frontend & product lead: making great ideas become intuitive products",
    ],
    current: true,
  },
];
