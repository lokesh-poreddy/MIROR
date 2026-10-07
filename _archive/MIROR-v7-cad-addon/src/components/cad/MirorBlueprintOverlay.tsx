"use client";

import React, { useMemo, useState } from "react";
import {
  CAD_PALETTE,
  ENGINEERING_CALLOUTS,
  makePlanGrid,
  type Coordinate,
  type DimensionSpec,
  type HotspotSpec,
  type LineSpec,
  type StructurePreset,
} from "@/lib/miror-cad-geometry";

export type BlueprintMode = "plan" | "elevation" | "section";
export type BlueprintOverlayProps = {
  preset: StructurePreset;
  mode?: BlueprintMode;
  compact?: boolean;
  showGrid?: boolean;
  showDimensions?: boolean;
  showCallouts?: boolean;
  showTitleBlock?: boolean;
  interactive?: boolean;
  onHotspotSelect?: (hotspot: HotspotSpec) => void;
};

type LabelPoint = { x: number; y: number; text: string; anchor?: "start" | "middle" | "end" };
type SvgRect = { x: number; y: number; width: number; height: number; opacity?: number; className?: string };

const SVG_W = 1200;
const SVG_H = 800;
const MARGIN = 90;

function clamp(value: number, min: number, max: number) { return Math.min(max, Math.max(min, value)); }
function map(value: number, fromMin: number, fromMax: number, toMin: number, toMax: number) { return toMin + ((value - fromMin) / (fromMax - fromMin || 1)) * (toMax - toMin); }
function projectX(x: number, width: number) { return map(x, -width / 2, width / 2, MARGIN, SVG_W - MARGIN); }
function projectY(y: number, height: number) { return map(y, 0, height, SVG_H - MARGIN, MARGIN); }
function fmt(value: number) { return Number.isInteger(value) ? String(value) : value.toFixed(1); }

function lineToSvg(line: LineSpec, preset: StructurePreset): { x1: number; y1: number; x2: number; y2: number } {
  if (line.semantic?.includes("grid") || line.semantic?.includes("axis-z")) {
    return {
      x1: projectX(line.start[0], preset.envelope[0] * 1.7),
      y1: projectY(line.start[2], preset.envelope[2] * 1.7),
      x2: projectX(line.end[0], preset.envelope[0] * 1.7),
      y2: projectY(line.end[2], preset.envelope[2] * 1.7),
    };
  }
  return {
    x1: projectX(line.start[0], preset.envelope[0]),
    y1: projectY(line.start[1], preset.envelope[1]),
    x2: projectX(line.end[0], preset.envelope[0]),
    y2: projectY(line.end[1], preset.envelope[1]),
  };
}

function PlanViewport({ preset, showGrid }: { preset: StructurePreset; showGrid: boolean }) {
  const width = preset.envelope[0];
  const depth = preset.envelope[2];
  const planScaleW = width * 1.6;
  const planScaleD = depth * 1.6;
  const building = {
    x: projectX(-width / 2, planScaleW),
    y: projectY(depth / 2, planScaleD),
    width: (width / planScaleW) * (SVG_W - 2 * MARGIN),
    height: (depth / planScaleD) * (SVG_H - 2 * MARGIN),
  };
  const grid = useMemo(() => makePlanGrid(Math.max(planScaleW, planScaleD), 2, 0), [planScaleW, planScaleD]);
  const baysX = Math.max(1, preset.grid.x);
  const baysZ = Math.max(1, preset.grid.z);
  const vertical = Array.from({ length: baysX + 1 }, (_, index) => building.x + (building.width / baysX) * index);
  const horizontal = Array.from({ length: baysZ + 1 }, (_, index) => building.y + (building.height / baysZ) * index);
  return (
    <g>
      {showGrid && grid.map((line, index) => {
        const x1 = projectX(line.start[0], planScaleW);
        const y1 = projectY(line.start[2], planScaleD);
        const x2 = projectX(line.end[0], planScaleW);
        const y2 = projectY(line.end[2], planScaleD);
        return <line key={`plan-grid-${index}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={CAD_PALETTE.lineSoft} strokeWidth="1" opacity="0.5" />;
      })}
      <rect x={building.x} y={building.y} width={building.width} height={building.height} fill="none" stroke={CAD_PALETTE.line} strokeWidth="2" />
      <rect x={building.x + building.width * 0.18} y={building.y + building.height * 0.16} width={building.width * 0.64} height={building.height * 0.68} fill="rgba(157,219,216,.05)" stroke={CAD_PALETTE.glass} strokeWidth="2" />
      {vertical.map((x, index) => <line key={`v-${index}`} x1={x} y1={building.y} x2={x} y2={building.y + building.height} stroke={CAD_PALETTE.lineMuted} strokeWidth="1" opacity=".8" />)}
      {horizontal.map((y, index) => <line key={`h-${index}`} x1={building.x} y1={y} x2={building.x + building.width} y2={y} stroke={CAD_PALETTE.lineMuted} strokeWidth="1" opacity=".8" />)}
      <circle cx={building.x + building.width / 2} cy={building.y + building.height / 2} r="22" fill="none" stroke={CAD_PALETTE.accent} strokeWidth="1.5" />
      <line x1={building.x + building.width / 2 - 48} y1={building.y + building.height / 2} x2={building.x + building.width / 2 + 48} y2={building.y + building.height / 2} stroke={CAD_PALETTE.accent} opacity=".5" />
      <line x1={building.x + building.width / 2} y1={building.y + building.height / 2 - 48} x2={building.x + building.width / 2} y2={building.y + building.height / 2 + 48} stroke={CAD_PALETTE.accent} opacity=".5" />
      {Array.from({ length: baysX + 1 }, (_, index) => <text key={`axis-x-${index}`} x={vertical[index]} y={building.y - 12} fill={CAD_PALETTE.lineMuted} fontSize="12" textAnchor="middle">{String.fromCharCode(65 + index)}</text>)}
      {Array.from({ length: baysZ + 1 }, (_, index) => <text key={`axis-z-${index}`} x={building.x - 16} y={horizontal[index] + 4} fill={CAD_PALETTE.lineMuted} fontSize="12" textAnchor="end">{index + 1}</text>)}
    </g>
  );
}

function ElevationViewport({ preset, axis }: { preset: StructurePreset; axis: "x" | "z" }) {
  const width = axis === "x" ? preset.envelope[0] : preset.envelope[2];
  const height = preset.envelope[1];
  const levels = preset.levels;
  const x0 = MARGIN + 60;
  const y0 = SVG_H - MARGIN;
  const w = SVG_W - MARGIN * 2 - 120;
  const h = SVG_H - MARGIN * 2;
  const shellX = map(-width / 2, -width, width, x0, x0 + w);
  const shellW = map(width / 2, -width, width, x0, x0 + w) - shellX;
  const top = map(height, 0, height * 1.1, y0, MARGIN);
  return (
    <g>
      <rect x={shellX} y={top} width={shellW} height={y0 - top} fill="rgba(157,219,216,.03)" stroke={CAD_PALETTE.line} strokeWidth="2" />
      {levels.map((level, index) => {
        const y = map(level.elevation, 0, height * 1.1, y0, MARGIN);
        return <g key={level.id}><line x1={shellX - 28} y1={y} x2={shellX + shellW + 28} y2={y} stroke={CAD_PALETTE.lineMuted} opacity=".7" /><text x={shellX - 38} y={y + 4} fill={CAD_PALETTE.lineMuted} fontSize="11" textAnchor="end">{level.label}</text><text x={shellX + shellW + 38} y={y + 4} fill={CAD_PALETTE.accent} fontSize="11">+{fmt(level.elevation)}m</text></g>;
      })}
      {Array.from({ length: Math.max(2, preset.grid.x + 1) }, (_, index) => {
        const x = shellX + (shellW / Math.max(1, preset.grid.x)) * index;
        return <line key={`elev-column-${index}`} x1={x} y1={top} x2={x} y2={y0} stroke={CAD_PALETTE.glass} opacity=".38" />;
      })}
      <rect x={shellX + shellW * .36} y={top + (y0 - top) * .13} width={shellW * .28} height={(y0 - top) * .74} fill="none" stroke={CAD_PALETTE.accent} opacity=".65" strokeWidth="2" />
      <text x={SVG_W - MARGIN} y={MARGIN - 18} textAnchor="end" fill={CAD_PALETTE.line} fontSize="14">ELEVATION {axis === "x" ? "A" : "B"}</text>
    </g>
  );
}

function SectionViewport({ preset }: { preset: StructurePreset }) {
  const width = preset.envelope[0];
  const height = preset.envelope[1];
  const x = MARGIN + 120;
  const y = SVG_H - MARGIN;
  const w = SVG_W - MARGIN * 2 - 240;
  const h = SVG_H - MARGIN * 2;
  const floorHeight = height / Math.max(1, preset.floors);
  const floorLines = Array.from({ length: Math.max(1, preset.floors) }, (_, index) => y - floorHeight * (index + 1) * (h / height));
  return (
    <g>
      <rect x={x} y={y - h} width={w} height={h} fill="rgba(157,219,216,.02)" stroke={CAD_PALETTE.line} strokeWidth="2" />
      {floorLines.map((floorY, index) => <g key={`section-floor-${index}`}><line x1={x} y1={floorY} x2={x + w} y2={floorY} stroke={CAD_PALETTE.lineMuted} opacity=".5" /><text x={x + 12} y={floorY - 7} fill={CAD_PALETTE.lineMuted} fontSize="10">LEVEL {String(index + 1).padStart(2, "0")}</text></g>)}
      <rect x={x + w * .42} y={y - h * .78} width={w * .16} height={h * .58} fill="rgba(214,173,89,.04)" stroke={CAD_PALETTE.accent} strokeWidth="2" />
      <path d={`M ${x + w*.10} ${y} L ${x + w*.10} ${y-h*.12} L ${x+w*.32} ${y-h*.24} L ${x+w*.32} ${y} Z`} fill="none" stroke={CAD_PALETTE.glass} strokeWidth="1.5" opacity=".7" />
      <path d={`M ${x + w*.68} ${y} L ${x + w*.68} ${y-h*.24} L ${x+w*.9} ${y-h*.12} L ${x+w*.9} ${y} Z`} fill="none" stroke={CAD_PALETTE.glass} strokeWidth="1.5" opacity=".7" />
      <text x={x} y={y-h-24} fill={CAD_PALETTE.line} fontSize="14">SECTION A-A · STRUCTURAL CUT</text>
    </g>
  );
}

function DimensionMarkup({ preset }: { preset: StructurePreset }) {
  const labels: LabelPoint[] = [];
  const width = preset.envelope[0];
  const depth = preset.envelope[2];
  const height = preset.envelope[1];
  labels.push({ x: SVG_W / 2, y: SVG_H - 28, text: `${fmt(width)} m`, anchor: "middle" });
  labels.push({ x: SVG_W - 28, y: SVG_H / 2, text: `${fmt(depth)} m`, anchor: "middle" });
  labels.push({ x: 28, y: SVG_H / 2, text: `${fmt(height)} m`, anchor: "middle" });
  return (
    <g>
      <line x1={MARGIN} y1={SVG_H - 52} x2={SVG_W - MARGIN} y2={SVG_H - 52} stroke={CAD_PALETTE.accent} opacity=".72" />
      <line x1={MARGIN} y1={SVG_H - 61} x2={MARGIN} y2={SVG_H - 43} stroke={CAD_PALETTE.accent} />
      <line x1={SVG_W - MARGIN} y1={SVG_H - 61} x2={SVG_W - MARGIN} y2={SVG_H - 43} stroke={CAD_PALETTE.accent} />
      <line x1={SVG_W - 52} y1={MARGIN} x2={SVG_W - 52} y2={SVG_H - MARGIN} stroke={CAD_PALETTE.accent} opacity=".72" />
      <line x1={SVG_W - 61} y1={MARGIN} x2={SVG_W - 43} y2={MARGIN} stroke={CAD_PALETTE.accent} />
      <line x1={SVG_W - 61} y1={SVG_H - MARGIN} x2={SVG_W - 43} y2={SVG_H - MARGIN} stroke={CAD_PALETTE.accent} />
      <text x={labels[0].x} y={labels[0].y} fill={CAD_PALETTE.accent} fontSize="12" textAnchor="middle">{labels[0].text}</text>
      <text x={labels[1].x} y={labels[1].y} fill={CAD_PALETTE.accent} fontSize="12" textAnchor="middle" transform={`rotate(-90 ${labels[1].x} ${labels[1].y})`}>{labels[1].text}</text>
      <text x={labels[2].x} y={labels[2].y} fill={CAD_PALETTE.accent} fontSize="12" textAnchor="middle" transform={`rotate(-90 ${labels[2].x} ${labels[2].y})`}>{labels[2].text}</text>
    </g>
  );
}

function HotspotMarkers({ preset, onHotspotSelect }: { preset: StructurePreset; onHotspotSelect?: (hotspot: HotspotSpec) => void }) {
  return <g>{preset.hotspots.map((hotspot, index) => {
    const x = map(index % 4, 0, 3, MARGIN + 80, SVG_W - MARGIN - 80);
    const y = MARGIN + 62 + Math.floor(index / 4) * 52;
    return <g key={hotspot.id} className="miror-blueprint-hotspot" role="button" tabIndex={0} onClick={() => onHotspotSelect?.(hotspot)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") onHotspotSelect?.(hotspot); }}><circle cx={x} cy={y} r="7" fill={hotspot.color ?? CAD_PALETTE.accent} /><circle cx={x} cy={y} r="15" fill="none" stroke={hotspot.color ?? CAD_PALETTE.accent} opacity=".36" /><text x={x + 24} y={y + 4} fill={CAD_PALETTE.line} fontSize="11">{String(index + 1).padStart(2, "0")} · {hotspot.label}</text></g>;
  })}</g>;
}

function CalloutBlock() {
  const items = ENGINEERING_CALLOUTS.slice(0, 8);
  return <g>{items.map((item, index) => { const x = SVG_W - MARGIN - 170; const y = MARGIN + index * 24; return <text key={item} x={x} y={y} fill={CAD_PALETTE.lineMuted} fontSize="9" textAnchor="end" opacity={index % 2 ? .55 : .8}>{item}</text>; })}</g>;
}

function TitleBlock({ preset }: { preset: StructurePreset }) {
  const x = SVG_W - MARGIN - 310;
  const y = SVG_H - MARGIN - 116;
  return (
    <g>
      <rect x={x} y={y} width="310" height="116" fill="rgba(8,16,21,.88)" stroke={CAD_PALETTE.lineMuted} />
      <line x1={x} y1={y + 34} x2={x + 310} y2={y + 34} stroke={CAD_PALETTE.lineMuted} />
      <line x1={x + 208} y1={y} x2={x + 208} y2={y + 116} stroke={CAD_PALETTE.lineMuted} />
      <text x={x + 16} y={y + 22} fill={CAD_PALETTE.line} fontSize="12" fontWeight="700">MIROR CONSTRUCTIONS</text>
      <text x={x + 16} y={y + 54} fill={CAD_PALETTE.lineMuted} fontSize="9">DIGITAL STRUCTURE STUDY</text>
      <text x={x + 16} y={y + 71} fill={CAD_PALETTE.white} fontSize="11">{preset.title}</text>
      <text x={x + 16} y={y + 88} fill={CAD_PALETTE.lineMuted} fontSize="9">SCHEMATIC / WEB VISUAL</text>
      <text x={x + 228} y={y + 58} fill={CAD_PALETTE.accent} fontSize="18">{preset.id.toUpperCase()}</text>
      <text x={x + 228} y={y + 79} fill={CAD_PALETTE.lineMuted} fontSize="8">REV. 01</text>
      <text x={x + 228} y={y + 96} fill={CAD_PALETTE.lineMuted} fontSize="8">V7.0</text>
    </g>
  );
}

export default function MirorBlueprintOverlay({ preset, mode = "plan", compact = false, showGrid = true, showDimensions = true, showCallouts = true, showTitleBlock = true, interactive = true, onHotspotSelect }: BlueprintOverlayProps) {
  const [activeMode, setActiveMode] = useState<BlueprintMode>(mode);
  const [activeLayer, setActiveLayer] = useState("structure");
  const modes: BlueprintMode[] = ["plan", "elevation", "section"];
  const labels = { plan: "PLAN", elevation: "ELEVATION", section: "SECTION" };
  return (
    <div className={`miror-blueprint-overlay ${compact ? "is-compact" : ""}`} data-mode={activeMode}>
      <div className="miror-blueprint-toolbar" aria-label="Blueprint view controls">
        <div className="miror-blueprint-modes" role="tablist" aria-label="Blueprint views">
          {modes.map((item) => <button key={item} type="button" className={activeMode === item ? "is-active" : ""} onClick={() => setActiveMode(item)} role="tab" aria-selected={activeMode === item}>{labels[item]}</button>)}
        </div>
        <button type="button" className="miror-blueprint-layer" onClick={() => setActiveLayer((value) => value === "structure" ? "section" : "structure")}>LAYER / {activeLayer.toUpperCase()}</button>
      </div>
      <div className="miror-blueprint-frame">
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} role="img" aria-label={`${preset.title} ${labels[activeMode].toLowerCase()} technical drawing`} preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="miror-major-grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke={CAD_PALETTE.lineSoft} strokeWidth="0.7" opacity="0.6" /></pattern>
            <pattern id="miror-minor-grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke={CAD_PALETTE.lineSoft} strokeWidth="0.45" opacity="0.38" /></pattern>
            <linearGradient id="miror-blueprint-fade" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor={CAD_PALETTE.background} /><stop offset=".55" stopColor="#0c171d" /><stop offset="1" stopColor="#071014" /></linearGradient>
            <filter id="miror-blueprint-glow"><feGaussianBlur stdDeviation="2.8" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          </defs>
          <rect width={SVG_W} height={SVG_H} fill="url(#miror-blueprint-fade)" />
          {showGrid && <><rect x="0" y="0" width={SVG_W} height={SVG_H} fill="url(#miror-minor-grid)" opacity=".55" /><rect x="0" y="0" width={SVG_W} height={SVG_H} fill="url(#miror-major-grid)" opacity=".55" /></>}
          <text x={MARGIN} y={MARGIN - 30} fill={CAD_PALETTE.lineMuted} fontSize="11" letterSpacing="3">MIROR / ENGINEERING VISUALIZATION SYSTEM</text>
          <text x={MARGIN} y={MARGIN - 8} fill={CAD_PALETTE.line} fontSize="22" fontWeight="700">{preset.title}</text>
          {activeMode === "plan" && <PlanViewport preset={preset} showGrid={showGrid} />}
          {activeMode === "elevation" && <ElevationViewport preset={preset} axis="x" />}
          {activeMode === "section" && <SectionViewport preset={preset} />}
          {showDimensions && <DimensionMarkup preset={preset} />}
          {interactive && <HotspotMarkers preset={preset} onHotspotSelect={onHotspotSelect} />}
          {showCallouts && <CalloutBlock />}
          {showTitleBlock && <TitleBlock preset={preset} />}
          <g opacity=".6"><line x1={MARGIN} y1={SVG_H - MARGIN + 9} x2={MARGIN + 80} y2={SVG_H - MARGIN + 9} stroke={CAD_PALETTE.accent} /><text x={MARGIN} y={SVG_H - MARGIN + 26} fill={CAD_PALETTE.lineMuted} fontSize="8">REFERENCE GRAPHIC · NOT FOR CONSTRUCTION</text></g>
        </svg>
      </div>
      <div className="miror-blueprint-footer">
        <span>SCHEMATIC VIEW</span>
        <span>GRID {preset.grid.x} × {preset.grid.z}</span>
        <span>{preset.category.toUpperCase()}</span>
        <span>STATUS / CONCEPTUAL</span>
      </div>
    </div>
  );
}

export function blueprintToSummary(preset: StructurePreset): Record<string, string> {
  return {
    structure: preset.title,
    category: preset.category,
    floors: String(preset.floors),
    modules: String(preset.modules),
    envelope: preset.envelope.map(fmt).join(" × "),
    hotspots: String(preset.hotspots.length),
  };
}

export function dimensionSummary(dimensions: DimensionSpec[]): string[] {
  return dimensions.map((dimension) => `${dimension.axis.toUpperCase()}: ${dimension.label}`);
}

export function hotspotSummary(hotspots: HotspotSpec[]): string[] {
  return hotspots.map((hotspot) => `${hotspot.label}: ${hotspot.description}`);
}

export function blueprintExportDescription(preset: StructurePreset): string {
  return `MIROR technical visualization for ${preset.title}. This web graphic communicates structural concepts and is not a construction drawing.`;
}

export const BLUEPRINT_OVERLAY_VERSION = "7.0.0";

export const BLUEPRINT_OVERLAY_FEATURES = [
  "plan-view",
  "elevation-view",
  "section-view",
  "grid-system",
  "dimension-markup",
  "engineering-callouts",
  "hotspot-navigation",
  "title-block",
  "responsive-svg",
  "conceptual-watermark",
  "keyboard-hotspots",
] as const;

export function hasBlueprintFeature(feature: string): boolean {
  return BLUEPRINT_OVERLAY_FEATURES.includes(feature as (typeof BLUEPRINT_OVERLAY_FEATURES)[number]);
}

/* Design and publication notes:
01 — Keep all numerical dimensions clearly conceptual until sourced from a public approved document.
02 — Real CAD-derived plan drawings should use a project-specific revision block.
03 — If client provides DWG, convert it offline to simplified SVG or GLB before web delivery.
04 — Do not expose hidden layers from a production DWG export.
05 — Strip authoring-software metadata from public files when it contains private information.
06 — Keep the blueprint overlay readable at 320px viewport width.
07 — Prefer vector linework for plans to avoid pixelated technical details.
08 — Use a static SVG fallback even when the 3D scene is active.
09 — Use the overlay to support narrative chapters, not to compete with the headline.
10 — Coordinate the accent color with the site's single accent token.
11 — Avoid generic blueprint clip art; geometry should be generated from a structural system.
12 — Use real photos adjacent to technical linework for contrast.
13 — On project pages, pair the model with role/scope information.
14 — On capability pages, use the same coordinate grammar to build continuity.
15 — Keep technical labels sparse enough to feel credible.
16 — Avoid fake engineering certification symbols.
17 — Never imply a decorative model is a signed engineering drawing.
18 — Preserve document accessibility through surrounding HTML text.
19 — Use focus rings on interactive SVG regions.
20 — Do not use pointer-following motion inside the technical drawing if it harms control.
21 — Provide an explicit reduce-motion mode.
22 — If an actual model is unavailable, procedural geometry remains acceptable as a design motif.
23 — The website should load into editorial content even when the entire visual layer fails.
24 — WebGL and SVG should never become a single point of failure for lead conversion.
25 — Use project-specific media rights metadata whenever approved models are loaded.
26 — If a project contains sensitive infrastructure details, use simplified geometry.
27 — The visual layer can communicate construction sequence without revealing security-sensitive drawings.
28 — Keep file sizes below the site's normal media budget.
29 — Use browser-native SVG rather than rasterized screenshots whenever practical.
30 — Keep blueprint titles editable through the project content model.
31 — Preserve the same IDs between visual hotspots and project content when possible.
32 — Ensure the content system can disable individual hotspots per project.
33 — Allow a project owner to hide dimensions entirely.
34 — Do not show a client logo inside a model unless the logo has publication approval.
35 — Use the title block as editorial metadata, not a faux legal document.
36 — Keep revision numbers tied to the site's published asset revision.
37 — Add source-document provenance only in internal metadata when publication is not desired.
38 — A public case study may state “concept visualization” rather than “construction drawing.”
39 — Real measurement annotations must use units consistently.
40 — Avoid mixing imperial and metric units on an Indian construction company's public site.
*/

export type BlueprintAudit = {
  hasTitle: boolean;
  hasCategory: boolean;
  hasDimensions: boolean;
  hasHotspots: boolean;
  conceptualOnly: boolean;
};

export function auditBlueprintPreset(preset: StructurePreset): BlueprintAudit {
  return {
    hasTitle: Boolean(preset.title),
    hasCategory: Boolean(preset.category),
    hasDimensions: preset.dimensions.length > 0,
    hasHotspots: preset.hotspots.length > 0,
    conceptualOnly: true,
  };
}
