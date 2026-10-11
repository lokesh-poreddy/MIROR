import Link from "next/link";
import { notFound } from "next/navigation";
import { capabilityGroups } from "@/data/miror-upgrade";
const deep={
 civil:["Earthwork","Concrete works","Civil structures","Site execution"],
 infrastructure:["Irrigation","Canal works","CM & CD works","Infrastructure packages"],
 structural:["RCC","Structural concrete","Formwork coordination","Site controls"],
 formwork:["Aluminium formwork","Cycle planning","RCC coordination","Site execution"],
 residential:["Residential execution","RCC works","Formwork","Project coordination"],
} as const;
export function generateStaticParams(){return capabilityGroups.map(item=>({slug:item.id}))}
export default async function CapabilityDetailPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const item=capabilityGroups.find(x=>x.id===slug);if(!item)notFound();const details=deep[slug as keyof typeof deep]??item.links;return <main className="v12-shell v12-page"><section className="v12-page-hero"><div className="v12-container v12-page-hero__grid"><div><span className="v12-kicker">Capability / {item.number}</span></div><div><h1 className="v12-display">{item.title}</h1><p>{item.description}</p></div></div></section><section className="v12-section"><div className="v12-container"><div className="v12-section__head"><div><span className="v12-kicker">Working scope</span></div><div className="v12-section__head-copy"><h2>Structured around real execution language.</h2></div></div><div className="v12-list">{details.map((detail,i)=><div className="v12-list__row" key={detail}><span>{String(i+1).padStart(2,"0")}</span><strong>{detail}</strong><small>Approved detail can expand this module</small></div>)}</div><div style={{marginTop:"2rem",display:"flex",gap:".6rem",flexWrap:"wrap"}}><Link className="v12-button v12-button--solid" href="/work">See documented work ↗</Link><Link className="v12-button" href="/contact">Discuss this capability ↗</Link></div></div></section></main>}
