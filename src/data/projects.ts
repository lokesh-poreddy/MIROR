export type ProjectStatus = "verified-public" | "client-supplied-pending";

export type Project = {
  slug: string;
  title: string;
  category: string;
  location?: string;
  year?: string;
  status: ProjectStatus;
  role?: string;
  scope?: string[];
  summary: string;
  featured?: boolean;
  media?: string;
};

export const projects: Project[] = [
  {
    slug: "hnss-kuppam-branch-canal-phase-ii",
    title: "HNSS Kuppam Branch Canal — Phase II",
    category: "Irrigation & Infrastructure",
    location: "Andhra Pradesh",
    status: "verified-public",
    role: "CM & CD works contractor within the larger Rithwik Projects package",
    scope: ["CM & CD structures", "Canal-associated civil works"],
    summary:
      "Publicly indexed project documentation names Miror Constructions & Consultancy in connection with CM & CD works on the HNSS Kuppam Branch Canal Phase II package.",
    featured: true,
    media: "/placeholder.svg",
  },
  {
    slug: "revasa-la-valora",
    title: "Revasa Là Valora",
    category: "Residential Construction",
    location: "Kardanur / Hyderabad region, Telangana",
    status: "verified-public",
    role: "Contractor identified in publicly indexed project documentation",
    scope: ["Aluminium formwork", "RCC / structural execution"],
    summary:
      "Publicly indexed project documentation identifies Miror Constructions & Consultancy in connection with aluminium formwork work at the Revasa Là Valora development.",
    featured: true,
    media: "/placeholder.svg",
  },
];

export const clientProjectSlots = Array.from({ length: 16 }, (_, index) => ({
  slot: index + 3,
  status: "client-supplied-pending" as const,
  message: "Awaiting client project data sheet, media and publication permission.",
}));

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
