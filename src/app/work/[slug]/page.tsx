import { notFound } from "next/navigation";
import Link from "next/link";
import { getProject, projects } from "@/data/projects";
import { Reveal } from "@/components/motion-reveal";

export function generateStaticParams(){ return projects.map(project=>({slug:project.slug})); }

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  return <main className="page-shell"><section className="project-hero"><div><div className="eyebrow">{project.category}</div><Reveal><h1>{project.title}</h1></Reveal><p className="section-copy">{project.summary}</p><div className="meta-list"><div className="meta-item"><span>Location</span>{project.location ?? "Pending"}</div><div className="meta-item"><span>Role</span>{project.role ?? "Pending"}</div></div></div><div className="project-hero-image"><img src={project.media ?? "/placeholder.svg"} alt="" /></div></section><section className="section"><div className="section-grid"><div className="section-kicker">Scope</div><div><h2>Documented work, presented with context.</h2><ul style={{padding:0,listStyle:"none",marginTop:"30px"}}>{(project.scope ?? []).map(item=><li key={item} style={{padding:"16px 0",borderTop:"1px solid var(--line)"}}>{item}</li>)}</ul><Link href="/work" className="button">Back to all work</Link></div></div></section></main>;
}
