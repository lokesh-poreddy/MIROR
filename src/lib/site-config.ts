const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const siteConfig = {
  name: "Miror Constructions & Consultancy",
  shortName: "Miror",
  description:
    "Miror Constructions & Consultancy — civil construction, infrastructure and engineering execution.",
  url: configuredSiteUrl || "http://localhost:3000",
  queryEmail: "p.lokeshreddy2005@gmail.com",
} as const;

export function getSiteUrl(): URL {
  try {
    return new URL(siteConfig.url);
  } catch {
    return new URL("http://localhost:3000");
  }
}

export function siteOrigin(): string {
  return getSiteUrl().origin.replace(/\/$/, "");
}
