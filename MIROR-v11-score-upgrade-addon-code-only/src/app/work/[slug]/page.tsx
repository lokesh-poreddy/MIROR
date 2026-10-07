import Link from "next/link";
import { notFound } from "next/navigation";
import { EngineeringBlueprint } from "@/components/upgrades/EngineeringBlueprint";
import { getEvidenceProject, evidenceProjects } from "@/data/miror-upgrade";

export function generateStaticParams() {
  return evidenceProjects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getEvidenceProject(slug);
  if (!project) notFound();

  return (
    <main className="miror-upgrade-home">
      <section className="miror-upgrade-statement" style={{ paddingTop: "15vh" }}>
        <div className="miror-upgrade-statement__index">PROJECT / {project.region === "Andhra Pradesh" ? "AP" : "TS"}</div>
        <div>
          <span className="miror-upgrade-kicker">{project.category}</span>
          <h1 style={{ fontSize: "clamp(48px,7vw,110px)", lineHeight: ".88", letterSpacing: "-.065em", fontWeight: 500, margin: "14px 0 0" }}>
            {project.title}
          </h1>
          <p style={{ maxWidth: 720, color: "#6f6b64", lineHeight: 1.7, marginTop: 25 }}>{project.summary}</p>
          <dl className="miror-evidence-card__facts" style={{ maxWidth: 760 }}>
            <div><dt>Location</dt><dd>{project.location}</dd></div>
            <div><dt>Miror role</dt><dd>{project.role}</dd></div>
            <div><dt>Scope</dt><dd>{project.scope.join(" · ")}</dd></div>
            <div><dt>Publication state</dt><dd>Public evidence; client media update pending</dd></div>
          </dl>
        </div>
      </section>

      <section className="miror-upgrade-statement" style={{ paddingTop: "4vh" }}>
        <div className="miror-upgrade-statement__index">TECHNICAL CONTEXT</div>
        <div><EngineeringBlueprint compact /></div>
      </section>

      <section className="miror-upgrade-cta">
        <div><span className="miror-upgrade-kicker">Next step</span><h2>Bring the approved project details into the record.</h2></div>
        <div><p>{project.evidenceNote}</p><div className="miror-upgrade-actions"><Link href="/contact" className="miror-upgrade-button miror-upgrade-button--paper">Send project enquiry <span aria-hidden="true">↗</span></Link><Link href="/work" className="miror-upgrade-button miror-upgrade-button--outline-light">Back to work</Link></div></div>
      </section>
    </main>
  );
}
