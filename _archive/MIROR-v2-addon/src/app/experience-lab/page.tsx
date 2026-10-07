import { ArrowUpRight } from "lucide-react";
import { ExperienceHeader } from "@/components/advanced/ExperienceHeader";
import { TextReveal } from "@/components/advanced/TextReveal";
import { KineticMarquee } from "@/components/advanced/KineticMarquee";
import { BlueprintField } from "@/components/advanced/BlueprintField";
import { StatsTicker } from "@/components/advanced/StatsTicker";
import { ProjectRail } from "@/components/advanced/ProjectRail";
import { ProjectFilter } from "@/components/advanced/ProjectFilter";
import { MagneticButton } from "@/components/advanced/MagneticButton";
import { Reveal } from "@/components/motion-reveal";
import { projects } from "@/data/projects";

export default function ExperienceLabPage() {
  return <main className="miror-experience-page"><ExperienceHeader />
    <section className="miror-x-hero"><div className="miror-x-hero__copy"><p className="miror-eyebrow">01 / Built on experience</p><h1><TextReveal>Built with precision.</TextReveal><br /><TextReveal>Delivered with purpose.</TextReveal></h1><p className="miror-x-lead">A cinematic, evidence-led digital expression for Miror Constructions & Consultancy.</p><MagneticButton href="/work" className="miror-x-cta">Explore the work <ArrowUpRight size={18} /></MagneticButton></div><div className="miror-x-hero__field"><BlueprintField /></div><div className="miror-x-scroll">Scroll / 001</div></section>
    <KineticMarquee items={["CIVIL CONSTRUCTION", "INFRASTRUCTURE", "RCC / STRUCTURAL", "FORMWORK", "SITE EXECUTION"]} />
    <section className="miror-x-section miror-x-statement"><Reveal><p className="miror-eyebrow">02 / The system</p><h2>Show the work. Explain the role. Let the evidence carry the story.</h2></Reveal></section>
    <section className="miror-x-section miror-x-stats"><div><p className="miror-eyebrow">Selected signals</p></div><div className="miror-stat-grid"><div><StatsTicker value={2019} /><span>Current private limited entity</span></div><div><StatsTicker value={18} suffix="+" /><span>Portfolio slots / initial system</span></div><div><StatsTicker value={6} suffix="" /><span>Core digital experience layers</span></div></div></section>
    <section className="miror-x-section"><div className="miror-x-section-head"><div><p className="miror-eyebrow">03 / Selected work</p><h2>Case studies that read like field notes.</h2></div><a href="/work">View all ↗</a></div><ProjectRail projects={projects} /></section>
    <section className="miror-x-section miror-x-dark"><div className="miror-x-section-head"><div><p className="miror-eyebrow">04 / Archive</p><h2>A filterable project index for the full portfolio.</h2></div></div><ProjectFilter projects={projects} /></section>
    <section className="miror-x-section miror-x-cta-band"><p className="miror-eyebrow">05 / Next</p><h2>Bring the next structure to life.</h2><MagneticButton href="/contact" className="miror-x-cta miror-x-cta--light">Start a conversation <ArrowUpRight size={18} /></MagneticButton></section>
  </main>;
}
