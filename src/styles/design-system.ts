export const DESIGN_SYSTEM = {
  color: {
    voltaLight: "#8b5cf6",
    voltaDark: "#a78bfa",
    larioLight: "#3b82f6",
    larioDark: "#60a5fa",
    silkLight: "#fafafa",
    silkDark: "#0a0a0a",
    slateLight: "#111827",
    slateDark: "#f3f4f6",
    slateMuted: "#64748b",
    white: "#ffffff",
    black: "#000000",
    superDark: "#ff4d4d",
    live: "#ff5f57",
    terminalGreen: "#0f0",
    brandDark: "#05070b",
    brandDarkAlt: "#0f1728",
    brandBlue: "#2f8dff",
    brandTeal: "#13c5a3",
    brandBlueAlt: "#40a3ff",
    brandDark2: "#121b2b",
    opengraphText: "#f2f6ff",
    iconText: "#f7fbff",
    twitterText: "#f7fbff",
    manifestLight: "#f4f5f7",
  },
  gradient: {
    icon:
      "radial-gradient(circle at 20% 22%, #2f8dff 0%, rgba(47,141,255,0) 42%), radial-gradient(circle at 78% 80%, #13c5a3 0%, rgba(19,197,163,0) 40%), linear-gradient(140deg, #05070b 0%, #0f1728 100%)",
    apple:
      "radial-gradient(circle at 22% 18%, #40a3ff 0%, rgba(64,163,255,0) 42%), linear-gradient(145deg, #05070b 0%, #121b2b 100%)",
    openGraph:
      "radial-gradient(circle at 8% 18%, #2f8dff 0%, rgba(47,141,255,0) 36%), radial-gradient(circle at 92% 82%, #13c5a3 0%, rgba(19,197,163,0) 40%), linear-gradient(135deg, #06080d 0%, #0b1220 100%)",
    twitter:
      "linear-gradient(150deg, #041f38 0%, #0a111b 48%, #132b33 100%)",
  },
  // Motion — the JS mirror of the scale in _variables.scss.
  // Kept in sync by hand because framer-motion and the Web Animations API
  // cannot read SCSS variables. Durations are in seconds (framer's unit) and
  // easings are bezier tuples (framer's format), so both drop straight into a
  // `transition`. Change a value here and you must change it there.
  motion: {
    duration: {
      instant: 0.1,
      micro: 0.15,
      base: 0.2,
      slow: 0.3,
      slower: 0.4,
      reveal: 0.52,
    },
    ease: {
      standard: [0.2, 0, 0.2, 1],
      outExpo: [0.16, 1, 0.3, 1],
      back: [0.175, 0.885, 0.32, 1.275],
      inOut: [0.645, 0.045, 0.355, 1],
    },
  },
  // Font families are loaded via next/font in layout.tsx
  // and exposed through SCSS variables / the Text component
} as const;
