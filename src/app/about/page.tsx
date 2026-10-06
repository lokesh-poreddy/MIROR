import { Reveal } from "@/components/motion-reveal";
import { company } from "@/data/company";

export const metadata = { title: "About" };

export default function AboutPage() {
  return <main className="page-shell">
    <section className="page-hero"><div className="eyebrow">About Miror</div><h1>Experience, translated into disciplined execution.</h1><p>Miror’s public company record begins in 2019, while the client describes a longer construction history behind the current legal entity. This page is structured to tell that story without confusing business heritage and corporate incorporation.</p></section>
    <section className="section"><div className="section-grid"><div className="section-kicker">Corporate record</div><div><Reveal><h2>{company.shortName} is an active private limited construction company based in Ongole, Andhra Pradesh.</h2></Reveal><div className="meta-list"><div className="meta-item"><span>Legal name</span>{company.legalName}</div><div className="meta-item"><span>CIN</span>{company.cin}</div><div className="meta-item"><span>Incorporated</span>28 March 2019</div><div className="meta-item"><span>Status</span>{company.status}</div><div className="meta-item"><span>Registered office</span>{company.registeredOffice}</div></div></div></div></section>
    <section className="section dark-section"><div className="section-grid"><div className="section-kicker">Legacy</div><div><Reveal><h2>Make the long history visible through a documented timeline.</h2></Reveal><p className="section-copy">The production version should use a milestone timeline supplied by the client: origins of the business, major contracts, expansion, the 2019 entity formation and subsequent projects.</p></div></div></section>
  </main>;
}
