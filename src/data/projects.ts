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
    layout: "featured",
  },
  {
    id: "filteroo",
    title: "Filteroo",
    description:
      "Web app to apply real-time filters to images directly in the browser, inspired by Instagram-style effects.",
    longDescription:
      "A React application that applies CSS and canvas-based filters to images in real time, built with a strong focus on component reusability and instant visual feedback. Figma was used for UI design.",
    category: "DEV",
    tags: ["React", "Hooks", "Image Processing", "SCSS"],
    year: "2022",
    duration: "2 weeks",
    role: "Design, Frontend Development",
    status: "archived",
    stack: ["React", "Hooks", "SCSS", "Styled Components", "Figma"],
    highlights: [
      "Real-time filter preview with no external libraries",
      "Figma-designed UI translated to React components",
      "Modular hooks architecture for filter logic",
    ],
    problem:
      "Applying and previewing image filters typically requires desktop software.",
    solution:
      "A lightweight browser-based tool using CSS filters and React state to deliver instant feedback.",
    links: {
      repo: "https://github.com/IvanDF/filteroo",
    },
    media: {
      thumbnail: "/assets/placeholder.svg",
    },
    interaction: "spotlight",
    layout: "wide",
  },
  {
    id: "zelda-cookbook",
    title: "Zelda Cookbook",
    description:
      "Full-stack recipe app themed around Breath of the Wild, with a Laravel REST API and a React TypeScript frontend.",
    longDescription:
      "A full-stack project featuring a Lumen/Laravel REST API backend and a TypeScript React frontend. Users can explore Zelda-inspired recipes with data fetched via REST.",
    category: "DEV",
    tags: ["React", "TypeScript", "Laravel", "REST API"],
    year: "2022",
    duration: "3 weeks",
    role: "Full-Stack Developer",
    status: "archived",
    stack: ["React", "TypeScript", "SCSS", "PHP", "Lumen", "REST API"],
    highlights: [
      "Decoupled frontend/backend architecture",
      "TypeScript React with custom fetch hooks",
      "Lumen REST API with CRUD endpoints",
    ],
    problem:
      "Full-stack exercises often lack an engaging theme, making it harder to stay motivated through both frontend and backend development.",
    solution:
      "Separate repos for frontend and backend communicating through a clean REST API.",
    links: {
      repo: "https://github.com/IvanDF/zelda-cookbook-fe",
    },
    media: {
      thumbnail: "/assets/placeholder.svg",
    },
    interaction: "tilt",
  },
  {
    id: "vue-boolflix",
    title: "Boolflix",
    description:
      "Netflix-inspired movie and TV search app powered by the TMDB API, built with Vue.js.",
    longDescription:
      "A responsive Vue.js application that queries the TMDB API to search for movies and TV series, displaying results in a card grid with dynamic info and poster images.",
    category: "DEV",
    tags: ["Vue.js", "AJAX", "API", "TMDB"],
    year: "2021",
    duration: "2 weeks",
    role: "Frontend Developer",
    status: "archived",
    stack: ["Vue.js", "AJAX", "TMDB API", "CSS"],
    highlights: [
      "Live search with TMDB API integration",
      "Responsive card grid with movie posters",
      "Vue component architecture for dynamic data",
    ],
    links: {
      repo: "https://github.com/IvanDF/vue-boolflix",
    },
    media: {
      thumbnail: "/assets/placeholder.svg",
    },
    interaction: "tilt",
  },
  {
    id: "html-css-spotifyweb",
    title: "Spotify Web Clone",
    description:
      "Pixel-faithful responsive clone of the Spotify Web Player UI built with pure HTML and CSS.",
    longDescription:
      "A pure HTML/CSS reproduction of the Spotify Web Player interface with a focus on responsive layout precision and visual accuracy.",
    category: "DEV",
    tags: ["HTML", "CSS", "Responsive"],
    year: "2021",
    duration: "1 week",
    role: "Frontend Developer",
    status: "archived",
    stack: ["HTML", "CSS"],
    highlights: [
      "Pixel-accurate Spotify layout reproduction",
      "Fully responsive with flexbox and grid",
      "No JavaScript — pure CSS layout challenge",
    ],
    links: {
      repo: "https://github.com/IvanDF/html-css-spotifyweb",
    },
    media: {
      thumbnail: "/assets/placeholder.svg",
    },
    interaction: "spotlight",
  },

  // ----------------------------------------------------------------------
  // VSCODE PROJECTS
  // ----------------------------------------------------------------------
  {
    id: "rick-and-morty-theme",
    title: "Rick and Morty Theme",
    description:
      "VS Code theme extension with dual variants, semantic token mapping, and contrast-aware palettes for long coding sessions.",
    longDescription:
      'A complete editor theme pack featuring "Portal Gun Dark" and "Citadel Light", with semantic token mapping, readability-first color decisions, and marketplace-ready packaging.',
    category: "VSCODE",
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
      repo: "https://github.com/IvanDF/rick-and-morty-theme",
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
    category: "VSCODE",
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
  // EXPERIMENTS
  // ----------------------------------------------------------------------
  {
    id: "3d-blender-animation",
    title: "3D Blender Animation",
    description:
      "3D model animation brought to life on the web with GSAP and CSS, exported from Blender.",
    longDescription:
      "A creative experiment combining a Blender 3D model with GSAP-driven animations on the web. The static model is exported and animated entirely with CSS and JavaScript for a smooth cinematic experience in the browser.",
    category: "EXPERIMENT",
    tags: ["Blender", "GSAP", "3D", "CSS Animation"],
    year: "2022",
    duration: "1 week",
    role: "3D Modeling, Web Animation",
    status: "archived",
    stack: ["Blender", "GSAP", "HTML", "CSS", "JavaScript"],
    highlights: [
      "Blender model exported for web use",
      "Smooth animation sequences driven by GSAP",
      "No WebGL — pure CSS 3D transforms and GSAP",
    ],
    links: {
      repo: "https://github.com/IvanDF/3d-blender-animation",
    },
    media: {
      thumbnail: "/assets/placeholder.svg",
    },
    interaction: "glitch",
    layout: "wide",
  },
  {
    id: "snake-3d",
    title: "Snake 3D",
    description:
      "Classic Snake game reimagined in a 3D JavaScript environment.",
    longDescription:
      "A 3D take on the timeless Snake game, built with vanilla JavaScript. The project explores game loop logic, collision detection, and 3D rendering without a dedicated game engine.",
    category: "EXPERIMENT",
    tags: ["JavaScript", "3D", "Game", "Canvas"],
    year: "2022",
    duration: "1 week",
    role: "Game Development, Creative Coding",
    status: "archived",
    stack: ["JavaScript", "HTML Canvas", "CSS"],
    highlights: [
      "Classic Snake mechanics in a 3D perspective",
      "Vanilla JavaScript with no game engine",
      "Game loop, collision detection, and score system",
    ],
    links: {
      repo: "https://github.com/IvanDF/snake-3d",
    },
    media: {
      thumbnail: "/assets/placeholder.svg",
    },
    interaction: "glitch",
  },
];
