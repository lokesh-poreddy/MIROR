import Link from "next/link";
import { EngineeringStudio } from "@/components/v12/EngineeringStudio";
import { ProjectCaseStudies } from "@/components/v12/ProjectCaseStudies";
import { CapabilityShowcase } from "@/components/v12/CapabilityShowcase";
import { QualitySafetySystem } from "@/components/v12/QualitySafetySystem";
import { PeopleCareers } from "@/components/v12/PeopleCareers";
import { LocationsLedger } from "@/components/v12/LocationsLedger";
import { executionSteps, homepageNarrative } from "@/data/miror-upgrade";

export function RoyalHome(){return <main className="v12-shell">
 <section className="v12-container v12-hero"><div className="v12-hero__copy"><span className="v12-kicker">{homepageNarrative.eyebrow}</span><h1 className="v12-display">Engineering discipline. Construction made tangible.</h1><p className="v12-hero__lead">Miror Constructions & Consultancy is presented through projects, capabilities, engineering thinking and disciplined execution.</p><p className="v12-hero__body">A more authoritative corporate identity, built around verified public information today and a structured path for approved company content tomorrow.</p><div className="v12-hero__actions"><Link className="v12-button v12-button--solid" href="/work">Explore our work ↗</Link><Link className="v12-button" href="/engineering">Engineering studio ↗</Link></div><div className="v12-hero__meta"><span>ONGOLE / ANDHRA PRADESH</span><span>AP ↔ TELANGANA</span><span>EVIDENCE-LED PROFILE</span></div></div><div className="v12-hero__visual"><div className="v12-hero__label"><span>FIELD FRAME / 01</span><span>LIVE VECTOR STUDY</span></div><EngineeringStudio compact/></div></section>
 <section className="v12-proof" aria-label="Corporate experience principles"><article><span className="v12-kicker">01</span><strong>Project-led</strong><p>Lead with actual work and the role Miror can substantiate.</p></article><article><span className="v12-kicker">02</span><strong>Engineering-first</strong><p>Make technical thinking visible rather than relying on decorative imagery.</p></article><article><span className="v12-kicker">03</span><strong>Publication-aware</strong><p>Separate verified records from client-approved future content.</p></article><article><span className="v12-kicker">04</span><strong>Built to scale</strong><p>Every major content unit can grow into a deeper corporate page.</p></article></section>
 <section className="v12-section"><div className="v12-container"><div className="v12-section__head"><div><span className="v12-kicker">Company</span></div><div className="v12-section__head-copy"><h2>What a serious construction website should communicate in one visit.</h2><p>Who the company is, what it can do, where it works, what it has built, how it executes, and how to begin a conversation.</p></div></div></div></section>
 <CapabilityShowcase/>
 <EngineeringStudio/>
 <section className="v12-section" aria-labelledby="v12-process-title"><div className="v12-container"><div className="v12-section__head"><div><span className="v12-kicker">Execution</span></div><div className="v12-section__head-copy"><h2 id="v12-process-title">From brief to built work.</h2><p>A simple operating story that is clear enough for a client and specific enough to feel like a construction company.</p></div></div><div className="v12-process">{executionSteps.map(step=><article key={step.number}><span>{step.number}</span><h3>{step.title}</h3><p>{step.body}</p></article>)}</div></div></section>
 <ProjectCaseStudies/>
 <QualitySafetySystem/>
 <PeopleCareers/>
 <LocationsLedger/>
 <section className="v12-cta"><div className="v12-container v12-cta__grid"><div><span className="v12-kicker v12-kicker-light">Start a conversation</span><h2 className="v12-display">Have a project worth building?</h2></div><div><p>Project enquiry, partnership, career or document request. Start with the context and let the conversation become more specific from there.</p><div className="v12-hero__actions"><Link className="v12-button v12-button--light" href="/contact">Contact Miror ↗</Link><a className="v12-button v12-button--light" href="mailto:p.lokeshreddy2005@gmail.com">Email directly ↗</a></div></div></div></section>
 </main>}
