import { getRecommendedStructure, type StructurePreset } from "@/lib/miror-cad-geometry";

export type ModelSource = "procedural" | "client-approved-glb" | "external-reference";
export type ModelRecord = {
  id: string;
  projectSlug?: string;
  title: string;
  source: ModelSource;
  url?: string;
  posterUrl?: string;
  revision: string;
  status: "draft" | "review" | "approved" | "published";
  rights: "unknown" | "pending" | "approved";
  sensitive: boolean;
  fallbackStructureId: string;
  tags: string[];
};

const proceduralModel = (id: string, title: string, structure: string, tags: string[]): ModelRecord => ({
  id,
  title,
  source: "procedural",
  revision: "7.0.0",
  status: "published",
  rights: "approved",
  sensitive: false,
  fallbackStructureId: structure,
  tags,
});

export const MIROR_MODEL_REGISTRY: ModelRecord[] = [
  proceduralModel("miror-structure-tower", "Structural Tower Study", "tower", ["rcc", "building", "grid"]),
  proceduralModel("miror-structure-bridge", "Bridge System Study", "bridge", ["bridge", "infrastructure", "pier"]),
  proceduralModel("miror-structure-canal", "Canal Structure Study", "canal", ["water", "irrigation", "cm-cd"]),
  {
    id: "hnss-kuppam-project",
    projectSlug: "hnss-kuppam-branch-canal-phase-ii",
    title: "HNSS Kuppam Branch Canal — visual model slot",
    source: "procedural",
    revision: "pending-client-model",
    status: "draft",
    rights: "pending",
    sensitive: true,
    fallbackStructureId: "canal",
    tags: ["hnss", "kuppam", "canal", "infrastructure"],
  },
  {
    id: "revasa-la-valora-project",
    projectSlug: "revasa-la-valora",
    title: "Revasa Là Valora — structural visual model slot",
    source: "procedural",
    revision: "pending-client-model",
    status: "draft",
    rights: "pending",
    sensitive: false,
    fallbackStructureId: "tower",
    tags: ["residential", "rcc", "formwork"],
  },
];

const byId = new Map(MIROR_MODEL_REGISTRY.map((model) => [model.id, model]));
const bySlug = new Map(MIROR_MODEL_REGISTRY.filter((model) => model.projectSlug).map((model) => [model.projectSlug as string, model]));

export function getModelById(id: string): ModelRecord | null { return byId.get(id) ?? null; }
export function getModelForProject(slug: string): ModelRecord | null { return bySlug.get(slug) ?? null; }
export function getFallbackPreset(model: ModelRecord | null): StructurePreset { return getRecommendedStructure(model?.fallbackStructureId ?? "Building"); }
export function canPublishModel(model: ModelRecord): boolean { return model.status === "published" && model.rights === "approved" && !model.sensitive; }
export function canUseOnProjectPage(model: ModelRecord): boolean { return model.status === "published" && model.rights === "approved"; }
export function registryForClient(projectSlug: string): { model: ModelRecord | null; fallback: StructurePreset } { const model = getModelForProject(projectSlug); return { model, fallback: getFallbackPreset(model) }; }

export function attachApprovedAsset(model: ModelRecord, asset: { url: string; posterUrl?: string; revision: string; sensitive?: boolean; }): ModelRecord {
  return { ...model, source: "client-approved-glb", url: asset.url, posterUrl: asset.posterUrl, revision: asset.revision, status: "published", rights: "approved", sensitive: Boolean(asset.sensitive) };
}

export function setModelReview(model: ModelRecord): ModelRecord { return { ...model, status: "review" }; }
export function markModelRightsPending(model: ModelRecord): ModelRecord { return { ...model, rights: "pending", status: "review" }; }
export function hideModel(model: ModelRecord): ModelRecord { return { ...model, status: "draft" }; }

export function modelPublicationMessage(model: ModelRecord): string {
  if (model.rights !== "approved") return "Publication blocked: visual rights have not been approved.";
  if (model.sensitive) return "Publication blocked: model is marked sensitive.";
  if (model.status !== "published") return `Publication blocked: model status is ${model.status}.`;
  return "Model is eligible for publication.";
}

export function isApprovedProjectModel(model: ModelRecord | null, projectSlug: string): boolean {
  return Boolean(model && model.projectSlug === projectSlug && canUseOnProjectPage(model));
}

export function modelDisplayName(model: ModelRecord | null): string { return model?.title ?? "Miror digital structure study"; }
export function modelRevision(model: ModelRecord | null): string { return model?.revision ?? "procedural"; }
export function modelTags(model: ModelRecord | null): string[] { return model?.tags ?? ["engineering", "construction", "structure"]; }

export function serializeRegistry(models: ModelRecord[] = MIROR_MODEL_REGISTRY): string {
  return JSON.stringify(models, null, 2);
}

export function validateRegistry(models: ModelRecord[]): { ok: boolean; errors: string[] } {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const model of models) {
    if (!model.id.trim()) errors.push("Model id cannot be empty.");
    if (ids.has(model.id)) errors.push(`Duplicate model id: ${model.id}`);
    ids.add(model.id);
    if (model.source === "client-approved-glb" && !model.url) errors.push(`Approved GLB model ${model.id} has no URL.`);
    if (model.status === "published" && model.rights !== "approved") errors.push(`Published model ${model.id} does not have approved rights.`);
  }
  return { ok: errors.length === 0, errors };
}

export const CAD_MODEL_REGISTRY_VERSION = "7.0.0";
