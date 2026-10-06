import Link from "next/link";
import type { Project } from "@/data/projects";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project-card">
      <Link href={`/work/${project.slug}`} className="project-card-media">
        <img src={project.media ?? "/placeholder.svg"} alt="" loading="lazy" />
        <span className="project-card-arrow">↗</span>
      </Link>
      <div className="project-card-meta">
        <div>
          <span className="eyebrow">{project.category}</span>
          <h3>{project.title}</h3>
        </div>
        {project.location ? <span className="project-location">{project.location}</span> : null}
      </div>
    </article>
  );
}
