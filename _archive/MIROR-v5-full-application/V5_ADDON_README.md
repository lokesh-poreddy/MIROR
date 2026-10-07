# MIROR V5 — Full Application Add-on

This bundle is the next application composition layer after the V3 interaction infrastructure. It replaces the minimal root page with a complete homepage composition and adds scalable project-directory and dynamic project routes.

## Merge order
1. Existing MIROR foundation.
2. MIROR V2 add-on.
3. MIROR V3 add-on.
4. This V5 add-on.

## Important
The V5 files intentionally assume the V3 files already exist at `src/components/experience/MirorCommandCenter.tsx`, `src/components/projects/MirorProjectStoryEngine.tsx`, `src/hooks/useMirorExperienceV3.ts`, and `src/lib/miror-design-system.ts`.

## Pages
- `/` — complete premium homepage
- `/work` — searchable/filterable project directory
- `/work/[slug]` — dynamic project story route

## Current content
Only the two public project records discovered during research are included. The remaining 16 project slots are reserved but not published.

## Launch requirements
- Replace placeholders with approved project photography/video.
- Confirm all project roles, clients, dates and source documents.
- Wire enquiry API to email/CRM persistence.
- Confirm privacy/terms content.
- Run `npm run typecheck` and `npm run build` using the final merged dependency set.
