import type { MirorPageSection, MirorRouteConfig } from "@/components/page-frame";

export const MIROR_V9_ROUTES: MirorRouteConfig[] = [
  {
    path: "/sustainability",
    title: "Responsible construction, considered from the ground up.",
    shortTitle: "Sustainability",
    number: "16",
    eyebrow: "Responsible construction",
    category: "Sustainability & Environment",
    description: "A measured responsibility layer for site stewardship, resource awareness and future-ready learning. Claims remain approval-controlled.",
    heroMode: "editorial",
    align: "left",
    tone: "paper",
    menuGroup: "Company",
    primaryCta: { label: "Explore responsibility", href: "#sustainability-content" },
    secondaryCta: { label: "Contact Miror", href: "/contact" },
    sections: [
      { id: "sustainability-content", label: "Responsible construction", status: "live" },
      { id: "resource-discipline", label: "Resource discipline", status: "approval" },
      { id: "future-methods", label: "Future methods", status: "update-soon" },
    ],
  },
  {
    path: "/about/people",
    title: "People who turn drawings into working structures.",
    shortTitle: "People",
    number: "17",
    eyebrow: "People & Teams",
    category: "People",
    description: "A human layer for engineers, supervisors, planning teams and execution specialists. Detailed biographies will be updated with client-approved content.",
    heroMode: "editorial",
    align: "left",
    tone: "paper",
    menuGroup: "About",
    primaryCta: { label: "Meet the team", href: "#people-content" },
    secondaryCta: { label: "Careers", href: "/careers" },
    sections: [
      { id: "people-content", label: "Teams", status: "update-soon" },
      { id: "project-engineering", label: "Project engineering", status: "update-soon" },
      { id: "site-execution", label: "Site execution", status: "update-soon" },
    ],
    parent: "About",
  },
  {
    path: "/about/leadership",
    title: "Leadership, experience and the discipline behind delivery.",
    shortTitle: "Leadership",
    number: "18",
    eyebrow: "Leadership",
    category: "Leadership",
    description: "Leadership profiles are structured for future publication; names, photographs and biographies will be added after client review.",
    heroMode: "editorial",
    align: "split",
    tone: "paper",
    menuGroup: "About",
    primaryCta: { label: "Leadership updates", href: "#leadership-content" },
    secondaryCta: { label: "About Miror", href: "/about" },
    sections: [
      { id: "leadership-content", label: "Leadership", status: "update-soon" },
      { id: "experience", label: "Experience", status: "approval" },
      { id: "future-profiles", label: "Profile updates", status: "update-soon" },
    ],
    parent: "About",
  },
  {
    path: "/careers",
    title: "Build your career where things get built.",
    shortTitle: "Careers",
    number: "19",
    eyebrow: "People & opportunity",
    category: "Careers",
    description: "A future-ready career surface for engineering, site execution, planning, quality, safety, commercial and administration roles. Current vacancies will be added later.",
    heroMode: "technical",
    align: "split",
    tone: "dark",
    menuGroup: "Company",
    primaryCta: { label: "Career enquiry", href: "mailto:p.lokeshreddy2005@gmail.com?subject=Miror%20Career%20Enquiry" },
    secondaryCta: { label: "Our people", href: "/about/people" },
    sections: [
      { id: "careers-content", label: "Opportunities", status: "update-soon" },
      { id: "teams", label: "Teams", status: "live" },
      { id: "talent-network", label: "Talent network", status: "update-soon" },
    ],
  },
  {
    path: "/clients",
    title: "Built through trusted project relationships.",
    shortTitle: "Clients & Partners",
    number: "20",
    eyebrow: "Project relationships",
    category: "Clients & Partners",
    description: "A permission-aware relationship layer for confirmed clients, principal contractors, developers and partners. Public logos remain hidden until approved.",
    heroMode: "editorial",
    align: "center",
    tone: "paper",
    menuGroup: "Company",
    primaryCta: { label: "Discuss a partnership", href: "mailto:p.lokeshreddy2005@gmail.com?subject=Miror%20Partnership%20Enquiry" },
    secondaryCta: { label: "See our work", href: "/work" },
    sections: [
      { id: "clients-content", label: "Confirmed relationships", status: "approval" },
      { id: "partners", label: "Partners", status: "update-soon" },
      { id: "relationship-proof", label: "Project proof", status: "approval" },
    ],
  },
  {
    path: "/locations",
    title: "From Andhra Pradesh to Telangana, project by project.",
    shortTitle: "Locations",
    number: "21",
    eyebrow: "Where we work",
    category: "Locations",
    description: "The current footprint highlights Andhra Pradesh and Telangana, with project-level locations added as the portfolio is approved.",
    heroMode: "technical",
    align: "split",
    tone: "technical",
    menuGroup: "Company",
    primaryCta: { label: "View project footprint", href: "#locations-content" },
    secondaryCta: { label: "Our work", href: "/work" },
    sections: [
      { id: "locations-content", label: "Andhra Pradesh", status: "live" },
      { id: "telangana", label: "Telangana", status: "live" },
      { id: "future-expansion", label: "Future expansion", status: "update-soon" },
    ],
  },
  {
    path: "/insights",
    title: "Learning new methods. Improving the work.",
    shortTitle: "Insights",
    number: "22",
    eyebrow: "Learning & innovation",
    category: "Insights & Innovation",
    description: "A restrained editorial layer for new techniques, field learning, engineering thinking, construction methods and future capability development.",
    heroMode: "editorial",
    align: "left",
    tone: "paper",
    menuGroup: "Company",
    primaryCta: { label: "Explore learning", href: "#insights-content" },
    secondaryCta: { label: "Engineering", href: "/engineering" },
    sections: [
      { id: "insights-content", label: "New techniques", status: "update-soon" },
      { id: "field-learning", label: "Field learning", status: "update-soon" },
      { id: "engineering-thinking", label: "Engineering thinking", status: "live" },
    ],
  },
  {
    path: "/resources",
    title: "The documents behind the work.",
    shortTitle: "Resources",
    number: "23",
    eyebrow: "Company resources",
    category: "Resources",
    description: "A controlled document center for future company profiles, project sheets, capability statements, policies and approved technical information.",
    heroMode: "archive",
    align: "center",
    tone: "paper",
    menuGroup: "Company",
    primaryCta: { label: "Request a document", href: "mailto:p.lokeshreddy2005@gmail.com?subject=Miror%20Document%20Request" },
    secondaryCta: { label: "Contact", href: "/contact" },
    sections: [
      { id: "resources-content", label: "Company profile", status: "update-soon" },
      { id: "project-resources", label: "Project sheets", status: "update-soon" },
      { id: "approved-documents", label: "Approved documents", status: "approval" },
    ],
  },
  {
    path: "/why-miror",
    title: "Why Miror: execution first, learning always.",
    shortTitle: "Why Miror",
    number: "24",
    eyebrow: "Why Miror",
    category: "Trust",
    description: "A factual trust story built from project experience, execution focus, adaptability and a commitment to improving the work.",
    heroMode: "editorial",
    align: "left",
    tone: "dark",
    menuGroup: "Company",
    primaryCta: { label: "See the work", href: "/work" },
    secondaryCta: { label: "Start a conversation", href: "/contact" },
    sections: [
      { id: "why-miror-content", label: "Execution focus", status: "live" },
      { id: "proof", label: "Project proof", status: "approval" },
      { id: "learning", label: "Continuous learning", status: "live" },
    ],
  },
  {
    path: "/faq",
    title: "Questions answered before the first meeting.",
    shortTitle: "FAQs",
    number: "25",
    eyebrow: "Questions",
    category: "FAQs",
    description: "A clear, searchable FAQ layer for projects, capabilities, locations, documents and contact. Complex or project-specific queries can be sent directly to the supplied mailbox.",
    heroMode: "archive",
    align: "center",
    tone: "paper",
    menuGroup: "Support",
    primaryCta: { label: "Ask Miror", href: "mailto:p.lokeshreddy2005@gmail.com?subject=Miror%20Question" },
    secondaryCta: { label: "Contact", href: "/contact" },
    sections: [
      { id: "faq-content", label: "General questions", status: "live" },
      { id: "project-queries", label: "Project queries", status: "live" },
      { id: "contact-queries", label: "Contact questions", status: "live" },
    ],
  },
  {
    path: "/contact",
    title: "Have a project worth building?",
    shortTitle: "Contact",
    number: "26–27",
    eyebrow: "Start a conversation",
    category: "Contact & Project Enquiry",
    description: "The contact route combines general enquiry, project qualification, document context and future form persistence while keeping the first step simple.",
    heroMode: "contact",
    align: "split",
    tone: "dark",
    menuGroup: "Contact",
    primaryCta: { label: "Email Miror", href: "mailto:p.lokeshreddy2005@gmail.com?subject=Miror%20Project%20Enquiry" },
    secondaryCta: { label: "See our work", href: "/work" },
    sections: [
      { id: "contact-content", label: "Contact", status: "live" },
      { id: "smart-contact", label: "Project qualification", status: "live" },
      { id: "documents", label: "Future document upload", status: "update-soon" },
    ],
  },
];

export const V9_ROUTE_BY_PATH = Object.fromEntries(MIROR_V9_ROUTES.map((route) => [route.path, route])) as Record<string, MirorRouteConfig>;

export function getV9Route(path: string): MirorRouteConfig | undefined {
  return V9_ROUTE_BY_PATH[path];
}

export function getV9RoutesByGroup(group: string): MirorRouteConfig[] {
  return MIROR_V9_ROUTES.filter((route) => route.menuGroup === group);
}

export function getV9ChildRoutes(parent: string): MirorRouteConfig[] {
  return MIROR_V9_ROUTES.filter((route) => route.parent === parent);
}

export function validateV9RouteConfiguration(route: MirorRouteConfig): string[] {
  const errors: string[] = [];
  if (!route.path.startsWith("/")) errors.push("Route must begin with /.");
  if (!route.title.trim()) errors.push("Title is required.");
  if (!route.description.trim()) errors.push("Description is required.");
  if (!route.primaryCta.href.trim()) errors.push("Primary CTA must have a destination.");
  if (route.sections.length === 0) errors.push("Every corporate route needs at least one section.");
  const ids = new Set<string>();
  for (const section of route.sections) {
    if (ids.has(section.id)) errors.push(`Duplicate section id: ${section.id}`);
    ids.add(section.id);
    if (!section.label.trim()) errors.push(`Section ${section.id} needs a label.`);
  }
  if (route.path === "/contact" && !route.primaryCta.href.includes("p.lokeshreddy2005@gmail.com")) {
    errors.push("Contact route must use the approved query mailbox.");
  }
  return errors;
}

export const V9_ROUTE_VALIDATION = MIROR_V9_ROUTES.map((route) => ({
  path: route.path,
  errors: validateV9RouteConfiguration(route),
}));

export const V9_VALID_ROUTE_COUNT = V9_ROUTE_VALIDATION.filter((item) => item.errors.length === 0).length;
export const V9_INVALID_ROUTE_COUNT = V9_ROUTE_VALIDATION.length - V9_VALID_ROUTE_COUNT;
