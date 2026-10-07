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

function ProjectMedia({ project, index }: { project: EvidenceProject, index: number }) {
  return (
    <div className="miror-evidence-card__media" aria-label={`${project.title} media region`} style={{ position: 'relative' }}>
      <img src={`/media/projects/project-0${index + 1}.png`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <div className="miror-evidence-card__media-copy" style={{ 
        position: 'absolute', bottom: '0', left: '0', width: '100%',
        padding: '2rem 1rem 1rem', background: 'linear-gradient(to top, rgba(13,15,16,0.9), transparent)',
        color: '#fff', fontSize: '10px', letterSpacing: '0.1em', 
        fontWeight: 700, fontFamily: 'var(--miror-mono)', textTransform: 'uppercase',
        display: 'flex', gap: '8px'
      }}>
        <span style={{opacity: 0.7}}>PROJECT 0{index + 1} / </span>
        <strong>ORIGINAL STUDY</strong>
      </div>
    </div>
  );
}

function EvidenceProjectCard({ project, index }: { project: EvidenceProject, index: number }) {
  return (
    <article className="miror-evidence-card">
      <ProjectMedia project={project} index={index} />
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
        {evidenceProjects.map((project, index) => <EvidenceProjectCard key={project.slug} project={project} index={index} />)}
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
