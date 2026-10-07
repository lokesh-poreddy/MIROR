import Link from "next/link";
import { company } from "@/data/company";
import { trustPrinciples } from "@/data/miror-upgrade";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <main className="miror-upgrade-home">
      <section className="miror-upgrade-statement" style={{ paddingTop: "15vh" }}>
        <div className="miror-upgrade-statement__index">ABOUT / 01</div>
        <div>
          <span className="miror-upgrade-kicker">Company</span>
          <h1 style={{ fontSize: "clamp(48px,7vw,110px)", lineHeight: ".88", letterSpacing: "-.065em", fontWeight: 500, margin: "14px 0 0" }}>
            A construction story should distinguish heritage, evidence and the company that exists today.
          </h1>
          <p style={{ maxWidth: 720, color: "#6f6b64", lineHeight: 1.7, marginTop: 25 }}>
            Miror Constructions and Consultancy Private Limited is the current legal entity. The company’s supplied context indicates that the underlying construction business predates the 2019 entity, so the website keeps those two timelines visibly separate.
          </p>
        </div>
      </section>

      <section className="miror-upgrade-statement" style={{ paddingTop: "3vh" }}>
        <div><span className="miror-upgrade-kicker">Corporate record</span></div>
        <div className="miror-upgrade-capability-list">
          {[
            ["Legal name", company.legalName],
            ["CIN", company.cin],
            ["Incorporated", "28 March 2019"],
            ["Status", company.status],
            ["Registered office", company.registeredOffice],
          ].map(([label, value]) => (
            <div key={label} className="miror-upgrade-capability-row" style={{ gridTemplateColumns: "180px 1fr", alignItems: "center" }}>
              <span className="miror-upgrade-capability-row__number">{label}</span>
              <strong style={{ fontSize: 15, fontWeight: 500 }}>{value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section id="legacy" className="miror-upgrade-trust">
        <div><span className="miror-upgrade-kicker">Legacy / 02</span><h2>Build the history from approved milestones, not assumptions.</h2></div>
        <div>
          <p style={{ color: "rgba(243,240,232,.62)", lineHeight: 1.7, maxWidth: 650 }}>
            The production timeline is deliberately prepared for client input: business origins, major phases of work, expansion, the formation of the 2019 private limited entity and subsequent documented projects. Until that information is supplied, the site does not manufacture dates, contract values or project counts.
          </p>
          <Link href="/contact" className="miror-upgrade-button miror-upgrade-button--paper">Update the company story ↗</Link>
        </div>
      </section>

      <section className="miror-upgrade-capabilities">
        <div className="miror-upgrade-section-head"><div><span className="miror-upgrade-kicker">How the site tells the story / 03</span><h2>Four principles keep the company profile credible.</h2></div></div>
        <div className="miror-upgrade-process__grid">
          {trustPrinciples.map((item) => <article key={item.number} className="miror-upgrade-step"><span>{item.number}</span><h3>{item.title}</h3><p>{item.body}</p></article>)}
        </div>
      </section>
    </main>
  );
}
