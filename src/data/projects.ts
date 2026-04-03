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
    platform: "github",
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
      figma:
        "https://www.figma.com/design/AUsHrYgiyCOT32SYU2Jrzm/Proj.-Gabber?node-id=104-39&p=f&t=Espn1nMIvV1LPI2y-0",
    },
    media: {
      thumbnail: "/projects/gabberg-icard/thumb.png",
      gallery: ["/projects/gabberg-icard/demo.gif"],
      fit: "contain",
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
    platform: "github",
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
      figma:
        "https://www.figma.com/design/Fr3KTY3BGTqGphnNKQL3R4/Filter-web-app?node-id=0-1&p=f&t=EhhrwIfYZysj3pHg-0",
    },
    media: {
      thumbnail:
        "https://raw.githubusercontent.com/IvanDF/filteroo/master/src/packages/github/devices.png",
      gallery: [
        "https://raw.githubusercontent.com/IvanDF/filteroo/master/src/packages/github/preview.gif",
      ],
      fit: "contain",
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
    platform: "github",
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
      fit: "contain",
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
    platform: "github",
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
      thumbnail:
        "https://raw.githubusercontent.com/IvanDF/vue-boolflix/master/img/readme/devices.png",
      fit: "contain",
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
    platform: "github",
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
      thumbnail:
        "https://raw.githubusercontent.com/IvanDF/html-css-spotifyweb/master/img/readme/devices.png",
      fit: "contain",
    },
    interaction: "spotlight",
  },

  {
    id: "todo-fullstack",
    title: "Full-Stack ToDo List",
    description:
      "To-do app with separate frontend and backend layers connected via API, built as a full-stack architecture exercise.",
    longDescription:
      "A full-stack project with Vue on the frontend and Laravel/PHP on the backend, designed to practice API-driven development, CRUD workflows, and database-backed task management.",
    category: "DEV",
    platform: "github",
    tags: ["Vue", "Laravel", "PHP", "MySQL", "API"],
    year: "2021",
    duration: "2 weeks",
    role: "Full-Stack Developer",
    status: "archived",
    stack: ["Vue", "Axios", "Laravel", "PHP", "MySQL", "SCSS"],
    highlights: [
      "Separated frontend/backend with API communication",
      "CRUD task lifecycle with persistence",
      "Local full-stack workflow with database integration",
    ],
    links: {
      repo: "https://github.com/IvanDF/todo-fullstack",
    },
    media: {
      thumbnail:
        "https://raw.githubusercontent.com/IvanDF/todo-fullstack/master/front-end/dist/img/readme/devices.png",
      gallery: [
        "https://raw.githubusercontent.com/IvanDF/todo-fullstack/master/front-end/dist/img/readme/demo.gif",
      ],
      fit: "contain",
    },
    interaction: "tilt",
    layout: "wide",
  },
  {
    id: "signup-onboarding-flow",
    title: "Onboarding Flow",
    description:
      "Sign-up and onboarding flow prototype focused on step clarity, state management, and responsive UI.",
    longDescription:
      "A React/TypeScript onboarding flow experiment exploring progressive disclosure, validation states, and visual continuity across sign-up steps.",
    category: "DEV",
    platform: "github",
    tags: ["React", "TypeScript", "Onboarding", "UX"],
    year: "2021",
    duration: "1 week",
    role: "Frontend Developer",
    status: "archived",
    stack: ["React", "TypeScript", "Styled Components"],
    highlights: [
      "Multi-step sign-up interaction",
      "Responsive interface and stateful progression",
      "Reusable component-oriented structure",
    ],
    links: {
      repo: "https://github.com/IvanDF/signup-page",
    },
    media: {
      thumbnail:
        "https://raw.githubusercontent.com/IvanDF/signup-page/master/src/packages/img/readme/devices.png",
      gallery: [
        "https://raw.githubusercontent.com/IvanDF/signup-page/master/src/packages/img/readme/demo.gif",
      ],
      fit: "contain",
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
    platform: "vscode-marketplace",
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
    platform: "github",
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
      gallery: ["/projects/check-your-pipes/desktop-shot.png"],
      fit: "contain",
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
    platform: "github",
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
      thumbnail:
        "https://raw.githubusercontent.com/IvanDF/3d-blender-animation/main/assets/devices.png",
      gallery: [
        "https://raw.githubusercontent.com/IvanDF/3d-blender-animation/main/assets/demo.gif",
      ],
      fit: "contain",
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
    platform: "github",
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
      fit: "contain",
    },
    interaction: "glitch",
  },

  // ----------------------------------------------------------------------
  // CODEPEN PLAYGROUNDS
  // ----------------------------------------------------------------------
  {
    id: "codepen-nintendo-switch-oled",
    title: "Nintendo Switch OLED (CSS)",
    description:
      "Pure CSS visual recreation of a Nintendo Switch OLED with polished controls and hardware-inspired composition.",
    longDescription:
      "A front-end style exercise focused on high-fidelity object recreation in CSS. The project explores gradients, shape composition, and layered shadows to mimic physical product design in a browser-only canvas.",
    category: "CODEPEN",
    platform: "codepen",
    tags: ["CodePen", "CSS Art", "UI Recreation"],
    year: "2024",
    duration: "2 days",
    role: "Visual Design, Frontend Craft",
    status: "live",
    stack: ["HTML", "CSS", "CodePen"],
    highlights: [
      "Pure CSS composition with no external assets",
      "Product-like proportions and depth",
      "Micro-details inspired by console controls",
    ],
    links: {
      demo: "https://codepen.io/IvanDF/pen/OJQyyXO",
      live: "https://codepen.io/IvanDF/full/OJQyyXO",
    },
    media: {
      thumbnail: "/projects/codepen-switch-oled/thumb.png",
      fit: "contain",
    },
    interaction: "spotlight",
    layout: "wide",
  },
  {
    id: "codepen-image-preview-slider",
    title: "Image Preview Slider",
    description:
      "Interactive image preview slider prototype with navigation controls and smooth transition behavior.",
    longDescription:
      "A lightweight UI component prototype built in CodePen to test interaction rhythm, visual hierarchy, and motion between preview states.",
    category: "CODEPEN",
    platform: "codepen",
    tags: ["CodePen", "Slider", "Interaction Design"],
    year: "2024",
    duration: "1 day",
    role: "Interaction Design, Frontend Prototyping",
    status: "live",
    stack: ["HTML", "CSS", "JavaScript", "CodePen"],
    highlights: [
      "Fast visual experimentation for component behavior",
      "Clear affordances for next/previous navigation",
      "Built as a reusable UI exploration",
    ],
    links: {
      demo: "https://codepen.io/IvanDF/pen/VwyOqPP",
      live: "https://codepen.io/IvanDF/full/VwyOqPP",
    },
    media: {
      thumbnail: "/projects/codepen-image-slider/thumb.png",
      fit: "contain",
    },
    interaction: "tilt",
  },
  {
    id: "codepen-navbar-animated",
    title: "Navbar Animated",
    description:
      "Animated anchor-based navigation concept focused on movement, section linking, and responsive menu behavior.",
    longDescription:
      "A navigation pattern experiment built on CodePen to refine timing, link emphasis, and animated transitions for one-page layouts.",
    category: "CODEPEN",
    platform: "codepen",
    tags: ["CodePen", "Navbar", "Animation"],
    year: "2024",
    duration: "1 day",
    role: "Frontend Prototyping",
    status: "live",
    stack: ["HTML", "CSS", "JavaScript", "CodePen"],
    highlights: [
      "Anchor-driven sections with animated nav state",
      "Smooth transitions tuned for clarity",
      "Lightweight structure for rapid reuse",
    ],
    links: {
      demo: "https://codepen.io/IvanDF/pen/OJzYwJy",
      live: "https://codepen.io/IvanDF/full/OJzYwJy",
    },
    media: {
      thumbnail: "/projects/codepen-navbar/thumb.png",
      fit: "contain",
    },
    interaction: "spotlight",
  },

  // ----------------------------------------------------------------------
  // FIGMA PROJECTS
  // ----------------------------------------------------------------------
  {
    id: "figma-icon-builder",
    title: "Icon Builder",
    description:
      "Figma plugin that converts selected design nodes into reusable React icon components, with optional motion-ready output.",
    longDescription:
      "Icon Builder is a Figma plugin focused on speeding up design-to-code flow for icon systems. It exports structured React components, supports wrapper patterns, and includes options for animated integrations.",
    category: "FIGMA",
    platform: "figma",
    tags: ["Figma Plugin", "Design to Code", "React Icons"],
    year: "2025",
    duration: "Ongoing",
    role: "Plugin Development, Product Design",
    status: "live",
    stack: ["Figma Plugin API", "TypeScript", "HTML"],
    highlights: [
      "Convert Figma nodes into reusable React icon components",
      "Supports wrapper-based integration patterns",
      "Published in Figma Community with iterative updates",
    ],
    links: {
      repo: "https://github.com/IvanDF/icon-builder",
      live: "https://www.figma.com/community/plugin/1489334044911703870/icon-builder",
    },
    media: {
      thumbnail:
        "https://raw.githubusercontent.com/IvanDF/icon-builder/main/assets/ui-preview.png",
      fit: "contain",
    },
    interaction: "spotlight",
    layout: "featured",
  },

  // ----------------------------------------------------------------------
  // NOTION SYSTEMS
  // ----------------------------------------------------------------------
  {
    id: "notion-payment-tracker-2",
    title: "Payment Tracker 2.0",
    description:
      "Personal finance workspace in Notion with recurring costs, month/day summaries, and history views.",
    longDescription:
      "A structured Notion system for tracking recurring and previsional payments. Includes summary charts, historical logs, and integration notes for Apple Shortcuts automation.",
    category: "MAKER",
    platform: "notion",
    tags: ["Notion", "Productivity", "Finance"],
    year: "2024",
    duration: "Iterative",
    role: "System Design, Workflow Automation",
    status: "live",
    stack: ["Notion Databases", "Linked Views", "Apple Shortcuts"],
    highlights: [
      "Recurring and previsional payment lists",
      "Monthly and daily summary views",
      "History section for tracking trends over time",
    ],
    links: {
      live: "https://idf-dev.notion.site/Payment-tracker-2-0-5e9328575ec447c19d999fbbcbd0b026",
    },
    media: {
      thumbnail: "/projects/notion/payment-tracker/thumb.png",
      fit: "contain",
    },
    interaction: "tilt",
    layout: "tall",
  },
  {
    id: "notion-bookshelf-2",
    title: "Bookshelf 2.0",
    description:
      "Knowledge and reading dashboard with library, genres, authors, yearly board, and personal reading stats.",
    longDescription:
      "A Notion reading operating system that organizes books by year, author, and genre with aggregated stats for pages, audiobooks, and active reading pipeline.",
    category: "MAKER",
    platform: "notion",
    tags: ["Notion", "Knowledge Management", "Reading"],
    year: "2024",
    duration: "Iterative",
    role: "Information Architecture",
    status: "live",
    stack: ["Notion Databases", "Board Views", "Rollups"],
    highlights: [
      "Structured pages for Library, Genres, Authors, and Details",
      "Board by year for browsing and planning",
      "Summary stats to monitor reading consistency",
    ],
    links: {
      live: "https://idf-dev.notion.site/Books-67a1b5e8e3144778b1b0ef6c34b40fbb",
    },
    media: {
      thumbnail: "/projects/notion/bookshelf/thumb.png",
      fit: "contain",
    },
    interaction: "spotlight",
  },
  {
    id: "notion-recipes-advanced",
    title: "Recipes Advanced",
    description:
      "Meal-planning and kitchen workflow workspace with weekly planning, recipes, shopping list, and ingredient tracking.",
    longDescription:
      "An advanced Notion setup for food workflow management: weekly meal planning, recipe organization, shopping synchronization, and ingredient inventory including out-of-stock visibility.",
    category: "MAKER",
    platform: "notion",
    tags: ["Notion", "Meal Planning", "System Design"],
    year: "2024",
    duration: "Iterative",
    role: "Workflow Design",
    status: "live",
    stack: ["Notion Databases", "Templates", "Filtered Views"],
    highlights: [
      "Weekly meals view connected to recipe database",
      "Dedicated shopping flow and phone-oriented list",
      "Ingredient inventory and out-of-stock management",
    ],
    links: {
      live: "https://idf-dev.notion.site/Recipes-14017fd407e24f8aa397f926d61ba536",
    },
    media: {
      thumbnail: "/assets/placeholder.svg",
      fit: "contain",
    },
    interaction: "tilt",
  },

  // ----------------------------------------------------------------------
  // APPLE SHORTCUTS
  // ----------------------------------------------------------------------
  {
    id: "shortcut-spotify-to-apple-music",
    title: "Spotify to Apple Music",
    description:
      "iOS Shortcut to speed up migration and lookup flow between Spotify content and Apple Music.",
    longDescription:
      "An automation shortcut designed to reduce friction when moving between Spotify and Apple Music contexts, enabling faster handoff for tracks and listening sessions.",
    category: "APPLE",
    platform: "apple-shortcuts",
    tags: ["Apple Shortcuts", "Automation", "Music"],
    year: "2024",
    duration: "1 day",
    role: "Automation Design",
    status: "live",
    stack: ["Apple Shortcuts", "iOS", "URL Actions"],
    highlights: [
      "Cross-service listening workflow",
      "Single-action mobile automation",
      "Designed for daily usage speed",
    ],
    links: {
      live: "https://www.icloud.com/shortcuts/b943ddc8db69421ea8b471426f643e40",
    },
    media: {
      thumbnail: "/projects/apple-shortcuts/spotify-to-apple/thumb.png",
      gallery: ["/projects/apple-shortcuts/spotify-to-apple/content.png"],
      fit: "contain",
    },
    interaction: "glitch",
  },
  {
    id: "shortcut-tabata",
    title: "Tabata",
    description:
      "Apple Shortcut for interval training routines with quick-start flow suitable for short workout sessions.",
    longDescription:
      "A focused iOS automation shortcut created to launch and support Tabata-style training routines with minimal setup and repeatable timing flow.",
    category: "APPLE",
    platform: "apple-shortcuts",
    tags: ["Apple Shortcuts", "Fitness", "Automation"],
    year: "2024",
    duration: "1 day",
    role: "Automation Design",
    status: "live",
    stack: ["Apple Shortcuts", "iOS"],
    highlights: [
      "Quick-start fitness routine",
      "Optimized for repeated short sessions",
      "Lightweight mobile-first interaction",
    ],
    links: {
      live: "https://www.icloud.com/shortcuts/188a947ada5343b89bcd1ea1b32e2cdd",
    },
    media: {
      thumbnail: "/projects/apple-shortcuts/tabata/thumb.png",
      gallery: ["/projects/apple-shortcuts/tabata/content.png"],
      fit: "contain",
    },
    interaction: "glitch",
  },
];
