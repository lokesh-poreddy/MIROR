import Link from "next/link";
const roles = ["Engineering","Site execution","Planning","Quality & safety","Commercial","Administration"];
export function PeopleCareers(){return <section className="v12-section" aria-labelledby="v12-people-title"><div className="v12-container">
 <div className="v12-section__head"><div><span className="v12-kicker">People / careers</span></div><div className="v12-section__head-copy"><h2 id="v12-people-title">Good work is built by people who understand the field.</h2><p>The public team story stays factual while detailed biographies and current vacancies are prepared for company approval.</p></div></div>
 <div className="v12-data-grid">{roles.map((role,i)=><article className="v12-data-card" key={role}><span className="v12-data-card__number">{String(i+1).padStart(2,"0")}</span><h3>{role}</h3><p>Reserved for approved team profiles, responsibilities and project-facing context.</p></article>)}</div>
 <div style={{marginTop:"2rem"}}><Link className="v12-button v12-button--solid" href="/careers">Explore careers ↗</Link></div>
 </div></section>}
