import Link from "next/link";
import { projects } from "@/data/projects";
import { ProjectMedia } from "@/components/v12/ProjectMedia";

export function ProjectCaseStudies({ compact = false }: { compact?: boolean }) {
  return (
    <section
      className={"v12-section " + (compact ? "v12-section--compact" : "")}
      aria-labelledby="v12-projects-title"
    >
      <div className="v12-container">
        <div className="v12-section__head">
          <div>
            <span className="v12-kicker">Projects / evidence</span>
          </div>
          <div className="v12-section__head-copy">
            <h2 id="v12-projects-title">
              A portfolio should explain the work, not merely display it.
            </h2>
            <p>
              Public project records remain evidence-led. Approved construction
              photography, video and drawings can enter through the same media registry.
            </p>
          </div>
        </div>

        <div className="v12-projects__grid">
          {projects.map((project) => (
            <article className="v12-project" key={project.slug}>
              <ProjectMedia slug={project.slug} compact />
              <div className="v12-project__body">
                <div className="v12-project__meta">
                  <span>{project.category}</span>
                  <span className="v12-badge">Public evidence</span>
                </div>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                <dl>
                  <div>
                    <dt>Location</dt>
                    <dd>{project.location ?? "Update soon"}</dd>
                  </div>
                  <div>
                    <dt>Miror role</dt>
                    <dd>{project.role ?? "Update soon"}</dd>
                  </div>
                  <div>
                    <dt>Scope</dt>
                    <dd>{project.scope?.join(" · ") ?? "Update soon"}</dd>
                  </div>
                  <div>
                    <dt>Publication</dt>
                    <dd>Evidence-led record</dd>
                  </div>
                </dl>
                <div className="v12-project__actions">
                  <Link className="v12-button v12-button--solid" href={`/work/${project.slug}`}>
                    Open case study ↗
                  </Link>
                  <span className="v12-kicker">Documented relationship</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="v12-pending">
          Additional project records remain reserved for confirmed data, approved media,
          scope descriptions and publication permission.
        </div>
      </div>
    </section>
  );
}
