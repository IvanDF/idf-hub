// projects.ts

import { Project } from "@/types/project";

export const PROJECTS: Project[] = [
  // ----------------------------------------------------------------------
  // DEV PROJECTS
  // ----------------------------------------------------------------------
  {
    id: "gabberg-icard",
    title: "GabberG iCard",
    description:
      "Interactive digital business card for cosplay and gaming events, optimized for fast contact sharing and persona-based branding.",
    longDescription:
      "A high-impact personal card experience designed to replace static social links with contextual profile variants tailored for events and conventions.",
    category: "DEV",
    tags: ["React", "Vite", "Digital Identity"],
    year: "2024",
    duration: "4 weeks",
    role: "Product Design, Frontend Development",
    status: "live",
    stack: ["React", "Vite", "SCSS", "Netlify"],
    highlights: [
      "Dynamic profile variants for different event contexts",
      "One-tap contact actions for high-traffic convention flow",
      "Fast React + Vite interface deployed on Netlify",
    ],
    problem:
      "Traditional contact sharing is slow and often forgettable at high-traffic events.",
    solution:
      "A lightweight interactive card with direct actions, clear visual hierarchy, and memorable branding.",
    metrics: [
      { label: "Deployment", value: "Netlify live" },
      { label: "UX Focus", value: "One-tap contacts" },
      { label: "Variants", value: "Context-based profiles" },
    ],
    links: {
      repo: "https://github.com/IvanDF/proj-gabberg-icard",
      live: "https://gabberg.netlify.app/?card_type=dp-ygh-001-01",
    },
    media: {
      thumbnail: "/assets/placeholder.svg",
    },
    interaction: "tilt",
  },
  {
    id: "rick-and-morty-theme",
    title: "Rick and Morty Theme",
    description:
      "VS Code theme extension with dual variants, semantic token mapping, and contrast-aware palettes for long coding sessions.",
    longDescription:
      'A complete editor theme pack featuring "Portal Gun Dark" and "Citadel Light", with semantic token mapping, readability-first color decisions, and marketplace-ready packaging.',
    category: "DEV",
    tags: ["VS Code", "Theme", "Design System"],
    year: "2023",
    duration: "3 weeks",
    role: "Design System, Extension Development",
    status: "live",
    stack: ["JSON Theme Tokens", "VS Code API", "Marketplace Packaging"],
    highlights: [
      "Two complete variants: Portal Gun Dark and Citadel Light",
      "Semantic token palette tuned for readability",
      "Published and maintained through VS Code Marketplace",
    ],
    problem:
      "Many novelty themes look cool but fail during long coding sessions due to poor contrast and token consistency.",
    solution:
      "Balanced visual style with semantic colors, readability checks, and disciplined token mapping.",
    metrics: [
      { label: "Distribution", value: "VS Code Marketplace" },
      { label: "Variants", value: "Dark + Light" },
      { label: "Core Value", value: "Readable semantic tokens" },
    ],
    links: {
      repo: "https://github.com/ivandf/rick-and-morty-theme",
      marketplace:
        "https://marketplace.visualstudio.com/items?itemName=idf-studio.rick-and-morty-theme",
    },
    media: {
      thumbnail: "/projects/rick-and-morty/thumb.jpg",
      gallery: [
        "/projects/rick-and-morty/dark.png",
        "/projects/rick-and-morty/light.png",
      ],
    },
    interaction: "glitch",
    layout: "featured",
  },
  {
    id: "check-your-pipes",
    title: "Check Your Pipes",
    description:
      "VS Code extension that surfaces Azure DevOps pipeline status in a terminal-style panel to reduce context switching.",
    longDescription:
      "A focused TypeScript extension built on the VS Code API and Azure DevOps REST APIs to keep build visibility inside the editor with a low-noise command-first UX.",
    category: "DEV",
    tags: ["VS Code Extension", "TypeScript", "Azure DevOps"],
    year: "2023",
    duration: "5 weeks",
    role: "Solo Developer",
    status: "archived",
    stack: ["TypeScript", "VS Code Extension API", "Azure DevOps REST"],
    highlights: [
      "Pipeline visibility directly in editor",
      "Fast status checks and minimal visual noise",
      "Terminal-inspired command-first UX",
    ],
    metrics: [
      { label: "Platform", value: "VS Code" },
      { label: "Integration", value: "Azure DevOps REST" },
      { label: "Status", value: "Archived" },
    ],
    links: {
      repo: "https://github.com/IvanDF/check-your-pipes",
    },
    media: {
      thumbnail: "/projects/check-your-pipes/thumb.svg",
    },
    interaction: "spotlight",
  },

  // ----------------------------------------------------------------------
  // MAKER / DESIGN
  // ----------------------------------------------------------------------
  {
    id: "gwent-cards",
    title: "Real Life Gwent",
    description:
      "Physical recreation of The Witcher 3 Gwent decks. High-res asset extraction & print design.",
    longDescription:
      "A physical production project combining digital asset extraction, print preflight, and material testing to recreate a playable premium card set.",
    category: "MAKER",
    tags: ["Print Design", "Prop Making", "The Witcher"],
    year: "2022",
    duration: "6 weeks",
    role: "Research, Print Pipeline, Crafting",
    status: "live",
    highlights: [
      "Playable physical decks with game-accurate visuals",
      "High resolution print calibration",
      "Material and finish experimentation",
    ],
    media: {
      thumbnail: "/projects/gwent/thumb.jpg",
    },
    interaction: "tilt",
    layout: "tall",
  },
  {
    id: "cosplay-business-cards",
    title: "Cosplay Branding",
    description:
      "Custom character-specific business cards (Pokémon, Yu-Gi-Oh!) for cosplayers.",
    longDescription:
      "A branding system for cosplayers where each card variant reflects character lore while preserving consistent personal identity cues.",
    category: "DESIGN",
    tags: ["Graphic Design", "Branding", "Print"],
    year: "2022",
    duration: "2 weeks",
    role: "Art Direction, Print Design",
    status: "live",
    highlights: [
      "Character-specific card variants",
      "Consistent identity framework across themes",
      "Print-ready layouts and color profiles",
    ],
    media: {
      thumbnail: "/projects/business-cards/thumb.jpg",
    },
    interaction: "tilt",
  },

  // ----------------------------------------------------------------------
  // EXPERIMENTS
  // ----------------------------------------------------------------------
  {
    id: "genji-ai",
    title: "Genji.ai",
    description: "Experimental generative interface concept.",
    longDescription:
      "A speculative interface exploration for conversational and generative workflows with strong emphasis on atmosphere and discoverability.",
    category: "EXPERIMENT",
    tags: ["AI", "Generative", "Concept"],
    year: "2023",
    duration: "Concept sprint",
    role: "Concept Design, UX Prototyping",
    status: "concept",
    highlights: [
      "Narrative-first interface language",
      "Exploration of command and prompt blending",
      "Rapid concept validation",
    ],
    media: {
      thumbnail: "/projects/genji/thumb.svg",
    },
    interaction: "glitch",
    layout: "wide",
  },
  {
    id: "gravity-well",
    title: "Gravity Well",
    description:
      "Particle simulation where cursor creates a black hole, distorting nearby elements and light.",
    longDescription:
      "An interactive physics-inspired visual where pointer movement modifies a gravity field in real time, affecting particles and ambient distortions.",
    category: "EXPERIMENT",
    tags: ["Physics", "Three.js", "Shader"],
    year: "2024",
    duration: "R&D ongoing",
    role: "Creative Coding, Shader Prototyping",
    status: "in-progress",
    stack: ["React", "Three.js", "WebGL Shader"],
    highlights: [
      "Cursor-driven gravity simulation",
      "Realtime distortion and particle reactions",
      "Optimized for experiential storytelling",
    ],
    problem:
      "Typical portfolio interactions feel static and quickly become forgettable.",
    solution:
      "Use physically reactive visuals to build immersion and direct attention.",
    media: {
      thumbnail: "/assets/placeholder.svg",
    },
    interaction: "glitch",
    layout: "featured",
    links: {
      caseStudy: "/lab/gravity-well",
      demo: "/lab/demo/gravity-well",
    },
  },
  {
    id: "data-stream",
    title: "Data Stream",
    description:
      "Infinite tunnel navigation visualizing data flow in a cyberpunk aesthetic.",
    longDescription:
      "A directional tunnel interface that communicates navigation and momentum through motion, depth, and reactive UI accents.",
    category: "EXPERIMENT",
    tags: ["WebGL", "Audio-Reactive", "Glitch"],
    year: "2024",
    duration: "Prototype",
    role: "Visual R&D",
    status: "concept",
    highlights: [
      "Depth-driven navigation metaphor",
      "Audio-reactive visual accents",
      "Cyberpunk visual language tests",
    ],
    media: {
      thumbnail: "/assets/placeholder.svg",
    },
    interaction: "glitch",
  },
  {
    id: "neural-map",
    title: "Neural Map",
    description:
      "Explore the connection between skills and concepts in a 3D graph.",
    longDescription:
      "A graph exploration experiment to navigate technical skills as connected nodes, exposing relationships and learning paths.",
    category: "EXPERIMENT",
    tags: ["Data Viz", "R3F", "Graph"],
    year: "2024",
    duration: "Prototype",
    role: "Interaction Design, Data Visualization",
    status: "in-progress",
    highlights: [
      "Interactive graph navigation",
      "Cluster-based skill storytelling",
      "Exploratory learning UX",
    ],
    media: {
      thumbnail: "/assets/placeholder.svg",
    },
    interaction: "tilt",
    links: {
      repo: "",
      demo: "/lab",
    },
  },
  {
    id: "liquid-surface",
    title: "Liquid Surface",
    description:
      "Interactive fluid simulation responding to mouse movement and scroll velocity.",
    longDescription:
      "A fluid-based interaction layer where movement and velocity shape surface ripples, used as a cinematic transition and focus tool.",
    category: "EXPERIMENT",
    tags: ["Fluid Sim", "Shader", "Interaction"],
    year: "2024",
    duration: "R&D ongoing",
    role: "Shader Design, Experience Engineering",
    status: "in-progress",
    stack: ["React", "WebGL", "Custom Shader"],
    highlights: [
      "Velocity-based wave behavior",
      "Expressive interaction feedback",
      "Reusable visual effect component",
    ],
    problem:
      "Standard hover/click animations can feel repetitive and low impact.",
    solution:
      "Introduce physically-inspired fluid reactions that feel tactile and alive.",
    media: {
      thumbnail: "/assets/placeholder.svg",
    },
    interaction: "spotlight",
    links: {
      caseStudy: "/lab/liquid-surface",
      demo: "/lab/demo/liquid-surface",
    },
  },
  {
    id: "terminal-os",
    title: "Terminal OS",
    description:
      'The command line interface powering this portfolio. Type "help" to explore.',
    longDescription:
      "A command-driven interaction layer that transforms portfolio browsing into an exploratory terminal experience with discoverable shortcuts.",
    category: "EXPERIMENT",
    tags: ["CLI", "React", "System"],
    year: "2024",
    duration: "Ongoing",
    role: "System UX, Frontend Architecture",
    status: "live",
    highlights: [
      "Command palette and quick navigation",
      "Playful but functional terminal metaphor",
      "Integrated with page-level navigation",
    ],
    media: {
      thumbnail: "/assets/placeholder.svg",
    },
    interaction: "glitch",
    links: {
      demo: "/",
    },
  },
];
