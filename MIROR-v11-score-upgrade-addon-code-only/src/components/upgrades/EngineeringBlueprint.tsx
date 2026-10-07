"use client";

import { useMemo, useState } from "react";
import { engineeringModes, type EngineeringMode } from "@/data/miror-upgrade";

const blueprints: Record<EngineeringMode, { lines: string[]; labels: Array<{ x: number; y: number; text: string }> }> = {
  plan: {
    lines: [
      "M 120 120 H 680",
      "M 120 240 H 680",
      "M 120 360 H 680",
      "M 120 480 H 680",
      "M 120 600 H 680",
      "M 160 80 V 640",
      "M 300 80 V 640",
      "M 440 80 V 640",
      "M 580 80 V 640",
      "M 680 80 V 640",
    ],
    labels: [
      { x: 132, y: 104, text: "GRID A" },
      { x: 312, y: 224, text: "GRID B" },
      { x: 452, y: 344, text: "GRID C" },
      { x: 592, y: 464, text: "GRID D" },
    ],
  },
  elevation: {
    lines: [
      "M 110 620 H 710",
      "M 130 520 H 690",
      "M 150 420 H 670",
      "M 170 320 H 650",
      "M 190 220 H 630",
      "M 210 120 H 610",
      "M 150 420 L 250 320 L 350 420 L 450 320 L 550 420 L 650 320",
      "M 180 520 L 260 420 L 340 520 L 420 420 L 500 520 L 580 420 L 660 520",
      "M 250 620 V 120",
      "M 450 620 V 120",
    ],
    labels: [
      { x: 216, y: 108, text: "RL +12.00" },
      { x: 216, y: 208, text: "RL +09.00" },
      { x: 216, y: 308, text: "RL +06.00" },
      { x: 216, y: 408, text: "RL +03.00" },
      { x: 216, y: 608, text: "DATUM 00" },
    ],
  },
  section: {
    lines: [
      "M 150 600 H 650",
      "M 180 520 H 620",
      "M 220 430 H 580",
      "M 260 340 H 540",
      "M 300 250 H 500",
      "M 340 160 H 460",
      "M 260 340 L 340 250 L 420 340 L 500 250 L 580 340",
      "M 300 430 L 380 340 L 460 430 L 540 340",
      "M 340 600 V 160",
      "M 460 600 V 160",
    ],
    labels: [
      { x: 170, y: 585, text: "CUT / A-A" },
      { x: 522, y: 230, text: "SLAB" },
      { x: 522, y: 320, text: "BEAM" },
      { x: 522, y: 410, text: "COLUMN" },
    ],
  },
  "3d": {
    lines: [
      "M 110 590 L 290 470 L 470 590 L 290 710 Z",
      "M 110 590 V 340 L 290 220 L 470 340 V 590",
      "M 290 470 V 220",
      "M 290 470 L 470 590",
      "M 290 470 L 110 590",
      "M 110 340 L 290 460 L 470 340",
      "M 140 320 L 290 220 L 440 320",
      "M 165 340 V 570",
      "M 245 286 V 520",
      "M 335 286 V 520",
      "M 415 340 V 570",
    ],
    labels: [
      { x: 292, y: 196, text: "3D FRAME" },
      { x: 478, y: 344, text: "AXIS X" },
      { x: 82, y: 338, text: "AXIS Y" },
      { x: 296, y: 718, text: "DATUM" },
    ],
  },
};

function axisTicks(mode: EngineeringMode) {
  return Array.from({ length: 9 }, (_, index) => ({
    id: `${mode}-${index}`,
    x: 112 + index * 72,
    label: `${String.fromCharCode(65 + index)}`,
  }));
}

export function EngineeringBlueprint({ compact = false }: { compact?: boolean }) {
  const [mode, setMode] = useState<EngineeringMode>("3d");
  const blueprint = blueprints[mode];
  const ticks = useMemo(() => axisTicks(mode), [mode]);

  return (
    <section className={`miror-upgrade-engineering ${compact ? "is-compact" : ""}`} aria-labelledby="engineering-visual-title">
      <div className="miror-upgrade-engineering__topline">
        <div>
          <span className="miror-upgrade-kicker">Engineering visual system</span>
          <h2 id="engineering-visual-title">PLAN / ELEVATION / SECTION / 3D</h2>
        </div>
        <div className="miror-upgrade-engineering__status" aria-label="Engineering visual status">
          <span>WEB-NATIVE</span>
          <span>VECTOR</span>
          <span>NO STOCK 3D</span>
        </div>
      </div>

      <div className="miror-upgrade-engineering__body">
        <div className="miror-upgrade-engineering__viewport" aria-live="polite">
          <svg viewBox="0 0 800 760" role="img" aria-labelledby="engineering-svg-title engineering-svg-desc">
            <title id="engineering-svg-title">Miror engineering blueprint — {mode}</title>
            <desc id="engineering-svg-desc">
              A procedural technical drawing with construction-style axes, frame lines and mode-specific annotations.
            </desc>
            <defs>
              <pattern id="miror-fine-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="currentColor" strokeOpacity="0.07" strokeWidth="1" />
              </pattern>
              <pattern id="miror-major-grid" width="96" height="96" patternUnits="userSpaceOnUse">
                <path d="M 96 0 L 0 0 0 96" fill="none" stroke="currentColor" strokeOpacity="0.11" strokeWidth="1" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="800" height="760" className="miror-blueprint-grid" />
            <rect x="0" y="0" width="800" height="760" className="miror-blueprint-major-grid" />
            <g className="miror-blueprint-frame">
              <rect x="52" y="48" width="696" height="664" fill="none" />
              <path d="M 76 88 H 724" />
              <path d="M 76 672 H 724" />
              <path d="M 76 88 V 672" />
              <path d="M 724 88 V 672" />
            </g>
            <g className="miror-blueprint-axes" aria-hidden="true">
              {ticks.map((tick) => <g key={tick.id}><line x1={tick.x} y1="88" x2={tick.x} y2="672" /><text x={tick.x} y="78">{tick.label}</text></g>)}
            </g>
            <g className="miror-blueprint-geometry">
              {blueprint.lines.map((d, index) => <path key={`${mode}-${index}`} d={d} />)}
            </g>
            <g className="miror-blueprint-callouts">
              {blueprint.labels.map((label) => <text key={`${label.x}-${label.y}-${label.text}`} x={label.x} y={label.y}>{label.text}</text>)}
            </g>
            <g className="miror-blueprint-dimensions" aria-hidden="true">
              <line x1="110" y1="706" x2="680" y2="706" />
              <line x1="110" y1="698" x2="110" y2="714" />
              <line x1="680" y1="698" x2="680" y2="714" />
              <text x="395" y="724">5700 / FIELD FRAME</text>
              <line x1="94" y1="120" x2="94" y2="640" />
              <line x1="86" y1="120" x2="102" y2="120" />
              <line x1="86" y1="640" x2="102" y2="640" />
              <text x="82" y="382" transform="rotate(-90 82 382)">5200 / DATUM</text>
            </g>
          </svg>
          <div className="miror-upgrade-engineering__cursor" aria-hidden="true" />
          <div className="miror-upgrade-engineering__viewport-footer">
            <span>DRAWING / {mode.toUpperCase()}</span>
            <span>REV 01</span>
            <span>CONCEPTUAL WEB VISUAL</span>
          </div>
        </div>

        <aside className="miror-upgrade-engineering__controls">
          <span className="miror-upgrade-kicker">View mode</span>
          <div className="miror-upgrade-engineering__mode-list" role="tablist" aria-label="Engineering drawing mode">
            {engineeringModes.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={mode === item.id}
                className={mode === item.id ? "is-active" : ""}
                onClick={() => setMode(item.id)}
              >
                <span>{item.label}</span>
                <small>{item.description}</small>
              </button>
            ))}
          </div>
          <div className="miror-upgrade-engineering__legend">
            <div><span className="legend-line" /><span>Primary geometry</span></div>
            <div><span className="legend-axis" /><span>Reference axis</span></div>
            <div><span className="legend-grid" /><span>Technical grid</span></div>
          </div>
          <div className="miror-upgrade-engineering__note">
            <strong>Why this belongs here</strong>
            <p>
              Corporate engineering sites use visuals to explain capability, not merely fill space. This system creates a consistent technical language now and provides a clean mounting point for approved CAD, BIM, Civil 3D or Revit exports later.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
