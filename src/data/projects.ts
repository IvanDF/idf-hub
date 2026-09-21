import { Project } from "@/types/project";

// Dates carry a `date` (YYYY-MM) alongside the display `year`. Every date with
// a verifiable source was taken from it — GitHub repository `created_at` for
// anything with a repo, image EXIF for the photographic and print work —
// because the hand-written years had drifted by up to three years.

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
    year: "2023",
    date: "2023-02",
    duration: "4 weeks",
    role: "Product Design, Frontend Development",
    status: "live",
    stack: ["React", "Vite", "SCSS", "Netlify"],
    highlights: [
      "Dynamic profile variants for different event contexts",
      "One-tap contact actions for high-traffic convention flow",
      "Fast React + Vite interface deployed on Netlify",
    ],
    decisions: [
      {
        choice: "Profile variant driven by a URL query param, not a route",
        why: "A card is handed over by QR code. One deploy, one build, and a different `?card_type=` on each printed code gives a different persona — no rebuild when a new event needs a new variant.",
        tradeoff:
          "Variants are invisible to search engines and to anyone who lands on the bare URL, which is fine for something only ever reached by scanning.",
      },
      {
        choice: "Vite over Next.js",
        why: "There is no server work here: it is one screen of static markup plus contact actions. Vite ships it as flat files that Netlify serves from the edge.",
        tradeoff: "No SSR if the card ever grows a dynamic section.",
      },
      {
        choice: "Native `tel:` / `mailto:` links instead of a contact form",
        why: "At a convention the goal is to get out of the browser and into the other person's address book in one tap. A form adds a keyboard, a submit, and a failure mode.",
      },
    ],
    why: "I needed a way to introduce GabberG — a cosplay persona — at events where you meet hundreds of people in minutes. A paper card or plain link dump wasn't going to cut it.",
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
    year: "2021",
    date: "2021-05",
    duration: "2 weeks",
    role: "Design, Frontend Development",
    status: "archived",
    stack: ["React", "Hooks", "SCSS", "Styled Components", "Figma"],
    highlights: [
      "Real-time filter preview with no external libraries",
      "Figma-designed UI translated to React components",
      "Modular hooks architecture for filter logic",
    ],
    decisions: [
      {
        choice: "CSS `filter` on the live preview, canvas only on export",
        why: "The browser composites CSS filters on the GPU, so dragging a slider stays at 60fps on an image of any size. Canvas re-reads every pixel on the CPU and stutters the moment the photo is large.",
        tradeoff:
          "Two code paths to keep in sync — the preview and the exported file have to be verified against each other, because they are produced by different engines.",
      },
      {
        choice: "No image-processing library",
        why: "Every effect in the set already exists as a CSS filter primitive. Pulling in a library would have added weight to reimplement what the browser does natively and faster.",
      },
      {
        choice: "One hook per filter, composed into a stack",
        why: "Filters are order-dependent. Modelling each as an isolated hook with a value and a range made the compose step a plain array join instead of a growing conditional.",
      },
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
    date: "2022-02",
    duration: "3 weeks",
    role: "Frontend and API development",
    status: "archived",
    stack: ["React", "TypeScript", "SCSS", "PHP", "Lumen", "REST API"],
    highlights: [
      "Decoupled frontend/backend architecture",
      "TypeScript React with custom fetch hooks",
      "Lumen REST API with CRUD endpoints",
    ],
    decisions: [
      {
        choice: "Lumen instead of full Laravel",
        why: "The backend is a read-mostly JSON API with no views, no sessions and no auth. Lumen boots a fraction of the framework and keeps response times down on cheap hosting.",
        tradeoff:
          "Losing Eloquent conveniences and the artisan generators meant writing more boilerplate by hand.",
      },
      {
        choice: "Two repositories instead of one",
        why: "Forcing a real HTTP boundary between the two halves meant the frontend could never quietly reach into the database. Every piece of data had to be an endpoint I had designed on purpose.",
        tradeoff:
          "Two deploys, two dependency trees, and CORS to configure for what one repo could have served.",
      },
      {
        choice: "Typed fetch hooks over a data-fetching library",
        why: "The app has three endpoints. A hook returning `{ data, loading, error }` typed per endpoint covered the whole surface without a cache layer to learn or configure.",
      },
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
    year: "2020",
    date: "2020-11",
    duration: "2 weeks",
    role: "Interface and API integration",
    status: "archived",
    stack: ["Vue.js", "AJAX", "TMDB API", "CSS"],
    highlights: [
      "Live search with TMDB API integration",
      "Responsive card grid with movie posters",
      "Vue component architecture for dynamic data",
    ],
    decisions: [
      {
        choice: "Debounced search instead of a submit button",
        why: "TMDB rate-limits per key. Waiting for a pause in typing rather than firing on every keystroke cut requests by roughly an order of magnitude while still feeling instant.",
        tradeoff:
          "A deliberate delay between the last keystroke and the first result, which has to be short enough not to read as lag.",
      },
      {
        choice: "Poster URLs built from the TMDB size manifest",
        why: "TMDB serves the same still at several widths. Picking the size that matches the card rather than the original kept the grid light on mobile data.",
      },
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
    year: "2020",
    date: "2020-10",
    duration: "1 week",
    role: "Layout and CSS architecture",
    status: "archived",
    stack: ["HTML", "CSS"],
    highlights: [
      "Pixel-accurate Spotify layout reproduction",
      "Fully responsive with flexbox and grid",
      "No JavaScript — pure CSS layout challenge",
    ],
    decisions: [
      {
        choice: "Grid for the page shell, flexbox inside it",
        why: "The shell is a two-dimensional problem — fixed sidebar, fixed player bar, one scrolling area. The contents of each region are one-dimensional rows. Using each tool for the axis it was built for removed most of the positioning hacks.",
      },
      {
        choice: "Zero JavaScript, on purpose",
        why: "The point of the exercise was to find where CSS actually runs out. Allowing a script would have let me skip past every hard part instead of solving it.",
        tradeoff:
          "The clone looks complete and is inert — nothing plays, nothing navigates.",
      },
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
    date: "2021-03",
    duration: "2 weeks",
    role: "Interface, API and schema",
    status: "archived",
    stack: ["Vue", "Axios", "Laravel", "PHP", "MySQL", "SCSS"],
    highlights: [
      "Separated frontend/backend with API communication",
      "CRUD task lifecycle with persistence",
      "Local full-stack workflow with database integration",
    ],
    decisions: [
      {
        choice: "Optimistic updates on toggle, rollback on failure",
        why: "Ticking a task is the one action people repeat dozens of times. Waiting for a round trip before the checkbox moves makes the whole app feel broken even when the network is fine.",
        tradeoff:
          "Every mutation needs a defined inverse, so the client holds a little more state than a naive implementation would.",
      },
      {
        choice: "Soft deletes in the schema",
        why: "Deleting a task is one tap and easy to do by accident. A `deleted_at` column turns an unrecoverable action into a reversible one for the cost of a filtered query.",
      },
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
    date: "2021-06",
    duration: "1 week",
    role: "Interaction design and implementation",
    status: "archived",
    stack: ["React", "TypeScript", "Styled Components"],
    highlights: [
      "Multi-step sign-up interaction",
      "Responsive interface and stateful progression",
      "Reusable component-oriented structure",
    ],
    decisions: [
      {
        choice: "Validate on blur, never on keystroke",
        why: "Marking a field invalid while it is still being typed means telling someone they are wrong before they have finished. Waiting for the field to lose focus gives the same protection without the nagging.",
      },
      {
        choice: "One state object for the whole flow, not per-step state",
        why: "Going back a step has to show what was already entered. Keeping the answers in a single object above the steps made back-navigation free instead of a synchronisation problem.",
        tradeoff:
          "The parent knows the shape of every step, so adding a step touches two files rather than one.",
      },
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
    year: "2026",
    date: "2026-02",
    duration: "3 weeks",
    role: "Design System, Extension Development",
    status: "live",
    stack: ["JSON Theme Tokens", "VS Code API", "Marketplace Packaging"],
    highlights: [
      "Two complete variants: Portal Gun Dark and Citadel Light",
      "Semantic token palette tuned for readability",
      "Published and maintained through VS Code Marketplace",
    ],
    decisions: [
      {
        choice: "Semantic tokens first, TextMate scopes only as fallback",
        why: "TextMate scopes guess at meaning from syntax; semantic tokens get the real answer from the language server. Colouring a variable differently from a function call requires knowing which is which, and only one of those two systems does.",
        tradeoff:
          "Languages without a semantic provider fall back to the scope rules, so the theme is measurably better in TypeScript than in older ecosystems.",
      },
      {
        choice: "Hue reserved for meaning, weight carries the structure",
        why: "The obvious way to theme Rick and Morty is portal green everywhere. Saturated green on a dark background vibrates and destroys reading stamina. The palette spends colour only where it separates one kind of token from another.",
        tradeoff:
          "Screenshots look tamer than novelty themes that throw every hue at the wall.",
      },
      {
        choice: "A light variant built from scratch, not inverted",
        why: "Inverting a dark palette produces muddy pastels, because contrast against white does not behave like contrast against black. Citadel Light was re-derived against its own background.",
        tradeoff: "Two palettes to keep in step whenever a token is added.",
      },
      {
        choice: "Every pair checked against WCAG AA",
        why: "A theme is read for eight hours at a stretch. Contrast is not a detail of the design here — it is the product.",
      },
    ],
    why: "I spent long sessions inside VS Code with themes that looked great in screenshots but were painful to actually read — bad contrast, inconsistent token mapping, colours fighting for attention. I wanted a theme built for the person coding, not the one showing off.",
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
    year: "2026",
    date: "2026-02",
    duration: "5 weeks",
    role: "Solo build, end to end",
    status: "archived",
    stack: ["TypeScript", "VS Code Extension API", "Azure DevOps REST"],
    highlights: [
      "Pipeline visibility directly in editor",
      "Fast status checks and minimal visual noise",
      "Terminal-inspired command-first UX",
    ],
    decisions: [
      {
        choice: "Poll on an interval instead of subscribing to webhooks",
        why: "A webhook needs a public endpoint. An extension running on someone's laptop does not have one, and standing up a relay server to avoid a timer would have been more infrastructure than the whole extension.",
        tradeoff:
          "Status can be stale by up to one interval, and the polling loop has to back off when the editor is idle so it does not burn API quota overnight.",
      },
      {
        choice: "Personal access token in VS Code SecretStorage",
        why: "SecretStorage hands the token to the OS keychain. Settings JSON is world-readable and routinely committed by accident — an Azure DevOps PAT has no business living there.",
      },
      {
        choice: "Status bar item rather than a sidebar view",
        why: "The whole point is to not switch context. A panel you have to open and look at is the browser tab it was meant to replace, moved inside the editor.",
        tradeoff:
          "A single line of text has room for one pipeline's state, so multi-pipeline detail needs a deliberate second step.",
      },
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
    date: "2022-09",
    duration: "1 week",
    role: "3D Modeling, Web Animation",
    status: "archived",
    stack: ["Blender", "GSAP", "HTML", "CSS", "JavaScript"],
    highlights: [
      "Blender model exported for web use",
      "Smooth animation sequences driven by GSAP",
      "No WebGL — pure CSS 3D transforms and GSAP",
    ],
    why: "Does a Blender model need WebGL on the web, or can a pre-rendered export plus CSS 3D carry the same sense of dimension?",
    solution:
      "For a fixed camera path it carries it completely, at a fraction of the weight and with no GPU context to lose. The moment the viewer should be able to look around, the illusion is over — this approach buys cinematics, not interactivity.",
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
    year: "2023",
    date: "2023-10",
    duration: "1 week",
    role: "Game Development, Creative Coding",
    status: "archived",
    stack: ["JavaScript", "HTML Canvas", "CSS"],
    highlights: [
      "Classic Snake mechanics in a 3D perspective",
      "Vanilla JavaScript with no game engine",
      "Game loop, collision detection, and score system",
    ],
    why: "Snake is a grid game. What happens to it when the grid is given a third dimension and no engine is there to help?",
    solution:
      "The logic survives the move almost untouched — collision is still integer comparison on cells. The hard part turned out to be the camera: depth makes it genuinely difficult to judge which cell the head is about to enter, which is a design problem, not a rendering one.",
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
    year: "2022",
    date: "2022-05",
    duration: "2 days",
    role: "Visual Design, Frontend Craft",
    status: "live",
    stack: ["HTML", "CSS", "CodePen"],
    highlights: [
      "Pure CSS composition with no external assets",
      "Product-like proportions and depth",
      "Micro-details inspired by console controls",
    ],
    why: "How far can CSS get toward a photograph of an object before you have to reach for an image?",
    solution:
      "Further than expected. Gradients carry the moulded plastic, layered shadows carry the depth, and the whole console is shapes and borders — no assets at all. What CSS cannot fake is wear: the shell reads as a render because it is too clean.",
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
    year: "2022",
    date: "2022-04",
    duration: "1 day",
    role: "Interaction Design, Frontend Prototyping",
    status: "live",
    stack: ["HTML", "CSS", "JavaScript", "CodePen"],
    highlights: [
      "Fast visual experimentation for component behavior",
      "Clear affordances for next/previous navigation",
      "Built as a reusable UI exploration",
    ],
    why: "At what transition speed does a slider stop feeling responsive and start feeling slow?",
    solution:
      "The usable band is narrower than it looks: under about 150ms the change is hard to follow, past roughly 350ms every tap feels like waiting. Easing matters more than duration — the same 250ms reads as sharp or sluggish depending on the curve.",
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
    year: "2022",
    date: "2022-04",
    duration: "1 day",
    role: "Frontend Prototyping",
    status: "live",
    stack: ["HTML", "CSS", "JavaScript", "CodePen"],
    highlights: [
      "Anchor-driven sections with animated nav state",
      "Smooth transitions tuned for clarity",
      "Lightweight structure for rapid reuse",
    ],
    why: "Can a nav communicate where you are on a page using motion alone, without a highlighted state to point at?",
    solution:
      "Partly. Movement draws the eye to the change but does not survive it — once the animation settles there is nothing left to read, so a persistent marker still has to do the actual work. Motion announces, state informs.",
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
    category: "CREATIVE",
    // Filed under Design in the Lab, but the story here is a technical one:
    // the page reads better as a decision log than as a mockup sheet.
    template: "code",
    platform: "figma",
    tags: ["Figma Plugin", "Design to Code", "React Icons"],
    year: "2025",
    date: "2025-03",
    duration: "Ongoing",
    role: "Plugin Development, Product Design",
    status: "live",
    stack: ["Figma Plugin API", "TypeScript", "HTML"],
    highlights: [
      "Convert Figma nodes into reusable React icon components",
      "Supports wrapper-based integration patterns",
      "Published in Figma Community with iterative updates",
    ],
    decisions: [
      {
        choice: "Emit JSX components, not raw SVG files",
        why: "An SVG file still has to be renamed, imported and wrapped before anyone can use it. The step that actually costs time is the wrapping, so that is the step the plugin does.",
        tradeoff:
          "The output is bound to React. A Vue or Svelte team gets nothing from it.",
      },
      {
        choice: "`currentColor` substituted for every hard-coded fill",
        why: "An icon that carries its own colour cannot be themed, and will be wrong the first time it lands on a dark background. Inheriting from CSS makes one exported component work everywhere.",
        tradeoff:
          "Deliberately multicoloured icons need an opt-out, because the substitution would flatten them.",
      },
      {
        choice: "Props for size and title rather than fixed dimensions",
        why: "A fixed `width` in the SVG has to be overridden at every call site. Taking a `size` prop and an accessible `title` makes the correct usage also the shortest one.",
      },
      {
        choice: "Published to Figma Community instead of kept internal",
        why: "The friction it removes is not specific to my files. Shipping it publicly meant real icon sets I had not designed found the edge cases I never would have.",
      },
    ],
    why: "Every design-to-code handoff I've done hit the same wall: icons. Export from Figma, rename, wrap in a React component, repeat. I built this to collapse that loop into a single click.",
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
    year: "2023",
    duration: "Iterative",
    role: "System Design, Workflow Automation",
    status: "live",
    stack: ["Notion Databases", "Linked Views", "Apple Shortcuts"],
    highlights: [
      "Recurring and previsional payment lists",
      "Monthly and daily summary views",
      "History section for tracking trends over time",
    ],
    why: "I knew roughly what left my account every month and precisely nothing about why the number kept surprising me.",
    problem:
      "Recurring costs and one-off spending live in the same bank feed, so the predictable part is impossible to separate from the part worth reacting to.",
    solution:
      "Recurring and previsional payments are kept as their own source of truth, with monthly and daily views rolled up from it and a history section that turns a month into a trend. Apple Shortcuts handles capture, so logging a cost never means opening Notion.",
    metrics: [
      { label: "Views", value: "Month, day, history" },
      { label: "Capture", value: "Apple Shortcuts" },
      { label: "Upkeep", value: "Iterative" },
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
    year: "2023",
    duration: "Iterative",
    role: "Information Architecture",
    status: "live",
    stack: ["Notion Databases", "Board Views", "Rollups"],
    highlights: [
      "Structured pages for Library, Genres, Authors, and Details",
      "Board by year for browsing and planning",
      "Summary stats to monitor reading consistency",
    ],
    why: "A reading list is easy. Knowing what you actually read, and noticing when you have quietly stopped, is the hard part.",
    problem:
      "Books, authors and genres are separate things that every reading app flattens into one list, which makes questions like 'what have I not finished' unanswerable.",
    solution:
      "Separate databases for library, genres and authors, related rather than duplicated, with a board by year for planning and rollups that surface pages read and the pipeline still open.",
    metrics: [
      { label: "Structure", value: "Linked databases" },
      { label: "Planning", value: "Board by year" },
      { label: "Signal", value: "Reading consistency" },
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
    year: "2023",
    duration: "Iterative",
    role: "Workflow Design",
    status: "live",
    stack: ["Notion Databases", "Templates", "Filtered Views"],
    highlights: [
      "Weekly meals view connected to recipe database",
      "Dedicated shopping flow and phone-oriented list",
      "Ingredient inventory and out-of-stock management",
    ],
    why: "Deciding what to eat, knowing what is in the cupboard, and writing the shopping list are the same problem solved three times a week from scratch.",
    problem:
      "Meal plans, recipes and shopping lists are usually three disconnected documents, so the list is always missing something a planned meal needs.",
    solution:
      "One recipe database feeds the weekly plan; the plan feeds the shopping list; the ingredient inventory marks what has run out. Each step reads from the one before it instead of being retyped.",
    metrics: [
      { label: "Flow", value: "Plan → list → kitchen" },
      { label: "Surface", value: "Phone-first list" },
      { label: "Tracking", value: "Out-of-stock state" },
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
    year: "2023",
    duration: "1 day",
    role: "Automation Design",
    status: "live",
    stack: ["Apple Shortcuts", "iOS", "URL Actions"],
    highlights: [
      "Cross-service listening workflow",
      "Single-action mobile automation",
      "Designed for daily usage speed",
    ],
    why: "Half my listening history is on one service and half my devices default to the other. Every handoff was a manual search.",
    problem:
      "Moving a track between two music ecosystems means copying a name, switching apps, searching, and hoping the right version comes up first.",
    solution:
      "A single shortcut that takes what is playing and opens its match on the other side, reachable from the share sheet so it works from wherever the track already is.",
    metrics: [
      { label: "Surface", value: "Share sheet" },
      { label: "Steps", value: "One tap" },
      { label: "Platform", value: "iOS" },
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
    year: "2023",
    duration: "1 day",
    role: "Automation Design",
    status: "live",
    stack: ["Apple Shortcuts", "iOS"],
    highlights: [
      "Quick-start fitness routine",
      "Optimized for repeated short sessions",
      "Lightweight mobile-first interaction",
    ],
    why: "A Tabata round is four minutes. Any setup longer than a few seconds is a bigger share of the session than the warm-up.",
    problem:
      "Interval timer apps want a configured workout, an account, and a screen you have to look at while your hands are busy.",
    solution:
      "A shortcut that starts the round from one tap and signals each interval by sound and haptics, so the phone can stay face down on the floor.",
    metrics: [
      { label: "Setup", value: "One tap" },
      { label: "Feedback", value: "Audio and haptic" },
      { label: "Platform", value: "iOS" },
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

  // ----------------------------------------------------------------------
  // PRINT & MERCHANDISE
  // ----------------------------------------------------------------------
  {
    id: "gin-tonic-tshirt",
    title: "Gin-Tonic T-Shirt Design",
    description:
      "Minimalist graphic design for apparel featuring a cocktail glass with a witty tagline, created for print production.",
    longDescription:
      "A custom shirt design project combining playful illustration with minimalist typography. The design features a gin-tonic glass with the phrase 'let the party be-gin' as a clever visual pun, optimized for screen printing.",
    category: "CREATIVE",
    platform: "web",
    tags: ["Design", "Apparel", "Print", "Illustrator"],
    year: "2023",
    date: "2023-12",
    duration: "1 week",
    role: "Illustration and print artwork",
    status: "live",
    stack: ["Affinity Designer", "Print Design", "Vector Graphics"],
    highlights: [
      "Minimalist cocktail illustration with personality",
      "Screen-print ready vector artwork",
      "Front and back designs with alternate variations",
    ],
    problem:
      "Need a playful, minimalist design for custom apparel that stands out while remaining timeless.",
    solution:
      "Designed a clever visual pun combining typography and illustration in Affinity Designer, optimized for garment printing.",
    // `mockup` intentionally absent: the files below are the flat print
    // artwork, not photographs or renders of the finished garment. Add a
    // `mockup` block once real product images exist — the template already
    // renders it above the brief.
    plates: [
      {
        src: "/projects/merchandise/gin-tonic/gin-tonic-front.png",
        label: "Front print",
        note: "The chest graphic as it goes to the screen — transparent, no background to knock out.",
      },
      {
        src: "/projects/merchandise/gin-tonic/gin-tonic-back.png",
        label: "Back print",
        note: "The wordmark that carries the pun, sized for the full width of the back.",
      },
      {
        src: "/projects/merchandise/gin-tonic/gin-tonic-illustration.png",
        label: "Filled illustration",
        note: "The artwork as it prints on dark garments — solid shapes, no hairlines to clog the screen.",
      },
      {
        src: "/projects/merchandise/gin-tonic/gin-tonic-illustration-outline.png",
        label: "Outline variant",
        note: "Stroke-only version for light fabric, where a solid fill would dominate the shirt.",
      },
    ],
    metrics: [
      { label: "Artwork", value: "Vector, print-ready" },
      { label: "Technique", value: "Screen print" },
      { label: "Placement", value: "Front and back" },
    ],
    links: {},
    media: {
      thumbnail: "/projects/merchandise/gin-tonic/gin-tonic-front.png",
      fit: "contain",
    },
    interaction: "spotlight",
    layout: "wide",
  },
  {
    id: "phone-covers-design",
    title: "Phone Covers Design Collection",
    description:
      "Custom phone case graphics created on commission, featuring diverse design styles and artistic approaches.",
    longDescription:
      "A commissioned project designing multiple phone cover variations. Each design brings a distinct aesthetic perspective suitable for custom case production, showcasing versatility in commercial graphic design.",
    category: "CREATIVE",
    platform: "web",
    tags: ["Design", "Merchandise", "Commercial", "Illustrator"],
    year: "2023",
    duration: "2 weeks",
    role: "Commissioned artwork",
    status: "live",
    stack: ["Affinity Designer", "Design for Commerce", "Print Production"],
    highlights: [
      "Multiple design variations for client selection",
      "Commercial-grade print specifications",
      "Portfolio-ready production files",
    ],
    problem:
      "Create multiple custom phone case designs on commission with commercial production requirements.",
    solution:
      "Developed a collection of diverse graphic designs in Affinity Designer, optimized for phone case printing and client approval workflow.",
    // `mockup` intentionally absent — see the note on the Gin-Tonic project.
    plates: [
      {
        src: "/projects/merchandise/phone-covers/stranger-things-final.png",
        label: "Stranger Things — final",
        note: "The approved artwork, as delivered for printing.",
      },
      {
        src: "/projects/merchandise/phone-covers/himym-cover.jpg",
        label: "How I Met Your Mother",
        note: "Second commission in the set, a different register entirely.",
      },
      {
        src: "/projects/merchandise/phone-covers/stranger-things-variant-01.png",
        label: "Variant 01",
        note: "First direction presented to the client — heavier on the title lettering.",
      },
      {
        src: "/projects/merchandise/phone-covers/stranger-things-variant-02.png",
        label: "Variant 02",
        note: "Second direction, trading the lettering for the silhouette.",
      },
      {
        src: "/projects/merchandise/phone-covers/phone-cover-background-01.jpg",
        label: "Texture study 01",
        note: "Background explorations that fed the final composition.",
      },
      {
        src: "/projects/merchandise/phone-covers/phone-cover-background-03.jpg",
        label: "Texture study 02",
      },
    ],
    metrics: [
      { label: "Brief", value: "Commission" },
      { label: "Directions", value: "Multiple per case" },
      { label: "Output", value: "Print-ready files" },
    ],
    links: {},
    media: {
      thumbnail: "/projects/merchandise/phone-covers/himym-cover.jpg",
      fit: "contain",
    },
    interaction: "tilt",
  },

  // ----------------------------------------------------------------------
  // PHOTOGRAPHY & PORTRAITURE
  // ----------------------------------------------------------------------
  {
    id: "mirror-archetype-cosplay",
    title: "The Mirror Archetype — Cosplay Compositing",
    description:
      "Complex portraiture and digital compositing project featuring a single performer in dual protagonist/antagonist roles through narrative symmetry.",
    longDescription:
      "An ambitious cosplay photography project bringing the Seven Deadly Sins aesthetic to life through multi-plate studio compositing. Using single-subject mirroring and landscape symmetry, the final piece creates a static narrative tension between hero and villain archetypes.",
    category: "CREATIVE",
    platform: "web",
    tags: ["Photography", "Compositing", "Cosplay", "Affinity", "Narrative"],
    year: "2024",
    date: "2024-06",
    duration: "4 weeks",
    role: "Photography, Post-Production, Conceptualization",
    status: "live",
    stack: ["Canon Camera", "Affinity Photo", "On-Location Lighting"],
    highlights: [
      "Complex multi-plate compositing for visual storytelling",
      "Symmetry-based framing to emphasize conflict and balance",
      "Single-subject dual-role technique for narrative cohesion",
    ],
    why: "I wanted to push cosplay photography beyond the usual 'character standing in a field' format. The Seven Deadly Sins arc has this deep internal conflict — one person carrying both light and dark — and I wanted to show that in a single frame, not a series.",
    problem:
      "How to visually communicate character rivalry and internal conflict in a static image without losing photographic authenticity.",
    solution:
      "Used location scouting, lighting consistency, and precise compositing to merge two narrative poles into one coherent visual statement.",
    metrics: [
      { label: "Technique", value: "Multi-plate compositing" },
      { label: "Scenes", value: "3 plates (backgrounds + characters)" },
      { label: "Character", value: "Seven Deadly Sins Archetype" },
    ],
    plates: [
      {
        src: "/projects/cosplay/mirror-archetype/mirror-archetype-background-03.jpeg",
        label: "Background plate",
        note: "Shot empty first. Everything else has to match this light, so it sets the rules for the rest of the session.",
      },
      {
        src: "/projects/cosplay/mirror-archetype/mirror-archetype-left.jpeg",
        label: "Left subject",
        note: "The protagonist pole, framed with the composite's centre line already in mind.",
      },
      {
        src: "/projects/cosplay/mirror-archetype/mirror-archetype-right.jpeg",
        label: "Right subject",
        note: "Same performer, same lens, mirrored blocking — the antagonist half of the frame.",
      },
    ],
    links: {},
    media: {
      thumbnail:
        "/projects/cosplay/mirror-archetype/mirror-archetype-final-01.jpg",
      gallery: [
        "/projects/cosplay/mirror-archetype/mirror-archetype-final-02.jpg",
        "/projects/cosplay/mirror-archetype/mirror-archetype-final-03.jpg",
      ],
      fit: "cover",
    },
    interaction: "glitch",
    layout: "featured",
  },
];
