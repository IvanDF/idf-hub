import { PROJECTS } from "@/data/projects";
import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://idf-hub.vercel.app";

// /secrets is deliberately absent: an easter egg loses its point once a
// sitemap hands it to every crawler.
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["/", "/lab", "/about", "/time-machine"];

  return [
    ...routes.map((route) => ({
      url: `${siteUrl}${route}`,
      changeFrequency: route === "/" ? ("weekly" as const) : ("monthly" as const),
      priority: route === "/" ? 1 : 0.7,
    })),
    ...PROJECTS.map((project) => ({
      url: `${siteUrl}/lab/${project.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
