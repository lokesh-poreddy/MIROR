import Link from "next/link";
import { notFound } from "next/navigation";
import { capabilityGroups } from "@/data/miror-upgrade";

export function generateStaticParams() {
  return capabilityGroups.map((capability) => ({ slug: capability.id }));
}

export default async function CapabilityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const capability = capabilityGroups.find((item) => item.id === slug);
  if (!capability) notFound();

  return (
    <main className="miror-upgrade-home">
      <section className="miror-upgrade-statement" style={{ paddingTop: "15vh" }}>
        <div className="miror-upgrade-statement__index">CAPABILITY / {capability.number}</div>
        <div>
          <span className="miror-upgrade-kicker">{capability.title}</span>
          <h1 style={{ fontSize: "clamp(48px,7vw,110px)", lineHeight: ".88", letterSpacing: "-.065em", fontWeight: 500, margin: "14px 0 0" }}>
            {capability.description}
          </h1>
          <p style={{ maxWidth: 720, color: "#6f6b64", lineHeight: 1.7, marginTop: 25 }}>
            The detailed capability record is intentionally scoped to the current evidence set. Additional methods, equipment, certifications or delivery metrics should be added only after company confirmation.
          </p>
          <div className="miror-upgrade-chip-row" style={{ marginTop: 24 }}>{capability.links.map((item) => <span key={item}>{item}</span>)}</div>
        </div>
      </section>
      <section className="miror-upgrade-cta">
        <div><span className="miror-upgrade-kicker">Next step</span><h2>Discuss the scope with Miror.</h2></div>
        <div><p>Use the contact route for a project brief, capability question or partnership enquiry.</p><div className="miror-upgrade-actions"><Link href="/contact" className="miror-upgrade-button miror-upgrade-button--paper">Start a conversation ↗</Link><Link href="/capabilities" className="miror-upgrade-button miror-upgrade-button--outline-light">Back to capabilities</Link></div></div>
      </section>
    </main>
  );
}
