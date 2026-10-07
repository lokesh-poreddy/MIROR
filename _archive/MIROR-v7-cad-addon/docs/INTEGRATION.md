# V7 Integration Guide

## Install

Add the dependencies from `package.fragment.json` to the existing application.

## Import CSS

In the app-level stylesheet or layout:

```tsx
import "@/styles/miror-cad-stage.css";
```

## Use the showcase

```tsx
import MirorCadShowcase from "@/components/cad/MirorCadShowcase";

<MirorCadShowcase
  projectSlug="hnss-kuppam-branch-canal-phase-ii"
  projectTitle="HNSS Kuppam Branch Canal — Phase II"
  projectCategory="Irrigation & Infrastructure"
  projectLocation="Andhra Pradesh"
/>
```

## Real project models

When the client supplies AutoCAD/BIM files, convert DWG/DXF/BIM exports to a simplified `.glb` for browser delivery. Remove non-public layers and unnecessary hidden geometry, reduce triangle count, compress with Meshopt or Draco, create a poster image, register the asset, and require publication approval before using it.

Keep original CAD files out of the public repository.

## Design rationale

The component architecture translates patterns observed on major construction/infrastructure websites into Miror's own system. Afcons uses sector-based project discovery and project-first storytelling. Bechtel combines project search with market/region/status filters and rich project narratives. Shapoorji combines business segments with HSE, technology, legacy and project search. Tata Projects uses lifecycle capabilities, project proof, technology and safety storytelling.

The Miror system combines these ideas with a CAD/BIM-inspired visual layer, but the visual geometry, copy, component code and branding are original.

## Recommended placement

Homepage hero: tower study.
About / legacy: low-opacity bridge structure.
Capabilities: canal/water blueprint.
Our Work: project-specific model slots.
Case study: approved GLB + plan/elevation.
Footer: only a tiny blueprint motif.

## Production guardrails

- Treat procedural dimensions as conceptual.
- Do not imply an illustrative model is an approved construction drawing.
- Preserve a text fallback for every visual.
- Respect reduced motion and save-data.
- Pause WebGL when offscreen.
- Keep one active WebGL canvas per visual stage.
- Use real project photos around the 3D visual to ground the experience.
- Obtain client permission for all project models, drawings and logos.
