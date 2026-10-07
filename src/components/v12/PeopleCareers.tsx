import Link from "next/link";
const roles = ["Engineering","Site execution","Planning","Quality & safety","Commercial","Administration"];
export function PeopleCareers(){return <section className="v12-section" aria-labelledby="v12-people-title"><div className="v12-container">
  <div className="v12-section__head">
    <div><span className="v12-kicker">People / careers</span></div>
    <div className="v12-section__head-copy">
      <h2 id="v12-people-title">Good work is built by people who understand the field.</h2>
      <p>The public team story stays factual while detailed biographies and current vacancies are prepared for company approval.</p>
    </div>
  </div>
  <div style={{ marginTop: "3rem", position: "relative" }}>
    <div style={{ width: '100%', aspectRatio: '16/9', backgroundColor: '#e5e5e5', position: 'relative', overflow: 'hidden' }}>
      <img src="/media/projects/construction-field-workers.png" alt="Construction team" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
    <div style={{
      position: 'absolute', right: '0', bottom: '0',
      backgroundColor: '#0d0f10', color: '#fff',
      padding: '2rem', maxWidth: '400px'
    }}>
      <div style={{ fontSize: '11px', letterSpacing: '0.1em', fontWeight: 700, fontFamily: 'var(--miror-mono)', textTransform: 'uppercase', opacity: 0.7, marginBottom: '1rem' }}>
        FIELD FRAME / 03
      </div>
      <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.5 }}>
        Execution is where engineering intent becomes measurable progress: coordinated teams, clear drawings and disciplined site decisions.
      </p>
    </div>
  </div>
  <div style={{marginTop:"3rem"}}><Link className="v12-button v12-button--solid" href="/careers">Explore careers ↗</Link></div>
  </div></section>}
