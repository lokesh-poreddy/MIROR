import type { Metadata } from "next";
import { MirorV9PageFrame } from "@/components/v9/MirorV9PageFrame";
import V9Careers from "@/components/v9/MirorV9Careers";
import { getV9Route, validateV9RouteConfiguration } from "@/data/V9RouteRegistry";
import "@/styles/miror-v9-routing.css";

const ROUTE_PATH = "/careers" as const;
const ROUTE = getV9Route(ROUTE_PATH);

if (!ROUTE) {
  throw new Error(`MIROR V9 route configuration is missing for ${ROUTE_PATH}`);
}

const routeErrors = validateV9RouteConfiguration(ROUTE);
if (routeErrors.length) {
  throw new Error(`MIROR V9 route configuration error: ${routeErrors.join("; ")}`);
}

export const metadata: Metadata = {
  title: `${ROUTE.shortTitle} | Miror Constructions`,
  description: ROUTE.description,
  alternates: { canonical: ROUTE.path },
  openGraph: {
    title: `${ROUTE.shortTitle} | Miror Constructions`,
    description: ROUTE.description,
    type: "website",
    url: ROUTE.path,
  },
};

const ALIGNMENT_NOTES = [
  "Desktop uses a 12-column editorial grid with the section index occupying the left rail.",
  "The main section remains fluid and never relies on absolute positioning for core content.",
  "Tablet collapses the rail into an ordered index above the content.",
  "Mobile collapses all grid columns to a single reading column.",
  "The technical visual stage may be reduced or replaced with approved placeholder media.",
  "CTA buttons remain keyboard reachable and use semantic links.",
  "Breadcrumbs expose the route hierarchy to users and search engines.",
  "The page frame owns spacing; the section component owns its internal content.",
  "This separation prevents section-specific CSS from breaking global routing geometry.",
  "Dark pages retain identical information architecture while changing only the visual tone.",
] as const;

const PAGE_BEHAVIOUR = {
  route: ROUTE.path,
  sectionCount: ROUTE.sections.length,
  alignment: ROUTE.align,
  heroMode: ROUTE.heroMode,
  tone: ROUTE.tone,
  reducedMotionSafe: true,
  keyboardSafe: true,
  placeholderSafe: true,
  evidenceSafe: true,
  primaryMailbox: "p.lokeshreddy2005@gmail.com",
  alignmentNotes: ALIGNMENT_NOTES,
} as const;

function RouteDiagnosticPanel() {
  if (process.env.NODE_ENV === "production") return null;
  return (
    <details className="miror-v9-route-diagnostics">
      <summary>V9 Route diagnostics</summary>
      <pre>{JSON.stringify(PAGE_BEHAVIOUR, null, 2)}</pre>
    </details>
  );
}

function PageIntro() {
  return (
    <div className="miror-v9-route-intro" id={ROUTE.sections[0]?.id ?? "content"}>
      <div className="miror-v9-route-intro-number">SECTION {ROUTE.number}</div>
      <h2>{ROUTE.title}</h2>
      <p>{ROUTE.description}</p>
    </div>
  );
}

export default function CareersPage() {
  return (
    <MirorV9PageFrame route={ROUTE}>
      <PageIntro />
      <div className="miror-v9-route-module">
        <V9Careers />
      </div>
      
      <RouteDiagnosticPanel />
    </MirorV9PageFrame>
  );
}
