import Link from "next/link";
import {
  evidenceProjects,
  formatEvidenceLabel,
  pendingProjectSlots,
  type EvidenceProject,
} from "@/data/miror-upgrade";

function EvidenceBadge({ project }: { project: EvidenceProject }) {
  return (
    <span className={`miror-evidence-badge ${project.state === "verified-public" ? "is-verified" : "is-pending"}`}>
      <span className="miror-evidence-badge__dot" aria-hidden="true" />
      {formatEvidenceLabel(project.state)}
    </span>
  );
}

function ProjectMedia({ project }: { project: EvidenceProject }) {
  return (
    <div className="miror-evidence-card__media" aria-label={`${project.title} media region`}>
      <div className="miror-evidence-card__media-grid" aria-hidden="true" />
      <div className="miror-evidence-card__media-mark" aria-hidden="true">M</div>
      <div className="miror-evidence-card__media-copy">
        <span>MEDIA</span>
        <strong>Update when approved</strong>
      </div>
    </div>
  );
}

function EvidenceProjectCard({ project }: { project: EvidenceProject }) {
  return (
    <article className="miror-evidence-card">
      <ProjectMedia project={project} />
      <div className="miror-evidence-card__body">
        <div className="miror-evidence-card__meta">
          <span>{project.category}</span>
          <EvidenceBadge project={project} />
        </div>
        <h3>{project.title}</h3>
        <p>{project.summary}</p>
        <dl className="miror-evidence-card__facts">
          <div><dt>Location</dt><dd>{project.location}</dd></div>
          <div><dt>Miror role</dt><dd>{project.role}</dd></div>
          <div><dt>Scope</dt><dd>{project.scope.join(" · ")}</dd></div>
        </dl>
        <div className="miror-evidence-card__actions">
          <Link href={`/work/${project.slug}`} className="miror-upgrade-button miror-upgrade-button--dark">View project <span aria-hidden="true">↗</span></Link>
          <span className="miror-evidence-card__evidence">{project.evidenceNote}</span>
        </div>
      </div>
    </article>
  );
}

export function ProjectEvidenceBoard({ compact = false }: { compact?: boolean }) {
  return (
    <section className={`miror-project-evidence ${compact ? "is-compact" : ""}`} aria-labelledby="evidence-board-title">
      <div className="miror-project-evidence__header">
        <div>
          <span className="miror-upgrade-kicker">Portfolio / evidence</span>
          <h2 id="evidence-board-title">Project stories with a clear line between proof and pending detail.</h2>
        </div>
        <div className="miror-project-evidence__summary" aria-label="Portfolio record summary">
          <div><strong>02</strong><span>Public evidence records</span></div>
          <div><strong>16</strong><span>Client project slots</span></div>
        </div>
      </div>

      <div className="miror-project-evidence__grid">
        {evidenceProjects.map((project) => <EvidenceProjectCard key={project.slug} project={project} />)}
      </div>

      <div className="miror-project-evidence__queue">
        <div className="miror-project-evidence__queue-head">
          <div>
            <span className="miror-upgrade-kicker">Portfolio expansion queue</span>
            <h3>Ready for the company’s additional project set.</h3>
          </div>
          <span className="miror-project-evidence__queue-count">16 RECORDS RESERVED</span>
        </div>
        <div className="miror-project-evidence__slots">
          {pendingProjectSlots.map((slot) => (
            <div key={slot.slot} className="miror-project-evidence__slot">
              <span>{String(slot.slot).padStart(2, "0")}</span>
              <strong>{slot.title}</strong>
              <small>{slot.note}</small>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
