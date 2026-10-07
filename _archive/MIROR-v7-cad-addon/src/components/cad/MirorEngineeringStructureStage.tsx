"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import MirorArchitecturalViewport from "@/components/cad/MirorArchitecturalViewport";
import MirorBlueprintOverlay from "@/components/cad/MirorBlueprintOverlay";
import {
  CAD_A11Y_COPY,
  CAD_PALETTE,
  getRecommendedStructure,
  getStructurePreset,
  structureDescription,
  type HotspotSpec,
  type StructurePreset,
} from "@/lib/miror-cad-geometry";

export type EngineeringStageProps = {
  projectTitle?: string;
  projectCategory?: string;
  projectLocation?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  structureId?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
  showBlueprint?: boolean;
  showModel?: boolean;
  sticky?: boolean;
  compact?: boolean;
  onOpenProject?: () => void;
};

type Chapter = {
  id: string;
  number: string;
  label: string;
  title: string;
  copy: string;
};

const CHAPTERS: Chapter[] = [
  { id: "structure", number: "01", label: "STRUCTURE", title: "Read the structure before the surface.", copy: "A restrained technical layer lets visitors understand order, massing, grid and execution logic without turning the website into a simulation tool." },
  { id: "process", number: "02", label: "PROCESS", title: "Turn drawings into project stories.", copy: "Use plan, elevation and section views as editorial devices around the real work, not as substitutes for evidence." },
  { id: "proof", number: "03", label: "PROOF", title: "Connect every visual to something real.", copy: "Approved photographs, project documents, scope descriptions and site facts become the factual layer beneath the visual treatment." },
];

const DEFAULT_COPY = {
  eyebrow: "DIGITAL STRUCTURE / MIROR",
  title: "Where construction logic becomes visible.",
  description: "An original CAD-inspired visual system for presenting structural thinking alongside the work Miror actually delivers.",
};

function useElementProgress(ref: React.RefObject<HTMLElement | null>) {
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 100, damping: 28, mass: 0.22 });
  const introY = useTransform(smooth, [0, 0.4, 1], [70, 0, -60]);
  const introOpacity = useTransform(smooth, [0, 0.18, 0.72], [0, 1, 1]);
  const mediaScale = useTransform(smooth, [0, 0.48, 1], [0.95, 1, 1.04]);
  const blueprintX = useTransform(smooth, [0, 1], [40, -40]);
  return { progress: smooth, introY, introOpacity, mediaScale, blueprintX };
}

function useActiveChapter(): [string, (id: string) => void] {
  const [active, setActive] = useState(CHAPTERS[0].id);
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const nodes = CHAPTERS.map((chapter) => document.getElementById(`miror-stage-${chapter.id}`)).filter(Boolean) as HTMLElement[];
    if (!nodes.length) return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target.id.startsWith("miror-stage-")) setActive(visible.target.id.replace("miror-stage-", ""));
    }, { threshold: [0.25, 0.5, 0.75], rootMargin: "-20% 0px -55% 0px" });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
  return [active, setActive];
}

function StageNav({ active, onChange }: { active: string; onChange: (id: string) => void }) {
  return (
    <nav className="miror-engineering-stage-nav" aria-label="Engineering visual chapters">
      {CHAPTERS.map((chapter) => (
        <button key={chapter.id} type="button" className={active === chapter.id ? "is-active" : ""} onClick={() => onChange(chapter.id)}>
          <span>{chapter.number}</span>
          <b>{chapter.label}</b>
        </button>
      ))}
    </nav>
  );
}

function StageStats({ preset }: { preset: StructurePreset }) {
  const stats = [
    ["FLOORS", String(preset.floors).padStart(2, "0")],
    ["MODULES", String(preset.modules).padStart(2, "0")],
    ["GRID", `${preset.grid.x}×${preset.grid.z}`],
    ["HOTSPOTS", String(preset.hotspots.length).padStart(2, "0")],
  ];
  return <div className="miror-engineering-stage-stats">{stats.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>;
}

function ScopePills({ preset }: { preset: StructurePreset }) {
  return <div className="miror-engineering-stage-pills">{preset.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>;
}

function HotspotPanel({ hotspot, onClose }: { hotspot: HotspotSpec | null; onClose: () => void }) {
  return <AnimatePresence>{hotspot && <motion.aside initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} className="miror-engineering-hotspot-panel" aria-live="polite"><div className="miror-engineering-hotspot-index">STRUCTURE NOTE / {hotspot.id.toUpperCase()}</div><h3>{hotspot.label}</h3><p>{hotspot.description}</p><button type="button" onClick={onClose}>CLOSE <span>×</span></button></motion.aside>}</AnimatePresence>;
}

function StageHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div className="miror-engineering-stage-header"><div className="miror-engineering-stage-eyebrow">{eyebrow}</div><h2>{title}</h2><p>{description}</p></div>;
}

function StageMetadata({ projectTitle, projectCategory, projectLocation }: Pick<EngineeringStageProps, "projectTitle" | "projectCategory" | "projectLocation">) {
  return <div className="miror-engineering-stage-meta"><div><span>PROJECT</span><strong>{projectTitle ?? "Miror Project"}</strong></div><div><span>SECTOR</span><strong>{projectCategory ?? "Construction"}</strong></div><div><span>LOCATION</span><strong>{projectLocation ?? "India"}</strong></div></div>;
}

function ChapterCopy({ chapter, active }: { chapter: Chapter; active: boolean }) {
  return <motion.article id={`miror-stage-${chapter.id}`} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.45 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className={`miror-engineering-chapter ${active ? "is-active" : ""}`}><span>{chapter.number}</span><div><small>{chapter.label}</small><h3>{chapter.title}</h3><p>{chapter.copy}</p></div></motion.article>;
}

function StructuralLegend() {
  const items = [
    ["PRIMARY", "Core / columns / beams", CAD_PALETTE.line],
    ["ENVELOPE", "Glass / facade study", CAD_PALETTE.glass],
    ["DATUM", "Grid / dimensions", CAD_PALETTE.lineMuted],
    ["FOCUS", "Interactive hotspot", CAD_PALETTE.accent],
  ] as const;
  return <div className="miror-engineering-legend"><span className="miror-engineering-legend-title">VISUAL LEGEND</span>{items.map(([label, copy, color]) => <div key={label}><i style={{ background: color }} /><b>{label}</b><span>{copy}</span></div>)}</div>;
}

function ScrollSignal() {
  return <div className="miror-engineering-scroll-signal" aria-hidden="true"><span>SCROLL / ROTATE</span><i><em /></i></div>;
}

function FallbackTechnicalCard({ preset }: { preset: StructurePreset }) {
  return <div className="miror-engineering-fallback-card"><span>CAD / BIM VISUAL SYSTEM</span><strong>{preset.title}</strong><p>{structureDescription(preset)}</p><div><b>TECHNICAL VISUAL ONLY</b><small>Actual project drawings require client approval.</small></div></div>;
}

export default function MirorEngineeringStructureStage({
  projectTitle,
  projectCategory,
  projectLocation,
  eyebrow = DEFAULT_COPY.eyebrow,
  title = DEFAULT_COPY.title,
  description = DEFAULT_COPY.description,
  structureId,
  ctaLabel = "View project",
  ctaHref = "/work",
  className = "",
  showBlueprint = true,
  showModel = true,
  sticky = true,
  compact = false,
  onOpenProject,
}: EngineeringStageProps) {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [activeChapter, setActiveChapter] = useActiveChapter();
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotSpec | null>(null);
  const resolvedPreset = useMemo(() => structureId ? getStructurePreset(structureId) : getRecommendedStructure(projectCategory), [structureId, projectCategory]);
  const { introY, introOpacity, mediaScale } = useElementProgress(rootRef);
  const setChapter = useCallback((id: string) => {
    setActiveChapter(id);
    document.getElementById(`miror-stage-${id}`)?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "center" });
  }, [prefersReducedMotion, setActiveChapter]);

  const openProject = useCallback(() => {
    if (onOpenProject) return onOpenProject();
    if (typeof window !== "undefined") window.location.href = ctaHref;
  }, [ctaHref, onOpenProject]);

  return (
    <section ref={rootRef} className={`miror-engineering-stage ${sticky ? "is-sticky" : ""} ${compact ? "is-compact" : ""} ${className}`}>
      <div className="miror-engineering-stage-gridline" aria-hidden="true" />
      <div className="miror-engineering-stage-intro">
        <motion.div style={{ y: prefersReducedMotion ? 0 : introY, opacity: introOpacity }}>
          <StageHeader eyebrow={eyebrow} title={title} description={description} />
          <StageMetadata projectTitle={projectTitle} projectCategory={projectCategory} projectLocation={projectLocation} />
          <ScopePills preset={resolvedPreset} />
          <button type="button" className="miror-engineering-stage-cta" onClick={openProject}>{ctaLabel}<span>↗</span></button>
        </motion.div>
        <StageNav active={activeChapter} onChange={setChapter} />
      </div>

      <div className="miror-engineering-stage-visual">
        <motion.div className="miror-engineering-stage-model" style={{ scale: prefersReducedMotion ? 1 : mediaScale }}>
          {showModel ? <MirorArchitecturalViewport structureId={resolvedPreset.id} title={`${projectTitle ?? "Miror"} structural visualization`} onHotspotSelect={setSelectedHotspot} /> : <FallbackTechnicalCard preset={resolvedPreset} />}
        </motion.div>
        {showBlueprint && <motion.div className="miror-engineering-stage-blueprint" style={{ x: prefersReducedMotion ? 0 : undefined }}><MirorBlueprintOverlay preset={resolvedPreset} compact={compact} onHotspotSelect={setSelectedHotspot} /></motion.div>}
        <StructuralLegend />
        <ScrollSignal />
        <HotspotPanel hotspot={selectedHotspot} onClose={() => setSelectedHotspot(null)} />
      </div>

      <div className="miror-engineering-stage-chapters">
        {CHAPTERS.map((chapter) => <ChapterCopy key={chapter.id} chapter={chapter} active={activeChapter === chapter.id} />)}
      </div>

      <div className="miror-engineering-stage-disclaimer">
        <span>VISUAL SYSTEM / V7</span>
        <p>{CAD_A11Y_COPY.instruction}</p>
        <span>CONCEPTUAL / NOT FOR CONSTRUCTION</span>
      </div>
    </section>
  );
}

export function getEngineeringStagePreset(category?: string) { return getRecommendedStructure(category); }
export function getEngineeringStageAlt(projectTitle?: string, category?: string) { const preset = getEngineeringStagePreset(category); return `${projectTitle ?? "Project"}: ${preset.title} ${preset.category.toLowerCase()} visualization`; }

export const ENGINEERING_STAGE_VERSION = "7.0.0";
export const ENGINEERING_STAGE_MODES = ["hero", "project", "capability", "blueprint", "fallback"] as const;
export type EngineeringStageMode = (typeof ENGINEERING_STAGE_MODES)[number];
export function isEngineeringStageMode(value: string): value is EngineeringStageMode { return ENGINEERING_STAGE_MODES.includes(value as EngineeringStageMode); }

/*
 * Integration rules for the Miror production site.
 *
 * A. Place the stage after a concise corporate positioning statement; do not
 *    make the visitor decode the technical visual before knowing what Miror does.
 * B. Use the visual as one side of the composition, leaving clear whitespace
 *    for the headline and a real call-to-action.
 * C. On the homepage, use a generic procedural structure if there is no public
 *    project model yet. A client-provided model can replace it later.
 * D. On an individual project page, the model should use a project-specific
 *    preset or approved GLB asset and should inherit the project's title and
 *    category from the content layer.
 * E. Use the same structural vocabulary across the site to build recognition.
 * F. Blueprint mode is a narrative support layer and should not look like a
 *    technical approval document.
 * G. The CTA must remain visible even if the WebGL visual is disabled.
 * H. Motion should be additive. The page remains readable with no animation.
 * I. Avoid using the technical visual as a loading screen. Real content loads
 *    first, visual enhancement second.
 * J. Keep scroll-linked model motion subtle enough that a user can still read.
 * K. When the active chapter changes, the model does not need to reset camera.
 * L. Hotspots should be limited to information that supports the chapter.
 * M. The chapter rail is optional on smaller layouts and becomes a compact list.
 * N. A real project drawing should never be used as background decoration until
 *    the client confirms copyright and confidentiality permissions.
 * O. For government/public infrastructure, simplify sensitive plans if required.
 * P. Use actual project images around the 3D layer to ground the visual story.
 * Q. Keep all numerical claims outside the visual system unless verified.
 * R. Use an explicit “conceptual visualization” label when using procedural data.
 * S. Maintain stable slugs so SEO links remain meaningful.
 * T. Route project CTA to `/work/[slug]` in the final app.
 * U. Route capability CTA to `/capabilities/[slug]` only if the capability model
 *    exists in the content system.
 * V. Use an external model viewer only when its bundle does not impact the first
 *    contentful paint.
 * W. Never autoplay a 3D model soundtrack or audio.
 * X. Do not hide the site header behind the 3D canvas.
 * Y. Use one consistent technical accent color.
 * Z. Ensure the model canvas has a visible keyboard-safe focus boundary.
 */

const STAGE_A11Y_STRINGS = {
  canvas: "Interactive architectural visualization",
  controls: "Use the external controls to change layers or models.",
  blueprint: "Technical blueprint illustration",
  disclaimer: "Conceptual visual only. Not for construction use.",
  hotspot: "Structure annotation",
} as const;

export function getStageA11yStrings() { return { ...STAGE_A11Y_STRINGS }; }

export function stageShouldUseBlueprintFallback(options: { webgl: boolean; saveData: boolean; reducedMotion: boolean; prefersLite?: boolean }) {
  if (!options.webgl) return true;
  if (options.saveData) return true;
  if (options.prefersLite) return true;
  return false;
}

export function stageDensityForWidth(width: number): "full" | "medium" | "compact" {
  if (width < 720) return "compact";
  if (width < 1120) return "medium";
  return "full";
}

export function stageCtaHref(projectSlug?: string) { return projectSlug ? `/work/${projectSlug}` : "/work"; }

export function stageMeta(project: { title?: string; category?: string; location?: string }) {
  return {
    title: project.title ?? "Miror project",
    category: project.category ?? "Construction",
    location: project.location ?? "India",
    structureId: getRecommendedStructure(project.category).id,
  };
}

export function mergeStageClasses(...classes: Array<string | undefined | false>) { return classes.filter(Boolean).join(" "); }

export function isSafeStageTitle(value: string) { return value.trim().length > 0 && value.length <= 160; }

export function normaliseStageCopy(value: string) { return value.replace(/\s+/g, " ").trim(); }

export function stageVersionLabel() { return `MIROR ENGINEERING STAGE ${ENGINEERING_STAGE_VERSION}`; }

export const STAGE_DESIGN_PRINCIPLES = [
  "technical clarity",
  "editorial hierarchy",
  "progressive enhancement",
  "evidence-led content",
  "subtle motion",
  "responsive geometry",
  "semantic fallbacks",
  "publication safety",
] as const;

export const STAGE_PERFORMANCE_PRIORITIES = [
  "first contentful paint before WebGL",
  "single canvas per visible stage",
  "reduced line density on mobile",
  "paused rendering offscreen",
  "compressed real models",
  "no autoplay audio",
  "no render-blocking fonts",
  "respect save-data",
] as const;

export function listStagePrinciples() { return [...STAGE_DESIGN_PRINCIPLES]; }
export function listStagePerformancePriorities() { return [...STAGE_PERFORMANCE_PRIORITIES]; }

export const STAGE_END = true;
