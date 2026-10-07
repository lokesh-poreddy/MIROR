import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { siteOrigin } from "@/lib/site-config";

const publicRoutes = [
  "/", "/about", "/about/people", "/about/leadership", "/capabilities",
  "/capabilities/civil", "/capabilities/infrastructure", "/capabilities/structural",
  "/capabilities/formwork", "/capabilities/residential", "/work", "/engineering",
  "/quality-safety", "/sustainability", "/locations", "/careers", "/clients",
  "/insights", "/resources", "/why-miror", "/faq", "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    ...publicRoutes.map((route) => ({ url: siteOrigin() + route, lastModified })),
    ...projects.filter((project) => project.status === "verified-public").map((project) => ({ url: siteOrigin() + "/work/" + project.slug, lastModified })),
  ];
}
