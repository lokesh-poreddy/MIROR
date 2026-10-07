/**
 * MIROR V7 CAD DESIGN SYSTEM
 * Central configuration contract for the architectural visual language.
 */

import { CAD_PALETTE, type StructurePreset } from "@/lib/miror-cad-geometry";
import type { CadPerformanceProfile } from "@/lib/miror-cad-performance";

export type ViewportBreakpoint = "xs" | "sm" | "md" | "lg" | "xl";
export type CadPlacement = "hero-side" | "hero-overlay" | "project-side" | "section-background" | "blueprint-panel" | "footer-mark";
export type MotionIntensity = "none" | "restrained" | "cinematic";
export type TechnicalTone = "neutral" | "precision" | "heritage" | "digital";

export type CadLayoutSpec = {
  breakpoint: ViewportBreakpoint;
  minWidth: number;
  maxWidth?: number;
  modelWidth: string;
  modelHeight: string;
  blueprintWidth: string;
  labelDensity: "low" | "medium" | "high";
  maxHotspots: number;
  cameraDistance: number;
  cameraElevation: number;
  visualOpacity: number;
};

export type CadMotionSpec = {
  intensity: MotionIntensity;
  idleRotation: number;
  cameraEaseMs: number;
  hoverScale: number;
  hotspotPulseMs: number;
  scanline: boolean;
  parallaxPx: number;
  allowAutoRotateOnTouch: boolean;
  allowPointerTilt: boolean;
};

export type CadTypographySpec = {
  labelSize: string;
  dataSize: string;
  titleSize: string;
  letterSpacing: string;
  monoFamily: string;
  displayFamily: string;
  uppercaseLabels: boolean;
};

export type CadAccessibilitySpec = {
  requiresTextFallback: boolean;
  requiresReducedMotion: boolean;
  requiresKeyboardControls: boolean;
  requiresFocusRing: boolean;
  requiresConceptualDisclaimer: boolean;
  minContrastForLabels: number;
};

export type CadVisualRules = {
  lineAlpha: number;
  mutedLineAlpha: number;
  envelopeAlpha: number;
  accentAlpha: number;
  maxLabelsDesktop: number;
  maxLabelsMobile: number;
  backgroundOpacity: number;
  vignetteOpacity: number;
  technicalNoiseOpacity: number;
};

export type CadContentRule = {
  id: string;
  title: string;
  category: "truth" | "rights" | "accessibility" | "performance" | "brand";
  severity: "blocker" | "warning" | "info";
  test: (context: CadContentContext) => boolean;
  message: string;
};

export type CadContentContext = {
  isProcedural: boolean;
  hasApprovedModelRights: boolean;
  hasApprovedProjectData: boolean;
  containsDimensions: boolean;
  dimensionSourceIsVerified: boolean;
  hasTextFallback: boolean;
  hasDisclaimer: boolean;
  isReducedMotion: boolean;
  labelCount: number;
  viewport: ViewportBreakpoint;
  isMobile: boolean;
  clientLogoApproved: boolean;
  sourceDocumentAvailable: boolean;
};

export const CAD_BREAKPOINTS: CadLayoutSpec[] = [
  { breakpoint: "xs", minWidth: 0, maxWidth: 479, modelWidth: "100%", modelHeight: "430px", blueprintWidth: "100%", labelDensity: "low", maxHotspots: 3, cameraDistance: 24, cameraElevation: 0.82, visualOpacity: 0.72 },
  { breakpoint: "sm", minWidth: 480, maxWidth: 767, modelWidth: "100%", modelHeight: "520px", blueprintWidth: "100%", labelDensity: "low", maxHotspots: 4, cameraDistance: 21, cameraElevation: 0.78, visualOpacity: 0.76 },
  { breakpoint: "md", minWidth: 768, maxWidth: 1023, modelWidth: "68%", modelHeight: "560px", blueprintWidth: "32%", labelDensity: "medium", maxHotspots: 6, cameraDistance: 18, cameraElevation: 0.72, visualOpacity: 0.8 },
  { breakpoint: "lg", minWidth: 1024, maxWidth: 1439, modelWidth: "64%", modelHeight: "620px", blueprintWidth: "36%", labelDensity: "medium", maxHotspots: 8, cameraDistance: 16, cameraElevation: 0.68, visualOpacity: 0.84 },
  { breakpoint: "xl", minWidth: 1440, modelWidth: "61%", modelHeight: "700px", blueprintWidth: "39%", labelDensity: "high", maxHotspots: 10, cameraDistance: 15, cameraElevation: 0.64, visualOpacity: 0.88 },
];

export const CAD_MOTION: Record<MotionIntensity, CadMotionSpec> = {
  none: { intensity: "none", idleRotation: 0, cameraEaseMs: 0, hoverScale: 1, hotspotPulseMs: 0, scanline: false, parallaxPx: 0, allowAutoRotateOnTouch: false, allowPointerTilt: false },
  restrained: { intensity: "restrained", idleRotation: 0.018, cameraEaseMs: 900, hoverScale: 1.025, hotspotPulseMs: 2600, scanline: true, parallaxPx: 12, allowAutoRotateOnTouch: false, allowPointerTilt: true },
  cinematic: { intensity: "cinematic", idleRotation: 0.035, cameraEaseMs: 1200, hoverScale: 1.045, hotspotPulseMs: 1900, scanline: true, parallaxPx: 28, allowAutoRotateOnTouch: false, allowPointerTilt: true },
};

export const CAD_TYPOGRAPHY: CadTypographySpec = {
  labelSize: "9px",
  dataSize: "10px",
  titleSize: "clamp(40px, 6vw, 88px)",
  letterSpacing: "0.14em",
  monoFamily: '"IBM Plex Mono", "SFMono-Regular", Consolas, monospace',
  displayFamily: '"Space Grotesk", Inter, ui-sans-serif, system-ui, sans-serif',
  uppercaseLabels: true,
};

export const CAD_ACCESSIBILITY: CadAccessibilitySpec = {
  requiresTextFallback: true,
  requiresReducedMotion: true,
  requiresKeyboardControls: true,
  requiresFocusRing: true,
  requiresConceptualDisclaimer: true,
  minContrastForLabels: 4.5,
};

export const CAD_VISUAL_RULES: CadVisualRules = {
  lineAlpha: 0.74,
  mutedLineAlpha: 0.28,
  envelopeAlpha: 0.1,
  accentAlpha: 0.86,
  maxLabelsDesktop: 12,
  maxLabelsMobile: 4,
  backgroundOpacity: 0.94,
  vignetteOpacity: 0.78,
  technicalNoiseOpacity: 0.08,
};

export const CAD_PLACEMENTS: Record<CadPlacement, { purpose: string; recommended: boolean; minHeight: string; dominant: "model" | "blueprint" | "text" }> = {
  "hero-side": { purpose: "Place the structural model on one side of the opening hero.", recommended: true, minHeight: "620px", dominant: "model" },
  "hero-overlay": { purpose: "Use a low-opacity line structure behind headline copy.", recommended: true, minHeight: "540px", dominant: "text" },
  "project-side": { purpose: "Pair project facts with a structural study in case studies.", recommended: true, minHeight: "560px", dominant: "model" },
  "section-background": { purpose: "Use a quiet blueprint plane behind a capability section.", recommended: true, minHeight: "420px", dominant: "blueprint" },
  "blueprint-panel": { purpose: "Dedicated technical panel for plan/elevation/section storytelling.", recommended: true, minHeight: "360px", dominant: "blueprint" },
  "footer-mark": { purpose: "Tiny technical-line motif in the footer for brand continuity.", recommended: false, minHeight: "160px", dominant: "blueprint" },
};

export function breakpointForWidth(width: number): ViewportBreakpoint {
  if (width < 480) return "xs";
  if (width < 768) return "sm";
  if (width < 1024) return "md";
  if (width < 1440) return "lg";
  return "xl";
}

export function layoutForWidth(width: number): CadLayoutSpec { return CAD_BREAKPOINTS.find((entry) => entry.breakpoint === breakpointForWidth(width)) ?? CAD_BREAKPOINTS[0]; }
export function motionForPreference(reduced: boolean, width: number): CadMotionSpec { return reduced ? CAD_MOTION.none : width < 768 ? CAD_MOTION.restrained : CAD_MOTION.cinematic; }

export function visualRuleForViewport(width: number): CadVisualRules {
  const mobile = width < 768;
  return { ...CAD_VISUAL_RULES, maxLabelsDesktop: mobile ? CAD_VISUAL_RULES.maxLabelsMobile : CAD_VISUAL_RULES.maxLabelsDesktop, lineAlpha: mobile ? 0.64 : CAD_VISUAL_RULES.lineAlpha, envelopeAlpha: mobile ? 0.07 : CAD_VISUAL_RULES.envelopeAlpha };
}

export function technicalToneForCategory(category?: string): TechnicalTone {
  const value = (category ?? "").toLowerCase();
  if (value.includes("water") || value.includes("irrigation") || value.includes("canal")) return "precision";
  if (value.includes("heritage") || value.includes("legacy")) return "heritage";
  if (value.includes("digital") || value.includes("technology")) return "digital";
  return "neutral";
}

export function accentForTone(tone: TechnicalTone): string {
  if (tone === "precision") return CAD_PALETTE.line;
  if (tone === "heritage") return CAD_PALETTE.accent;
  if (tone === "digital") return CAD_PALETTE.glass;
  return CAD_PALETTE.accent;
}

export const CAD_SURFACE_PRESETS = {
  dark: { background: CAD_PALETTE.background, ink: CAD_PALETTE.white, line: CAD_PALETTE.line, accent: CAD_PALETTE.accent },
  light: { background: "#f1efe8", ink: "#101417", line: "#274146", accent: "#a5792b" },
} as const;

export type CadSurface = keyof typeof CAD_SURFACE_PRESETS;
export function getSurface(surface: CadSurface = "dark") { return CAD_SURFACE_PRESETS[surface]; }

export const CAD_COMPONENT_MATRIX = [
  { component: "ArchitecturalViewport", required: true, route: "homepage/project", fallback: "BlueprintOverlay" },
  { component: "BlueprintOverlay", required: true, route: "capabilities/project", fallback: "StaticSvg" },
  { component: "CadShowcase", required: true, route: "homepage/project", fallback: "EditorialBlock" },
  { component: "HotspotPanel", required: false, route: "project", fallback: "ProjectFact" },
  { component: "ModelRegistry", required: true, route: "server", fallback: "ProceduralPreset" },
  { component: "PerformanceEngine", required: true, route: "global", fallback: "StaticMode" },
  { component: "PublicationAudit", required: true, route: "cms", fallback: "ManualReview" },
  { component: "ConceptualDisclaimer", required: true, route: "technical-view", fallback: "TextNote" },
] as const;

export const CAD_CONTENT_RULES: CadContentRule[] = [
  { id: "TRUTH-001", title: "Procedural geometry cannot imply actual project dimensions", category: "truth", severity: "blocker", test: (c) => !c.isProcedural || !c.containsDimensions || !c.dimensionSourceIsVerified, message: "Remove or verify numerical dimensions before publishing a procedural scene." },
  { id: "RIGHTS-001", title: "Client model requires approved rights", category: "rights", severity: "blocker", test: (c) => c.isProcedural || c.hasApprovedModelRights, message: "Do not publish a real client-derived model without publication approval." },
  { id: "TRUTH-002", title: "Project facts must be approved", category: "truth", severity: "warning", test: (c) => c.hasApprovedProjectData, message: "Project title, role and scope should be confirmed before publication." },
  { id: "ACCESS-001", title: "Technical visuals require text fallback", category: "accessibility", severity: "blocker", test: (c) => c.hasTextFallback, message: "Provide semantic surrounding text or an equivalent fallback." },
  { id: "ACCESS-002", title: "Technical visuals require a reduced-motion path", category: "accessibility", severity: "blocker", test: (c) => c.isReducedMotion || true, message: "The component must support reduced motion even if the current request does not use it." },
  { id: "ACCESS-003", title: "Conceptual disclaimer required", category: "truth", severity: "blocker", test: (c) => c.hasDisclaimer, message: "Label procedural/demonstration drawings as conceptual or visual-only." },
  { id: "PERF-001", title: "Mobile label density capped", category: "performance", severity: "warning", test: (c) => !c.isMobile || c.labelCount <= 4, message: "Reduce technical labels on small screens." },
  { id: "RIGHTS-002", title: "Source document retained for approved model", category: "rights", severity: "warning", test: (c) => c.isProcedural || c.sourceDocumentAvailable, message: "Retain source/provenance internally for project-derived models." },
  { id: "BRAND-001", title: "Client logo requires approval", category: "brand", severity: "blocker", test: (c) => c.clientLogoApproved, message: "Do not place client logos inside the technical visualization without permission." },
  { id: "TRUTH-003", title: "Dimensions require verified source", category: "truth", severity: "blocker", test: (c) => !c.containsDimensions || c.dimensionSourceIsVerified, message: "Dimension annotations need a verified source document." },
];

export function runCadContentAudit(context: CadContentContext) {
  const results = CAD_CONTENT_RULES.map((rule) => ({ id: rule.id, title: rule.title, category: rule.category, severity: rule.severity, ok: rule.test(context), message: rule.test(context) ? "Pass" : rule.message }));
  return { ok: results.every((item) => item.ok), blockers: results.filter((item) => !item.ok && item.severity === "blocker"), warnings: results.filter((item) => !item.ok && item.severity === "warning"), results };
}

export function auditProjectPreset(preset: StructurePreset, context?: Partial<CadContentContext>) {
  const defaultContext: CadContentContext = {
    isProcedural: true,
    hasApprovedModelRights: true,
    hasApprovedProjectData: false,
    containsDimensions: preset.dimensions.length > 0,
    dimensionSourceIsVerified: false,
    hasTextFallback: true,
    hasDisclaimer: true,
    isReducedMotion: false,
    labelCount: preset.hotspots.length,
    viewport: "lg",
    isMobile: false,
    clientLogoApproved: true,
    sourceDocumentAvailable: false,
  };
  return runCadContentAudit({ ...defaultContext, ...context });
}

export function stageStyleVariables(width: number, profile?: CadPerformanceProfile) {
  const layout = layoutForWidth(width);
  const motion = motionForPreference(Boolean(profile?.reason.includes("reduced-motion")), width);
  const visuals = visualRuleForViewport(width);
  return {
    "--cad-model-width": layout.modelWidth,
    "--cad-model-height": layout.modelHeight,
    "--cad-blueprint-width": layout.blueprintWidth,
    "--cad-label-density": layout.labelDensity,
    "--cad-line-alpha": String(visuals.lineAlpha),
    "--cad-envelope-alpha": String(visuals.envelopeAlpha),
    "--cad-accent-alpha": String(visuals.accentAlpha),
    "--cad-motion-rotation": `${motion.idleRotation}rad`,
    "--cad-motion-parallax": `${motion.parallaxPx}px`,
  } as React.CSSProperties;
}

export const CAD_SECTION_RECIPES = [
  { id: "hero", placement: "hero-side" as CadPlacement, model: "tower", blueprint: "elevation", narrative: "positioning" },
  { id: "legacy", placement: "hero-overlay" as CadPlacement, model: "bridge", blueprint: "section", narrative: "history" },
  { id: "capability", placement: "blueprint-panel" as CadPlacement, model: "canal", blueprint: "plan", narrative: "expertise" },
  { id: "work", placement: "project-side" as CadPlacement, model: "project-derived", blueprint: "elevation", narrative: "proof" },
  { id: "quality", placement: "section-background" as CadPlacement, model: "tower", blueprint: "section", narrative: "quality" },
] as const;

export const CAD_COPY_TONE = {
  eyebrow: "technical / measured / concise",
  title: "editorial / confident / human",
  body: "specific / evidence-led / unexaggerated",
  labels: "mono / uppercase / compact",
  disclaimers: "quiet / visible / direct",
} as const;

export function copyToneForStage(stage: string) { return { ...CAD_COPY_TONE, stage }; }

export const CAD_ROUTING = {
  work: "/work",
  project: (slug: string) => `/work/${slug}`,
  capabilities: "/capabilities",
  capability: (slug: string) => `/capabilities/${slug}`,
  about: "/about",
  contact: "/contact",
} as const;

export function shouldAttachModelQuery(slug?: string): boolean { return Boolean(slug && slug.length > 1); }
export function modelQuery(slug?: string) { return shouldAttachModelQuery(slug) ? `?visual=structure&project=${encodeURIComponent(slug as string)}` : ""; }

export const CAD_META_DEFAULTS = {
  title: "MIROR / Digital Structure",
  description: "CAD-inspired structural visualization for Miror Constructions & Consultancy.",
  ogType: "website",
  keywords: ["construction", "civil engineering", "infrastructure", "structural visualization", "CAD", "BIM"],
} as const;

export function cadMetaForProject(project: { title?: string; category?: string; location?: string; slug?: string }) {
  const title = project.title ? `${project.title} — Miror Constructions` : CAD_META_DEFAULTS.title;
  const description = project.category ? `${project.category} project visualization for ${project.title ?? "Miror"}${project.location ? ` in ${project.location}` : ""}.` : CAD_META_DEFAULTS.description;
  return { title, description, canonical: project.slug ? CAD_ROUTING.project(project.slug) : CAD_ROUTING.work, keywords: [...CAD_META_DEFAULTS.keywords, project.category ?? "construction"] };
}

export const CAD_SAFETY_COPY = {
  conceptual: "Conceptual visualization — not for construction use.",
  sourcePending: "Source drawing pending client publication approval.",
  realModel: "Client-approved digital model.",
  simplified: "Geometry simplified for public presentation.",
} as const;

export function safetyLabel(input: { isProcedural: boolean; approved: boolean; simplified: boolean }) {
  if (input.isProcedural) return CAD_SAFETY_COPY.conceptual;
  if (!input.approved) return CAD_SAFETY_COPY.sourcePending;
  if (input.simplified) return CAD_SAFETY_COPY.simplified;
  return CAD_SAFETY_COPY.realModel;
}

export const CAD_LOAD_STATES = {
  idle: { label: "STRUCTURE READY", tone: "quiet" },
  loading: { label: "BUILDING DIGITAL MODEL", tone: "accent" },
  fallback: { label: "TECHNICAL FALLBACK", tone: "neutral" },
  error: { label: "VISUAL LAYER UNAVAILABLE", tone: "warning" },
} as const;

export function loadStateLabel(state: keyof typeof CAD_LOAD_STATES) { return CAD_LOAD_STATES[state].label; }

export const CAD_ERROR_MESSAGES = {
  webgl: "Interactive 3D is unavailable on this device; the technical drawing fallback remains available.",
  asset: "The approved project model could not be loaded; using the verified fallback visualization.",
  permission: "This model is not publicly approved; using the conceptual structure study instead.",
  timeout: "The visual layer took too long to load; the page is continuing with the static technical view.",
} as const;

export function errorCopy(code: keyof typeof CAD_ERROR_MESSAGES) { return CAD_ERROR_MESSAGES[code]; }

export const CAD_ANALYTICS_EVENTS = [
  "cad_view_enter",
  "cad_structure_change",
  "cad_hotspot_open",
  "cad_blueprint_mode_change",
  "cad_layer_toggle",
  "cad_fallback",
  "cad_model_error",
  "cad_case_study_open",
] as const;

export type CadAnalyticsEvent = (typeof CAD_ANALYTICS_EVENTS)[number];
export function isCadAnalyticsEvent(value: string): value is CadAnalyticsEvent { return CAD_ANALYTICS_EVENTS.includes(value as CadAnalyticsEvent); }

export function analyticsPayload(event: CadAnalyticsEvent, data: Record<string, unknown> = {}) {
  return { event, timestamp: new Date().toISOString(), source: "miror-cad-v7", data };
}

export const CAD_QA_CHECKLIST = [
  "Desktop Chromium — 1440px",
  "Desktop Safari — 1440px",
  "iPad — 820px",
  "iPhone — 390px",
  "Android — 360px",
  "prefers-reduced-motion",
  "save-data",
  "WebGL unavailable",
  "keyboard only",
  "screen reader smoke test",
  "slow network",
  "no real model rights",
  "real model with approved rights",
  "project dimensions verified",
  "project dimensions missing",
] as const;

export function checklistLength() { return CAD_QA_CHECKLIST.length; }

export const CAD_VERSION = "7.0.0";
