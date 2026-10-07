# MIROR V2 add-on architecture

## Interaction layers

### Layer 1 — universal
- sticky global navigation
- active route state
- scroll progress
- intersection-based reveals
- accessible project rail
- project filtering
- keyboard/Escape full-screen menu
- reduced-motion fallback

### Layer 2 — premium
- magnetic desktop CTA
- kinetic marquee
- animated SVG engineering blueprint
- number ticker
- image parallax
- editorial text masks

### Layer 3 — optional
- GSAP ScrollTrigger for only the few sequences where Motion is insufficient
- Three/R3F for an actual spatial engineering visualization, not decorative 3D

The current site should remain functional if Layer 2/3 is disabled.

## Data flow

Client project sheet -> Python audit -> JSON/CSV staging -> project model -> database/CMS -> dynamic route -> SEO metadata -> project card/rail/case study.

No project should move from staging to public status solely because it exists in a local JSON file.
