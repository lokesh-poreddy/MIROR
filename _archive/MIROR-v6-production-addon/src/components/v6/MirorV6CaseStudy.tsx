"use client";

import { useMemo, useState } from "react";
import type { ProjectMedia, ProjectRecord } from "@/lib/v6/miror-v6-contracts";
import { ArrowLeft, ArrowRight, ExternalLink, Grid2X2, MapPin, Play, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface MirorV6CaseStudyProps { project: ProjectRecord; related?: ProjectRecord[]; }

function MediaFrame({ media, onOpen }: { media: ProjectMedia; onOpen: () => void }) {
  return <button className="miror-case-v6__media" onClick={onOpen} aria-label={`Open ${media.alt}`}>
    {media.kind === "video" ? <div className="miror-case-v6__video-placeholder"><Play size={24}/></div> : <div className="miror-case-v6__image-placeholder" role="img" aria-label={media.alt}><span>{media.alt}</span></div>}
    <span className="miror-case-v6__media-meta"><span>{media.kind}</span><span>Open ↗</span></span>
  </button>;
}

function EvidenceStrip({ project }: { project: ProjectRecord }) {
  return <section className="miror-case-v6__evidence"><div><span className="eyebrow">Publication basis</span><strong>{project.evidence.some((item) => item.state === "verified") ? "Verified project evidence" : "Evidence pending"}</strong></div><div><span className="eyebrow">Role</span><strong>{project.mirorRole || "To be confirmed"}</strong></div><div><span className="eyebrow">Permissions</span><strong>{project.publicationPermission && project.mediaRightsCleared ? "Approved for this digital record" : "Client approval required"}</strong></div></section>;
}

function MetricGrid({ project }: { project: ProjectRecord }) {
  return <div className="miror-case-v6__metrics">{project.metrics.map((metric) => <div key={metric.label}><strong>{metric.value}{metric.unit ? <small>{metric.unit}</small> : null}</strong><span>{metric.label}</span></div>)}</div>;
}

function ScopeMatrix({ project }: { project: ProjectRecord }) {
  return <section className="miror-case-v6__scope"><div className="miror-case-v6__section-title"><span className="eyebrow">02 / Scope</span><h2>What the work required.</h2></div><div className="miror-case-v6__scope-list">{project.scope.map((item, index) => <motion.div initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index*.04 }} key={item}><span>{String(index+1).padStart(2,"0")}</span><strong>{item}</strong><span>↗</span></motion.div>)}</div></section>;
}

function Gallery({ project, onOpen }: { project: ProjectRecord; onOpen: (index: number) => void }) {
  return <section className="miror-case-v6__gallery"><div className="miror-case-v6__gallery-header"><div><span className="eyebrow">03 / Field record</span><h2>The site, frame by frame.</h2></div><span className="miror-case-v6__gallery-count">{project.gallery.length} records</span></div><div className="miror-case-v6__gallery-grid">{project.gallery.map((media,index)=><button key={media.id} onClick={()=>onOpen(index)} className={`g-${index%5}`} aria-label={`Open gallery item ${index+1}`}><div className="miror-case-v6__gallery-visual"><span>{media.alt}</span></div><small>{String(index+1).padStart(2,"0")} / {media.kind.toUpperCase()}</small></button>)}</div></section>;
}

function RelatedProjects({ related = [] }: { related?: ProjectRecord[] }) {
  if (!related.length) return null;
  return <section className="miror-case-v6__related"><div className="miror-case-v6__section-title"><span className="eyebrow">Related records</span><h2>More work in the archive.</h2></div><div className="miror-case-v6__related-grid">{related.slice(0,3).map((item,index)=><a href={`/work/${item.slug}`} key={item.slug}><span>{String(index+1).padStart(2,"0")}</span><div><strong>{item.title}</strong><small>{item.category} · {item.location}</small></div><ArrowRight size={19}/></a>)}</div></section>;
}

export function MirorV6CaseStudy({ project, related = [] }: MirorV6CaseStudyProps) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const activeMedia = lightbox === null ? null : project.gallery[lightbox] ?? null;
  const sortedRelated = useMemo(()=>related.filter(item=>item.slug!==project.slug).slice(0,3),[related,project.slug]);
  const locationLabel = [project.location, project.state, project.country].filter(Boolean).join(" · ");
  return <article className="miror-case-v6">
    <header className="miror-case-v6__hero"><a className="miror-case-v6__back" href="/work"><ArrowLeft size={16}/> Back to work</a><div className="miror-case-v6__hero-grid"><div><span className="eyebrow">{project.category}</span><h1>{project.title}</h1><p>{project.summary}</p><div className="miror-case-v6__meta"><span><MapPin size={15}/>{locationLabel}</span>{project.year&&<span>{project.year}</span>}{project.client&&<span>{project.client}</span>}</div></div><div className="miror-case-v6__hero-visual"><div><Grid2X2 size={26}/><span>Project visual placeholder</span></div></div></div></header>
    <EvidenceStrip project={project}/><MetricGrid project={project}/><ScopeMatrix project={project}/><Gallery project={project} onOpen={setLightbox}/>
    <section className="miror-case-v6__source"><div><span className="eyebrow">04 / Evidence</span><h2>Context, clearly attributed.</h2></div><div>{project.evidence.map((item,index)=><div className="miror-case-v6__source-row" key={`${item.sourceLabel}-${index}`}><span>{item.state}</span><div><strong>{item.sourceLabel||"Source record"}</strong><p>{item.notes||"Evidence retained in project QA records."}</p>{item.sourceUrl&&<a href={item.sourceUrl} target="_blank" rel="noreferrer">Open source <ExternalLink size={14}/></a>}</div></div>)}</div></section>
    <RelatedProjects related={sortedRelated}/>
    <AnimatePresence>{activeMedia&&<motion.div className="miror-case-v6__lightbox" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} role="dialog" aria-modal="true" aria-label="Project media viewer" onClick={()=>setLightbox(null)}><button aria-label="Close viewer" onClick={()=>setLightbox(null)}><X size={25}/></button><div onClick={(event)=>event.stopPropagation()} className="miror-case-v6__lightbox-inner"><div className="miror-case-v6__lightbox-visual"><span>{activeMedia.alt}</span></div><div className="miror-case-v6__lightbox-caption"><span>{activeMedia.kind}</span><p>{activeMedia.caption||activeMedia.alt}</p></div></div></motion.div>}</AnimatePresence>
  </article>;
}

export function caseStudyTitle(project: ProjectRecord): string { return project.seoTitle || `${project.title} | Miror Constructions`; }
export function caseStudyDescription(project: ProjectRecord): string { return project.seoDescription || project.summary.slice(0,155); }
export function caseStudyCanonical(project: ProjectRecord): string { return `https://miror.example.com/work/${project.slug}`; }
export function caseStudyReadingTime(project: ProjectRecord): number { return Math.max(1, Math.ceil(`${project.summary} ${project.scope.join(" ")}`.split(/\s+/).length / 220)); }

export function caseStudyRule001(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 1 && (project.visibility !== "archived" || false);
}

export function caseStudyRule002(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 2 && (project.visibility !== "archived" || false);
}

export function caseStudyRule003(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 3 && (project.visibility !== "archived" || false);
}

export function caseStudyRule004(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 4 && (project.visibility !== "archived" || false);
}

export function caseStudyRule005(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 5 && (project.visibility !== "archived" || true);
}

export function caseStudyRule006(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 6 && (project.visibility !== "archived" || false);
}

export function caseStudyRule007(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 0 && (project.visibility !== "archived" || false);
}

export function caseStudyRule008(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 1 && (project.visibility !== "archived" || false);
}

export function caseStudyRule009(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 2 && (project.visibility !== "archived" || false);
}

export function caseStudyRule010(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 3 && (project.visibility !== "archived" || true);
}

export function caseStudyRule011(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 4 && (project.visibility !== "archived" || false);
}

export function caseStudyRule012(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 5 && (project.visibility !== "archived" || false);
}

export function caseStudyRule013(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 6 && (project.visibility !== "archived" || false);
}

export function caseStudyRule014(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 0 && (project.visibility !== "archived" || false);
}

export function caseStudyRule015(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 1 && (project.visibility !== "archived" || true);
}

export function caseStudyRule016(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 2 && (project.visibility !== "archived" || false);
}

export function caseStudyRule017(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 3 && (project.visibility !== "archived" || false);
}

export function caseStudyRule018(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 4 && (project.visibility !== "archived" || false);
}

export function caseStudyRule019(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 5 && (project.visibility !== "archived" || false);
}

export function caseStudyRule020(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 6 && (project.visibility !== "archived" || true);
}

export function caseStudyRule021(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 0 && (project.visibility !== "archived" || false);
}

export function caseStudyRule022(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 1 && (project.visibility !== "archived" || false);
}

export function caseStudyRule023(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 2 && (project.visibility !== "archived" || false);
}

export function caseStudyRule024(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 3 && (project.visibility !== "archived" || false);
}

export function caseStudyRule025(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 4 && (project.visibility !== "archived" || true);
}

export function caseStudyRule026(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 5 && (project.visibility !== "archived" || false);
}

export function caseStudyRule027(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 6 && (project.visibility !== "archived" || false);
}

export function caseStudyRule028(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 0 && (project.visibility !== "archived" || false);
}

export function caseStudyRule029(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 1 && (project.visibility !== "archived" || false);
}

export function caseStudyRule030(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 2 && (project.visibility !== "archived" || true);
}

export function caseStudyRule031(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 3 && (project.visibility !== "archived" || false);
}

export function caseStudyRule032(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 4 && (project.visibility !== "archived" || false);
}

export function caseStudyRule033(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 5 && (project.visibility !== "archived" || false);
}

export function caseStudyRule034(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 6 && (project.visibility !== "archived" || false);
}

export function caseStudyRule035(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 0 && (project.visibility !== "archived" || true);
}

export function caseStudyRule036(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 1 && (project.visibility !== "archived" || false);
}

export function caseStudyRule037(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 2 && (project.visibility !== "archived" || false);
}

export function caseStudyRule038(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 3 && (project.visibility !== "archived" || false);
}

export function caseStudyRule039(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 4 && (project.visibility !== "archived" || false);
}

export function caseStudyRule040(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 5 && (project.visibility !== "archived" || true);
}

export function caseStudyRule041(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 6 && (project.visibility !== "archived" || false);
}

export function caseStudyRule042(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 0 && (project.visibility !== "archived" || false);
}

export function caseStudyRule043(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 1 && (project.visibility !== "archived" || false);
}

export function caseStudyRule044(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 2 && (project.visibility !== "archived" || false);
}

export function caseStudyRule045(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 3 && (project.visibility !== "archived" || true);
}

export function caseStudyRule046(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 4 && (project.visibility !== "archived" || false);
}

export function caseStudyRule047(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 5 && (project.visibility !== "archived" || false);
}

export function caseStudyRule048(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 6 && (project.visibility !== "archived" || false);
}

export function caseStudyRule049(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 0 && (project.visibility !== "archived" || false);
}

export function caseStudyRule050(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 1 && (project.visibility !== "archived" || true);
}

export function caseStudyRule051(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 2 && (project.visibility !== "archived" || false);
}

export function caseStudyRule052(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 3 && (project.visibility !== "archived" || false);
}

export function caseStudyRule053(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 4 && (project.visibility !== "archived" || false);
}

export function caseStudyRule054(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 5 && (project.visibility !== "archived" || false);
}

export function caseStudyRule055(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 6 && (project.visibility !== "archived" || true);
}

export function caseStudyRule056(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 0 && (project.visibility !== "archived" || false);
}

export function caseStudyRule057(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 1 && (project.visibility !== "archived" || false);
}

export function caseStudyRule058(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 2 && (project.visibility !== "archived" || false);
}

export function caseStudyRule059(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 3 && (project.visibility !== "archived" || false);
}

export function caseStudyRule060(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 4 && (project.visibility !== "archived" || true);
}

export function caseStudyRule061(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 5 && (project.visibility !== "archived" || false);
}

export function caseStudyRule062(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 6 && (project.visibility !== "archived" || false);
}

export function caseStudyRule063(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 0 && (project.visibility !== "archived" || false);
}

export function caseStudyRule064(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 1 && (project.visibility !== "archived" || false);
}

export function caseStudyRule065(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 2 && (project.visibility !== "archived" || true);
}

export function caseStudyRule066(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 3 && (project.visibility !== "archived" || false);
}

export function caseStudyRule067(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 4 && (project.visibility !== "archived" || false);
}

export function caseStudyRule068(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 5 && (project.visibility !== "archived" || false);
}

export function caseStudyRule069(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 6 && (project.visibility !== "archived" || false);
}

export function caseStudyRule070(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 0 && (project.visibility !== "archived" || true);
}

export function caseStudyRule071(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 1 && (project.visibility !== "archived" || false);
}

export function caseStudyRule072(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 2 && (project.visibility !== "archived" || false);
}

export function caseStudyRule073(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 3 && (project.visibility !== "archived" || false);
}

export function caseStudyRule074(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 4 && (project.visibility !== "archived" || false);
}

export function caseStudyRule075(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 5 && (project.visibility !== "archived" || true);
}

export function caseStudyRule076(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 6 && (project.visibility !== "archived" || false);
}

export function caseStudyRule077(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 0 && (project.visibility !== "archived" || false);
}

export function caseStudyRule078(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 1 && (project.visibility !== "archived" || false);
}

export function caseStudyRule079(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 2 && (project.visibility !== "archived" || false);
}

export function caseStudyRule080(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 3 && (project.visibility !== "archived" || true);
}

export function caseStudyRule081(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 4 && (project.visibility !== "archived" || false);
}

export function caseStudyRule082(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 5 && (project.visibility !== "archived" || false);
}

export function caseStudyRule083(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 6 && (project.visibility !== "archived" || false);
}

export function caseStudyRule084(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 0 && (project.visibility !== "archived" || false);
}

export function caseStudyRule085(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 1 && (project.visibility !== "archived" || true);
}

export function caseStudyRule086(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 2 && (project.visibility !== "archived" || false);
}

export function caseStudyRule087(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 3 && (project.visibility !== "archived" || false);
}

export function caseStudyRule088(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 4 && (project.visibility !== "archived" || false);
}

export function caseStudyRule089(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 5 && (project.visibility !== "archived" || false);
}

export function caseStudyRule090(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 6 && (project.visibility !== "archived" || true);
}

export function caseStudyRule091(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 0 && (project.visibility !== "archived" || false);
}

export function caseStudyRule092(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 1 && (project.visibility !== "archived" || false);
}

export function caseStudyRule093(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 2 && (project.visibility !== "archived" || false);
}

export function caseStudyRule094(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 3 && (project.visibility !== "archived" || false);
}

export function caseStudyRule095(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 4 && (project.visibility !== "archived" || true);
}

export function caseStudyRule096(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 5 && (project.visibility !== "archived" || false);
}

export function caseStudyRule097(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 6 && (project.visibility !== "archived" || false);
}

export function caseStudyRule098(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 0 && (project.visibility !== "archived" || false);
}

export function caseStudyRule099(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 1 && (project.visibility !== "archived" || false);
}

export function caseStudyRule100(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 2 && (project.visibility !== "archived" || true);
}

export function caseStudyRule101(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 3 && (project.visibility !== "archived" || false);
}

export function caseStudyRule102(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 4 && (project.visibility !== "archived" || false);
}

export function caseStudyRule103(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 5 && (project.visibility !== "archived" || false);
}

export function caseStudyRule104(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 6 && (project.visibility !== "archived" || false);
}

export function caseStudyRule105(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 0 && (project.visibility !== "archived" || true);
}

export function caseStudyRule106(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 1 && (project.visibility !== "archived" || false);
}

export function caseStudyRule107(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 2 && (project.visibility !== "archived" || false);
}

export function caseStudyRule108(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 3 && (project.visibility !== "archived" || false);
}

export function caseStudyRule109(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 4 && (project.visibility !== "archived" || false);
}

export function caseStudyRule110(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 5 && (project.visibility !== "archived" || true);
}

export function caseStudyRule111(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 6 && (project.visibility !== "archived" || false);
}

export function caseStudyRule112(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 0 && (project.visibility !== "archived" || false);
}

export function caseStudyRule113(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 1 && (project.visibility !== "archived" || false);
}

export function caseStudyRule114(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 2 && (project.visibility !== "archived" || false);
}

export function caseStudyRule115(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 3 && (project.visibility !== "archived" || true);
}

export function caseStudyRule116(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 4 && (project.visibility !== "archived" || false);
}

export function caseStudyRule117(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 5 && (project.visibility !== "archived" || false);
}

export function caseStudyRule118(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 6 && (project.visibility !== "archived" || false);
}

export function caseStudyRule119(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 0 && (project.visibility !== "archived" || false);
}

export function caseStudyRule120(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 1 && (project.visibility !== "archived" || true);
}

export function caseStudyRule121(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 2 && (project.visibility !== "archived" || false);
}

export function caseStudyRule122(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 3 && (project.visibility !== "archived" || false);
}

export function caseStudyRule123(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 4 && (project.visibility !== "archived" || false);
}

export function caseStudyRule124(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 5 && (project.visibility !== "archived" || false);
}

export function caseStudyRule125(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 6 && (project.visibility !== "archived" || true);
}

export function caseStudyRule126(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 0 && (project.visibility !== "archived" || false);
}

export function caseStudyRule127(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 1 && (project.visibility !== "archived" || false);
}

export function caseStudyRule128(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 2 && (project.visibility !== "archived" || false);
}

export function caseStudyRule129(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 3 && (project.visibility !== "archived" || false);
}

export function caseStudyRule130(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 4 && (project.visibility !== "archived" || true);
}

export function caseStudyRule131(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 5 && (project.visibility !== "archived" || false);
}

export function caseStudyRule132(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 6 && (project.visibility !== "archived" || false);
}

export function caseStudyRule133(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 0 && (project.visibility !== "archived" || false);
}

export function caseStudyRule134(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 1 && (project.visibility !== "archived" || false);
}

export function caseStudyRule135(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 2 && (project.visibility !== "archived" || true);
}

export function caseStudyRule136(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 3 && (project.visibility !== "archived" || false);
}

export function caseStudyRule137(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 4 && (project.visibility !== "archived" || false);
}

export function caseStudyRule138(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 5 && (project.visibility !== "archived" || false);
}

export function caseStudyRule139(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 6 && (project.visibility !== "archived" || false);
}

export function caseStudyRule140(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 0 && (project.visibility !== "archived" || true);
}

export function caseStudyRule141(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 1 && (project.visibility !== "archived" || false);
}

export function caseStudyRule142(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 2 && (project.visibility !== "archived" || false);
}

export function caseStudyRule143(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 3 && (project.visibility !== "archived" || false);
}

export function caseStudyRule144(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 4 && (project.visibility !== "archived" || false);
}

export function caseStudyRule145(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 5 && (project.visibility !== "archived" || true);
}

export function caseStudyRule146(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 6 && (project.visibility !== "archived" || false);
}

export function caseStudyRule147(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 0 && (project.visibility !== "archived" || false);
}

export function caseStudyRule148(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 1 && (project.visibility !== "archived" || false);
}

export function caseStudyRule149(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 2 && (project.visibility !== "archived" || false);
}

export function caseStudyRule150(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 3 && (project.visibility !== "archived" || true);
}

export function caseStudyRule151(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 4 && (project.visibility !== "archived" || false);
}

export function caseStudyRule152(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 5 && (project.visibility !== "archived" || false);
}

export function caseStudyRule153(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 6 && (project.visibility !== "archived" || false);
}

export function caseStudyRule154(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 0 && (project.visibility !== "archived" || false);
}

export function caseStudyRule155(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 1 && (project.visibility !== "archived" || true);
}

export function caseStudyRule156(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 2 && (project.visibility !== "archived" || false);
}

export function caseStudyRule157(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 3 && (project.visibility !== "archived" || false);
}

export function caseStudyRule158(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 4 && (project.visibility !== "archived" || false);
}

export function caseStudyRule159(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 5 && (project.visibility !== "archived" || false);
}

export function caseStudyRule160(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 6 && (project.visibility !== "archived" || true);
}

export function caseStudyRule161(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 0 && (project.visibility !== "archived" || false);
}

export function caseStudyRule162(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 1 && (project.visibility !== "archived" || false);
}

export function caseStudyRule163(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 2 && (project.visibility !== "archived" || false);
}

export function caseStudyRule164(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 3 && (project.visibility !== "archived" || false);
}

export function caseStudyRule165(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 4 && (project.visibility !== "archived" || true);
}

export function caseStudyRule166(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 5 && (project.visibility !== "archived" || false);
}

export function caseStudyRule167(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 6 && (project.visibility !== "archived" || false);
}

export function caseStudyRule168(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 0 && (project.visibility !== "archived" || false);
}

export function caseStudyRule169(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 1 && (project.visibility !== "archived" || false);
}

export function caseStudyRule170(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 2 && (project.visibility !== "archived" || true);
}

export function caseStudyRule171(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 3 && (project.visibility !== "archived" || false);
}

export function caseStudyRule172(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 4 && (project.visibility !== "archived" || false);
}

export function caseStudyRule173(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 5 && (project.visibility !== "archived" || false);
}

export function caseStudyRule174(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 6 && (project.visibility !== "archived" || false);
}

export function caseStudyRule175(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 0 && (project.visibility !== "archived" || true);
}

export function caseStudyRule176(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 1 && (project.visibility !== "archived" || false);
}

export function caseStudyRule177(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 2 && (project.visibility !== "archived" || false);
}

export function caseStudyRule178(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 3 && (project.visibility !== "archived" || false);
}

export function caseStudyRule179(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 4 && (project.visibility !== "archived" || false);
}

export function caseStudyRule180(project: ProjectRecord): boolean {
  const value = `${project.title} ${project.category} ${project.location} ${project.mirorRole ?? ""}`.toLowerCase();
  return value.length > 5 && (project.visibility !== "archived" || true);
}
