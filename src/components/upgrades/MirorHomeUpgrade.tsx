import Link from "next/link";
import { EngineeringBlueprint } from "@/components/upgrades/EngineeringBlueprint";
import { ProjectEvidenceBoard } from "@/components/upgrades/ProjectEvidenceBoard";
import {
  capabilityGroups,
  executionSteps,
  homepageNarrative,
  locationSignals,
  trustPrinciples,
} from "@/data/miror-upgrade";

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export function MirorHomeUpgrade() {
  return (
    <main className="miror-upgrade-home">
      <section className="miror-upgrade-hero" aria-labelledby="miror-upgrade-title">
        <div className="miror-upgrade-hero__copy">
          <div className="miror-upgrade-kicker-row">
            <span className="miror-upgrade-kicker">{homepageNarrative.eyebrow}</span>
            <span className="miror-upgrade-micro">MIROR / AP–TS / 01</span>
          </div>
          <h1 id="miror-upgrade-title">{homepageNarrative.title}</h1>
          <p className="miror-upgrade-hero__lead">{homepageNarrative.lead}</p>
          <p className="miror-upgrade-hero__supporting">{homepageNarrative.supporting}</p>
          <div className="miror-upgrade-actions">
            <Link className="miror-upgrade-button miror-upgrade-button--dark" href="/work">Explore the work <Arrow /></Link>
            <Link className="miror-upgrade-button" href="/engineering">Enter engineering <Arrow /></Link>
          </div>
          <div className="miror-upgrade-hero__footline">
            <span>ONGOLE / ANDHRA PRADESH</span>
            <span>EVIDENCE-FIRST DIGITAL PROFILE</span>
            <span>SCROLL TO BUILD THE STORY</span>
          </div>
        </div>
        <div className="miror-upgrade-hero__visual">
          <div className="miror-upgrade-hero__visual-top">
            <span>LIVE DRAWING / 3D</span>
            <span>FIELD FRAME / 01</span>
          </div>
          <EngineeringBlueprint compact />
        </div>
      </section>

      <section className="miror-upgrade-proof-strip" aria-label="What the site is designed to do">
        <div><span>01</span><strong>Project proof</strong><p>Show documented relationships before marketing language.</p></div>
        <div><span>02</span><strong>Engineering clarity</strong><p>Use technical visuals as a communication system.</p></div>
        <div><span>03</span><strong>Publication control</strong><p>Keep future client content replaceable and approval-aware.</p></div>
        <div><span>04</span><strong>Corporate scale</strong><p>Build the structure needed for a serious multi-page website.</p></div>
      </section>

      <section className="miror-upgrade-statement">
        <div className="miror-upgrade-statement__index">02 / COMPANY POSITION</div>
        <div>
          <h2>Construction websites earn trust when the digital experience feels as considered as the work it describes.</h2>
          <p>
            The strongest engineering and construction websites lead with projects, markets, capabilities, people and evidence rather than decorative claims. This upgrade follows that model while keeping Miror-specific facts deliberately restrained. Bechtel, AECOM and Afcons all place substantial emphasis on projects, markets, engineering capabilities and the contexts in which work is delivered. citeturn474307search0turn474307search2turn474307search6
          </p>
        </div>
      </section>

      <section className="miror-upgrade-capabilities" aria-labelledby="capabilities-title">
        <div className="miror-upgrade-section-head">
          <div><span className="miror-upgrade-kicker">Capabilities / 03</span><h2 id="capabilities-title">Make the capability story legible in one scan.</h2></div>
          <Link href="/capabilities" className="miror-upgrade-text-link">View all capabilities <Arrow /></Link>
        </div>
        <div className="miror-upgrade-capability-list">
          {capabilityGroups.map((capability) => (
            <Link key={capability.id} href={capability.route} className="miror-upgrade-capability-row">
              <span className="miror-upgrade-capability-row__number">{capability.number}</span>
              <div><h3>{capability.title}</h3><p>{capability.description}</p><div className="miror-upgrade-chip-row">{capability.links.map((item) => <span key={item}>{item}</span>)}</div></div>
              <Arrow />
            </Link>
          ))}
        </div>
      </section>

      <EngineeringBlueprint />

      <section className="miror-upgrade-process" aria-labelledby="process-title">
        <div className="miror-upgrade-section-head">
          <div><span className="miror-upgrade-kicker">Execution / 05</span><h2 id="process-title">From brief to built work.</h2></div>
          <p>Simple enough for a client to understand. Specific enough to feel like a construction company rather than a generic agency website.</p>
        </div>
        <div className="miror-upgrade-process__grid">
          {executionSteps.map((step) => (
            <article key={step.number} className="miror-upgrade-step">
              <span>{step.number}</span><h3>{step.title}</h3><p>{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <ProjectEvidenceBoard />

      <section className="miror-upgrade-trust" aria-labelledby="trust-title">
        <div><span className="miror-upgrade-kicker">Why Miror / 07</span><h2 id="trust-title">A stronger corporate story comes from disciplined details.</h2></div>
        <div className="miror-upgrade-trust__grid">
          {trustPrinciples.map((principle) => <article key={principle.number}><span>{principle.number}</span><h3>{principle.title}</h3><p>{principle.body}</p></article>)}
        </div>
      </section>

      <section className="miror-upgrade-locations" aria-labelledby="locations-title">
        <div className="miror-upgrade-locations__copy">
          <span className="miror-upgrade-kicker">Where we work / 08</span>
          <h2 id="locations-title">Andhra Pradesh ↔ Telangana</h2>
          <p>The site keeps the geographic story clear and modest: a corporate base in Ongole and documented project footprint extending into Telangana.</p>
          <Link href="/locations" className="miror-upgrade-button">View locations <Arrow /></Link>
        </div>
        <div className="miror-upgrade-location-rail">
          <div className="miror-upgrade-location-line" aria-hidden="true" />
          {locationSignals.map((location) => <div className="miror-upgrade-location-stop" key={location.code}><span className="miror-upgrade-location-stop__dot" /><div><small>{location.code}</small><strong>{location.region}</strong><span>{location.role} · {location.detail}</span></div></div>)}
        </div>
      </section>

      <section className="miror-upgrade-cta" aria-labelledby="contact-title">
        <div>
          <span className="miror-upgrade-kicker">Start a conversation / 09</span>
          <h2 id="contact-title">Have a project worth building?</h2>
        </div>
        <div>
          <p>Project, capability, partnership or career enquiry — the next step should be simple.</p>
          <div className="miror-upgrade-actions"><Link className="miror-upgrade-button miror-upgrade-button--paper" href="/contact">Contact Miror <Arrow /></Link><a className="miror-upgrade-button miror-upgrade-button--outline-light" href="mailto:p.lokeshreddy2005@gmail.com">Email directly <Arrow /></a></div>
        </div>
      </section>

      <footer className="miror-upgrade-footer">
        <div className="miror-upgrade-footer__brand">MIROR<span>®</span></div>
        <div className="miror-upgrade-footer__grid">
          <div><span>Construction · Infrastructure · Execution</span><small>Ongole · Andhra Pradesh</small></div>
          <nav aria-label="Footer navigation"><Link href="/about">About</Link><Link href="/capabilities">Capabilities</Link><Link href="/engineering">Engineering</Link><Link href="/work">Work</Link><Link href="/quality-safety">Quality & Safety</Link><Link href="/contact">Contact</Link></nav>
          <div><span>Query mailbox</span><a href="mailto:p.lokeshreddy2005@gmail.com">p.lokeshreddy2005@gmail.com</a></div>
        </div>
        <div className="miror-upgrade-footer__bottom"><span>© 2026 Miror Constructions & Consultancy</span><span>Evidence-first publication system</span></div>
      </footer>
    </main>
  );
}
