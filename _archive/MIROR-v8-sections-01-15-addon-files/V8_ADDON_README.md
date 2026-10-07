# MIROR V8 — Sections 01–15 Add-on

This package is the implementation layer for the first 15 selected website sections. It is additive to earlier MIROR V3/V5/V6/V7 work.

## Design direction
The sections synthesize current public patterns from leading construction/engineering websites: project-first storytelling and sector grouping, searchable project discovery, legacy + HSE + technology presentation, innovation/VDC references, and restrained editorial interfaces. No proprietary code, branding, or assets are copied.

## Sections implemented
01 Hero
02 Engineering HUD
03 Company Statement
04 Legacy / Timeline
05 Capabilities
06 Capability Matrix
07 Execution Process
08 Engineering Showcase
09 Selected Works
10 Project Directory
11 Project Case-study Entry
12 Construction Progress Story
13 Built From the Ground Up
14 Quality & Safety
15 Engineering Technology

## Content status
Only two project records are represented from current public evidence; the remaining sixteen records are placeholders for the client dataset. Replace placeholders with approved names, locations, scopes, images, drawings and permissions.

## CAD / BIM
Use approved AutoCAD, Revit, Civil 3D or BIM exports as browser-safe GLB/SVG/PNG derivatives. Do not expose raw DWG/DXF files in the public application.

## Integration
Import the shared CSS once, then compose the individual section components inside the V5/V6 homepage shell. Project data is already separated from presentation.

## Responsive behavior
Desktop: full visual language and optional full 3D. Tablet: simplified visual layers. Mobile: poster/SVG fallback and compressed interactions.
