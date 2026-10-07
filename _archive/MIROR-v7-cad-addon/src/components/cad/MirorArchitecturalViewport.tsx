"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Line, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import {
  CAD_A11Y_COPY,
  CAD_PALETTE,
  DEFAULT_CAD_OPTIONS,
  getRenderBudget,
  getStructurePreset,
  makeElevationLines,
  makePlanGrid,
  makeMicroGrid,
  makeSectionGuide,
  opacityForLayer,
  projectCameraDistance,
  semanticLineColor,
  trimPresetForBudget,
  type BeamSpec,
  type BoxSpec,
  type ColumnSpec,
  type Coordinate,
  type DimensionSpec,
  type HotspotSpec,
  type LineSpec,
  type SlabSpec,
  type StructurePreset,
} from "@/lib/miror-cad-geometry";

export type CadLayerState = {
  structure: boolean;
  envelope: boolean;
  slabs: boolean;
  grid: boolean;
  dimensions: boolean;
  hotspots: boolean;
  labels: boolean;
};

export type CadViewportProps = {
  structureId?: string;
  title?: string;
  className?: string;
  interactive?: boolean;
  autoRotate?: boolean;
  showControls?: boolean;
  showHud?: boolean;
  showBlueprint?: boolean;
  reducedMotion?: boolean;
  onHotspotSelect?: (hotspot: HotspotSpec) => void;
  onStructureChange?: (preset: StructurePreset) => void;
};

const DEFAULT_LAYERS: CadLayerState = {
  structure: true,
  envelope: true,
  slabs: true,
  grid: true,
  dimensions: true,
  hotspots: true,
  labels: true,
};

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);
  return matches;
}

function useVisibility(ref: React.RefObject<Element | null>): boolean {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    if (!ref.current || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "160px 0px 160px 0px", threshold: 0.01 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  return visible;
}

function useFinePointer(): boolean {
  return useMediaQuery("(pointer: fine)");
}

function useCanHover(): boolean {
  return useMediaQuery("(hover: hover)");
}

function useConnectionSaveData(): boolean {
  const [saveData, setSaveData] = useState(false);
  useEffect(() => {
    if (typeof navigator === "undefined") return;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    setSaveData(Boolean(connection?.saveData));
  }, []);
  return saveData;
}

function vec3(point: Coordinate): THREE.Vector3 {
  return new THREE.Vector3(point[0], point[1], point[2]);
}

function columnColor(material: ColumnSpec["material"]): string {
  if (material === "accent") return CAD_PALETTE.accent;
  if (material === "concrete") return CAD_PALETTE.line;
  if (material === "glass") return CAD_PALETTE.glass;
  return CAD_PALETTE.white;
}

function beamColor(material: BeamSpec["material"]): string {
  if (material === "accent") return CAD_PALETTE.accent;
  if (material === "concrete") return CAD_PALETTE.line;
  return CAD_PALETTE.white;
}

function ColumnMesh({ spec, active }: { spec: ColumnSpec; active: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const pulse = 1 + (active ? Math.sin(clock.elapsedTime * 2 + spec.position[0]) * 0.012 : 0);
    ref.current.scale.set(pulse, 1, pulse);
  });
  return (
    <mesh ref={ref} position={spec.position}>
      <boxGeometry args={[spec.width, spec.height, spec.depth]} />
      <meshBasicMaterial color={columnColor(spec.material)} transparent opacity={active ? 0.68 : 0.26} wireframe />
    </mesh>
  );
}

function BeamMesh({ spec, active }: { spec: BeamSpec; active: boolean }) {
  const midpoint = new THREE.Vector3(
    (spec.start[0] + spec.end[0]) / 2,
    (spec.start[1] + spec.end[1]) / 2,
    (spec.start[2] + spec.end[2]) / 2,
  );
  const start = vec3(spec.start);
  const end = vec3(spec.end);
  const direction = end.clone().sub(start);
  const length = direction.length();
  const quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), direction.normalize());
  return (
    <mesh position={midpoint} quaternion={quaternion}>
      <boxGeometry args={[length, spec.thickness, spec.thickness]} />
      <meshBasicMaterial color={beamColor(spec.material)} transparent opacity={active ? 0.64 : 0.2} wireframe />
    </mesh>
  );
}

function SlabMesh({ spec, active }: { spec: SlabSpec; active: boolean }) {
  return (
    <mesh position={[0, spec.level, 0]}>
      <boxGeometry args={[spec.width - (spec.inset ?? 0) * 2, spec.thickness, spec.depth - (spec.inset ?? 0) * 2]} />
      <meshBasicMaterial color={CAD_PALETTE.glass} transparent opacity={active ? spec.opacity ?? 0.1 : 0.02} wireframe />
    </mesh>
  );
}

function BoxWire({ spec, active }: { spec: BoxSpec; active: boolean }) {
  const [x, y, z] = spec.size;
  return (
    <mesh position={spec.position} rotation={spec.rotation as THREE.EulerTuple | undefined}>
      <boxGeometry args={[x, y, z]} />
      <meshBasicMaterial color={spec.accent ? CAD_PALETTE.accent : CAD_PALETTE.glass} transparent opacity={active ? spec.opacity ?? 0.1 : 0.01} wireframe />
    </mesh>
  );
}

function EngineeringLine({ spec, visible = true }: { spec: LineSpec; visible?: boolean }) {
  if (!visible) return null;
  return (
    <Line
      points={[spec.start, spec.end]}
      color={semanticLineColor(spec.semantic ?? "detail")}
      transparent
      opacity={spec.opacity ?? 0.6}
      lineWidth={spec.weight ?? 1}
    />
  );
}

function StructuralModel({
  preset,
  layers,
  reducedMotion,
  selectedHotspot,
  onHotspotSelect,
}: {
  preset: StructurePreset;
  layers: CadLayerState;
  reducedMotion: boolean;
  selectedHotspot: string | null;
  onHotspotSelect?: (hotspot: HotspotSpec) => void;
}) {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!group.current) return;
    const targetRotation = reducedMotion ? 0 : Math.sin(clock.elapsedTime * 0.14) * 0.035;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetRotation, 4, 1 / 60);
    const targetX = reducedMotion ? 0 : Math.sin(clock.elapsedTime * 0.08) * 0.02;
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetX, 4, 1 / 60);
  });

  return (
    <group ref={group}>
      {layers.structure && preset.columns.map((spec, index) => <ColumnMesh key={`column-${index}`} spec={spec} active />)}
      {layers.structure && preset.beams.map((spec, index) => <BeamMesh key={`beam-${index}`} spec={spec} active />)}
      {layers.slabs && preset.slabs.map((spec, index) => <SlabMesh key={`slab-${index}`} spec={spec} active />)}
      {layers.envelope && preset.boxes.map((spec, index) => <BoxWire key={`box-${index}`} spec={spec} active />)}
      {layers.grid && makeElevationLines(preset).map((spec, index) => <EngineeringLine key={`elev-${index}`} spec={spec} />)}
      {layers.structure && makeSectionGuide(preset).map((spec, index) => <EngineeringLine key={`section-${index}`} spec={spec} />)}
      {layers.hotspots && preset.hotspots.map((hotspot) => (
        <Hotspot
          key={hotspot.id}
          hotspot={hotspot}
          selected={hotspot.id === selectedHotspot}
          reducedMotion={reducedMotion}
          onSelect={onHotspotSelect}
          showLabel={layers.labels}
        />
      ))}
    </group>
  );
}

function Hotspot({
  hotspot,
  selected,
  reducedMotion,
  onSelect,
  showLabel,
}: {
  hotspot: HotspotSpec;
  selected: boolean;
  reducedMotion: boolean;
  onSelect?: (hotspot: HotspotSpec) => void;
  showLabel: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const phase = clock.elapsedTime * (selected ? 2.8 : 1.6);
    const pulse = reducedMotion ? 1 : 1 + Math.sin(phase) * (selected ? 0.11 : 0.06);
    ref.current.scale.setScalar(pulse);
  });
  return (
    <group position={hotspot.position}>
      <mesh ref={ref} onClick={(event) => { event.stopPropagation(); onSelect?.(hotspot); }}>
        <sphereGeometry args={[selected ? 0.12 : 0.075, 12, 12]} />
        <meshBasicMaterial color={hotspot.color ?? CAD_PALETTE.accent} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} onClick={(event) => { event.stopPropagation(); onSelect?.(hotspot); }}>
        <ringGeometry args={[0.16, 0.19, 24]} />
        <meshBasicMaterial color={hotspot.color ?? CAD_PALETTE.accent} transparent opacity={selected ? 0.76 : 0.32} side={THREE.DoubleSide} />
      </mesh>
      {showLabel && <Html distanceFactor={12} center>
        <button
          type="button"
          className={`miror-cad-hotspot-label${selected ? " is-selected" : ""}`}
          onClick={() => onSelect?.(hotspot)}
          aria-label={`Inspect ${hotspot.label}`}
        >
          <span className="miror-cad-hotspot-dot" />
          <span>{hotspot.label}</span>
        </button>
      </Html>}
    </group>
  );
}

function BlueprintGround({ preset, opacity = 0.38 }: { preset: StructurePreset; opacity?: number }) {
  const grid = useMemo(() => makePlanGrid(Math.max(preset.envelope[0], preset.envelope[2]) * 2.5, 2, -0.08), [preset]);
  const micro = useMemo(() => makeMicroGrid(Math.max(preset.envelope[0], preset.envelope[2]) * 0.9, 0.5, -0.06), [preset]);
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.12, 0]}>
        <planeGeometry args={[Math.max(preset.envelope[0], preset.envelope[2]) * 3, Math.max(preset.envelope[0], preset.envelope[2]) * 3]} />
        <meshBasicMaterial color={CAD_PALETTE.background} transparent opacity={0.7} />
      </mesh>
      {grid.map((line, index) => <EngineeringLine key={`grid-${index}`} spec={{ ...line, opacity: (line.opacity ?? 0.25) * opacity }} />)}
      {micro.map((line, index) => <EngineeringLine key={`micro-${index}`} spec={{ ...line, opacity: (line.opacity ?? 0.12) * opacity }} />)}
    </group>
  );
}

function DimensionLine({ dimension, preset }: { dimension: DimensionSpec; preset: StructurePreset }) {
  const [width, height, depth] = preset.envelope;
  const lineY = dimension.axis === "y" ? dimension.from : dimension.level;
  if (dimension.axis === "x") {
    const z = -depth / 2 - Math.abs(dimension.offset) * 0.22;
    return <EngineeringLine spec={{ start: [dimension.from, lineY, z], end: [dimension.to, lineY, z], opacity: 0.65, weight: 1, semantic: "dimension" }} />;
  }
  if (dimension.axis === "z") {
    const x = width / 2 + Math.abs(dimension.offset) * 0.22;
    return <EngineeringLine spec={{ start: [x, lineY, dimension.from], end: [x, lineY, dimension.to], opacity: 0.65, weight: 1, semantic: "dimension" }} />;
  }
  return <EngineeringLine spec={{ start: [width / 2 + 0.7, dimension.from, depth / 2 + 0.7], end: [width / 2 + 0.7, dimension.to, depth / 2 + 0.7], opacity: 0.65, weight: 1, semantic: "dimension" }} />;
}

function DimensionLabels({ preset }: { preset: StructurePreset }) {
  return (
    <group>
      {preset.dimensions.map((dimension, index) => {
        const [width, height, depth] = preset.envelope;
        const position: Coordinate = dimension.axis === "x"
          ? [0, dimension.level + 0.05, -depth / 2 - 1.2]
          : dimension.axis === "z"
            ? [width / 2 + 1.2, dimension.level + 0.05, 0]
            : [width / 2 + 1.0, height / 2, depth / 2 + 1.0];
        return (
          <Html key={`dim-label-${index}`} position={position} center distanceFactor={10}>
            <span className="miror-cad-dimension-label">{dimension.label}</span>
          </Html>
        );
      })}
    </group>
  );
}

function CadScene({
  preset,
  layers,
  reducedMotion,
  interactive,
  autoRotate,
  finePointer,
  selectedHotspot,
  onHotspotSelect,
}: {
  preset: StructurePreset;
  layers: CadLayerState;
  reducedMotion: boolean;
  interactive: boolean;
  autoRotate: boolean;
  finePointer: boolean;
  selectedHotspot: string | null;
  onHotspotSelect?: (hotspot: HotspotSpec) => void;
}) {
  const { gl } = useThree();
  useEffect(() => {
    gl.setClearColor(CAD_PALETTE.background, 0);
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.08;
  }, [gl]);

  return (
    <>
      <PerspectiveCamera makeDefault position={[projectCameraDistance(preset), preset.envelope[1] * 0.55, projectCameraDistance(preset)]} fov={36} near={0.1} far={400} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 20, 12]} intensity={1.1} />
      {layers.grid && <BlueprintGround preset={preset} />}
      <StructuralModel preset={preset} layers={layers} reducedMotion={reducedMotion} selectedHotspot={selectedHotspot} onHotspotSelect={onHotspotSelect} />
      {layers.dimensions && preset.dimensions.map((dimension, index) => <DimensionLine key={`dimension-${index}`} dimension={dimension} preset={preset} />)}
      {layers.dimensions && layers.labels && <DimensionLabels preset={preset} />}
      <OrbitControls
        enablePan={interactive && finePointer}
        enableZoom={interactive}
        enableRotate={interactive}
        autoRotate={autoRotate && !reducedMotion}
        autoRotateSpeed={0.35}
        minDistance={Math.max(7, projectCameraDistance(preset) * 0.55)}
        maxDistance={Math.max(18, projectCameraDistance(preset) * 2.3)}
        minPolarAngle={0.45}
        maxPolarAngle={Math.PI * 0.78}
        dampingFactor={0.06}
        enableDamping
      />
    </>
  );
}

function CadHud({
  preset,
  layers,
  setLayers,
  selectedHotspot,
  onHotspotSelect,
}: {
  preset: StructurePreset;
  layers: CadLayerState;
  setLayers: React.Dispatch<React.SetStateAction<CadLayerState>>;
  selectedHotspot: string | null;
  onHotspotSelect?: (hotspot: HotspotSpec) => void;
}) {
  const [open, setOpen] = useState(false);
  const toggle = (key: keyof CadLayerState) => setLayers((current) => ({ ...current, [key]: !current[key] }));
  return (
    <div className="miror-cad-hud">
      <div className="miror-cad-hud-top">
        <span className="miror-cad-eyebrow">MIROR / DIGITAL STRUCTURE STUDY</span>
        <span className="miror-cad-status"><i /> LIVE VISUAL</span>
      </div>
      <div className="miror-cad-hud-title">
        <strong>{preset.title}</strong>
        <span>{preset.subtitle}</span>
      </div>
      <div className="miror-cad-hud-bottom">
        <div className="miror-cad-model-data">
          <span>FLOORS <b>{String(preset.floors).padStart(2, "0")}</b></span>
          <span>MODULES <b>{String(preset.modules).padStart(2, "0")}</b></span>
          <span>GRID <b>{preset.grid.x}×{preset.grid.z}</b></span>
        </div>
        <button type="button" className="miror-cad-layer-trigger" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
          LAYERS <span>{open ? "−" : "+"}</span>
        </button>
      </div>
      {open && (
        <div className="miror-cad-layer-panel">
          {(Object.keys(layers) as Array<keyof CadLayerState>).map((key) => (
            <button type="button" className={layers[key] ? "is-active" : ""} key={key} onClick={() => toggle(key)}>
              <span>{key.replace(/([A-Z])/g, " $1").toUpperCase()}</span><i />
            </button>
          ))}
          <div className="miror-cad-hotspot-list">
            {preset.hotspots.slice(0, 4).map((hotspot) => (
              <button type="button" key={hotspot.id} onClick={() => onHotspotSelect?.(hotspot)} className={selectedHotspot === hotspot.id ? "is-selected" : ""}>
                <span>00{preset.hotspots.indexOf(hotspot) + 1}</span>
                {hotspot.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CadFallback({ preset }: { preset: StructurePreset }) {
  return (
    <div className="miror-cad-fallback" role="img" aria-label={CAD_A11Y_COPY.fallback}>
      <div className="miror-cad-fallback-grid" />
      <div className="miror-cad-fallback-structure" style={{ aspectRatio: `${Math.max(preset.envelope[0], 10)} / ${Math.max(preset.envelope[1], 8)}` }}>
        {Array.from({ length: Math.min(12, preset.floors + 1) }).map((_, index) => <span key={index} />)}
        <i /><i /><i />
      </div>
      <span className="miror-cad-fallback-note">3D VISUALIZATION UNAVAILABLE · TECHNICAL FALLBACK ACTIVE</span>
    </div>
  );
}

export default function MirorArchitecturalViewport({
  structureId = "tower",
  title = "Architectural visualization",
  className = "",
  interactive = DEFAULT_CAD_OPTIONS.interactive,
  autoRotate = DEFAULT_CAD_OPTIONS.autoRotate,
  showControls = true,
  showHud = true,
  reducedMotion = false,
  onHotspotSelect,
  onStructureChange,
}: CadViewportProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const visible = useVisibility(rootRef);
  const finePointer = useFinePointer();
  const canHover = useCanHover();
  const saveData = useConnectionSaveData();
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [layers, setLayers] = useState<CadLayerState>(DEFAULT_LAYERS);
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);
  const [activeStructureId, setActiveStructureId] = useState(structureId);
  const [webglAvailable, setWebglAvailable] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1440;
  const budget = useMemo(() => getRenderBudget(viewportWidth, typeof navigator !== "undefined" ? navigator.hardwareConcurrency || 4 : 4), [viewportWidth]);
  const rawPreset = getStructurePreset(activeStructureId);
  const preset = useMemo(() => trimPresetForBudget(rawPreset, budget), [rawPreset, budget]);
  const shouldReduce = reducedMotion || prefersReducedMotion;
  const renderInteractive = webglAvailable && visible && !saveData;

  useEffect(() => {
    setActiveStructureId(structureId);
  }, [structureId]);

  useEffect(() => {
    onStructureChange?.(preset);
  }, [onStructureChange, preset]);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    setWebglAvailable(Boolean(context));
  }, []);

  useEffect(() => {
    if (!visible) return;
    const timeout = window.setTimeout(() => setIsLoaded(true), 120);
    return () => window.clearTimeout(timeout);
  }, [visible]);

  const selectHotspot = useCallback((hotspot: HotspotSpec) => {
    setSelectedHotspot(hotspot.id);
    onHotspotSelect?.(hotspot);
  }, [onHotspotSelect]);

  const cycleStructure = useCallback(() => {
    const order = ["tower", "bridge", "canal"];
    const index = order.indexOf(activeStructureId);
    const next = order[(index + 1 + order.length) % order.length];
    setActiveStructureId(next);
    setSelectedHotspot(null);
  }, [activeStructureId]);

  return (
    <section
      ref={rootRef}
      className={`miror-cad-viewport ${className}`}
      aria-labelledby={`${activeStructureId}-cad-title`}
      data-ready={isLoaded ? "true" : "false"}
      data-pointer={canHover ? "hover" : "coarse"}
    >
      <span id={`${activeStructureId}-cad-title`} className="sr-only">{title}: {CAD_A11Y_COPY.label}</span>
      <div className="miror-cad-canvas-wrap">
        {renderInteractive ? (
          <Canvas
            dpr={[1, Math.min(finePointer ? budget.dpr : budget.mobileMaxDpr, DEFAULT_CAD_OPTIONS.maxDpr)]}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            camera={{ fov: 36, near: 0.1, far: 400 }}
            frameloop={visible ? "always" : "never"}
            fallback={<CadFallback preset={preset} />}
          >
            <CadScene
              preset={preset}
              layers={layers}
              reducedMotion={shouldReduce}
              interactive={interactive}
              autoRotate={autoRotate && visible}
              finePointer={finePointer}
              selectedHotspot={selectedHotspot}
              onHotspotSelect={selectHotspot}
            />
          </Canvas>
        ) : (
          <CadFallback preset={preset} />
        )}
      </div>

      <div className="miror-cad-vignette" aria-hidden="true" />
      <div className="miror-cad-scanline" aria-hidden="true" />
      <div className="miror-cad-crosshair crosshair-a" aria-hidden="true" />
      <div className="miror-cad-crosshair crosshair-b" aria-hidden="true" />

      {showHud && <CadHud preset={preset} layers={layers} setLayers={setLayers} selectedHotspot={selectedHotspot} onHotspotSelect={selectHotspot} />}

      {showControls && (
        <div className="miror-cad-actions" aria-label="Visualization controls">
          <button type="button" onClick={() => setLayers((current) => ({ ...current, grid: !current.grid }))} aria-pressed={layers.grid}>GRID</button>
          <button type="button" onClick={() => setLayers((current) => ({ ...current, dimensions: !current.dimensions }))} aria-pressed={layers.dimensions}>DIM</button>
          <button type="button" onClick={cycleStructure}>NEXT MODEL ↗</button>
        </div>
      )}

      <div className="miror-cad-accessibility-note">{shouldReduce ? CAD_A11Y_COPY.reducedMotion : CAD_A11Y_COPY.instruction}</div>
    </section>
  );
}

/*
 * Integration checklist
 * --------------------------------------------------------------------------
 * 01. Import this component dynamically from Next.js with ssr:false.
 * 02. Keep one Canvas instance per route viewport to avoid WebGL contention.
 * 03. Do not mount the viewport above the fold if the content is hidden behind
 *     an early cookie wall or consent overlay; mount it once the section is
 *     actually useful to the visitor.
 * 04. Replace procedural presets with approved GLB files only after the client
 *     signs off on publication rights.
 * 05. If a real GLB is used, preserve the same hotspot and layer contract.
 * 06. Keep the technical labels as metadata, not decorative fake measurements.
 * 07. Connect real project dimensions only when those numbers come from a
 *     source document approved for public publication.
 * 08. Use the project slug as the model registry key rather than hardcoding
 *     model URLs inside this visual component.
 * 09. For a 3D model, prefer DRACO or Meshopt compression where appropriate.
 * 10. Do not ship heavy 4K textures for a model that only occupies 40vw.
 * 11. Keep transparent materials sparse; excessive alpha overdraw can become
 *     expensive on mobile GPUs.
 * 12. Never make the 3D model the only carrier of key company information.
 * 13. Every technical scene should have a static semantic fallback.
 * 14. Use `prefers-reduced-motion` to disable camera choreography.
 * 15. Save-data connections should receive the SVG/CSS fallback.
 * 16. If the model is below the fold, IntersectionObserver can pause rendering.
 * 17. If the browser reports low memory, reduce DPR before removing controls.
 * 18. Pointer labels use HTML overlays so the text stays crisp and accessible.
 * 19. Keep hotspot labels short and use longer descriptions outside the canvas.
 * 20. Use keyboard-accessible external controls for critical navigation.
 * 21. Do not require orbit controls to understand the page's narrative.
 * 22. The component's default visual language is dark technical drawing on a
 *     quiet background so it can sit beside a premium editorial headline.
 * 23. Accent color is intentionally reserved for selected structural details.
 * 24. Large construction projects should use subtle scale cues, not fake
 *     floating hologram dashboards.
 * 25. If the website later accepts uploaded BIM models, validate MIME type,
 *     file size, rights, and geometry complexity server-side.
 * 26. Never trust an upload's filename extension as a safe content indicator.
 * 27. Sanitize public project metadata before sending it into an HTML overlay.
 * 28. Cache stable model metadata at the edge while keeping private admin data
 *     on the server.
 * 29. Avoid putting client contact information into the 3D model metadata.
 * 30. Real-world addresses should come from the project record, not from
 *     decorative geometry labels.
 */

export const MIROR_CAD_VIEWPORT_VERSION = "7.0.0";

export const MIROR_CAD_VIEWPORT_FEATURES = [
  "procedural-structural-models",
  "blueprint-grid",
  "dimension-overlays",
  "layer-controls",
  "interactive-hotspots",
  "reduced-motion",
  "save-data-fallback",
  "responsive-render-budget",
  "static-fallback",
  "dynamic-project-selection",
  "webgl-progressive-enhancement",
  "keyboard-safe-external-controls",
] as const;

export function cadViewportSupports(feature: string): boolean {
  return MIROR_CAD_VIEWPORT_FEATURES.includes(feature as (typeof MIROR_CAD_VIEWPORT_FEATURES)[number]);
}

export const CAD_VIEWPORT_COPY = {
  header: "DIGITAL STRUCTURE STUDY",
  live: "LIVE VISUAL",
  layers: "LAYERS",
  grid: "GRID",
  dimensions: "DIM",
  nextModel: "NEXT MODEL",
  unavailable: "3D VISUALIZATION UNAVAILABLE",
  fallback: "TECHNICAL FALLBACK ACTIVE",
} as const;
