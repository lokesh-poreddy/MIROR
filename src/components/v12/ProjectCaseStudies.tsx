import Link from "next/link";
import { projects } from "@/data/projects";

export function ProjectCaseStudies({ compact = false }: { compact?: boolean }) {
  return <section className={`v12-section ${compact ? "v12-section--compact" : ""}`} aria-labelledby="v12-projects-title">
    <div className="v12-container">
      <div className="v12-section__head">
        <div><span className="v12-kicker">Projects / evidence</span></div>
        <div className="v12-section__head-copy"><h2 id="v12-projects-title">A portfolio should explain the work, not merely display it.</h2><p>Miror’s current public project records are presented at the level supported by available evidence. Additional project stories can be added without changing the underlying structure.</p></div>
      </div>
      <div className="v12-projects__grid">
        {projects.map((project,index)=><article className="v12-project" key={project.slug}>
          <div className="v12-project__visual"><div className="v12-project__monogram">{index===0 ? "H" : "R"}</div><span className="v12-project__visual-label">PROJECT {String(index+1).padStart(2,"0")} / MEDIA UPDATE AFTER APPROVAL</span></div>
          <div className="v12-project__body">
            <div className="v12-project__meta"><span>{project.category}</span><span className="v12-badge">Public evidence</span></div>
            <h3>{project.title}</h3>
            <p>{project.summary}</p>
            <dl><div><dt>Location</dt><dd>{project.location ?? "Update soon"}</dd></div><div><dt>Miror role</dt><dd>{project.role ?? "Update soon"}</dd></div><div><dt>Scope</dt><dd>{project.scope?.join(" · ") ?? "Update soon"}</dd></div><div><dt>Publication</dt><dd>Evidence-led record</dd></div></dl>
            <div className="v12-project__actions"><Link className="v12-button v12-button--solid" href={`/work/${project.slug}`}>Open case study ↗</Link><span className="v12-kicker">Documented relationship</span></div>
          </div>
        </article>)}
      </div>
      <div className="v12-pending">Additional project records are reserved for confirmed project data, approved photography, scope descriptions and publication permission. This keeps the public portfolio expandable without turning placeholders into unsupported claims.</div>
    </div>
  </section>;
}
