import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { EngineeringStudio } from "@/components/v12/EngineeringStudio";
import { ProjectMedia } from "@/components/v12/ProjectMedia";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();

  return (
    <main className="v12-shell v12-page">
      <section className="v12-page-hero">
        <div className="v12-container v12-page-hero__grid">
          <div><span className="v12-kicker">Project / {project.status === "verified-public" ? "Public evidence" : "Pending"}</span></div>
          <div><h1 className="v12-display">{project.title}</h1><p>{project.summary}</p></div>
        </div>
      </section>
      <section className="v12-section">
        <div className="v12-container">
          <div className="v12-case">
            <div><span className="v12-kicker">Project record</span></div>
            <div className="v12-case__main">
              <div className="v12-case__facts">
                <div className="v12-case__fact"><dt>Category</dt><dd>{project.category}</dd></div>
                <div className="v12-case__fact"><dt>Location</dt><dd>{project.location ?? "Update soon"}</dd></div>
                <div className="v12-case__fact"><dt>Miror role</dt><dd>{project.role ?? "Update soon"}</dd></div>
                <div className="v12-case__fact"><dt>Scope</dt><dd>{project.scope?.join(" · ") ?? "Update soon"}</dd></div>
              </div>
              <ProjectMedia slug={project.slug} />
              <div style={{ marginTop: "2.5rem" }}>
                <h2 className="v12-display" style={{ fontSize: "clamp(2.5rem,4vw,4.5rem)" }}>Evidence first, detail second.</h2>
                <p className="v12-body">This public record describes the documented relationship and avoids unsupported project-wide claims. Approved media and additional execution detail can be added through the same evidence-controlled system.</p>
              </div>
              <div style={{ marginTop: "2rem", display: "flex", gap: ".6rem", flexWrap: "wrap" }}>
                <Link className="v12-button v12-button--solid" href="/contact">Discuss this project ↗</Link>
                <Link className="v12-button" href="/work">Back to work ↗</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <EngineeringStudio compact />
    </main>
  );
}
