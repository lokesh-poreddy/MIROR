# Integration snippets

## Layout

Add this line to `src/app/layout.tsx`:

```tsx
import "@/styles/miror-addon.css";
```

## Global experience header

Wrap the page with:

```tsx
import { ExperienceHeader } from "@/components/advanced/ExperienceHeader";
```

and render `<ExperienceHeader />` near the root of the page.

## Project archive

```tsx
import { ProjectFilter } from "@/components/advanced/ProjectFilter";
<ProjectFilter projects={projects} />
```

## Horizontal featured work

```tsx
import { ProjectRail } from "@/components/advanced/ProjectRail";
<ProjectRail projects={projects.filter((project) => project.featured)} />
```
