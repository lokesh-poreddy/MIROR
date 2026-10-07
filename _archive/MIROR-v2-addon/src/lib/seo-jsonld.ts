const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Miror Constructions and Consultancy Private Limited",
    url: siteUrl,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ongole",
      addressRegion: "Andhra Pradesh",
      postalCode: "523001",
      addressCountry: "IN",
    },
  };
}

export function projectJsonLd(project: {
  title: string;
  summary: string;
  location?: string;
  image?: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    url: `${siteUrl}/work/${project.slug}`,
    ...(project.location ? { locationCreated: { "@type": "Place", name: project.location } } : {}),
    ...(project.image ? { image: [`${siteUrl}${project.image}`] } : {}),
  };
}
