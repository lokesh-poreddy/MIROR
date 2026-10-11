import type { MetadataRoute } from "next";
export const dynamic = "force-static";
import { siteOrigin } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/admin-login", "/system", "/api"] }],
    sitemap: siteOrigin() + "/sitemap.xml",
  };
}
