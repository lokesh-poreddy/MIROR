import Link from "next/link";
import { capabilityGroups } from "@/data/miror-upgrade";

export function CapabilityShowcase({ dark = false }: { dark?: boolean }) {
  return <section className={`v12-section ${dark ? "v12-section--dark" : ""}`} aria-labelledby="v12-capabilities-title">
    <div className="v12-container">
      <div className="v12-section__head"><div><span className={`v12-kicker ${dark ? "v12-kicker-light" : ""}`}>Capabilities</span></div><div className="v12-section__head-copy"><h2 id="v12-capabilities-title">Capability should read like a working scope.</h2><p>Clear service lines, useful execution language and a path into more detailed capability pages.</p></div></div>
      <div className="v12-capability-list">
        {capabilityGroups.map((capability)=><Link key={capability.id} href={capability.route} className="v12-capability">
          <span className="v12-capability__number">{capability.number}</span>
          <div><h3>{capability.title}</h3><p>{capability.description}</p><div className="v12-capability__chips">{capability.links.map((item)=><span key={item}>{item}</span>)}</div></div><span className="v12-capability__arrow" aria-hidden="true">↗</span>
        </Link>)}
      </div>
    </div>
  </section>;
}
