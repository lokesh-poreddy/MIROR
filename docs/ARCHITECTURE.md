# MIROR — engineering architecture

## Runtime
Next.js App Router + React + TypeScript is the application runtime. As of the 2026 research pass, Next.js 16.x is the current generation and React 19.3 is current; Tailwind CSS 4.3 and Motion 14 are used by the scaffold. The exact resolved versions should be frozen by the package lock during setup.

## Why not three backends?
The site is a corporate platform, not a polyglot distributed system. Next.js server routes cover public forms and content delivery. PostgreSQL is the persistence layer. Python is used as a deterministic content QA/import helper. Java is kept as an optional future integration boundary.

## Content architecture
Projects are first-class entities. UI components consume structured project data instead of embedding copy into visual components. The first two project records are public-evidence seeds; the client's additional projects remain pending.

## Route architecture
/
/about
/capabilities
/work
/work/[slug]
/careers
/quality-safety
/contact

The navigation overlay can later expand to include /industries, /insights, /partners and /legal when approved.

## Motion architecture
Use Motion for reveal and microinteraction primitives. Upgrade to GSAP only for a specific pinned/sequence-heavy story that earns the complexity. Every animation must have a reduced-motion path.

## Data model
Production entities: projects, project_media, enquiries, careers, site_settings, company_profile, approved_clients, documents.

## Security baseline
Server-side validation; rate limiting on public endpoints; origin-aware CSRF posture where applicable; no secrets in client bundles; authenticated admin for content mutation; media served from object storage/CDN rather than Git.

## Performance baseline
Use responsive `next/image`, AVIF/WebP, poster frames for video, lazy loading below the fold, restrained JavaScript, and avoid global WebGL/canvas. Keep the hero visual high quality but bounded in transfer size.
