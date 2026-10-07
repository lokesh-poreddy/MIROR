# MIROR V2 — Premium Experience Add-on

This add-on is designed to sit on top of the MIROR foundation repository. It does not replace the existing architecture.

## Design intent

A serious, engineering-led construction site with a premium editorial/cinematic layer: strong typography, proof-of-work storytelling, full-screen navigation, restrained motion, and mobile-first progressive enhancement.

The implementation uses the existing `motion` package for scroll-linked/triggered motion and keeps heavy WebGL optional. Motion's current documentation describes `useScroll`, `useSpring`, and native/hardware-accelerated scroll-linked animation support. The optional package manifest also pins the current researched GSAP/Three/R3F versions at the time this add-on was authored.

## Add-on structure

- `src/components/advanced/*` reusable motion + navigation + project interaction components
- `SmartHeader`, `PointerSpotlight`, `RevealScale`, `PageTransition` for premium interaction polish
- `src/styles/miror-addon.css` premium design system layer
- `src/app/experience-lab/page.tsx` implementation showcase route
- `src/lib/seo-jsonld.ts` JSON-LD helpers
- `src/lib/content-safety.ts` publication guardrails
- `src/data/navigation.ts` information architecture
- `scripts/build-project-index.mjs` project content indexing utility
- `tools/python/audit_project_sheet.py` CSV/JSON project-data QA tool
- `services/java/src/main/java/.../ProjectRecord.java` optional enterprise DTO boundary
- `db/migrations/002_miror_experience_addon.sql` additive schema migration
- `.env.example` environment contract
- `package.addon.json` optional packages for advanced motion / WebGL

## Installation

1. Copy `src/components/advanced`, `src/styles/miror-addon.css`, `src/lib`, and `src/data/navigation.ts` into the base repository.
2. Add `import "@/styles/miror-addon.css";` to `src/app/layout.tsx` after `globals.css`.
3. Copy `src/app/experience-lab/page.tsx` to preview the system at `/experience-lab`.
4. The existing project model can be passed directly into `ProjectRail` and `ProjectFilter`.
5. Do not add the optional WebGL packages unless the final design genuinely needs a 3D scene.

## Current researched package references

- Motion: use the existing `motion` dependency.
- Optional GSAP: `3.15.0`.
- Optional Three.js: `0.186.1`.
- Optional React Three Fiber: `9.8.1`.

These versions were checked against current package registries while this add-on was prepared; re-run `npm view <package> version` before production lockfile changes.

## Interaction budget

Essential: header state, menu transitions, section reveals, image scale/parallax, project hover reveal, scroll progress, accessible horizontal project rail.

Premium: magnetic CTA, pointer spotlight on capable devices, animated blueprint SVG, number tickers, route transition, keyboard command menu.

Avoid: full-page WebGL as a default, perpetual cursor effects on touch, autoplay audio, multi-second loaders, animation that delays reading, excessive blur, or motion that ignores `prefers-reduced-motion`.
