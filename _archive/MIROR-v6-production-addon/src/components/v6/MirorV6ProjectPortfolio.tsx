"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Filter, Search } from "lucide-react";
import { motion } from "framer-motion";
import { projectRoute, searchProjects, uniqueProjectCategories, type ProjectRecord } from "@/lib/v6/miror-v6-contracts";

export interface MirorV6ProjectPortfolioProps { projects: ProjectRecord[]; preview?: boolean; }

function Card({ project, index }: { project: ProjectRecord; index: number }) {
  return <motion.a href={projectRoute(project)} className={`miror-portfolio-v6__card card-${index%4}`} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .12 }} transition={{ duration: .65, delay: Math.min(.2,index*.03) }}>
    <div className="miror-portfolio-v6__visual"><span>{project.cover?.alt || "Project media placeholder"}</span><i>Open ↗</i></div>
    <div className="miror-portfolio-v6__card-meta"><span>{project.category}</span><span>{project.location}</span></div>
    <h3>{project.title}</h3>
    <p>{project.summary}</p>
    <div className="miror-portfolio-v6__scope-mini">{project.scope.slice(0,3).map((item)=><span key={item}>{item}</span>)}</div>
  </motion.a>;
}

export function MirorV6ProjectPortfolio({ projects, preview = false }: MirorV6ProjectPortfolioProps) {
  const [query,setQuery]=useState("");
  const [category,setCategory]=useState("all");
  const categories=useMemo(()=>uniqueProjectCategories(projects),[projects]);
  const filtered=useMemo(()=>searchProjects(projects,query,category),[projects,query,category]);
  const shown=preview ? filtered.slice(0,6) : filtered;
  return <div className="miror-portfolio-v6">
    {!preview && <div className="miror-portfolio-v6__controls"><label className="miror-portfolio-v6__search"><Search size={17}/><input value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="Search projects, locations, disciplines…" aria-label="Search projects"/></label><div className="miror-portfolio-v6__filters"><Filter size={16}/>{categories.map((item)=><button className={category===item?"is-active":""} key={item} onClick={()=>setCategory(item)}>{item === "all" ? "All work" : item}</button>)}</div></div>}
    <div className="miror-portfolio-v6__summary"><span>{shown.length} record{shown.length===1?"":"s"}</span>{query&&<button onClick={()=>setQuery("")}>Clear search</button>}</div>
    <div className="miror-portfolio-v6__grid">{shown.map((project,index)=><Card key={project.slug} project={project} index={index}/>)}</div>
    {!preview&&shown.length===0&&<div className="miror-portfolio-v6__empty"><strong>No matching project record.</strong><p>Try another project type, location or discipline.</p></div>}
  </div>;
}


export function portfolioRule001(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule002(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule003(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule004(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule005(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule006(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule007(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule008(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule009(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || false);
}

export function portfolioRule010(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule011(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule012(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule013(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule014(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule015(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule016(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule017(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule018(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || false);
}

export function portfolioRule019(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule020(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule021(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule022(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule023(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule024(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule025(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule026(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule027(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || false);
}

export function portfolioRule028(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule029(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule030(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule031(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule032(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule033(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule034(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule035(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule036(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || false);
}

export function portfolioRule037(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule038(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule039(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule040(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule041(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule042(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule043(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule044(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule045(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || false);
}

export function portfolioRule046(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule047(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule048(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule049(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule050(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule051(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule052(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule053(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule054(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || false);
}

export function portfolioRule055(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule056(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule057(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule058(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule059(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule060(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule061(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule062(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule063(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || false);
}

export function portfolioRule064(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule065(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule066(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule067(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule068(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule069(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule070(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule071(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule072(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || false);
}

export function portfolioRule073(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule074(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule075(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule076(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule077(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule078(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule079(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule080(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule081(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || false);
}

export function portfolioRule082(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule083(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule084(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule085(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule086(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule087(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule088(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule089(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule090(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || false);
}

export function portfolioRule091(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule092(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule093(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule094(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule095(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule096(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule097(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule098(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule099(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || false);
}

export function portfolioRule100(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule101(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule102(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule103(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule104(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule105(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule106(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule107(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule108(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || false);
}

export function portfolioRule109(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule110(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule111(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule112(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule113(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule114(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule115(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule116(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule117(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || false);
}

export function portfolioRule118(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule119(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule120(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule121(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule122(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule123(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule124(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule125(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule126(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || false);
}

export function portfolioRule127(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule128(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule129(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule130(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule131(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule132(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule133(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule134(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule135(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || false);
}

export function portfolioRule136(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule137(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule138(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule139(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule140(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule141(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule142(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule143(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule144(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || false);
}

export function portfolioRule145(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule146(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule147(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule148(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule149(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule150(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule151(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule152(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule153(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || false);
}

export function portfolioRule154(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule155(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule156(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule157(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule158(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule159(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule160(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule161(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule162(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || false);
}

export function portfolioRule163(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule164(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule165(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule166(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule167(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule168(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule169(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule170(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule171(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || false);
}

export function portfolioRule172(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule173(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule174(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule175(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule176(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule177(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule178(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule179(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule180(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || false);
}

export function portfolioRule181(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule182(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule183(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule184(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule185(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule186(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule187(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule188(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule189(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || false);
}

export function portfolioRule190(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule191(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule192(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule193(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule194(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule195(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule196(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule197(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule198(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || false);
}

export function portfolioRule199(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}

export function portfolioRule200(project: ProjectRecord, query = ""): boolean {
  const text = `${project.title} ${project.category} ${project.location} ${project.country} ${project.summary}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return project.visibility !== "archived" && (!q || text.includes(q)) && (project.sortOrder >= 0 || true);
}
