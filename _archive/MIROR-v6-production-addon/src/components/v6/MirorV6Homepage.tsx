"use client";

import { useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Check, Compass, Construction, HardHat, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { MirorV6Navigation } from "./MirorV6Navigation";
import { MirorV6ProjectPortfolio } from "./MirorV6ProjectPortfolio";
import { useMirorV6Experience } from "@/lib/v6/miror-v6-platform";
import { MIROR_COMPANY, MOTION, type Capability, type ProjectRecord } from "@/lib/v6/miror-v6-contracts";

export interface MirorV6HomepageProps { projects: ProjectRecord[]; capabilities?: Capability[]; }

const DEFAULT_CAPABILITIES: Capability[] = [
  { id: "civil-construction", number: "01", title: "Civil Construction", short: "Structural and site execution", body: "Site-led construction with disciplined coordination across earthwork, concrete, reinforcement, formwork and finishing interfaces.", deliverables: ["RCC structures", "Earthwork", "Concrete execution", "Site coordination"], projectSlugs: ["hnss-kuppam-branch-canal-phase-ii", "revasa-la-valora"], accent: "sand" },
  { id: "infrastructure-execution", number: "02", title: "Infrastructure Execution", short: "Civil works for large project environments", body: "Execution support across infrastructure packages where sequencing, quality checks and field coordination matter as much as output.", deliverables: ["CM & CD works", "Canal-associated structures", "Site packages", "Quality checkpoints"], projectSlugs: ["hnss-kuppam-branch-canal-phase-ii"], accent: "steel" },
  { id: "structural-formwork", number: "03", title: "Structural & Formwork", short: "RCC walls, slabs and formwork systems", body: "Execution workflows for repetitive structural systems, aluminium formwork and concrete interfaces within residential developments.", deliverables: ["Aluminium formwork", "RC walls", "RC slabs", "MEP openings"], projectSlugs: ["revasa-la-valora"], accent: "ink" },
  { id: "site-delivery", number: "04", title: "Site Delivery", short: "Planning, coordination and completion discipline", body: "A field-first delivery mindset focused on sequencing, inspections, handoffs and clear documentation.", deliverables: ["Site planning", "Inspection workflows", "Subcontractor coordination", "Closeout"], projectSlugs: [], accent: "signal" },
];

const PRINCIPLES = [
  ["Proof before promise", "Every project story is designed to be backed by source evidence and client approval."],
  ["Field intelligence", "The interface is built around the work itself: scope, role, sequence, place and outcome."],
  ["Calm technology", "Motion earns its place when it clarifies hierarchy; it never competes with the work."],
  ["Built to scale", "The same architecture can hold two verified projects or twenty without rewriting the site."],
] as const;

const STORY_STATS = [
  { value: "2019", label: "Current private limited entity" },
  { value: "18+", label: "Planned portfolio scale" },
  { value: "02", label: "Publicly evidenced project references" },
  { value: "01", label: "Integrated digital platform" },
];

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.16 }} transition={{ duration: MOTION.duration.slow, delay, ease: MOTION.ease.reveal }}>{children}</motion.div>;
}

function SectionLabel({ number, label }: { number: string; label: string }) {
  return <div className="miror-v6__section-label"><span>{number}</span><span>{label}</span></div>;
}

function BlueprintGraphic() {
  const lines = Array.from({ length: 8 }, (_, index) => index);
  return <div className="miror-v6__blueprint" aria-hidden="true"><div className="miror-v6__blueprint-frame">{lines.map((line) => <span key={`h-${line}`} className="h" style={{ top: `${12 + line * 11}%` }} />)}{lines.map((line) => <span key={`v-${line}`} className="v" style={{ left: `${12 + line * 11}%` }} />)}<span className="miror-v6__blueprint-block block-a"/><span className="miror-v6__blueprint-block block-b"/><span className="miror-v6__blueprint-dimension">143.000</span><span className="miror-v6__blueprint-dimension vertical">CM + CD</span></div></div>;
}

function Hero() {
  const [active, setActive] = useState(false);
  return <section className="miror-v6__hero" data-section="hero">
    <div className="miror-v6__hero-noise" aria-hidden="true" />
    <div className="miror-v6__hero-grid">
      <div className="miror-v6__hero-copy"><Reveal><p className="eyebrow">Miror Constructions & Consultancy</p></Reveal><Reveal delay={0.04}><h1>Built with<br/><em>precision.</em></h1></Reveal><Reveal delay={0.08}><p className="miror-v6__hero-lead">Civil construction, infrastructure and site execution—told through the projects that prove the work.</p></Reveal><Reveal delay={0.12}><div className="miror-v6__hero-cta-row"><a className="miror-v6__button miror-v6__button--solid" href="/work">Explore our work <ArrowUpRight size={18}/></a><button className="miror-v6__text-button" onClick={() => setActive((value) => !value)}>{active ? "Close detail" : "See the idea"}<ArrowDownRight size={17}/></button></div></Reveal>{active && <Reveal><div className="miror-v6__hero-note">The new digital platform separates verified project evidence from client-supplied material, so the public story can grow safely as the archive is approved.</div></Reveal>}</div>
      <div className="miror-v6__hero-art"><BlueprintGraphic/><div className="miror-v6__hero-art-caption"><span>01</span><span>FIELD / FORM / FLOW</span></div></div>
    </div>
    <a className="miror-v6__scroll-cue" href="#story" aria-label="Scroll to story"><span>Scroll to explore</span><span className="line"/></a>
  </section>;
}

function StorySection() {
  return <section id="story" className="miror-v6__story section-pad"><SectionLabel number="01" label="The company"/><div className="miror-v6__story-grid"><Reveal><h2>Long experience,<br/><span>one clearer story.</span></h2></Reveal><Reveal delay={0.05}><div className="miror-v6__story-copy"><p>The current private limited company was incorporated in 2019. Client-provided history indicates the underlying construction business began earlier, giving the new platform an opportunity to document that legacy without blurring the legal timeline.</p><a href="/about" className="miror-v6__inline-link">Read the company story <ArrowUpRight size={16}/></a></div></Reveal></div><div className="miror-v6__stat-grid">{STORY_STATS.map((stat, index) => <Reveal delay={index * 0.04} key={stat.label}><div className="miror-v6__stat"><strong>{stat.value}</strong><span>{stat.label}</span></div></Reveal>)}</div></section>;
}

function PrincipleSection() {
  return <section className="miror-v6__principles section-pad"><SectionLabel number="02" label="How we present the work"/><div className="miror-v6__principles-grid"><Reveal><h2>Construction websites should feel like <span>evidence rooms,</span> not brochures.</h2></Reveal><div>{PRINCIPLES.map(([title, body], index) => <Reveal delay={index * .06} key={title}><article className="miror-v6__principle"><span>{String(index + 1).padStart(2,"0")}</span><div><h3>{title}</h3><p>{body}</p></div></article></Reveal>)}</div></div></section>;
}

function CapabilitySection({ capabilities }: { capabilities: Capability[] }) {
  const [activeId, setActiveId] = useState(capabilities[0]?.id ?? "");
  const active = capabilities.find((item) => item.id === activeId) ?? capabilities[0];
  return <section className="miror-v6__capabilities section-pad"><SectionLabel number="03" label="Capabilities"/><div className="miror-v6__cap-head"><Reveal><h2>From site logic<br/><span>to visible outcome.</span></h2></Reveal><Reveal delay={.08}><p>Capabilities become useful when they connect directly to the project record. Select a discipline to see the delivery language behind it.</p></Reveal></div><div className="miror-v6__cap-layout"><div className="miror-v6__cap-list" role="tablist" aria-label="Capabilities">{capabilities.map((item) => <button key={item.id} role="tab" aria-selected={activeId === item.id} className={activeId === item.id ? "is-active" : ""} onClick={() => setActiveId(item.id)}><span>{item.number}</span><strong>{item.title}</strong><small>{item.short}</small><ArrowUpRight size={17}/></button>)}</div>{active && <Reveal><div className="miror-v6__cap-detail" role="tabpanel"><p className="eyebrow">Capability {active.number}</p><h3>{active.title}</h3><p>{active.body}</p><div className="miror-v6__deliverables">{active.deliverables.map((item) => <span key={item}><Check size={15}/>{item}</span>)}</div><a href={`/capabilities#${active.id}`} className="miror-v6__button">View capability <ArrowUpRight size={17}/></a></div></Reveal>}</div></section>;
}

function TrustSection() {
  const points = [{ icon: Construction, title: "Project-led", body: "Lead with actual work and structured project records." }, { icon: ShieldCheck, title: "Evidence-led", body: "Publication gates protect against unsupported claims." }, { icon: HardHat, title: "Site-aware", body: "Visual language reflects engineering and construction reality." }, { icon: Compass, title: "Scalable", body: "Architecture is ready for the full project archive." }];
  return <section className="miror-v6__trust section-dark section-pad"><SectionLabel number="04" label="The standard"/><Reveal><div className="miror-v6__trust-head"><p className="eyebrow">Built for the next chapter</p><h2>A corporate presence that looks as considered as the work behind it.</h2></div></Reveal><div className="miror-v6__trust-grid">{points.map((point,index)=>{const Icon=point.icon;return <Reveal key={point.title} delay={index*.05}><article><Icon size={22}/><h3>{point.title}</h3><p>{point.body}</p></article></Reveal>})}</div></section>;
}

function ClosingCTA() { return <section className="miror-v6__closing section-pad"><div className="miror-v6__closing-inner"><Reveal><Sparkles size={20}/><p className="eyebrow">For projects, partnerships and careers</p><h2>Let the next project<br/><span>have a better front door.</span></h2><a className="miror-v6__button miror-v6__button--solid" href="/contact">Start a conversation <ArrowUpRight size={18}/></a></Reveal><div className="miror-v6__closing-mark">MIROR<br/><small>CONSTRUCTIONS & CONSULTANCY</small></div></div></section>; }

export function MirorV6Homepage({ projects, capabilities = DEFAULT_CAPABILITIES }: MirorV6HomepageProps) {
  const { reducedMotion } = useMirorV6Experience();
  const publishable = useMemo(() => projects.filter((project) => project.visibility === "published"), [projects]);
  return <div className={`miror-v6-site ${reducedMotion ? "motion-reduced" : ""}`}><MirorV6Navigation/><main><Hero/><StorySection/><PrincipleSection/><CapabilitySection capabilities={capabilities}/><section className="miror-v6__work section-pad"><SectionLabel number="05" label="Our work"/><div className="miror-v6__work-head"><Reveal><h2>The work<br/><span>does the talking.</span></h2></Reveal><Reveal delay={.05}><a className="miror-v6__inline-link" href="/work">Open the project archive <ArrowUpRight size={16}/></a></Reveal></div><MirorV6ProjectPortfolio projects={publishable} preview/></section><TrustSection/><ClosingCTA/></main></div>;
}

export const HOMEPAGE_SECTION_ORDER = ["hero","story","principles","capabilities","work","trust","closing"] as const;
export function homepageSectionLabel(section: string): string { const labels: Record<string,string> = {hero:"Introduction",story:"The company",principles:"The standard",capabilities:"Capabilities",work:"Our work",trust:"Trust",closing:"Contact"}; return labels[section] ?? section; }
export function homepageRoute(section: string): string { return section === "work" ? "/work" : section === "capabilities" ? "/capabilities" : section === "story" ? "/about" : "/"; }

export function homepageRule001(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 65);
}

export function homepageRule002(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 70);
}

export function homepageRule003(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 75);
}

export function homepageRule004(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 80);
}

export function homepageRule005(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 85);
}

export function homepageRule006(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 90);
}

export function homepageRule007(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 95);
}

export function homepageRule008(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 100);
}

export function homepageRule009(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 105);
}

export function homepageRule010(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 110);
}

export function homepageRule011(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 115);
}

export function homepageRule012(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 120);
}

export function homepageRule013(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 125);
}

export function homepageRule014(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 130);
}

export function homepageRule015(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 135);
}

export function homepageRule016(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 140);
}

export function homepageRule017(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 145);
}

export function homepageRule018(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 150);
}

export function homepageRule019(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 155);
}

export function homepageRule020(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 160);
}

export function homepageRule021(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 165);
}

export function homepageRule022(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 170);
}

export function homepageRule023(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 175);
}

export function homepageRule024(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 180);
}

export function homepageRule025(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 185);
}

export function homepageRule026(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 190);
}

export function homepageRule027(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 195);
}

export function homepageRule028(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 200);
}

export function homepageRule029(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 205);
}

export function homepageRule030(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 60);
}

export function homepageRule031(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 65);
}

export function homepageRule032(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 70);
}

export function homepageRule033(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 75);
}

export function homepageRule034(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 80);
}

export function homepageRule035(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 85);
}

export function homepageRule036(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 90);
}

export function homepageRule037(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 95);
}

export function homepageRule038(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 100);
}

export function homepageRule039(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 105);
}

export function homepageRule040(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 110);
}

export function homepageRule041(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 115);
}

export function homepageRule042(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 120);
}

export function homepageRule043(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 125);
}

export function homepageRule044(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 130);
}

export function homepageRule045(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 135);
}

export function homepageRule046(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 140);
}

export function homepageRule047(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 145);
}

export function homepageRule048(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 150);
}

export function homepageRule049(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 155);
}

export function homepageRule050(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 160);
}

export function homepageRule051(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 165);
}

export function homepageRule052(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 170);
}

export function homepageRule053(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 175);
}

export function homepageRule054(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 180);
}

export function homepageRule055(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 185);
}

export function homepageRule056(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 190);
}

export function homepageRule057(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 195);
}

export function homepageRule058(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 200);
}

export function homepageRule059(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 205);
}

export function homepageRule060(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 60);
}

export function homepageRule061(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 65);
}

export function homepageRule062(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 70);
}

export function homepageRule063(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 75);
}

export function homepageRule064(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 80);
}

export function homepageRule065(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 85);
}

export function homepageRule066(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 90);
}

export function homepageRule067(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 95);
}

export function homepageRule068(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 100);
}

export function homepageRule069(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 105);
}

export function homepageRule070(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 110);
}

export function homepageRule071(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 115);
}

export function homepageRule072(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 120);
}

export function homepageRule073(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 125);
}

export function homepageRule074(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 130);
}

export function homepageRule075(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 135);
}

export function homepageRule076(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 140);
}

export function homepageRule077(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 145);
}

export function homepageRule078(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 150);
}

export function homepageRule079(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 155);
}

export function homepageRule080(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 160);
}

export function homepageRule081(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 165);
}

export function homepageRule082(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 170);
}

export function homepageRule083(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 175);
}

export function homepageRule084(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 180);
}

export function homepageRule085(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 185);
}

export function homepageRule086(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 190);
}

export function homepageRule087(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 195);
}

export function homepageRule088(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 200);
}

export function homepageRule089(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 205);
}

export function homepageRule090(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 60);
}

export function homepageRule091(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 65);
}

export function homepageRule092(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 70);
}

export function homepageRule093(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 75);
}

export function homepageRule094(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 80);
}

export function homepageRule095(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 85);
}

export function homepageRule096(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 90);
}

export function homepageRule097(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 95);
}

export function homepageRule098(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 100);
}

export function homepageRule099(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 105);
}

export function homepageRule100(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 110);
}

export function homepageRule101(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 115);
}

export function homepageRule102(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 120);
}

export function homepageRule103(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 125);
}

export function homepageRule104(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 130);
}

export function homepageRule105(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 135);
}

export function homepageRule106(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 140);
}

export function homepageRule107(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 145);
}

export function homepageRule108(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 150);
}

export function homepageRule109(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 155);
}

export function homepageRule110(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 160);
}

export function homepageRule111(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 165);
}

export function homepageRule112(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 170);
}

export function homepageRule113(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 175);
}

export function homepageRule114(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 180);
}

export function homepageRule115(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 185);
}

export function homepageRule116(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 190);
}

export function homepageRule117(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 195);
}

export function homepageRule118(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 200);
}

export function homepageRule119(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 205);
}

export function homepageRule120(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 60);
}

export function homepageRule121(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 65);
}

export function homepageRule122(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 70);
}

export function homepageRule123(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 75);
}

export function homepageRule124(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 80);
}

export function homepageRule125(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 85);
}

export function homepageRule126(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 90);
}

export function homepageRule127(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 95);
}

export function homepageRule128(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 100);
}

export function homepageRule129(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 105);
}

export function homepageRule130(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 110);
}

export function homepageRule131(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 115);
}

export function homepageRule132(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 120);
}

export function homepageRule133(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 125);
}

export function homepageRule134(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 130);
}

export function homepageRule135(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 135);
}

export function homepageRule136(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 140);
}

export function homepageRule137(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 145);
}

export function homepageRule138(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 150);
}

export function homepageRule139(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 155);
}

export function homepageRule140(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 160);
}

export function homepageRule141(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 165);
}

export function homepageRule142(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 170);
}

export function homepageRule143(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 175);
}

export function homepageRule144(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 180);
}

export function homepageRule145(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 185);
}

export function homepageRule146(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 190);
}

export function homepageRule147(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 195);
}

export function homepageRule148(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 200);
}

export function homepageRule149(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 205);
}

export function homepageRule150(value: string): string {
  const normalized = (value ?? "").normalize("NFKC").trim();
  return normalized.slice(0, 60);
}
