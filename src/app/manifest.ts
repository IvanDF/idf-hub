import type { MetadataRoute } from "next";

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
    background_color: "#05070b",
    theme_color: "#05070b",
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
        src: "/projects/rick-and-morty/dark.png",
        sizes: "1833x1130",
        type: "image/png",
        form_factor: "wide",
      },
      {
        src: "/projects/rick-and-morty/light.png",
        sizes: "1833x1130",
        type: "image/png",
        form_factor: "wide",
      },
    ],
  };
}
