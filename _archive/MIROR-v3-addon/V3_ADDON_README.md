# MIROR V3 — Large-code add-on layer

This package is an additive engineering layer for the MIROR corporate website foundation.

## Modules

- `src/lib/miror-design-system.ts` — centralized design, motion, accessibility, navigation, content and publication contracts.
- `src/hooks/useMirorExperienceV3.ts` — viewport, scroll, pointer, menu, command, keyboard, focus and reduced-motion runtime state.
- `src/components/experience/MirorCommandCenter.tsx` — premium header, full-screen navigation, command search, footer and pointer field.
- `src/components/projects/MirorProjectStoryEngine.tsx` — project case-study renderer, gallery, lightbox, media, timeline, related work and evidence state.
- `src/lib/services/miror-runtime.ts` — server-safe project filtering, caching, rate limiting, enquiry validation, publication workflow and related-project ranking.
- `src/lib/services/media-performance-engine.ts` — image/video policy, responsive variants, CDN transforms, upload restrictions, media QA and caching guidance.

## Integration

Copy the `src` files into the existing MIROR application while preserving the alias `@/* -> src/*`.

These files deliberately expect the foundation's Next.js/TypeScript runtime and should be integrated before adding large media assets.

The generated presets near the end of the large modules are deterministic configuration contracts. They are intended to keep interaction tuning data-driven rather than spreading magic numbers across the UI.

## Safety

Project content must carry evidence status and publication permission. Do not promote unverified client names, project values, certifications, awards, turnover, safety claims or ownership claims.

## Performance

Do not enable WebGL/3D by default. Keep hero video muted, poster-first and optional. Use responsive image transforms and lazy load non-critical galleries.
