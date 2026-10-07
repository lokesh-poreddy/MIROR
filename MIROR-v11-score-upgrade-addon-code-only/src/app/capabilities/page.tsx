import Link from "next/link";
import { capabilityGroups } from "@/data/miror-upgrade";

export const metadata = { title: "Capabilities" };

export default function CapabilitiesPage() {
  return (
    <main className="miror-upgrade-home">
      <section className="miror-upgrade-statement" style={{ paddingTop: "15vh" }}>
        <div className="miror-upgrade-statement__index">CAPABILITIES / 01</div>
        <div>
          <span className="miror-upgrade-kicker">Capabilities</span>
          <h1 style={{ fontSize: "clamp(48px,7vw,110px)", lineHeight: ".88", letterSpacing: "-.065em", fontWeight: 500, margin: "14px 0 0" }}>
            Capability should read like a working scope, not a marketing slogan.
          </h1>
          <p style={{ maxWidth: 720, color: "#6f6b64", lineHeight: 1.7, marginTop: 25 }}>
            The capability system starts with the areas supported by the current project evidence and keeps additional service claims subject to company approval.
          </p>
        </div>
      </section>
      <section className="miror-upgrade-capabilities">
        <div className="miror-upgrade-capability-list">
          {capabilityGroups.map((capability) => (
            <article key={capability.id} className="miror-upgrade-capability-row">
              <span className="miror-upgrade-capability-row__number">{capability.number}</span>
              <div>
                <h2 style={{ margin: 0, fontSize: "28px", fontWeight: 500 }}>{capability.title}</h2>
                <p>{capability.description}</p>
                <div className="miror-upgrade-chip-row">
                  {capability.links.map((item) => <span key={item}>{item}</span>)}
                </div>
              </div>
              <Link href={capability.route} aria-label={`Open ${capability.title}`}><span aria-hidden="true">↗</span></Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
