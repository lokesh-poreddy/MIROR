"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { getModelById, getModelForProject, modelDisplayName, modelPublicationMessage, modelRevision, modelTags } from "@/lib/miror-cad-model-registry";
import { getStructurePreset, MIROR_STRUCTURE_PRESETS, type HotspotSpec } from "@/lib/miror-cad-geometry";
import "@/styles/miror-cad-stage.css";

const MirorArchitecturalViewport = dynamic(() => import("@/components/cad/MirorArchitecturalViewport"), { ssr: false, loading: () => <div className="miror-cad-showcase-loading"><span>INITIALIZING STRUCTURAL VIEW</span></div> });
const MirorBlueprintOverlay = dynamic(() => import("@/components/cad/MirorBlueprintOverlay"), { ssr: false });

export type MirorCadShowcaseProps = {
  projectSlug?: string;
  projectTitle?: string;
  projectCategory?: string;
  projectLocation?: string;
  showModelSelector?: boolean;
  showBlueprint?: boolean;
  className?: string;
};

export default function MirorCadShowcase({ projectSlug, projectTitle = "Miror Construction", projectCategory = "Construction", projectLocation = "India", showModelSelector = true, showBlueprint = true, className = "" }: MirorCadShowcaseProps) {
  const projectModel = projectSlug ? getModelForProject(projectSlug) : null;
  const [selectedModelId, setSelectedModelId] = useState(projectModel?.id ?? "miror-structure-tower");
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotSpec | null>(null);
  const selectedModel = getModelById(selectedModelId);
  const presetId = selectedModel?.fallbackStructureId ?? "tower";
  const preset = useMemo(() => getStructurePreset(presetId), [presetId]);
  const cards = useMemo(() => MIROR_STRUCTURE_PRESETS.map((item) => ({ id: `miror-structure-${item.id}`, name: item.title, category: item.category })), []);

  return (
    <section className={`miror-cad-showcase ${className}`} aria-labelledby="miror-cad-showcase-title">
      <div className="miror-cad-showcase-header">
        <div>
          <span className="miror-cad-showcase-eyebrow">CAD / BIM VISUAL LAYER</span>
          <h2 id="miror-cad-showcase-title">A structural view of the work.</h2>
          <p>{projectTitle} · {projectCategory} · {projectLocation}</p>
        </div>
        <div className="miror-cad-showcase-proof"><span>{modelDisplayName(selectedModel)}</span><small>REV / {modelRevision(selectedModel)}</small><small>{modelPublicationMessage(selectedModel)}</small></div>
      </div>

      {showModelSelector && <div className="miror-cad-showcase-selector" role="tablist" aria-label="Structure model selector">
        {cards.map((card) => <button key={card.id} type="button" role="tab" aria-selected={selectedModelId === card.id} className={selectedModelId === card.id ? "is-active" : ""} onClick={() => setSelectedModelId(card.id)}><span>{card.name}</span><small>{card.category}</small></button>)}
      </div>}

      <div className="miror-cad-showcase-grid">
        <div className="miror-cad-showcase-primary"><MirorArchitecturalViewport structureId={preset.id} title={`${projectTitle} structural visualization`} onHotspotSelect={setSelectedHotspot} /></div>
        {showBlueprint && <aside className="miror-cad-showcase-secondary"><MirorBlueprintOverlay preset={preset} compact onHotspotSelect={setSelectedHotspot} /><div className="miror-cad-showcase-tags">{modelTags(selectedModel).map((tag) => <span key={tag}>{tag}</span>)}</div></aside>}
      </div>

      {selectedHotspot && <div className="miror-cad-showcase-hotspot"><span>STRUCTURE NOTE</span><strong>{selectedHotspot.label}</strong><p>{selectedHotspot.description}</p><button type="button" onClick={() => setSelectedHotspot(null)}>Dismiss</button></div>}
    </section>
  );
}

export const MIROR_CAD_SHOWCASE_VERSION = "7.0.0";
