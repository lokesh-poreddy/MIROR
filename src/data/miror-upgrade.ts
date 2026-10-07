import { projects as baseProjects } from "@/data/projects";

export type EvidenceState = "verified-public" | "client-supplied-pending";

export type EvidenceProject = {
  slug: string;
  title: string;
  category: string;
  region: "Andhra Pradesh" | "Telangana" | "Other / confirm";
  location: string;
  role: string;
  scope: string[];
  state: EvidenceState;
  summary: string;
  evidenceNote: string;
  mediaState: "placeholder" | "approved-media";
  featured: boolean;
};

const evidenceNotes: Record<string, string> = {
  "hnss-kuppam-branch-canal-phase-ii":
    "The website intentionally describes Miror’s documented role rather than attributing the entire larger project to Miror.",
  "revasa-la-valora":
    "The website presents the documented execution relationship and does not claim Miror built the entire development.",
};

export const evidenceProjects: EvidenceProject[] = baseProjects.map((project) => ({
  slug: project.slug,
  title: project.title,
  category: project.category,
  region: project.location?.toLowerCase().includes("telangana")
    ? "Telangana"
    : "Andhra Pradesh",
  location: project.location ?? "Update soon",
  role: project.role ?? "Update soon",
  scope: project.scope ?? ["Update soon"],
  state: project.status === "verified-public" ? "verified-public" : "client-supplied-pending",
  summary: project.summary,
  evidenceNote:
    evidenceNotes[project.slug] ??
    "Awaiting approved project-specific evidence wording before publication.",
  mediaState: project.media?.includes("placeholder") ? "placeholder" : "approved-media",
  featured: Boolean(project.featured),
}));

export const pendingProjectSlots = Array.from({ length: 16 }, (_, index) => ({
  slot: index + 3,
  title: `Project ${String(index + 3).padStart(2, "0")}`,
  state: "client-supplied-pending" as const,
  note: "Awaiting approved project data, project photography and publication permission.",
}));

export const capabilityGroups = [
  {
    id: "civil",
    number: "01",
    title: "Civil Construction",
    description:
      "Site-focused civil execution presented around documented experience and approved project information.",
    links: ["Earthwork", "Concrete works", "Civil structures", "Site execution"],
    route: "/capabilities/civil",
  },
  {
    id: "infrastructure",
    number: "02",
    title: "Infrastructure",
    description:
      "Infrastructure delivery framed around irrigation, canal-associated civil structures and future confirmed work packages.",
    links: ["Irrigation", "Canal works", "CM & CD works", "Infrastructure packages"],
    route: "/capabilities/infrastructure",
  },
  {
    id: "structural",
    number: "03",
    title: "Structural Execution",
    description:
      "RCC and structural execution with project-level scope kept specific and evidence-aware.",
    links: ["RCC", "Structural concrete", "Formwork coordination", "Site controls"],
    route: "/capabilities/structural",
  },
  {
    id: "formwork",
    number: "04",
    title: "Aluminium Formwork",
    description:
      "A documented execution capability that can be expanded with approved details and project imagery.",
    links: ["Aluminium formwork", "Cycle planning", "RCC coordination", "Site execution"],
    route: "/capabilities/formwork",
  },
  {
    id: "residential",
    number: "05",
    title: "Residential Construction",
    description:
      "Residential project execution shown through documented project relationships and client-approved portfolio records.",
    links: ["Residential execution", "RCC works", "Formwork", "Project coordination"],
    route: "/capabilities/residential",
  },
] as const;

export const executionSteps = [
  {
    number: "01",
    title: "Understand",
    body: "Read the brief, the drawings, the site conditions and the delivery context before committing to execution language.",
  },
  {
    number: "02",
    title: "Plan",
    body: "Translate the scope into sequences, dependencies, people, materials and practical site controls.",
  },
  {
    number: "03",
    title: "Build",
    body: "Coordinate field execution with disciplined handoffs, quality checks and project-specific decisions.",
  },
  {
    number: "04",
    title: "Verify",
    body: "Keep records, project evidence and published claims aligned so the digital story remains traceable.",
  },
] as const;

export const engineeringModes = [
  { id: "plan", label: "PLAN", description: "Top-level coordination view with axes and structural rhythm." },
  { id: "elevation", label: "ELEVATION", description: "Vertical frame showing bays, decks, supports and alignment." },
  { id: "section", label: "SECTION", description: "Cut-through technical view for structure and depth relationships." },
  { id: "3d", label: "3D", description: "Isometric construction study used as a web-native visual language." },
] as const;

export type EngineeringMode = (typeof engineeringModes)[number]["id"];

export const locationSignals = [
  {
    region: "Andhra Pradesh",
    role: "Primary corporate base",
    detail: "Ongole / Prakasam region",
    code: "AP-01",
  },
  {
    region: "Telangana",
    role: "Documented project footprint",
    detail: "Hyderabad region",
    code: "TS-01",
  },
] as const;

export const homepageNarrative = {
  eyebrow: "Civil construction · infrastructure · execution",
  title: "We build the work behind what moves people, places and projects forward.",
  lead:
    "Miror Constructions & Consultancy is shaping its digital presence around evidence-led project stories, practical engineering thinking and disciplined construction execution.",
  supporting:
    "The site separates what is documented publicly from what is waiting for client approval, so the company can grow its portfolio without compromising credibility.",
};

export const trustPrinciples = [
  {
    number: "01",
    title: "Specific over inflated",
    body: "Project roles, scopes and relationships are described at the level the available evidence can support.",
  },
  {
    number: "02",
    title: "Useful over decorative",
    body: "Engineering visuals are treated as communication tools rather than generic 3D decoration.",
  },
  {
    number: "03",
    title: "Ready for real media",
    body: "Every image region has a replaceable media contract so approved project photography can slot in later.",
  },
  {
    number: "04",
    title: "Built for expansion",
    body: "Projects, capabilities and content are structured as data-driven units rather than one-off pages.",
  },
] as const;

export const mediaPlaceholders = {
  hero: {
    label: "Approved hero project photography",
    note: "Replace with a licensed Miror construction image or video before launch.",
  },
  projects: {
    label: "Project photography",
    note: "Replace with approved project imagery after publication permission is recorded.",
  },
} as const;

export function formatEvidenceLabel(state: EvidenceState): string {
  return state === "verified-public" ? "Public evidence" : "Client update pending";
}

export function isPubliclyPresentable(project: EvidenceProject): boolean {
  return project.state === "verified-public";
}

export function getEvidenceProject(slug: string): EvidenceProject | undefined {
  return evidenceProjects.find((project) => project.slug === slug);
}

export function buildProjectMailSubject(projectTitle: string): string {
  return `Miror project enquiry — ${projectTitle}`;
}
