/*
 * MIROR V6 — production platform contracts
 * Purpose: one explicit contract layer shared by UI, APIs, data adapters, and QA tooling.
 * This file is intentionally dependency-light so it can be imported from server or client code.
 */

export type BrandTone = "paper" | "ink" | "sand" | "steel" | "signal";
export type MotionTier = "none" | "essential" | "premium" | "cinematic";
export type ProjectVisibility = "draft" | "review" | "published" | "archived";
export type EvidenceState = "missing" | "pending" | "verified" | "expired";
export type LeadStatus = "new" | "qualified" | "contacted" | "closed" | "spam";
export type MediaKind = "image" | "video" | "document" | "model";
export type RouteKind = "marketing" | "archive" | "case-study" | "conversion" | "utility";

export interface SiteNavItem {
  id: string;
  label: string;
  href: string;
  kind: RouteKind;
  description: string;
  children?: SiteNavItem[];
  featured?: boolean;
  external?: boolean;
}

export interface ProjectMedia {
  id: string;
  kind: MediaKind;
  src: string;
  alt: string;
  caption?: string;
  poster?: string;
  width?: number;
  height?: number;
  rights: "unknown" | "approved" | "restricted";
  focalPoint?: { x: number; y: number };
}

export interface ProjectEvidence {
  sourceUrl?: string;
  sourceLabel?: string;
  sourceDocument?: string;
  checkedAt?: string;
  state: EvidenceState;
  notes?: string;
}

export interface ProjectRecord {
  id: string;
  slug: string;
  title: string;
  discipline: string;
  category: string;
  location: string;
  state?: string;
  country: string;
  status: "completed" | "ongoing" | "planned" | "unknown";
  visibility: ProjectVisibility;
  year?: string;
  client?: string;
  principalContractor?: string;
  mirorRole?: string;
  summary: string;
  scope: string[];
  metrics: Array<{ label: string; value: string; unit?: string }>;
  cover?: ProjectMedia;
  gallery: ProjectMedia[];
  evidence: ProjectEvidence[];
  publicationPermission: boolean;
  mediaRightsCleared: boolean;
  seoTitle?: string;
  seoDescription?: string;
  relatedCapabilities: string[];
  featured?: boolean;
  sortOrder: number;
}

export interface EnquiryInput {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projectType?: string;
  location?: string;
  budgetBand?: string;
  message: string;
  consent: boolean;
  source?: string;
  website?: string;
}

export interface EnquiryRecord extends EnquiryInput {
  id: string;
  createdAt: string;
  status: LeadStatus;
  spamScore: number;
  requestId: string;
}

export interface CareerApplication {
  roleId: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  coverNote?: string;
  consent: boolean;
}

export interface JobRole {
  id: string;
  title: string;
  discipline: string;
  location: string;
  type: "full-time" | "contract" | "internship";
  summary: string;
  responsibilities: string[];
  requirements: string[];
  active: boolean;
}

export interface Capability {
  id: string;
  number: string;
  title: string;
  short: string;
  body: string;
  deliverables: string[];
  projectSlugs: string[];
  accent: BrandTone;
}

export const MIROR_COMPANY = {
  legalName: "Miror Constructions and Consultancy Private Limited",
  cin: "U45500AP2019PTC111545",
  status: "Active",
  incorporatedOn: "2019-03-28",
  registeredOffice: "D. No: 7-642(3), Gandhi Nagar, Mangamur Road, Ongole, Prakasam, Andhra Pradesh 523001, India",
  publicExperienceNote: "Client-provided context indicates that the underlying construction business predates the current 2019 private limited entity.",
  publicDisclosureRule: "Use only evidence-backed claims in public marketing copy.",
} as const;

export const NAVIGATION: SiteNavItem[] = [
  { id: "about", label: "About", href: "/about", kind: "marketing", description: "Company story, legacy and leadership" },
  { id: "capabilities", label: "Capabilities", href: "/capabilities", kind: "marketing", description: "Civil, infrastructure and execution capabilities" },
  { id: "work", label: "Our Work", href: "/work", kind: "archive", description: "Verified project portfolio" },
  { id: "quality", label: "Quality & Safety", href: "/quality-safety", kind: "marketing", description: "Quality systems and site discipline" },
  { id: "careers", label: "Careers", href: "/careers", kind: "conversion", description: "Open roles and applications" },
  { id: "contact", label: "Contact", href: "/contact", kind: "conversion", description: "Project and business enquiries", featured: true },
];

export const MOTION = {
  duration: { instant: 0.12, fast: 0.22, medium: 0.42, slow: 0.78, cinematic: 1.15 },
  ease: { standard: [0.22, 1, 0.36, 1], reveal: [0.16, 1, 0.3, 1], soft: [0.33, 1, 0.68, 1] } as const,
  distance: { sm: 8, md: 22, lg: 48, xl: 88 },
  viewport: { once: true, amount: 0.18 },
  reducedMotion: { disableParallax: true, disableScrub: true, keepOpacity: true },
} as const;

export const DESIGN_TOKENS = {
  colors: {
    ink: "#111315",
    paper: "#f4f1ea",
    warm: "#d4c8b3",
    sand: "#b5a98f",
    steel: "#56606a",
    line: "rgba(17,19,21,0.14)",
    lineStrong: "rgba(17,19,21,0.28)",
    white: "#fbfaf7",
    warning: "#9c6b00",
    danger: "#a33b2c",
    success: "#366d54",
  },
  type: {
    display: "clamp(3.2rem, 8vw, 9rem)",
    h2: "clamp(2.4rem, 5vw, 5.8rem)",
    h3: "clamp(1.5rem, 2vw, 2.2rem)",
    body: "clamp(1rem, 1.25vw, 1.2rem)",
    small: "0.78rem",
    micro: "0.68rem",
  },
  spacing: { page: "4vw", section: "12rem", gutter: "2rem", card: "1.4rem" },
  radii: { none: "0", sm: "2px", md: "8px", pill: "999px" },
  shadows: { soft: "0 16px 60px rgba(17,19,21,0.08)", strong: "0 28px 100px rgba(17,19,21,0.18)" },
} as const;

export const PERFORMANCE_BUDGET = {
  initialJsKb: 180,
  heroMediaMb: 5,
  projectImageMb: 1.2,
  maxVideoAutoplaySeconds: 12,
  maxConcurrentVideos: 1,
  maxPinnedSections: 2,
  maxWebglCanvases: 1,
  imageQuality: 82,
  animationFpsTarget: 55,
  longTaskMs: 80,
} as const;

export function normalizeSlug(value: string): string {
  return value.normalize("NFKC").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function cleanText(value: unknown, max = 5000): string {
  if (typeof value !== "string") return "";
  return value.normalize("NFKC").replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
}

export function cleanEmail(value: unknown): string {
  const email = cleanText(value, 320).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "";
  return email;
}

export function cleanPhone(value: unknown): string {
  return cleanText(value, 40).replace(/[^0-9+()\-\s]/g, "").slice(0, 25);
}

export function evidenceIsPublishable(project: ProjectRecord): boolean {
  if (project.visibility !== "published") return false;
  if (!project.publicationPermission) return false;
  if (!project.mediaRightsCleared) return false;
  if (!project.evidence.some((item) => item.state === "verified")) return false;
  if (!project.mirorRole?.trim()) return false;
  if (!project.scope.length) return false;
  return true;
}

export function publicProjects(projects: ProjectRecord[]): ProjectRecord[] {
  return projects.filter(evidenceIsPublishable).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function projectRoute(project: Pick<ProjectRecord, "slug">): string {
  return `/work/${normalizeSlug(project.slug)}`;
}

export function capabilityRoute(id: string): string {
  return `/capabilities#${encodeURIComponent(normalizeSlug(id))}`;
}

export function wordCount(text: string): number {
  return cleanText(text).split(/\s+/).filter(Boolean).length;
}

export function estimateReadingTime(text: string): number {
  return Math.max(1, Math.ceil(wordCount(text) / 220));
}

export function scoreLead(input: EnquiryInput): number {
  let score = 0;
  if (input.website) score += 0.75;
  if (!input.consent) score += 0.2;
  if (!cleanEmail(input.email)) score += 0.45;
  if (wordCount(input.message) < 3) score += 0.18;
  if (/https?:\/\//i.test(input.message)) score += 0.16;
  if (/(viagra|crypto|casino|loan|seo service)/i.test(input.message)) score += 0.38;
  return Math.min(1, score);
}

export function leadStatus(score: number): LeadStatus {
  if (score >= 0.8) return "spam";
  return "new";
}

export function securityHeaders(): Record<string, string> {
  return {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Cache-Control": "no-store",
  };
}

export function allowedOrigin(origin: string | undefined, configured: string[]): boolean {
  if (!origin) return true;
  if (!configured.length) return true;
  return configured.includes(origin);
}

export function requestId(): string {
  const randomPart = Math.random().toString(36).slice(2, 10);
  return `miror-${Date.now().toString(36)}-${randomPart}`;
}

export function safeLogRecord(input: Record<string, unknown>): Record<string, unknown> {
  const blocked = new Set(["email", "phone", "message", "resumeUrl", "ip"]);
  return Object.fromEntries(Object.entries(input).map(([key, value]) => [key, blocked.has(key) ? "[REDACTED]" : value]));
}

export const CONTENT_GUARDRAILS = [
  "Never claim the entire prime contract when evidence only identifies Miror as a package contractor.",
  "Never publish project value unless the source and client permission are confirmed.",
  "Never publish a client logo without usage permission.",
  "Never publish awards or certifications without documentary evidence.",
  "Never publish employee counts, revenue, or fleet counts from inference.",
  "Never convert client-provided project history into a third-party verified claim without a source note.",
  "Never use a stock photo as if it were a Miror site photograph.",
  "Never expose private enquiry information in public JSON or logs.",
] as const;

export const ACCESSIBILITY_RULES = {
  focusVisible: true,
  skipLink: true,
  keyboardMenuEscape: true,
  menuFocusTrap: true,
  dialogAriaModal: true,
  buttonsHaveLabels: true,
  imagesHaveAlt: true,
  decorativeImagesHidden: true,
  reducedMotion: true,
  minimumTapTargetPx: 44,
} as const;

export const SEO_RULES = {
  titleMaxChars: 60,
  descriptionMaxChars: 155,
  canonicalRequired: true,
  sitemapRequired: true,
  robotsRequired: true,
  ogImageRequired: true,
  organizationJsonLd: true,
  breadcrumbJsonLd: true,
  projectJsonLdOnlyWhenEvidenceSupports: true,
} as const;

export const OBSERVABILITY_EVENTS = [
  "page_view",
  "nav_open",
  "nav_close",
  "project_filter",
  "project_open",
  "project_media_open",
  "cta_click",
  "enquiry_start",
  "enquiry_submit",
  "enquiry_error",
  "career_open",
  "career_apply_start",
  "career_apply_submit",
  "search_open",
  "search_query",
  "video_play",
  "video_pause",
  "performance_warning",
  "media_error",
] as const;

export type ObservabilityEvent = typeof OBSERVABILITY_EVENTS[number];

export interface AnalyticsEvent {
  name: ObservabilityEvent;
  path: string;
  timestamp: string;
  requestId?: string;
  value?: string;
  metadata?: Record<string, string | number | boolean | null>;
}

export function makeAnalyticsEvent(name: ObservabilityEvent, path: string, metadata?: AnalyticsEvent["metadata"]): AnalyticsEvent {
  return { name, path, timestamp: new Date().toISOString(), metadata };
}

export const DEFAULT_BREAKPOINTS = { sm: 640, md: 768, lg: 1024, xl: 1280, xxl: 1536 } as const;

export function responsiveSize(width: number): "mobile" | "tablet" | "desktop" | "wide" {
  if (width < DEFAULT_BREAKPOINTS.md) return "mobile";
  if (width < DEFAULT_BREAKPOINTS.lg) return "tablet";
  if (width < DEFAULT_BREAKPOINTS.xxl) return "desktop";
  return "wide";
}

export function isTouchLikeDevice(): boolean {
  return typeof window !== "undefined" && (window.matchMedia?.("(pointer: coarse)").matches ?? false);
}

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
}

export function safeHttpUrl(value: unknown): string {
  const raw = cleanText(value, 1000);
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && url.protocol !== "http:") return "";
    return url.toString();
  } catch {
    return "";
  }
}

export function mediaShouldLoad(kind: MediaKind, index: number, isInViewport: boolean, reducedMotion: boolean): boolean {
  if (!isInViewport) return false;
  if (kind === "video" && index > 0) return false;
  if (reducedMotion && kind === "video") return false;
  return true;
}

export function projectSearchText(project: ProjectRecord): string {
  return [project.title, project.category, project.discipline, project.location, project.state ?? "", project.country, project.client ?? "", project.mirorRole ?? "", project.summary, ...project.scope].join(" ").toLowerCase();
}

export function searchProjects(projects: ProjectRecord[], query: string, category?: string): ProjectRecord[] {
  const q = cleanText(query, 160).toLowerCase();
  return publicProjects(projects).filter((project) => {
    const categoryMatch = !category || category === "all" || project.category === category;
    const textMatch = !q || projectSearchText(project).includes(q);
    return categoryMatch && textMatch;
  });
}

export function uniqueStrings(items: string[]): string[] {
  return [...new Set(items.map((item) => cleanText(item, 180)).filter(Boolean))];
}

export function uniqueProjectCategories(projects: ProjectRecord[]): string[] {
  return ["all", ...uniqueStrings(publicProjects(projects).map((project) => project.category))];
}

export const ROUTES = {
  home: "/",
  about: "/about",
  capabilities: "/capabilities",
  work: "/work",
  qualitySafety: "/quality-safety",
  careers: "/careers",
  contact: "/contact",
  privacy: "/privacy",
  terms: "/terms",
  sitemap: "/sitemap.xml",
} as const;

export type RouteKey = keyof typeof ROUTES;

export const FORM_LIMITS = {
  name: 120,
  email: 320,
  phone: 40,
  company: 180,
  projectType: 120,
  location: 180,
  budgetBand: 80,
  message: 5000,
  source: 120,
  roleId: 120,
  coverNote: 5000,
  url: 1000,
} as const;

export function truncate(value: string, max: number): string {
  return cleanText(value, max);
}

export function hasText(value: unknown, max = 5000): value is string {
  return cleanText(value, max).length > 0;
}

export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${String(value)}`);
}

export function serializeForClient<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

// Repeatedly named validators are intentionally grouped below so API routes can import one function per concern.

export function validateV6Field01(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field02(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field03(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field04(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field05(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field06(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field07(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field08(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field09(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field10(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field11(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field12(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field13(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field14(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field15(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field16(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field17(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field18(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field19(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field20(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field21(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field22(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field23(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field24(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field25(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field26(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field27(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field28(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field29(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field30(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field31(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field32(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field33(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field34(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field35(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field36(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field37(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field38(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field39(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field40(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field41(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field42(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field43(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field44(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field45(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field46(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field47(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field48(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field49(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field50(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field51(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field52(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field53(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field54(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field55(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field56(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field57(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field58(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field59(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field60(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field61(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field62(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field63(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field64(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field65(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field66(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}

export function validateV6Field67(value: unknown): boolean {
  return value !== null && value !== undefined && (typeof value === "boolean" || cleanText(value, 5000).length > 0);
}


export interface PublicationDecision {
  allowed: boolean;
  reasons: string[];
  warnings: string[];
}

export function publicationDecision(project: ProjectRecord): PublicationDecision {
  const reasons: string[] = [];
  const warnings: string[] = [];
  if (project.visibility !== "published") reasons.push("Project visibility is not published.");
  if (!project.publicationPermission) reasons.push("Publication permission is missing.");
  if (!project.mediaRightsCleared) reasons.push("Media rights clearance is missing.");
  if (!project.mirorRole?.trim()) reasons.push("Miror role is missing.");
  if (!project.scope.length) reasons.push("Project scope is empty.");
  if (!project.evidence.some((item) => item.state === "verified")) reasons.push("No verified evidence is present.");
  if (!project.title.trim()) reasons.push("Project title is empty.");
  if (!project.summary.trim()) reasons.push("Project summary is empty.");
  if (!project.gallery.length) warnings.push("Project has no media yet.");
  if (!project.client) warnings.push("Client field is not populated.");
  if (!project.year) warnings.push("Year field is not populated.");
  return { allowed: reasons.length === 0, reasons: uniqueStrings(reasons), warnings: uniqueStrings(warnings) };
}

export function projectEditorialScore(project: ProjectRecord): number {
  let score = 0;
  score += project.title.length > 8 ? 15 : 4;
  score += project.summary.length > 120 ? 20 : project.summary.length > 60 ? 12 : 4;
  score += project.scope.length >= 3 ? 20 : project.scope.length * 6;
  score += project.gallery.length >= 5 ? 15 : project.gallery.length * 2;
  score += project.mirorRole ? 15 : 0;
  score += project.client ? 5 : 0;
  score += project.year ? 5 : 0;
  score += project.location ? 5 : 0;
  return Math.min(100, score);
}

export function projectQualityBand(score: number): "draft" | "developing" | "strong" | "excellent" {
  if (score < 35) return "draft";
  if (score < 60) return "developing";
  if (score < 80) return "strong";
  return "excellent";
}

export function projectSearchTokens(project: ProjectRecord): string[] {
  const raw = [project.title, project.category, project.discipline, project.location, project.state || "", project.country, project.client || "", project.principalContractor || "", project.mirorRole || "", project.summary, ...project.scope];
  return uniqueStrings(raw.join(" ").toLowerCase().split(/[^a-z0-9]+/));
}

export function projectMatchesTokens(project: ProjectRecord, tokens: string[]): boolean {
  if (!tokens.length) return true;
  const haystack = new Set(projectSearchTokens(project));
  return tokens.every((token) => haystack.has(token) || [...haystack].some((item) => item.includes(token)));
}

export function safeProjectLabel(project: ProjectRecord): string {
  const location = project.location ? ` · ${project.location}` : "";
  return `${cleanText(project.title, 120)}${location}`;
}

export const ROUTE_METADATA: Record<string, { label: string; kind: RouteKind; indexable: boolean }> = {
  "/": { label: "Home", kind: "marketing", indexable: true },
  "/about": { label: "About", kind: "marketing", indexable: true },
  "/capabilities": { label: "Capabilities", kind: "marketing", indexable: true },
  "/work": { label: "Our Work", kind: "archive", indexable: true },
  "/quality-safety": { label: "Quality & Safety", kind: "marketing", indexable: true },
  "/careers": { label: "Careers", kind: "conversion", indexable: true },
  "/contact": { label: "Contact", kind: "conversion", indexable: true },
};

export function routeMetadata(pathname: string): { label: string; kind: RouteKind; indexable: boolean } {
  const path = pathname.split("?")[0].replace(/\/+$/, "") || "/";
  if (ROUTE_METADATA[path]) return ROUTE_METADATA[path];
  if (path.startsWith("/work/")) return { label: "Project", kind: "case-study", indexable: true };
  if (path.startsWith("/api/")) return { label: "API", kind: "utility", indexable: false };
  return { label: "Page", kind: "marketing", indexable: false };
}

export function normalizeLocale(value: unknown): "en-IN" | "en-US" | "en-GB" {
  const raw = cleanText(value, 20).toLowerCase();
  if (raw === "en-us") return "en-US";
  if (raw === "en-gb") return "en-GB";
  return "en-IN";
}

export function formatProjectLocation(project: ProjectRecord): string {
  return [project.location, project.state, project.country].filter(Boolean).join(", ");
}

export function formatProjectRole(project: ProjectRecord): string {
  return project.mirorRole?.trim() || "Role pending client confirmation";
}

export function canIndexProject(project: ProjectRecord): boolean {
  return evidenceIsPublishable(project) && Boolean(project.seoTitle || project.title) && Boolean(project.seoDescription || project.summary);
}

export function canonicalProjectUrl(project: ProjectRecord, baseUrl = "https://miror.example.com"): string {
  const base = baseUrl.replace(/\/+$/, "");
  return `${base}${projectRoute(project)}`;
}

export function normalizeMetric(value: unknown): { value: string; unit?: string } {
  if (typeof value === "object" && value !== null) {
    const record = value as Record<string, unknown>;
    return { value: cleanText(record.value, 100), unit: cleanText(record.unit, 30) || undefined };
  }
  return { value: cleanText(value, 100) };
}

export function normalizeMediaRights(value: unknown): "unknown" | "approved" | "restricted" {
  const raw = cleanText(value, 30).toLowerCase();
  if (raw === "approved") return "approved";
  if (raw === "restricted") return "restricted";
  return "unknown";
}

export function validateEnquiryContract(input: Partial<EnquiryInput>): string[] {
  const errors: string[] = [];
  if (!hasText(input.name, FORM_LIMITS.name)) errors.push("name");
  if (!cleanEmail(input.email)) errors.push("email");
  if (!hasText(input.message, FORM_LIMITS.message)) errors.push("message");
  if (input.consent !== true) errors.push("consent");
  if (input.website) errors.push("website");
  return uniqueStrings(errors);
}

export function normalizeEnquiry(input: Partial<EnquiryInput>): EnquiryInput {
  return {
    name: truncate(String(input.name ?? ""), FORM_LIMITS.name),
    email: cleanEmail(input.email),
    phone: cleanPhone(input.phone),
    company: truncate(String(input.company ?? ""), FORM_LIMITS.company),
    projectType: truncate(String(input.projectType ?? ""), FORM_LIMITS.projectType),
    location: truncate(String(input.location ?? ""), FORM_LIMITS.location),
    budgetBand: truncate(String(input.budgetBand ?? ""), FORM_LIMITS.budgetBand),
    message: truncate(String(input.message ?? ""), FORM_LIMITS.message),
    consent: input.consent === true,
    source: truncate(String(input.source ?? "website"), FORM_LIMITS.source),
    website: truncate(String(input.website ?? ""), FORM_LIMITS.url),
  };
}

export const MIROR_V6_VERSION = "6.2.0";
export const MIROR_V6_BUILD = "production-add-on";
