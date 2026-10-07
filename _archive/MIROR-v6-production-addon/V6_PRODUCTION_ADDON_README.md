# MIROR V6 Production Add-on

This package is an additive full-stack application layer for the MIROR corporate website.

## Design direction
The implementation synthesizes project-first construction-site storytelling, capability grouping, searchable portfolios, careers pathways, and restrained editorial motion. It is inspired by patterns common to leading construction/infrastructure and premium corporate websites; it does not copy proprietary branding or layouts.

## Layers
- `src/lib/v6/miror-v6-contracts.ts` — shared type, evidence, motion, security and content contracts.
- `src/lib/v6/miror-v6-server.ts` — server-side repository, cache, validation, lead and career orchestration.
- `src/lib/v6/miror-v6-seo.ts` — metadata, JSON-LD, analytics and performance helpers.
- `src/components/v6/MirorV6Navigation.tsx` — premium sticky header + full-screen menu + command-search behavior.
- `src/components/v6/MirorV6Homepage.tsx` — composed homepage.
- `src/components/v6/MirorV6ProjectPortfolio.tsx` — filterable/searchable project archive.
- `src/components/v6/MirorV6CaseStudy.tsx` — project case-study detail experience and lightbox.
- `src/app/v6/api/route.ts` — combined API surface for project queries, enquiries, careers and health.
- `src/styles/miror-v6-production.css` — responsive visual system and accessibility states.
- `db/miror-v6-production.sql` — PostgreSQL schema, publication view, indexes and operational migration markers.
- `tools/python/miror_v6_content_audit.py` — project-sheet QA and claim-risk audit.
- `services/java/MirorIntegrationGateway.java` — optional enterprise/ERP integration boundary.

## Important integration note
The V6 layer is intentionally not a second independent website. Merge it after the V5 application foundation and map aliases/import paths to the existing project. The package contains placeholder media and only publicly supported project evidence. The client's additional projects must be inserted after approval.

## Publication safety
A project is intended to reach the public archive only after publication permission, media rights clearance, verified evidence, verified Miror role and non-empty scope are all present.

## Recommended merge order
1. Copy contracts/server/SEO modules.
2. Copy components and CSS.
3. Add the API route under the project's chosen application route.
4. Apply SQL via Prisma/Drizzle/migration tooling rather than manually editing production.
5. Add the Python audit to content CI.
6. Wire the Java boundary only when an actual enterprise data source exists.
7. Replace placeholder media and content with client-approved records.

## No fabricated claims
Do not publish inferred project value, client logos, awards, certifications, employee counts, revenue, fleet counts, government-client claims, or full-project ownership claims unless the client supplies documentary evidence and publication permission.
