# MIROR V7 — CAD / BIM Visual Layer

This add-on introduces an original procedural **CAD-inspired / BIM-style** 3D visual system for the Miror website.

## Design inspiration
The architecture borrows transferable patterns from major construction/infrastructure sites:
- Afcons: project-first storytelling and sector-based project discovery.
- Bechtel: project filters by market/region/status and project-led narrative.
- Shapoorji Pallonji: legacy, HSE, technology, business-segment and project-search sections.
- Tata Projects: lifecycle/service grouping, project-led credibility, technology and safety storytelling.

The visuals are original. This package does **not** copy logos, source assets, text, proprietary UI or website code.

## Core idea
Use a semi-transparent structural model as a visual layer—not a videogame-like 3D scene. The model occupies one side of hero/section layouts, while editorial text and proof-of-work content remain primary.

## Technical approach
- Procedural Three.js geometry for a lightweight fallback-friendly architectural structure.
- React Three Fiber + Drei for browser rendering.
- SVG blueprint overlays for deterministic linework, dimensions and labels.
- Dynamic import is recommended for the actual route to avoid SSR/WebGL issues.
- Model slots can later load client-approved `.glb/.gltf` exports of real CAD/BIM work.
- DWG/DXF should be converted server-side or offline to web-friendly GLB/SVG assets; do not attempt raw DWG parsing in the browser.

## Integration
Copy `src/` into the existing MIROR application, merge `styles/miror-cad-stage.css`, then install the dependencies from `package.fragment.json`.

Recommended production usage:
1. Home hero: semi-side procedural tower/bridge.
2. Capabilities: blueprint plan/elevation overlay.
3. Project case study: real GLB model when approved.
4. Work archive: small model thumbnails / wireframe badges.

## Performance rules
- Keep one active WebGL canvas per viewport.
- Limit DPR on mobile.
- Pause animation when offscreen.
- Reduce line density on mobile.
- Respect `prefers-reduced-motion`.
- Prefer static poster/SVG when WebGL is unavailable.
- Compress and cache all real project media.
