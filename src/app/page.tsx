import Link from "next/link";
import { Reveal } from "@/components/motion-reveal";
import { company } from "@/data/company";
import { projects } from "@/data/projects";

export default function HomePage() {
  const featured = projects.filter((project) => project.featured);
  return (
    <main>
      <section className="hero">
        <div className="hero-copy-wrap">
          <Reveal><div className="eyebrow">Civil construction · infrastructure · execution</div></Reveal>
          <Reveal delay={0.05}><h1>Built with precision. Delivered with purpose.</h1></Reveal>
          <Reveal delay={0.1}><p>Miror is building a digital presence around the thing that matters most in construction: credible work, clear execution and long-term relationships.</p></Reveal>
          <Reveal delay={0.15}><div className="hero-actions"><Link className="button button-solid" href="/work">Explore our work ↗</Link><Link className="button" href="/contact">Start a conversation</Link></div></Reveal>
        </div>
        <div className="hero-media"><img src="/placeholder.svg" alt="Construction site placeholder — replace with approved project photography" /></div>
        <div className="hero-media-overlay">Ongole · Andhra Pradesh</div>
        <div className="scroll-cue">Scroll to explore</div>
      </section>

      <section className="section">
        <div className="section-grid">
          <div className="section-kicker">The company</div>
          <div><Reveal><h2>A construction story with roots that extend beyond the current 2019 company entity.</h2></Reveal><Reveal delay={0.08}><p className="section-copy">{company.historyNote} The final public-facing history will be written from the client’s approved timeline so the site can distinguish legacy experience from the current legal entity.</p></Reveal></div>
        </div>
      </section>

      <section className="section dark-section">
        <div className="section-grid"><div className="section-kicker">Our work</div><div><Reveal><h2>Project stories, not just project cards.</h2></Reveal><Reveal delay={0.08}><p className="section-copy">The portfolio architecture is ready for the two publicly evidenced projects plus the client’s additional project set, without inventing details.</p></Reveal></div></div>
        <div className="work-preview">
          {featured.map((project, index) => <Link key={project.slug} href={`/work/${project.slug}`} className={index === 0 ? "work-preview-main" : "work-preview-side"}><img src={project.media ?? "/placeholder.svg"} alt="" /><div className="work-caption"><div className="eyebrow" style={{color:"rgba(255,255,255,.65)"}}>{project.category}</div><h3>{project.title}</h3></div></Link>)}
        </div>
      </section>

      <section className="section">
        <div className="section-grid"><div className="section-kicker">Capabilities</div><div><h2>Infrastructure, civil construction and structural execution.</h2><div className="section-copy"><p>Publicly discoverable project evidence supports irrigation/canal-related CM & CD work, RCC and aluminium formwork execution. The service taxonomy will expand only when the client confirms additional capabilities.</p></div><Link className="button" href="/capabilities">View capabilities ↗</Link></div></div>
      </section>

      <footer className="footer"><div className="footer-top"><div className="footer-brand">MIROR.</div><nav className="footer-links"><Link href="/about">About</Link><Link href="/capabilities">Capabilities</Link><Link href="/work">Our Work</Link><Link href="/careers">Careers</Link><Link href="/quality-safety">Quality & Safety</Link><Link href="/contact">Contact</Link></nav></div><div className="footer-bottom"><span>{company.registeredOffice}</span><span>© {new Date().getFullYear()} Miror</span></div></footer>
    </main>
  );
}
