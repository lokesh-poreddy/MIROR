/**
 * MIROR V7 CAD PERFORMANCE ENGINE
 * Device, connection, rendering and media policy helpers for the 3D layer.
 */

export type ConnectionProfile = "offline" | "slow-2g" | "2g" | "3g" | "4g" | "5g" | "unknown";
export type DeviceTier = "low" | "balanced" | "high" | "desktop-pro";
export type RenderMode = "webgl" | "svg" | "static";
export type CadPerformanceInput = {
  viewportWidth: number;
  viewportHeight: number;
  deviceMemory?: number;
  hardwareConcurrency?: number;
  connection?: ConnectionProfile;
  saveData?: boolean;
  prefersReducedMotion?: boolean;
  webgl?: boolean;
  visible?: boolean;
  batteryLevel?: number;
  charging?: boolean;
};

export type CadPerformanceProfile = {
  tier: DeviceTier;
  renderMode: RenderMode;
  dpr: number;
  lineBudget: number;
  boxBudget: number;
  pixelBudget: number;
  animateCamera: boolean;
  animateHotspots: boolean;
  allowOrbit: boolean;
  allowZoom: boolean;
  preloadModel: boolean;
  preloadBlueprint: boolean;
  shouldPauseOffscreen: boolean;
  reason: string[];
};

export type MediaVariant = { width: number; height: number; format: "webp" | "avif" | "jpeg"; quality: number };
export type ModelPolicy = { maxBytes: number; maxTriangles: number; preferredCompression: "meshopt" | "draco" | "none"; maxTextureDimension: number; maxTextureBytes: number };

const MOBILE_MAX_DPR = 1.1;
const TABLET_MAX_DPR = 1.25;
const DESKTOP_MAX_DPR = 1.55;
const HIGH_DPR = 1.75;

export function clamp(value: number, min: number, max: number): number { return Math.max(min, Math.min(max, value)); }
export function clampInt(value: number, min: number, max: number): number { return Math.round(clamp(value, min, max)); }

export function inferConnection(input?: CadPerformanceInput): ConnectionProfile {
  if (input?.connection) return input.connection;
  if (typeof navigator === "undefined") return "unknown";
  const connection = (navigator as Navigator & { connection?: { effectiveType?: string; saveData?: boolean } }).connection;
  const type = connection?.effectiveType;
  if (type === "slow-2g" || type === "2g" || type === "3g" || type === "4g") return type;
  return "unknown";
}

export function inferDeviceTier(input: CadPerformanceInput): DeviceTier {
  const cores = input.hardwareConcurrency ?? (typeof navigator !== "undefined" ? navigator.hardwareConcurrency || 4 : 4);
  const memory = input.deviceMemory ?? (typeof navigator !== "undefined" ? Number((navigator as Navigator & { deviceMemory?: number }).deviceMemory) || 4 : 4);
  if (input.viewportWidth >= 1440 && cores >= 12 && memory >= 8) return "desktop-pro";
  if (cores <= 4 || memory <= 2 || input.viewportWidth < 720) return "low";
  if (cores >= 8 && memory >= 6) return "high";
  return "balanced";
}

export function connectionAllowsWebgl(connection: ConnectionProfile, saveData = false): boolean {
  if (saveData) return false;
  return connection !== "offline" && connection !== "slow-2g" && connection !== "2g";
}

export function batteryAllowsHeavyAnimation(level?: number, charging?: boolean): boolean {
  if (typeof level !== "number" || charging) return true;
  return level > 0.2;
}

export function calculatePixelBudget(width: number, height: number, dpr: number): number {
  return width * height * dpr * dpr;
}

export function chooseDpr(input: CadPerformanceInput, tier: DeviceTier): number {
  const requested = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
  const base = input.viewportWidth < 720 ? MOBILE_MAX_DPR : input.viewportWidth < 1200 ? TABLET_MAX_DPR : DESKTOP_MAX_DPR;
  const tierCap = tier === "low" ? 1 : tier === "balanced" ? 1.25 : tier === "high" ? 1.5 : HIGH_DPR;
  return clamp(Math.min(requested, base, tierCap), 1, HIGH_DPR);
}

export function chooseLineBudget(tier: DeviceTier, width: number): number {
  if (tier === "low") return width < 520 ? 280 : 520;
  if (tier === "balanced") return width < 900 ? 760 : 1100;
  if (tier === "high") return width < 1000 ? 1100 : 1550;
  return 2100;
}

export function chooseBoxBudget(tier: DeviceTier): number {
  if (tier === "low") return 70;
  if (tier === "balanced") return 150;
  if (tier === "high") return 260;
  return 380;
}

export function chooseRenderMode(input: CadPerformanceInput, tier: DeviceTier, connection: ConnectionProfile): RenderMode {
  if (input.webgl === false) return "svg";
  if (input.prefersReducedMotion && tier === "low") return "svg";
  if (!connectionAllowsWebgl(connection, Boolean(input.saveData))) return "svg";
  return "webgl";
}

export function buildCadPerformanceProfile(input: CadPerformanceInput): CadPerformanceProfile {
  const connection = inferConnection(input);
  const tier = inferDeviceTier(input);
  const dpr = chooseDpr(input, tier);
  const renderMode = chooseRenderMode(input, tier, connection);
  const lowBattery = !batteryAllowsHeavyAnimation(input.batteryLevel, input.charging);
  const reduced = Boolean(input.prefersReducedMotion);
  const visible = input.visible !== false;
  const reasons: string[] = [];
  if (connection === "slow-2g" || connection === "2g") reasons.push("slow-connection");
  if (input.saveData) reasons.push("save-data");
  if (reduced) reasons.push("reduced-motion");
  if (lowBattery) reasons.push("low-battery");
  if (!visible) reasons.push("offscreen");
  if (renderMode === "svg") reasons.push("svg-progressive-enhancement");
  return {
    tier,
    renderMode,
    dpr,
    lineBudget: chooseLineBudget(tier, input.viewportWidth),
    boxBudget: chooseBoxBudget(tier),
    pixelBudget: calculatePixelBudget(input.viewportWidth, input.viewportHeight, dpr),
    animateCamera: renderMode === "webgl" && !reduced && !lowBattery && visible,
    animateHotspots: renderMode === "webgl" && !reduced && visible,
    allowOrbit: renderMode === "webgl" && tier !== "low" && visible,
    allowZoom: renderMode !== "static" && visible,
    preloadModel: renderMode === "webgl" && connection !== "3g" && !input.saveData,
    preloadBlueprint: true,
    shouldPauseOffscreen: true,
    reason: reasons,
  };
}

export function selectMediaVariant(width: number, height: number, pixelRatio = 1): MediaVariant {
  const effectiveWidth = Math.ceil(width * clamp(pixelRatio, 1, 2));
  const target = effectiveWidth <= 480 ? 480 : effectiveWidth <= 768 ? 768 : effectiveWidth <= 1280 ? 1280 : effectiveWidth <= 1920 ? 1920 : 2560;
  const targetHeight = Math.ceil((target / Math.max(1, width)) * Math.max(1, height));
  const format: MediaVariant["format"] = target >= 1280 ? "avif" : "webp";
  const quality = target >= 1920 ? 72 : target >= 1280 ? 76 : 80;
  return { width: target, height: targetHeight, format, quality };
}

export function makeResponsiveSrcSet(baseUrl: string, widths = [480, 768, 1024, 1280, 1536, 1920, 2560]): string {
  return widths.map((width) => `${baseUrl}?w=${width} ${width}w`).join(", ");
}

export function modelPolicyForTier(tier: DeviceTier): ModelPolicy {
  if (tier === "low") return { maxBytes: 2_000_000, maxTriangles: 35_000, preferredCompression: "meshopt", maxTextureDimension: 1024, maxTextureBytes: 600_000 };
  if (tier === "balanced") return { maxBytes: 5_000_000, maxTriangles: 90_000, preferredCompression: "meshopt", maxTextureDimension: 1536, maxTextureBytes: 1_500_000 };
  if (tier === "high") return { maxBytes: 10_000_000, maxTriangles: 180_000, preferredCompression: "meshopt", maxTextureDimension: 2048, maxTextureBytes: 3_000_000 };
  return { maxBytes: 16_000_000, maxTriangles: 320_000, preferredCompression: "meshopt", maxTextureDimension: 4096, maxTextureBytes: 5_000_000 };
}

export function validateModelMetadata(model: { bytes: number; triangles: number; textureBytes: number; textureDimension: number }, policy: ModelPolicy): { ok: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  if (model.bytes > policy.maxBytes) errors.push(`Model exceeds ${policy.maxBytes} byte budget.`);
  if (model.triangles > policy.maxTriangles) errors.push(`Model exceeds ${policy.maxTriangles} triangle budget.`);
  if (model.textureBytes > policy.maxTextureBytes) errors.push(`Texture payload exceeds ${policy.maxTextureBytes} byte budget.`);
  if (model.textureDimension > policy.maxTextureDimension) warnings.push(`Texture dimension ${model.textureDimension}px is above recommended ${policy.maxTextureDimension}px.`);
  return { ok: errors.length === 0, errors, warnings };
}

export function modelUrlWithCache(url: string, revision: string): string { return `${url}${url.includes("?") ? "&" : "?"}v=${encodeURIComponent(revision)}`; }
export function shouldLazyLoadModel(sectionVisible: boolean, connection: ConnectionProfile, saveData: boolean): boolean { return !sectionVisible || saveData || connection === "3g" || connection === "slow-2g" || connection === "2g"; }
export function shouldUsePoster(connection: ConnectionProfile, saveData: boolean): boolean { return saveData || connection === "3g" || connection === "slow-2g" || connection === "2g"; }
export function shouldPreconnect(origin: string): boolean { return /^https:\/\//.test(origin); }
export function sanitizeOrigin(origin: string): string { try { const url = new URL(origin); return url.origin; } catch { return ""; } }

export function safeModelFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-").slice(0, 180);
}

export function acceptedModelExtension(filename: string): boolean { return /\.(glb|gltf)$/i.test(filename); }
export function acceptedBlueprintExtension(filename: string): boolean { return /\.(svg|pdf|png|jpg|jpeg|webp)$/i.test(filename); }
export function modelMimeAllowed(mime: string): boolean { return mime === "model/gltf-binary" || mime === "model/gltf+json" || mime === "application/octet-stream"; }
export function blueprintMimeAllowed(mime: string): boolean { return ["image/svg+xml", "image/png", "image/jpeg", "image/webp", "application/pdf"].includes(mime); }

export function buildPreloadHints(modelUrl: string, blueprintUrl: string, profile: CadPerformanceProfile) {
  const hints: Array<{ rel: string; as: string; href: string; type?: string }> = [];
  if (profile.preloadBlueprint) hints.push({ rel: "preload", as: "image", href: blueprintUrl });
  if (profile.preloadModel && profile.renderMode === "webgl") hints.push({ rel: "preload", as: "fetch", href: modelUrl, type: "model/gltf-binary" });
  return hints;
}

export function createIntersectionMargin(tier: DeviceTier): string {
  if (tier === "low") return "80px 0px 80px 0px";
  if (tier === "balanced") return "160px 0px 160px 0px";
  return "240px 0px 240px 0px";
}

export function frameBudgetForTier(tier: DeviceTier): number {
  if (tier === "low") return 30;
  if (tier === "balanced") return 20;
  return 16;
}

export function isWithinFrameBudget(frameMs: number, tier: DeviceTier): boolean { return frameMs <= frameBudgetForTier(tier); }
export function lineDensityPerPixel(width: number, budget: number): number { return budget / Math.max(1, width); }
export function pixelBudgetDescription(profile: CadPerformanceProfile): string { return `${Math.round(profile.pixelBudget).toLocaleString()} pixels/frame target`; }

export function selectCanvasSize(width: number, height: number, maxPixelBudget: number): { width: number; height: number; scale: number } {
  const pixels = Math.max(1, width * height);
  const scale = Math.min(1, Math.sqrt(maxPixelBudget / pixels));
  return { width: Math.max(1, Math.floor(width * scale)), height: Math.max(1, Math.floor(height * scale)), scale };
}

export function animationScale(profile: CadPerformanceProfile): number {
  if (!profile.animateCamera) return 0;
  if (profile.tier === "low") return 0.2;
  if (profile.tier === "balanced") return 0.5;
  if (profile.tier === "high") return 0.72;
  return 1;
}

export function choosePostProcessing(profile: CadPerformanceProfile): { bloom: boolean; antialias: boolean; toneMapping: boolean } {
  if (profile.renderMode !== "webgl") return { bloom: false, antialias: false, toneMapping: false };
  if (profile.tier === "low") return { bloom: false, antialias: true, toneMapping: true };
  if (profile.tier === "balanced") return { bloom: false, antialias: true, toneMapping: true };
  return { bloom: false, antialias: true, toneMapping: true };
}

export function fpsGuard(samples: number[], target = 55): { ok: boolean; average: number; recommendation: "keep" | "reduce-dpr" | "reduce-geometry" | "fallback-svg" } {
  if (!samples.length) return { ok: true, average: 60, recommendation: "keep" };
  const average = samples.reduce((sum, value) => sum + value, 0) / samples.length;
  if (average >= target) return { ok: true, average, recommendation: "keep" };
  if (average >= target - 8) return { ok: false, average, recommendation: "reduce-dpr" };
  if (average >= target - 18) return { ok: false, average, recommendation: "reduce-geometry" };
  return { ok: false, average, recommendation: "fallback-svg" };
}

export function createQualityLadder(): Array<{ stage: number; action: string }> {
  return [
    { stage: 0, action: "Use approved poster/SVG fallback." },
    { stage: 1, action: "Enable WebGL with 1x DPR and reduced geometry." },
    { stage: 2, action: "Enable full procedural linework at balanced density." },
    { stage: 3, action: "Enable real GLB project model within validated budget." },
    { stage: 4, action: "Enable higher DPR only after runtime frame checks." },
  ];
}

export function evaluateCadExperience(input: CadPerformanceInput): { profile: CadPerformanceProfile; ladder: ReturnType<typeof createQualityLadder> } {
  return { profile: buildCadPerformanceProfile(input), ladder: createQualityLadder() };
}

export const CAD_PERFORMANCE_VERSION = "7.0.0";

/*
Production principles:
01 progressive enhancement;
02 first content before canvas;
03 one WebGL context per visible stage;
04 no heavy texture atlas for decorative models;
05 no infinite render loops after section leaves viewport;
06 reduced motion as a first-class mode;
07 data saver respected;
08 poster and SVG always available;
09 model budget enforced server-side;
10 media rights kept outside geometry;
11 no private CAD files in public URLs;
12 no client-specific coordinates in generic presets;
13 cache immutable model revisions;
14 invalidate cache when model revision changes;
15 keep model loaders lazy;
16 keep Drei helpers tree-shakable where practical;
17 avoid post-processing unless it materially improves the scene;
18 avoid shadows for wireframe-only scenes;
19 avoid real-time reflections for editorial visuals;
20 use line materials carefully to prevent overdraw;
21 pause camera animation when the tab is hidden;
22 lower DPR before lowering text legibility;
23 do not disable keyboard navigation for 3D controls;
24 keep labels in DOM when possible;
25 retain a descriptive heading outside canvas;
26 make model selection URL-addressable only when useful;
27 keep project story order independent of scene state;
28 avoid auto-rotate on touch devices by default;
29 test Safari and Chromium separately;
30 test iOS memory pressure explicitly;
31 verify low-power mode behavior;
32 avoid loading three separate models simultaneously;
33 use a model registry rather than scattered URLs;
34 use signed URLs when files are private;
35 use origin checks when receiving uploads;
36 restrict public model MIME types;
37 scan uploaded archives where required;
38 cap compressed archive extraction size;
39 remove unsupported extensions before storage;
40 retain audit trail for model publication;
41 do not expose source DWG metadata;
42 convert BIM data to simplified public geometry;
43 keep sensitive building systems abstracted;
44 publish only client-approved visual layers;
45 keep construction-drawing disclaimer near technical views;
46 avoid saying “AutoCAD model” unless that is actually the source;
47 “CAD-inspired” is acceptable for procedural geometry;
48 “BIM visualization” should be used only when backed by a BIM asset;
49 “conceptual structural study” is safe for procedural geometry;
50 final website copy should distinguish real project data from demo geometry.
*/
