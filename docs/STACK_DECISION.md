# Stack decision

## Chosen
- Next.js + React + TypeScript: web runtime, routing, server rendering, API routes, SEO.
- Tailwind CSS: layout and design tokens.
- Motion: accessible component and interaction animation.
- PostgreSQL: project/content/enquiry persistence.
- Python: deterministic content QA/import utility.
- Object storage/CDN: project photography and video.

## Deliberately not core
Java is not a required runtime for the public corporate website. Keep the optional Java module only for future enterprise integrations where a JVM service has a real requirement.

## Deployment direction
Vercel or equivalent Node-compatible hosting for Next.js, managed PostgreSQL, object storage/CDN and transactional email provider.
