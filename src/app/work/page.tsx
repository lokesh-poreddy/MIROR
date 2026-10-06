import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/motion-reveal";
import { projects, clientProjectSlots } from "@/data/projects";

export const metadata = { title: "Our Work" };

export default function WorkPage(){ return <main className="page-shell"><section className="page-hero"><div className="eyebrow">Our Work</div><h1>18 project slots. One evidence-led portfolio.</h1><p>Two projects are currently seeded from public project documentation. The portfolio schema has capacity for the company’s additional project set without fabricating project content.</p></section><section className="section"><div className="project-grid">{projects.map(project=><Reveal key={project.slug}><ProjectCard project={project}/></Reveal>)}</div><div style={{marginTop:"10vh",borderTop:"1px solid var(--line)",paddingTop:"18px"}}><div className="eyebrow">Client data queue</div><p className="section-copy">{clientProjectSlots.length} additional project records are reserved for the approved project data sheet, photography and publication permissions.</p></div></section></main>; }
