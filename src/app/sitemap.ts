import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/about", "/capabilities", "/work", "/careers", "/quality-safety", "/contact"];
  const base = "https://www.mirorconstructions.example";
  return [
    ...routes.map((route) => ({ url: `${base}${route}`, lastModified: '2026-10-07' })),
    ...projects.map((project) => ({ url: `${base}/work/${project.slug}`, lastModified: '2026-10-07' })),
  ];
}
