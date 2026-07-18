/** One movement of an exploded chapter: a phase of the real work. */
export type StoryPhase = {
  title: string;
  body: string;
};

/** The exploded view of a chapter — the full story behind the timeline line. */
export type CareerStory = {
  intro: string;
  phases: StoryPhase[];
  outcomes?: string[];
  stack?: string[];
};

export type CareerStep = {
  /** Display period — approximate labels are fine for the early, pre-CV years. */
  years: string;
  role: string;
  place: string;
  /** One growth line, not a job description. */
  note: string;
  /** Concrete work — migrations, systems, challenges. Recent roles earn more. */
  highlights?: string[];
  /** Set both to give the chapter an exploded page at /lab/path/[slug]. */
  slug?: string;
  story?: CareerStory;
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
    slug: "azimut-marketplace",
    story: {
      intro:
        "Three years on a financial marketplace, from external consultant to the team's technical reference. The platform is where I learned that fintech UX is a trust problem before it is a design problem.",
      phases: [
        {
          title: "Junior in",
          body: "I joined as a frontend consultant on bug duty. Fixing other people's bugs is the fastest way to read a codebase honestly: every ticket taught me where the architecture creaked and where it held.",
        },
        {
          title: "Owning the frontend",
          body: "From tickets to architecture: scalable components, shared patterns, and a steady push on user experience. My design background stopped being a side note — UI decisions started from how people actually behave under financial anxiety.",
        },
        {
          title: "Technical reference",
          body: "By the end, new questions landed on my desk first. Not a title change — a trust change. The consultant badge stopped mattering; being the person who knew why things were built that way did.",
        },
      ],
      outcomes: [
        "From bug-fixing junior to technical reference point in three years",
        "Scalable component patterns adopted across the platform",
      ],
      stack: ["Frontend architecture", "Component systems", "Fintech UX"],
    },
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
    slug: "romeo-founders",
    story: {
      intro:
        "Leading frontend and product design of a platform designed from the ground up — the role where a decade of detours finally point in one direction: strategy, design and engineering in the same pair of hands.",
      phases: [
        {
          title: "A design system with no training wheels",
          body: "The platform's design system is built from scratch, without external UI frameworks. Every component, token and interaction exists because we decided it should — a foundation made for long-term growth and maintainability, not for the next demo.",
        },
        {
          title: "Taming the polyrepo",
          body: "The frontend ecosystem grew as 20+ independent repositories, libraries and Web Components. I'm leading its migration into a modern monorepo: fewer moving parts, simpler workflows, and scalability that doesn't depend on tribal knowledge.",
        },
        {
          title: "Bridging three worlds",
          body: "The job in one line: connect strategy, technology and design so that great ideas become intuitive products — and make sure the bridge holds when all three pull in different directions.",
        },
      ],
      outcomes: [
        "A consistent, scalable user experience across the whole platform",
        "Development workflows simplified by the monorepo migration",
      ],
      stack: ["Design systems", "Monorepo", "Web Components", "Product strategy"],
    },
  },
];
