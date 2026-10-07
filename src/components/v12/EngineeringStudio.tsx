"use client";

import { useMemo, useState } from "react";

const modes = {
  plan: { label: "PLAN", detail: "Grid and structural rhythm", note: "Coordination view for axes, bays and primary geometry." },
  elevation: { label: "ELEVATION", detail: "Vertical frame", note: "Vertical alignment, levels, supports and facade rhythm." },
  section: { label: "SECTION", detail: "Cut-through study", note: "Depth relationships between slab, beam, column and datum." },
  isometric: { label: "ISOMETRIC", detail: "Spatial construction view", note: "A web-native spatial study prepared for future approved BIM assets." },
  detail: { label: "DETAIL", detail: "Connection logic", note: "A close technical view for interfaces and execution detail." },
} as const;

type Mode = keyof typeof modes;

const geometry: Record<Mode, string[]> = {
  plan: ["M120 140H700","M120 270H700","M120 400H700","M120 530H700","M170 90V610","M300 90V610","M430 90V610","M560 90V610","M690 90V610"],
  elevation: ["M120 590H700","M150 490H670","M180 390H640","M210 290H610","M240 190H580","M210 590V190","M380 590V190","M550 590V190","M210 290L300 190L390 290L480 190L570 290"],
  section: ["M140 600H660","M180 510H620","M220 420H580","M260 330H540","M300 240H500","M310 600V240","M490 600V240","M300 420L380 330L460 420L540 330"],
  isometric: ["M160 560L380 420L600 560L380 700Z","M160 560V300L380 160L600 300V560","M380 420V160","M160 300L380 440L600 300","M220 338V520","M320 276V458","M440 276V458","M540 338V520"],
  detail: ["M190 560H610","M220 480H580","M250 400H550","M300 320H500","M340 240H460","M300 320L360 240L420 320L480 240L540 320","M320 560V240","M480 560V240","M260 430H540"],
};

function axes(mode: Mode){return Array.from({length:8},(_,i)=>({x:135+i*80,label:String.fromCharCode(65+i),id:`${mode}-${i}`}));}

export function EngineeringStudio({ compact = false }: { compact?: boolean }) {
  const [mode, setMode] = useState<Mode>("isometric");
  const current = modes[mode];
  const ticks = useMemo(() => axes(mode), [mode]);

  return <section className={`v12-engineering ${compact ? "v12-engineering--compact" : ""}`} aria-labelledby="v12-engineering-title">
    <div className="v12-engineering__top">
      <div><span className="v12-kicker v12-kicker-light">Engineering Studio</span><h2 id="v12-engineering-title" className="v12-display">Technical communication before technical assets.</h2></div>
      <div className="v12-engineering__status"><span>VECTOR</span><span>RESPONSIVE</span><span>REDUCED-MOTION READY</span></div>
    </div>
    <div className="v12-engineering__body">
      <div className="v12-engineering__stage" aria-live="polite">
        <svg className="v12-engineering__svg" viewBox="0 0 820 760" role="img" aria-label={`Miror ${current.label.toLowerCase()} engineering visual`}>
          <rect x="34" y="34" width="752" height="692"/>
          {ticks.map((tick)=><g key={tick.id}><line className="axis" x1={tick.x} y1="70" x2={tick.x} y2="690"/><text x={tick.x-4} y="58">{tick.label}</text></g>)}
          {geometry[mode].map((d,i)=><path key={`${mode}-${i}`} d={d}/>)}
          <line className="axis" x1="100" y1="640" x2="720" y2="640"/><text x="105" y="630">DATUM / +00.00</text>
          <text x="102" y="105">DRAWING / {current.label}</text>
          <text x="570" y="105">REV 01 / WEB STUDY</text>
        </svg>
        <div className="v12-engineering__footer"><span>{current.detail}</span><span>CONCEPTUAL WEB VISUAL</span><span>MODE / {current.label}</span></div>
      </div>
      <aside className="v12-engineering__panel">
        <span className="v12-kicker">View mode</span>
        <div className="v12-engineering__tabs" role="tablist" aria-label="Engineering modes">
          {(Object.entries(modes) as [Mode, (typeof modes)[Mode]][]).map(([id,item])=><button key={id} type="button" role="tab" aria-selected={mode===id} className={`v12-engineering__tab ${mode===id ? "is-active" : ""}`} onClick={()=>setMode(id)}><strong>{item.label}</strong><small>{item.detail}</small></button>)}
        </div>
        <div className="v12-engineering__note"><strong>{current.label}</strong><br/>{current.note}</div>
      </aside>
    </div>
  </section>;
}
