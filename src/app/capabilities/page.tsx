import { Reveal } from "@/components/motion-reveal";

export const metadata = { title: "Capabilities" };

const capabilities = [
  ["01", "Irrigation & canal infrastructure", "Civil execution associated with canal systems, CM & CD works and related structures."],
  ["02", "RCC & structural works", "Reinforced concrete walls, slabs and structural site execution."],
  ["03", "Aluminium formwork", "Formwork execution documented in a major residential development project."],
  ["04", "Civil site execution", "Earthwork, concrete and project-site construction activities, subject to client confirmation of the final service list."],
];

export default function CapabilitiesPage(){ return <main className="page-shell"><section className="page-hero"><div className="eyebrow">Capabilities</div><h1>Construction capability, expressed through the work.</h1><p>A structured service page that starts with publicly evidenced strengths and can expand as the company supplies its approved capability statement.</p></section><section className="section"><div className="project-grid">{capabilities.map(([n,t,d])=><Reveal key={n}><article className="project-card"><div style={{padding:"35px 0",borderTop:"1px solid var(--line)"}}><div className="eyebrow">{n}</div><h3>{t}</h3><p className="section-copy">{d}</p></div></article></Reveal>)}</div></section></main>; }
