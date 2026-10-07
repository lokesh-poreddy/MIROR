/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * MIROR CAD / BIM VISUAL GEOMETRY ENGINE
 *
 * This file contains lightweight procedural geometry definitions used by the
 * website's architectural visualization layer. It deliberately avoids any
 * proprietary AutoCAD parser. Real DWG/DXF deliverables should be converted
 * to web-safe GLB/GLTF or SVG assets before being connected to this runtime.
 */

export type Axis = "x" | "y" | "z";
export type Coordinate = [number, number, number];
export type ColorStop = { color: string; intensity: number };
export type LineSpec = {
  start: Coordinate;
  end: Coordinate;
  weight?: number;
  opacity?: number;
  semantic?: string;
};
export type BoxSpec = {
  position: Coordinate;
  size: Coordinate;
  rotation?: Coordinate;
  layer?: string;
  opacity?: number;
  accent?: boolean;
};
export type ColumnSpec = {
  position: Coordinate;
  height: number;
  width: number;
  depth: number;
  material?: "steel" | "concrete" | "glass" | "accent";
};
export type SlabSpec = {
  level: number;
  width: number;
  depth: number;
  thickness: number;
  inset?: number;
  opacity?: number;
};
export type BeamSpec = {
  start: Coordinate;
  end: Coordinate;
  thickness: number;
  material?: "steel" | "concrete" | "accent";
};
export type LevelSpec = {
  id: string;
  label: string;
  elevation: number;
  program?: string;
};
export type DimensionSpec = {
  axis: Axis;
  from: number;
  to: number;
  level: number;
  offset: number;
  label: string;
};
export type HotspotSpec = {
  id: string;
  label: string;
  position: Coordinate;
  description: string;
  color?: string;
};
export type StructurePreset = {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  envelope: Coordinate;
  center: Coordinate;
  floors: number;
  modules: number;
  grid: { x: number; z: number };
  levels: LevelSpec[];
  columns: ColumnSpec[];
  slabs: SlabSpec[];
  beams: BeamSpec[];
  boxes: BoxSpec[];
  dimensions: DimensionSpec[];
  hotspots: HotspotSpec[];
  tags: string[];
};

export const CAD_PALETTE = {
  background: "#081015",
  surface: "#101a20",
  line: "#bce8e4",
  lineMuted: "#55767a",
  lineSoft: "#274146",
  glass: "#9ddbd8",
  accent: "#d6ad59",
  white: "#f2f4f1",
  danger: "#d87667",
} as const;

export const DEFAULT_CAD_OPTIONS = {
  showStructure: true,
  showEnvelope: true,
  showGrid: true,
  showDimensions: true,
  showLabels: true,
  showHotspots: true,
  showGroundPlane: true,
  autoRotate: true,
  interactive: true,
  intensity: 0.82,
  lineOpacity: 0.78,
  maxDpr: 1.55,
  mobileMaxDpr: 1.1,
  maxActiveHotspots: 8,
  reducedMotion: false,
} as const;

export function add3(a: Coordinate, b: Coordinate): Coordinate {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

export function sub3(a: Coordinate, b: Coordinate): Coordinate {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

export function mul3(a: Coordinate, scalar: number): Coordinate {
  return [a[0] * scalar, a[1] * scalar, a[2] * scalar];
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

export function lerp3(a: Coordinate, b: Coordinate, t: number): Coordinate {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function roundTo(value: number, precision = 3): number {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

export function almostEqual(a: number, b: number, epsilon = 0.0001): boolean {
  return Math.abs(a - b) <= epsilon;
}

export function distance3(a: Coordinate, b: Coordinate): number {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  const dz = a[2] - b[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export function midpoint3(a: Coordinate, b: Coordinate): Coordinate {
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
}

export function normalize3(value: Coordinate): Coordinate {
  const length = Math.sqrt(value[0] ** 2 + value[1] ** 2 + value[2] ** 2) || 1;
  return [value[0] / length, value[1] / length, value[2] / length];
}

export function cross3(a: Coordinate, b: Coordinate): Coordinate {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

export function dot3(a: Coordinate, b: Coordinate): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

export function makeLine(
  start: Coordinate,
  end: Coordinate,
  semantic = "detail",
  opacity = 0.72,
  weight = 1,
): LineSpec {
  return { start, end, semantic, opacity, weight };
}

export function makeBox(
  position: Coordinate,
  size: Coordinate,
  layer = "envelope",
  opacity = 0.08,
  accent = false,
): BoxSpec {
  return { position, size, layer, opacity, accent };
}

export function makeColumn(
  x: number,
  y: number,
  z: number,
  height: number,
  width: number,
  depth: number,
  material: ColumnSpec["material"] = "steel",
): ColumnSpec {
  return { position: [x, y, z], height, width, depth, material };
}

export function makeSlab(
  level: number,
  width: number,
  depth: number,
  thickness = 0.14,
  inset = 0,
  opacity = 0.1,
): SlabSpec {
  return { level, width, depth, thickness, inset, opacity };
}

export function makeBeam(
  start: Coordinate,
  end: Coordinate,
  thickness = 0.12,
  material: BeamSpec["material"] = "steel",
): BeamSpec {
  return { start, end, thickness, material };
}

export function generateGridLines(
  width: number,
  depth: number,
  stepX: number,
  stepZ: number,
  y = 0,
): LineSpec[] {
  const lines: LineSpec[] = [];
  const halfW = width / 2;
  const halfD = depth / 2;
  for (let x = -halfW; x <= halfW + stepX * 0.25; x += stepX) {
    lines.push(makeLine([roundTo(x), y, -halfD], [roundTo(x), y, halfD], "grid", 0.25));
  }
  for (let z = -halfD; z <= halfD + stepZ * 0.25; z += stepZ) {
    lines.push(makeLine([-halfW, y, roundTo(z)], [halfW, y, roundTo(z)], "grid", 0.25));
  }
  return lines;
}

export function generateLevelLines(
  width: number,
  depth: number,
  levels: number[],
): LineSpec[] {
  return levels.flatMap((level) => [
    makeLine([-width / 2, level, -depth / 2], [width / 2, level, -depth / 2], "level", 0.58),
    makeLine([width / 2, level, -depth / 2], [width / 2, level, depth / 2], "level", 0.58),
    makeLine([width / 2, level, depth / 2], [-width / 2, level, depth / 2], "level", 0.58),
    makeLine([-width / 2, level, depth / 2], [-width / 2, level, -depth / 2], "level", 0.58),
  ]);
}

export function generateFacadeBays(
  width: number,
  height: number,
  depth: number,
  floors: number,
  baysX: number,
  baysZ: number,
): LineSpec[] {
  const result: LineSpec[] = [];
  const stepX = width / baysX;
  const stepZ = depth / baysZ;
  const floorHeight = height / Math.max(1, floors);
  for (let floor = 0; floor <= floors; floor += 1) {
    const y = floor * floorHeight;
    for (let bay = 0; bay <= baysX; bay += 1) {
      const x = -width / 2 + bay * stepX;
      result.push(makeLine([x, y, -depth / 2], [x, y, depth / 2], "facade", 0.46));
    }
    for (let bay = 0; bay <= baysZ; bay += 1) {
      const z = -depth / 2 + bay * stepZ;
      result.push(makeLine([-width / 2, y, z], [width / 2, y, z], "facade", 0.46));
    }
  }
  return result;
}

export function generateWindowBands(
  width: number,
  depth: number,
  floorCount: number,
  floorHeight: number,
  bandHeight: number,
  margin = 0.4,
): BoxSpec[] {
  const result: BoxSpec[] = [];
  const frontDepth = 0.04;
  for (let floor = 0; floor < floorCount; floor += 1) {
    const y = floor * floorHeight + floorHeight * 0.56;
    result.push(makeBox([0, y, -depth / 2 - frontDepth], [Math.max(0, width - margin), bandHeight, frontDepth], "glass", 0.11));
    result.push(makeBox([0, y, depth / 2 + frontDepth], [Math.max(0, width - margin), bandHeight, frontDepth], "glass", 0.11));
  }
  return result;
}

export function generateCore(
  center: Coordinate,
  width: number,
  depth: number,
  height: number,
): BoxSpec {
  return makeBox(add3(center, [0, height / 2, 0]), [width, height, depth], "core", 0.16, true);
}

export function generateTower(
  floors: number,
  floorHeight = 2.8,
  width = 11,
  depth = 8,
  bayX = 5,
  bayZ = 4,
): Omit<StructurePreset, "id" | "title" | "subtitle" | "category" | "tags"> {
  const height = floors * floorHeight;
  const columns: ColumnSpec[] = [];
  const beams: BeamSpec[] = [];
  const slabs: SlabSpec[] = [];
  const columnsX: number[] = [];
  const columnsZ: number[] = [];
  for (let ix = 0; ix <= bayX; ix += 1) columnsX.push(-width / 2 + (width / bayX) * ix);
  for (let iz = 0; iz <= bayZ; iz += 1) columnsZ.push(-depth / 2 + (depth / bayZ) * iz);
  columnsX.forEach((x) => columnsZ.forEach((z) => columns.push(makeColumn(x, height / 2, z, height, 0.12, 0.12, "steel"))));
  for (let floor = 1; floor <= floors; floor += 1) {
    const y = floor * floorHeight;
    slabs.push(makeSlab(y, width, depth, 0.16, 0.08, 0.08));
    columnsX.forEach((x) => beams.push(makeBeam([x, y, -depth / 2], [x, y, depth / 2], 0.11, "concrete")));
    columnsZ.forEach((z) => beams.push(makeBeam([-width / 2, y, z], [width / 2, y, z], 0.11, "concrete")));
  }
  const levels: LevelSpec[] = Array.from({ length: floors + 1 }, (_, index) => ({
    id: `L${String(index).padStart(2, "0")}`,
    label: index === 0 ? "GROUND" : `LEVEL ${String(index).padStart(2, "0")}`,
    elevation: roundTo(index * floorHeight),
    program: index === 0 ? "Arrival / Services" : index % 4 === 0 ? "Shared / Utility" : "Working Floor",
  }));
  const dimensions: DimensionSpec[] = [
    { axis: "x", from: -width / 2, to: width / 2, level: 0, offset: -depth / 2 - 1.2, label: `${width.toFixed(1)} m` },
    { axis: "z", from: -depth / 2, to: depth / 2, level: 0, offset: width / 2 + 1.2, label: `${depth.toFixed(1)} m` },
    { axis: "y", from: 0, to: height, level: width / 2 + 1.8, offset: depth / 2 + 1.4, label: `${height.toFixed(1)} m` },
  ];
  const hotspots: HotspotSpec[] = [
    { id: "grid", label: "Structural Grid", position: [0, height * 0.54, -depth / 2], description: "Primary column and beam rhythm used to communicate structural order." },
    { id: "core", label: "Vertical Core", position: [0, height * 0.46, 0], description: "Core volume representing the main vertical circulation and service zone.", color: CAD_PALETTE.accent },
    { id: "slabs", label: "Floor Plates", position: [width * 0.4, height * 0.28, 0], description: "Repeated slabs illustrate the level-by-level construction sequence." },
    { id: "facade", label: "Facade Rhythm", position: [-width * 0.38, height * 0.76, depth / 2], description: "Facade bands emphasize the visual relationship between structure and envelope." },
  ];
  const boxes = [
    generateCore([0, 0, 0], Math.max(1.5, width * 0.18), Math.max(1.5, depth * 0.22), height),
    ...generateWindowBands(width, depth, floors, floorHeight, Math.min(1.05, floorHeight * 0.33)),
  ];
  return {
    envelope: [width, height, depth],
    center: [0, height / 2, 0],
    floors,
    modules: bayX * bayZ,
    grid: { x: bayX, z: bayZ },
    levels,
    columns,
    slabs,
    beams,
    boxes,
    dimensions,
    hotspots,
  };
}

export function generateBridge(
  span = 36,
  deckHeight = 7.5,
  deckWidth = 5.5,
  pierCount = 5,
): Omit<StructurePreset, "id" | "title" | "subtitle" | "category" | "tags"> {
  const pierSpacing = span / (pierCount + 1);
  const columns: ColumnSpec[] = [];
  const beams: BeamSpec[] = [];
  const slabs: SlabSpec[] = [];
  const boxes: BoxSpec[] = [];
  for (let i = 0; i < pierCount; i += 1) {
    const x = -span / 2 + pierSpacing * (i + 1);
    columns.push(makeColumn(x, deckHeight / 2, 0, deckHeight, 0.85, 0.85, "concrete"));
    columns.push(makeColumn(x, deckHeight - 1.0, 0, 2.2, 1.35, 0.9, "concrete"));
  }
  const deck: BeamSpec[] = [
    makeBeam([-span / 2, deckHeight, -deckWidth / 2], [span / 2, deckHeight, -deckWidth / 2], 0.32, "concrete"),
    makeBeam([-span / 2, deckHeight, deckWidth / 2], [span / 2, deckHeight, deckWidth / 2], 0.32, "concrete"),
  ];
  beams.push(...deck);
  slabs.push(makeSlab(deckHeight, span, deckWidth, 0.42, 0.12, 0.13));
  for (let i = 0; i <= 18; i += 1) {
    const x = -span / 2 + (span / 18) * i;
    boxes.push(makeBox([x, deckHeight + 0.55, -deckWidth / 2 + 0.06], [0.08, 1.1, 0.08], "guard", 0.2));
    boxes.push(makeBox([x, deckHeight + 0.55, deckWidth / 2 - 0.06], [0.08, 1.1, 0.08], "guard", 0.2));
  }
  const dimensions: DimensionSpec[] = [
    { axis: "x", from: -span / 2, to: span / 2, level: 0, offset: -deckWidth / 2 - 1.7, label: `${span.toFixed(0)} m span` },
    { axis: "z", from: -deckWidth / 2, to: deckWidth / 2, level: deckHeight, offset: 2.0, label: `${deckWidth.toFixed(1)} m deck` },
  ];
  const levels: LevelSpec[] = [
    { id: "FOUND", label: "FOUNDATION", elevation: 0 },
    { id: "DECK", label: "DECK", elevation: deckHeight, program: "Vehicle / Pedestrian Movement" },
    { id: "PARAPET", label: "PARAPET", elevation: deckHeight + 1.1 },
  ];
  const hotspots: HotspotSpec[] = [
    { id: "deck", label: "Deck System", position: [span * 0.12, deckHeight, 0], description: "Continuous deck element shown as a lightweight structural volume." },
    { id: "pier", label: "Pier", position: [-span * 0.23, deckHeight * 0.48, 0], description: "Vertical support element repeated along the bridge span." },
    { id: "edge", label: "Edge Beam", position: [0, deckHeight + 0.2, deckWidth / 2], description: "Secondary edge member clarifying the bridge section." },
  ];
  return {
    envelope: [span, deckHeight + 2, deckWidth],
    center: [0, deckHeight / 2, 0],
    floors: 1,
    modules: pierCount,
    grid: { x: pierCount + 1, z: 2 },
    levels,
    columns,
    slabs,
    beams,
    boxes,
    dimensions,
    hotspots,
  };
}

export function generateCanalStructure(
  length = 32,
  width = 5.5,
  wallHeight = 3.5,
): Omit<StructurePreset, "id" | "title" | "subtitle" | "category" | "tags"> {
  const walls: BoxSpec[] = [
    makeBox([0, wallHeight / 2, -width / 2], [length, wallHeight, 0.34], "wall", 0.14),
    makeBox([0, wallHeight / 2, width / 2], [length, wallHeight, 0.34], "wall", 0.14),
  ];
  const slabs = [makeSlab(0.14, length, width, 0.3, 0, 0.12)];
  const beams: BeamSpec[] = [];
  const columns: ColumnSpec[] = [];
  const boxes = [...walls];
  for (let i = 0; i <= 16; i += 1) {
    const x = -length / 2 + (length / 16) * i;
    beams.push(makeBeam([x, 0.35, -width / 2], [x, 0.35, width / 2], 0.08, "concrete"));
  }
  for (let i = 1; i <= 6; i += 1) {
    const x = -length / 2 + (length / 7) * i;
    columns.push(makeColumn(x, wallHeight / 2, 0, wallHeight, 0.2, width * 0.8, "concrete"));
  }
  const levels: LevelSpec[] = [
    { id: "BED", label: "CHANNEL BED", elevation: 0 },
    { id: "WALL", label: "WALL TOP", elevation: wallHeight },
  ];
  const dimensions: DimensionSpec[] = [
    { axis: "x", from: -length / 2, to: length / 2, level: 0, offset: -width / 2 - 1.5, label: `${length.toFixed(0)} m` },
    { axis: "z", from: -width / 2, to: width / 2, level: wallHeight, offset: 1.4, label: `${width.toFixed(1)} m` },
  ];
  const hotspots: HotspotSpec[] = [
    { id: "flow", label: "Channel Bed", position: [0, 0.3, 0], description: "Base element for water conveyance and associated civil structures." },
    { id: "wall", label: "Retaining Wall", position: [-length * 0.28, wallHeight * 0.65, -width / 2], description: "Side wall represented as a transparent structural plane." },
  ];
  return {
    envelope: [length, wallHeight, width],
    center: [0, wallHeight / 2, 0],
    floors: 1,
    modules: 6,
    grid: { x: 16, z: 1 },
    levels,
    columns,
    slabs,
    beams,
    boxes,
    dimensions,
    hotspots,
  };
}

export const MIROR_STRUCTURE_PRESETS: StructurePreset[] = [
  { id: "tower", title: "STRUCTURAL TOWER", subtitle: "Grid / Core / Floor Plate", category: "Building", tags: ["RCC", "Grid", "Envelope"], ...generateTower(14, 2.6, 12, 9, 6, 4) },
  { id: "bridge", title: "BRIDGE SYSTEM", subtitle: "Deck / Pier / Span", category: "Infrastructure", tags: ["Civil", "Deck", "Pier"], ...generateBridge(38, 7.2, 5.8, 5) },
  { id: "canal", title: "CANAL STRUCTURE", subtitle: "Bed / Wall / Cross Members", category: "Water", tags: ["Irrigation", "CM & CD", "Civil"], ...generateCanalStructure(34, 5.6, 3.4) },
];

export const STRUCTURE_INDEX = Object.fromEntries(MIROR_STRUCTURE_PRESETS.map((item) => [item.id, item]));

export function getStructurePreset(id: string): StructurePreset {
  return STRUCTURE_INDEX[id] ?? MIROR_STRUCTURE_PRESETS[0];
}

export function getRecommendedStructure(projectCategory?: string): StructurePreset {
  const category = (projectCategory ?? "").toLowerCase();
  if (category.includes("water") || category.includes("irrigation") || category.includes("canal")) return getStructurePreset("canal");
  if (category.includes("bridge") || category.includes("infrastructure")) return getStructurePreset("bridge");
  return getStructurePreset("tower");
}

export function boundsOfStructure(preset: StructurePreset): { min: Coordinate; max: Coordinate } {
  const [width, height, depth] = preset.envelope;
  const [cx, cy, cz] = preset.center;
  return {
    min: [cx - width / 2, Math.max(0, cy - height / 2), cz - depth / 2],
    max: [cx + width / 2, cy + height / 2, cz + depth / 2],
  };
}

export function structureRadius(preset: StructurePreset): number {
  const bounds = boundsOfStructure(preset);
  return distance3(bounds.min, bounds.max) / 2;
}

export function projectCameraDistance(preset: StructurePreset, viewportWidth = 1440): number {
  const radius = structureRadius(preset);
  const widthFactor = viewportWidth < 768 ? 2.7 : viewportWidth < 1100 ? 2.25 : 1.95;
  return Math.max(12, radius * widthFactor);
}

export function createMeasurementLabel(dimension: DimensionSpec): string {
  return `${dimension.axis.toUpperCase()} ${dimension.label}`;
}

export function makeElevationLines(preset: StructurePreset, axis: Axis = "x"): LineSpec[] {
  const [width, height, depth] = preset.envelope;
  const lines: LineSpec[] = [];
  const front = axis === "x" ? -depth / 2 : -width / 2;
  for (const level of preset.levels) {
    if (axis === "x") lines.push(makeLine([-width / 2, level.elevation, front], [width / 2, level.elevation, front], "elevation", 0.38));
    if (axis === "z") lines.push(makeLine([front, level.elevation, -depth / 2], [front, level.elevation, depth / 2], "elevation", 0.38));
  }
  return lines;
}

export function makeSectionGuide(preset: StructurePreset, heightRatio = 0.48): LineSpec[] {
  const [width, height, depth] = preset.envelope;
  const y = height * clamp(heightRatio, 0.05, 0.95);
  return [
    makeLine([-width / 2 - 0.8, y, -depth / 2], [width / 2 + 0.8, y, -depth / 2], "section-cut", 0.8, 2),
    makeLine([-width / 2, y, -depth / 2 - 0.6], [-width / 2, y, depth / 2 + 0.6], "section-cut", 0.8, 2),
  ];
}

export function pulseValue(timeSeconds: number, frequency = 1): number {
  return 0.5 + 0.5 * Math.sin(timeSeconds * Math.PI * 2 * frequency);
}

export function easedPulse(timeSeconds: number, frequency = 0.5): number {
  const t = pulseValue(timeSeconds, frequency);
  return t * t * (3 - 2 * t);
}

export function opacityForLayer(layer: string, base = 0.8): number {
  const map: Record<string, number> = {
    grid: 0.24,
    level: 0.48,
    facade: 0.54,
    glass: 0.18,
    core: 0.24,
    wall: 0.18,
    guard: 0.32,
    section: 0.84,
    accent: 0.92,
  };
  return clamp(base * (map[layer] ?? 0.64), 0.02, 0.98);
}

export function semanticLineColor(semantic: string): string {
  if (semantic.includes("section")) return CAD_PALETTE.accent;
  if (semantic.includes("grid")) return CAD_PALETTE.lineMuted;
  if (semantic.includes("level")) return CAD_PALETTE.line;
  if (semantic.includes("elevation")) return CAD_PALETTE.glass;
  return CAD_PALETTE.white;
}

export function mergeLineSets(...sets: LineSpec[][]): LineSpec[] {
  return sets.flat();
}

export function transformLines(lines: LineSpec[], transform: (point: Coordinate) => Coordinate): LineSpec[] {
  return lines.map((line) => ({ ...line, start: transform(line.start), end: transform(line.end) }));
}

export function translatePreset(preset: StructurePreset, delta: Coordinate): StructurePreset {
  return {
    ...preset,
    center: add3(preset.center, delta),
    columns: preset.columns.map((column) => ({ ...column, position: add3(column.position, delta) })),
    beams: preset.beams.map((beam) => ({ ...beam, start: add3(beam.start, delta), end: add3(beam.end, delta) })),
    boxes: preset.boxes.map((box) => ({ ...box, position: add3(box.position, delta) })),
    hotspots: preset.hotspots.map((hotspot) => ({ ...hotspot, position: add3(hotspot.position, delta) })),
  };
}

export function scalePreset(preset: StructurePreset, scale: Coordinate): StructurePreset {
  const scalePoint = (point: Coordinate): Coordinate => [point[0] * scale[0], point[1] * scale[1], point[2] * scale[2]];
  return {
    ...preset,
    envelope: scalePoint(preset.envelope),
    center: scalePoint(preset.center),
    columns: preset.columns.map((column) => ({ ...column, position: scalePoint(column.position), height: column.height * scale[1], width: column.width * scale[0], depth: column.depth * scale[2] })),
    beams: preset.beams.map((beam) => ({ ...beam, start: scalePoint(beam.start), end: scalePoint(beam.end), thickness: beam.thickness * Math.min(...scale) })),
    slabs: preset.slabs.map((slab) => ({ ...slab, level: slab.level * scale[1], width: slab.width * scale[0], depth: slab.depth * scale[2], thickness: slab.thickness * scale[1], inset: (slab.inset ?? 0) * Math.min(scale[0], scale[2]) })),
    boxes: preset.boxes.map((box) => ({ ...box, position: scalePoint(box.position), size: scalePoint(box.size) })),
    dimensions: preset.dimensions.map((dimension) => ({ ...dimension, from: dimension.from * (dimension.axis === "x" ? scale[0] : dimension.axis === "y" ? scale[1] : scale[2]), to: dimension.to * (dimension.axis === "x" ? scale[0] : dimension.axis === "y" ? scale[1] : scale[2]), level: dimension.level * (dimension.axis === "y" ? scale[1] : 1), offset: dimension.offset * (dimension.axis === "x" ? scale[0] : scale[2]) })),
    hotspots: preset.hotspots.map((hotspot) => ({ ...hotspot, position: scalePoint(hotspot.position) })),
  };
}

export function makePlanGrid(size = 48, step = 2, y = -0.03): LineSpec[] {
  return generateGridLines(size, size, step, step, y);
}

export function makeMicroGrid(size = 8, step = 0.5, y = -0.02): LineSpec[] {
  return generateGridLines(size, size, step, step, y).map((line) => ({ ...line, opacity: 0.12, weight: 0.5 }));
}

export function generateAxisGuides(size = 20): LineSpec[] {
  return [
    makeLine([-size, 0, 0], [size, 0, 0], "axis-x", 0.28, 1),
    makeLine([0, 0, -size], [0, 0, size], "axis-z", 0.28, 1),
    makeLine([0, 0, 0], [0, size / 2, 0], "axis-y", 0.42, 1),
  ];
}

export function makeDatumTicks(size = 20, step = 2): LineSpec[] {
  const result: LineSpec[] = [];
  for (let value = -size; value <= size; value += step) {
    result.push(makeLine([value, 0, -0.12], [value, 0, 0.12], "datum", 0.35));
    result.push(makeLine([-0.12, 0, value], [0.12, 0, value], "datum", 0.35));
  }
  return result;
}

export const ENGINEERING_CALLOUTS = [
  "GRID A-01",
  "GRID A-02",
  "GRID B-01",
  "GRID B-02",
  "SECTION A-A",
  "SECTION B-B",
  "LEVEL +00.000",
  "LEVEL +03.500",
  "LEVEL +07.000",
  "LEVEL +10.500",
  "DETAIL 01",
  "DETAIL 02",
  "NODE 14",
  "NODE 22",
  "CORE 01",
  "STRUCTURE 01",
  "ENVELOPE 02",
  "SERVICES 04",
] as const;

export function selectCallout(index: number): string {
  return ENGINEERING_CALLOUTS[Math.abs(index) % ENGINEERING_CALLOUTS.length];
}

export function buildStatusFrame(preset: StructurePreset, progress: number) {
  const bounded = clamp(progress, 0, 1);
  return {
    id: preset.id,
    progress: bounded,
    activeLevel: Math.round(bounded * Math.max(0, preset.levels.length - 1)),
    pulse: easedPulse(bounded * 4),
    dimensions: preset.dimensions.map((dimension) => ({ ...dimension, intensity: bounded })),
    hotspotOpacity: 0.35 + bounded * 0.65,
  };
}

export function getLayerAvailability(preset: StructurePreset) {
  return {
    structure: preset.columns.length + preset.beams.length > 0,
    envelope: preset.boxes.length > 0,
    slabs: preset.slabs.length > 0,
    dimensions: preset.dimensions.length > 0,
    hotspots: preset.hotspots.length > 0,
  };
}

export function toDebugSummary(preset: StructurePreset): string[] {
  return [
    `ID: ${preset.id}`,
    `CATEGORY: ${preset.category}`,
    `ENVELOPE: ${preset.envelope.join(" × ")}`,
    `FLOORS: ${preset.floors}`,
    `MODULES: ${preset.modules}`,
    `COLUMNS: ${preset.columns.length}`,
    `BEAMS: ${preset.beams.length}`,
    `SLABS: ${preset.slabs.length}`,
    `BOXES: ${preset.boxes.length}`,
    `LEVELS: ${preset.levels.length}`,
    `DIMENSIONS: ${preset.dimensions.length}`,
    `HOTSPOTS: ${preset.hotspots.length}`,
  ];
}

/*
 * Geometry policy notes intentionally live beside the data definitions so a
 * future engineer can change visual density without rewriting the component.
 *
 * Rule 01: the 3D scene is a communication layer, not the source of truth.
 * Rule 02: client-approved GLB assets can replace procedural presets.
 * Rule 03: dimensions shown in decorative scenes must be labelled as visual
 * references unless they are sourced from the actual project drawing.
 * Rule 04: do not show a client's DWG-derived geometry without publication
 * permission.
 * Rule 05: mobile rendering should reduce detail before reducing usability.
 * Rule 06: the hero should remain useful when JavaScript/WebGL fails.
 * Rule 07: reduced-motion should preserve orientation and information.
 * Rule 08: no camera movement should prevent reading the associated headline.
 * Rule 09: line density should be capped by viewport and device capability.
 * Rule 10: procedural structure names are internal visual identifiers.
 */

export const CAD_A11Y_COPY = {
  label: "Interactive architectural structure visualization",
  fallback: "Technical line drawing of a construction structure",
  instruction: "Use the structure selector to change the visual model and layer controls to reveal structural information.",
  reducedMotion: "Motion has been reduced according to your accessibility settings.",
} as const;

export function shouldRenderInteractiveWebGL(input: {
  webgl: boolean;
  reducedMotion: boolean;
  saveData: boolean;
  connection?: string;
}): boolean {
  if (!input.webgl) return false;
  if (input.saveData) return false;
  if (input.connection === "slow-2g" || input.connection === "2g") return false;
  return true;
}

export function getRenderBudget(viewportWidth: number, hardwareConcurrency = 4): {
  maxLines: number;
  maxBoxes: number;
  dpr: number;
  autoRotate: boolean;
} {
  if (viewportWidth < 520) return { maxLines: 420, maxBoxes: 90, dpr: 1, autoRotate: false };
  if (viewportWidth < 900) return { maxLines: 760, maxBoxes: 160, dpr: 1.1, autoRotate: hardwareConcurrency >= 6 };
  return { maxLines: hardwareConcurrency >= 8 ? 1800 : 1250, maxBoxes: hardwareConcurrency >= 8 ? 340 : 220, dpr: hardwareConcurrency >= 8 ? 1.5 : 1.3, autoRotate: true };
}

export function limitArray<T>(items: T[], limit: number): T[] {
  if (items.length <= limit) return items;
  return items.slice(0, Math.max(0, limit));
}

export function trimPresetForBudget(preset: StructurePreset, budget: ReturnType<typeof getRenderBudget>): StructurePreset {
  const linesEstimate = preset.columns.length * 4 + preset.beams.length * 3 + preset.boxes.length * 12;
  if (linesEstimate <= budget.maxLines) return preset;
  return {
    ...preset,
    columns: limitArray(preset.columns, Math.floor(budget.maxLines / 8)),
    beams: limitArray(preset.beams, Math.floor(budget.maxLines / 8)),
    boxes: limitArray(preset.boxes, budget.maxBoxes),
    hotspots: limitArray(preset.hotspots, DEFAULT_CAD_OPTIONS.maxActiveHotspots),
  };
}

export function structureDescription(preset: StructurePreset): string {
  return `${preset.title} — ${preset.subtitle}. ${preset.category} visualization with ${preset.floors} floor level${preset.floors === 1 ? "" : "s"}, ${preset.columns.length} primary columns and ${preset.hotspots.length} annotated hotspots.`;
}

export function buildProjectVisualMetadata(project: { title: string; category?: string; location?: string }) {
  const preset = getRecommendedStructure(project.category);
  return {
    structureId: preset.id,
    label: `${project.title} architectural study`,
    category: project.category ?? preset.category,
    location: project.location ?? "",
    accessibilityLabel: structureDescription(preset),
  };
}

export function safeProjectVisualMetadata(project: { title?: string; category?: string; location?: string } | null | undefined) {
  if (!project?.title) return buildProjectVisualMetadata({ title: "Miror construction project", category: "Building" });
  return buildProjectVisualMetadata(project);
}

export function isValidCoordinate(point: unknown): point is Coordinate {
  return Array.isArray(point) && point.length === 3 && point.every((value) => typeof value === "number" && Number.isFinite(value));
}

export function sanitizeCoordinate(point: Coordinate): Coordinate {
  return [roundTo(point[0], 4), roundTo(point[1], 4), roundTo(point[2], 4)];
}

export function sanitizePreset(preset: StructurePreset): StructurePreset {
  return {
    ...preset,
    center: sanitizeCoordinate(preset.center),
    envelope: sanitizeCoordinate(preset.envelope),
    columns: preset.columns.map((column) => ({ ...column, position: sanitizeCoordinate(column.position) })),
    beams: preset.beams.map((beam) => ({ ...beam, start: sanitizeCoordinate(beam.start), end: sanitizeCoordinate(beam.end) })),
    boxes: preset.boxes.map((box) => ({ ...box, position: sanitizeCoordinate(box.position), size: sanitizeCoordinate(box.size) })),
    hotspots: preset.hotspots.map((hotspot) => ({ ...hotspot, position: sanitizeCoordinate(hotspot.position) })),
  };
}

export const CAD_VERSION = "7.0.0";
export const CAD_SCHEMA = "miror-cad-v7";

export const CAD_NOTES = [
  "Procedural visual only unless a project model is explicitly attached.",
  "Dimension values in presets are illustrative and must not be presented as project measurements.",
  "Actual project data can supply a matching modelId and approved asset URL.",
  "WebGL is progressive enhancement over a functional editorial layout.",
  "The visual language intentionally references technical drawing conventions.",
] as const;

export function getCadSchemaInfo() {
  return { version: CAD_VERSION, schema: CAD_SCHEMA, notes: [...CAD_NOTES] };
}
