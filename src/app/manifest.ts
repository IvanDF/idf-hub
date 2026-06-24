import type { MetadataRoute } from "next";
import { DESIGN_SYSTEM } from "@/styles/design-system";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "iDF 2.0",
    short_name: "iDF",
    description:
      "Interactive portfolio with creative experiments, polished micro-effects, and digital craftsmanship.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: DESIGN_SYSTEM.color.brandDark,
    theme_color: DESIGN_SYSTEM.color.brandDark,
    lang: "en",
    categories: ["portfolio", "design", "art", "technology"],
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/icon?size=192",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon?size=512",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icon?size=512",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcuts: [
      {
        name: "Explore Lab",
        short_name: "Lab",
        description: "Open interactive experiments and prototypes.",
        url: "/lab",
      },
      {
        name: "Open Time Machine",
        short_name: "Time",
        description: "Jump into timeline storytelling mode.",
        url: "/time-machine",
      },
    ],
    screenshots: [
      {
        src: "/screenshots/dark.png",
        sizes: "3024x1964",
        type: "image/png",
        form_factor: "wide",
        label: "iDF – dark theme",
      },
      {
        src: "/screenshots/light.png",
        sizes: "3024x1964",
        type: "image/png",
        form_factor: "wide",
        label: "iDF – light theme",
      },
      {
        src: "/screenshots/super-dark.png",
        sizes: "3024x1964",
        type: "image/png",
        form_factor: "wide",
        label: "iDF – super dark theme",
      },
    ],
  };
}
