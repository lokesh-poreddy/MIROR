export type ProjectMediaAsset =
  | { type: "image"; src: string; alt: string; credit?: string; license?: string; approved: true }
  | { type: "video"; src: string; poster?: string; title: string; credit?: string; license?: string; approved: true };

const registry: Record<string, ProjectMediaAsset[]> = {
  "hnss-kuppam-branch-canal-phase-ii": [
    { type: "image", src: "/media/projects/project-01.png", alt: "HNSS Kuppam Branch Canal", approved: true }
  ],
  "revasa-la-valora": [
    { type: "image", src: "/media/projects/project-02.png", alt: "Revasa Là Valora", approved: true }
  ],
};

export function getApprovedProjectMedia(slug: string) {
  return (registry[slug] ?? []).filter((asset) => asset.approved);
}

export const projectMediaPublishRule =
  "Only client-approved, licensed or company-owned project media may be published.";
