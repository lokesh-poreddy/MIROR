"use client";

import { AnimatePresence, motion, useInView, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronDown, ChevronLeft, ChevronRight, Expand, ExternalLink, MapPin, Pause, Play, ShieldCheck, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { buildSeo, evidenceLabel, formatMetric, getProjectKindLabel, isProjectPublishable, type EvidenceStatus, type MetricDefinition, type ProjectKind } from "@/lib/miror-design-system";

export interface StoryMedia { id:string; src:string; alt:string; caption?:string; width:number; height:number; type?:"image"|"video"; poster?:string; }
export interface StoryMilestone { id:string; year?:string; title:string; description:string; }
export interface StoryMetric extends MetricDefinition { }
export interface ProjectStory { slug:string; title:string; subtitle?:string; category:ProjectKind; location:string; region?:string; year?:string; status:EvidenceStatus; sourceDocument?:string|null; publicationPermission:boolean; client?:string; principalContractor?:string; mirorRole:string; summary:string; description:string; scope:string[]; disciplines:string[]; metrics:StoryMetric[]; gallery:StoryMedia[]; milestones:StoryMilestone[]; relatedSlugs:string[]; previousSlug?:string; nextSlug?:string; cover:StoryMedia; film?:StoryMedia; }
export interface ProjectStoryEngineProps { project:ProjectStory; related?:ProjectStory[]; className?:string; }

function usePrefersReducedMotion():boolean { const [value,setValue]=useState(false); useEffect(()=>{const media=window.matchMedia("(prefers-reduced-motion: reduce)");const update=()=>setValue(media.matches);update();media.addEventListener("change",update);return()=>media.removeEventListener("change",update);},[]);return value; }
function SectionLabel({index,label,dark=false}:{index:string;label:string;dark?:boolean}){return <p className={`text-[10px] uppercase tracking-[.18em] ${dark?"text-white/35":"text-black/35"}`}><span className="mr-3 font-mono">{index}</span>{label}</p>;}
function InfoRow({label,value,dark=false}:{label:string;value?:string;dark?:boolean}){if(!value)return null;return <div className={`flex items-start justify-between gap-6 border-t py-3 text-sm ${dark?"border-white/10 text-white/65":"border-black/10 text-black/60"}`}><span className="text-[10px] uppercase tracking-[.13em] opacity-45">{label}</span><span className="max-w-[65%] text-right">{value}</span></div>;}
function MetricRow({metric,index,dark=false}:{metric:MetricDefinition;index:number;dark?:boolean}){return <motion.div initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-12% 0px"}} transition={{duration:.48,delay:index*.04}} className={`border-t py-5 ${dark?"border-white/12":"border-black/12"}`}><div className="flex items-end justify-between gap-8"><span className={`text-[10px] uppercase tracking-[.15em] ${dark?"text-white/42":"text-black/42"}`}>{metric.label}</span><span className={`text-2xl tracking-[-.035em] ${dark?"text-white":"text-black"}`}>{formatMetric(metric)}</span></div>{metric.source?<p className={`mt-2 text-[9px] uppercase tracking-[.12em] ${dark?"text-white/25":"text-black/25"}`}>Source · {metric.source}</p>:null}</motion.div>;}
function ScopeGrid({items}:{items:string[]}){return <div className="grid md:grid-cols-2">{items.map((item,index)=><motion.div key={`${item}-${index}`} className="flex gap-4 border-t border-black/10 py-4" initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.4,delay:index*.025}}><span className="font-mono text-[9px] text-black/30">{String(index+1).padStart(2,"0")}</span><span className="text-sm leading-6">{item}</span></motion.div>)}</div>;}
function Timeline({items}:{items:StoryMilestone[]}){return <div className="relative border-l border-black/15 pl-7">{items.map((item,index)=><motion.div key={item.id} className="relative pb-10 last:pb-0" initial={{opacity:0,x:14}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:.46,delay:index*.045}}><span className="absolute -left-[34px] top-1 h-2 w-2 rounded-full bg-[#b58a37] ring-4 ring-[#ebe6dc]"/><span className="font-mono text-[9px] uppercase tracking-[.15em] text-black/35">{item.year??"Milestone"}</span><h3 className="mt-2 text-xl tracking-[-.02em]">{item.title}</h3><p className="mt-2 max-w-xl text-sm leading-6 text-black/55">{item.description}</p></motion.div>)}</div>;}
function GalleryGrid({items,onOpen}:{items:StoryMedia[];onOpen:(index:number)=>void}){return <div className="grid grid-cols-2 gap-2 md:grid-cols-12 md:gap-4">{items.map((item,index)=>{const span=index===0?"col-span-2 md:col-span-8":index===1?"col-span-2 md:col-span-4":index%4===0?"col-span-2 md:col-span-7":"col-span-1 md:col-span-5";return <button key={item.id} onClick={()=>onOpen(index)} className={`${span} group relative overflow-hidden text-left`} aria-label={`Open ${item.alt}`}><div className="relative aspect-[4/3] bg-black/5"><Image src={item.src} alt={item.alt} fill sizes="(max-width:900px) 50vw,60vw" className="object-cover transition duration-700 ease-out group-hover:scale-[1.035]"/></div><span className="absolute inset-0 bg-black/0 transition group-hover:bg-black/15"/><span className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-black/75 px-3 py-1.5 text-[9px] uppercase tracking-[.13em] text-white opacity-0 transition group-hover:opacity-100"><Expand size={11}/> Open</span></button>})}</div>;}
function Lightbox({items,index,onClose,onChange}:{items:StoryMedia[];index:number|null;onClose:()=>void;onChange:(index:number)=>void}){const current=index===null?null:items[index];useEffect(()=>{if(index===null)return;document.body.style.overflow="hidden";const key=(e:KeyboardEvent)=>{if(e.key==="Escape")onClose();if(e.key==="ArrowRight")onChange((index+1)%items.length);if(e.key==="ArrowLeft")onChange((index-1+items.length)%items.length);};window.addEventListener("keydown",key);return()=>{document.body.style.overflow="";window.removeEventListener("keydown",key);};},[index,items.length,onChange,onClose]);return <AnimatePresence>{current?<motion.div data-miror-overlay className="fixed inset-0 z-[210] bg-black/94 p-4 md:p-8" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} role="dialog" aria-modal="true" aria-label="Project media viewer"><button onClick={onClose} aria-label="Close media viewer" className="absolute right-4 top-4 z-20 rounded-full bg-white/10 p-3 text-white backdrop-blur"><X size={19}/></button><div className="flex h-full items-center justify-center"><div className="relative h-full w-full max-w-7xl"><Image src={current.src} alt={current.alt} fill sizes="100vw" className="object-contain" priority/></div></div><button onClick={()=>onChange((index!-1+items.length)%items.length)} className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white" aria-label="Previous image"><ChevronLeft/></button><button onClick={()=>onChange((index!+1)%items.length)} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white" aria-label="Next image"><ChevronRight/></button><div className="absolute bottom-4 left-4 right-4 text-white md:bottom-8 md:left-8"><p className="font-mono text-[9px] tracking-[.16em] text-white/45">{String(index!+1).padStart(2,"0")} / {String(items.length).padStart(2,"0")}</p>{current.caption?<p className="mt-2 max-w-2xl text-sm text-white/65">{current.caption}</p>:null}</div></motion.div>:null}</AnimatePresence>;}
function ProgressRail({sectionIds}:{sectionIds:string[]}){const [active,setActive]=useState(0);useEffect(()=>{const update=()=>{let index=0;sectionIds.forEach((id,i)=>{const el=document.getElementById(id);if(el&&el.getBoundingClientRect().top<=window.innerHeight*.46)index=i;});setActive(index);};window.addEventListener("scroll",update,{passive:true});update();return()=>window.removeEventListener("scroll",update);},[sectionIds]);return <aside className="fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 lg:block"><div className="flex flex-col gap-2">{sectionIds.map((id,i)=><a key={id} href={`#${id}`} className="group flex items-center gap-2" aria-label={`Go to ${id}`}><span className={`h-1 w-4 rounded-full transition ${active===i?"bg-[#b58a37]":"bg-black/15 group-hover:bg-black/30"}`}/><span className="pointer-events-none whitespace-nowrap text-[8px] uppercase tracking-[.14em] text-black/0 transition group-hover:text-black/45">{id.replace(/-/g," ")}</span></a>)}</div></aside>;}

export default function MirorProjectStoryEngine({project,related=[],className=""}:ProjectStoryEngineProps){
  const reduced=usePrefersReducedMotion();
  const [lightbox,setLightbox]=useState<number|null>(null);
  const [filmPlaying,setFilmPlaying]=useState(false);
  const heroRef=useRef<HTMLDivElement|null>(null);
  const filmRef=useRef<HTMLVideoElement|null>(null);
  const {scrollYProgress}=useScroll({target:heroRef,offset:["start start","end start"]});
  const y=useSpring(useTransform(scrollYProgress,[0,1],[0,reduced?0:120]),{stiffness:55,damping:22});
  const scale=useTransform(scrollYProgress,[0,1],[1.02,reduced?1.02:1.1]);
  const publishable=isProjectPublishable({permission:project.publicationPermission,evidence:project.status,sourceDocument:project.sourceDocument,hasRole:Boolean(project.mirorRole),hasScope:project.scope.length>0,hasMedia:project.gallery.length>0});
  const seo=buildSeo(project.title,project.summary);
  const sectionIds=useMemo(()=>["overview","metrics","scope","disciplines","field-film","gallery","timeline","related","cta"],[ ]);
  const openGallery=useCallback((index:number)=>setLightbox(index),[]);
  const closeGallery=useCallback(()=>setLightbox(null),[]);
  const changeGallery=useCallback((index:number)=>setLightbox(index),[]);
  const toggleFilm=useCallback(()=>{const video=filmRef.current;if(!video)return;if(video.paused){void video.play();setFilmPlaying(true);}else{video.pause();setFilmPlaying(false);}},[]);
  return <article className={`bg-[#f4f1ea] text-[#111214] ${className}`} data-project={project.slug} data-seo-title={seo.title}>
    <ProgressRail sectionIds={sectionIds}/>
    <section ref={heroRef} className="relative min-h-[92svh] overflow-hidden bg-[#111214] text-[#f4f1ea]"><motion.div style={{y,scale}} className="absolute inset-[-8%]"><Image src={project.cover.src} alt={project.cover.alt} fill priority sizes="100vw" className="object-cover"/></motion.div><div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10"/><div className="relative mx-auto flex min-h-[92svh] max-w-[1440px] flex-col justify-between px-6 py-28 md:px-10 lg:px-16"><div className="flex items-center justify-between"><Link href="/work" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[.16em] text-white/60 hover:text-white"><ArrowLeft size={14}/> Our work</Link><span className="font-mono text-[9px] uppercase tracking-[.16em] text-white/42">{evidenceLabel(project.status)}</span></div><div className="grid gap-10 lg:grid-cols-[1fr_340px] lg:items-end"><div><p className="text-[10px] uppercase tracking-[.18em] text-white/48">{getProjectKindLabel(project.category)} · {project.location}</p><h1 className="mt-5 max-w-6xl text-[clamp(3.4rem,9.5vw,10rem)] leading-[.86] tracking-[-.07em]">{project.title}</h1>{project.subtitle?<p className="mt-7 max-w-xl text-base leading-7 text-white/65 md:text-lg">{project.subtitle}</p>:null}</div><div className="border-l border-white/15 pl-6"><p className="text-[9px] uppercase tracking-[.17em] text-white/35">Miror role</p><p className="mt-3 text-sm leading-6 text-white/67">{project.mirorRole}</p>{project.year?<p className="mt-5 font-mono text-[9px] uppercase tracking-[.15em] text-white/35">{project.year}</p>:null}</div></div></div></section>
    <section id="overview" className="border-b border-black/10 bg-[#f4f1ea]"><div className="mx-auto grid max-w-[1440px] gap-12 px-6 py-20 md:px-10 lg:grid-cols-[.36fr_1fr] lg:px-16 lg:py-28"><div><SectionLabel index="01" label="At a glance"/><div className="mt-9"><InfoRow label="Location" value={`${project.location}${project.region?`, ${project.region}`:""}`}/><InfoRow label="Client" value={project.client}/><InfoRow label="Principal contractor" value={project.principalContractor}/><InfoRow label="Status" value={evidenceLabel(project.status)}/></div></div><div><h2 className="max-w-5xl text-[clamp(2rem,4.8vw,5.4rem)] leading-[.95] tracking-[-.055em]">{project.summary}</h2><p className="mt-8 max-w-2xl text-base leading-7 text-black/55">{project.description}</p></div></div></section>
    <section id="metrics" className="bg-[#ebe6dc]"><div className="mx-auto grid max-w-[1440px] gap-12 px-6 py-20 md:px-10 lg:grid-cols-[.36fr_1fr] lg:px-16 lg:py-28"><div><SectionLabel index="02" label="Measured context"/><ShieldCheck className="mt-8" size={24} strokeWidth={1.3}/><p className="mt-4 max-w-xs text-xs leading-5 text-black/42">Publish only metrics backed by evidence or written client confirmation.</p></div><div className="grid gap-1 md:grid-cols-2">{project.metrics.filter(metric=>metric.publishable).map((metric,index)=><MetricRow key={metric.id} metric={metric} index={index}/>)}</div></div></section>
    <section id="scope" className="bg-[#f4f1ea]"><div className="mx-auto grid max-w-[1440px] gap-12 px-6 py-20 md:px-10 lg:grid-cols-[.36fr_1fr] lg:px-16 lg:py-28"><div><SectionLabel index="03" label="Scope"/><p className="mt-8 max-w-xs text-sm leading-6 text-black/48">Separate Miror's documented package from the wider project narrative.</p></div><div><h2 className="max-w-4xl text-[clamp(2rem,4vw,4.8rem)] leading-[.97] tracking-[-.05em]">Built around the actual work package.</h2><div className="mt-10"><ScopeGrid items={project.scope}/></div></div></div></section>
    <section id="disciplines" className="bg-[#111214] text-[#f4f1ea]"><div className="mx-auto grid max-w-[1440px] gap-12 px-6 py-20 md:px-10 lg:grid-cols-[.36fr_1fr] lg:px-16 lg:py-28"><div><SectionLabel index="04" label="Disciplines" dark/></div><div className="grid md:grid-cols-2">{project.disciplines.map((item,index)=><motion.div key={`${item}-${index}`} className="flex items-center justify-between border-t border-white/12 py-5" initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.4,delay:index*.03}}><span className="text-xl tracking-[-.02em]">{item}</span><span className="font-mono text-[9px] text-white/28">{String(index+1).padStart(2,"0")}</span></motion.div>)}</div></div></section>
    {project.film?<section id="field-film" className="bg-[#111214] text-white"><div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 lg:px-16 lg:py-24"><div className="relative overflow-hidden bg-black"><video ref={filmRef} poster={project.film.poster} src={project.film.src} className="aspect-video w-full object-cover" preload="metadata" playsInline muted loop aria-label={project.film.alt}/><button onClick={toggleFilm} className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/45 px-4 py-2 text-[10px] uppercase tracking-[.14em] backdrop-blur-md">{filmPlaying?<Pause size={14}/>:<Play size={14}/>} {filmPlaying?"Pause":"Play"}</button></div>{project.film.caption?<p className="mt-3 text-xs text-white/38">{project.film.caption}</p>:null}</div></section>:null}
    <section id="gallery" className="bg-[#f4f1ea]"><div className="mx-auto max-w-[1440px] px-6 py-20 md:px-10 lg:px-16 lg:py-28"><div className="mb-12 flex items-end justify-between"><div><SectionLabel index="05" label="Field gallery"/><h2 className="mt-4 text-[clamp(2rem,4vw,4.4rem)] leading-none tracking-[-.05em]">Site evidence, frame by frame.</h2></div><span className="font-mono text-[9px] uppercase tracking-[.14em] text-black/30">{project.gallery.length} frames</span></div>{project.gallery.length?<GalleryGrid items={project.gallery} onOpen={openGallery}/>:<div className="grid min-h-64 place-items-center border border-dashed border-black/15 text-sm text-black/40">Media pending approval.</div>}</div></section>
    {project.milestones.length?<section id="timeline" className="bg-[#ebe6dc]"><div className="mx-auto grid max-w-[1440px] gap-12 px-6 py-20 md:px-10 lg:grid-cols-[.36fr_1fr] lg:px-16 lg:py-28"><div><SectionLabel index="06" label="Timeline"/></div><Timeline items={project.milestones}/></div></section>:null}
    <section className="bg-[#f4f1ea]"><div className="mx-auto max-w-[1440px] px-6 py-12 md:px-10 lg:px-16"><div className={`rounded-2xl border p-5 ${publishable?"border-[#3f7657]/20 bg-[#3f7657]/5":"border-[#a36e23]/20 bg-[#a36e23]/6"}`}><div className="flex items-start gap-3"><ShieldCheck size={18} className="mt-0.5 shrink-0"/><p className="text-sm leading-6 text-black/55">{publishable?"This record passes the current publication gates in the frontend model.":"This record is not yet ready for public indexing. Complete evidence, scope, media and publication-permission gates before launch."}</p></div></div></div></section>
    {related.length?<section id="related" className="border-t border-black/10 bg-[#f4f1ea]"><div className="mx-auto max-w-[1440px] px-6 py-20 md:px-10 lg:px-16 lg:py-28"><div className="mb-12 flex items-end justify-between"><div><SectionLabel index="07" label="Related work"/><h2 className="mt-4 text-[clamp(2rem,4vw,4.3rem)] leading-none tracking-[-.05em]">Continue through the portfolio.</h2></div><Link href="/work" className="hidden items-center gap-2 text-[10px] uppercase tracking-[.14em] md:inline-flex">All work <ArrowUpRight size={14}/></Link></div><div className="grid gap-6 md:grid-cols-2">{related.map(item=><Link key={item.slug} href={`/work/${item.slug}`} className="group"><div className="relative aspect-[4/2.6] overflow-hidden bg-black/5"><Image src={item.cover.src} alt={item.cover.alt} fill sizes="(max-width:900px) 100vw,50vw" className="object-cover transition duration-700 group-hover:scale-[1.035]"/></div><div className="mt-4 flex justify-between gap-4"><div><p className="text-[9px] uppercase tracking-[.14em] text-black/32">{getProjectKindLabel(item.category)} · {item.location}</p><h3 className="mt-2 text-2xl tracking-[-.03em]">{item.title}</h3></div><ArrowUpRight size={17}/></div></Link>)}</div></div></section>:null}
    <section id="cta" className="bg-[#111214] text-[#f4f1ea]"><div className="mx-auto grid max-w-[1440px] gap-10 px-6 py-20 md:px-10 lg:grid-cols-[1fr_320px] lg:px-16 lg:py-28"><div><SectionLabel index="08" label="Next project" dark/><h2 className="mt-6 max-w-5xl text-[clamp(3rem,6.5vw,7.4rem)] leading-[.88] tracking-[-.06em]">Bring the next requirement.</h2></div><div className="lg:self-end"><p className="text-sm leading-6 text-white/48">We can turn your requirement into a structured project conversation.</p><Link href="/contact#enquiry" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#f4f1ea] px-5 py-3 text-[10px] uppercase tracking-[.14em] text-[#111214]">Start an enquiry <ArrowUpRight size={15}/></Link></div></div></section>
    <div className="flex border-t border-black/10 bg-[#f4f1ea]"><Link href={project.previousSlug?`/work/${project.previousSlug}`:"/work"} className="group flex flex-1 items-center gap-3 border-r border-black/10 px-5 py-7 md:px-10"><ChevronLeft size={17}/><span><span className="block text-[9px] uppercase tracking-[.15em] text-black/32">Previous</span><span className="mt-1 block text-sm group-hover:underline">Project</span></span></Link><Link href={project.nextSlug?`/work/${project.nextSlug}`:"/work"} className="group flex flex-1 items-center justify-end gap-3 px-5 py-7 text-right md:px-10"><span><span className="block text-[9px] uppercase tracking-[.15em] text-black/32">Next</span><span className="mt-1 block text-sm group-hover:underline">Project</span></span><ChevronRight size={17}/></Link></div>
    <Lightbox items={project.gallery} index={lightbox} onClose={closeGallery} onChange={changeGallery}/>
  </article>;
}

export const projectStoryPreset001 = Object.freeze({ id:"story-001", reveal:2, imageSpan:4, delay:35, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset002 = Object.freeze({ id:"story-002", reveal:3, imageSpan:5, delay:70, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset003 = Object.freeze({ id:"story-003", reveal:4, imageSpan:6, delay:105, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset004 = Object.freeze({ id:"story-004", reveal:5, imageSpan:7, delay:140, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset005 = Object.freeze({ id:"story-005", reveal:6, imageSpan:8, delay:175, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset006 = Object.freeze({ id:"story-006", reveal:7, imageSpan:9, delay:210, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset007 = Object.freeze({ id:"story-007", reveal:8, imageSpan:3, delay:245, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset008 = Object.freeze({ id:"story-008", reveal:9, imageSpan:4, delay:280, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset009 = Object.freeze({ id:"story-009", reveal:1, imageSpan:5, delay:315, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset010 = Object.freeze({ id:"story-010", reveal:2, imageSpan:6, delay:350, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset011 = Object.freeze({ id:"story-011", reveal:3, imageSpan:7, delay:385, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset012 = Object.freeze({ id:"story-012", reveal:4, imageSpan:8, delay:0, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset013 = Object.freeze({ id:"story-013", reveal:5, imageSpan:9, delay:35, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset014 = Object.freeze({ id:"story-014", reveal:6, imageSpan:3, delay:70, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset015 = Object.freeze({ id:"story-015", reveal:7, imageSpan:4, delay:105, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset016 = Object.freeze({ id:"story-016", reveal:8, imageSpan:5, delay:140, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset017 = Object.freeze({ id:"story-017", reveal:9, imageSpan:6, delay:175, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset018 = Object.freeze({ id:"story-018", reveal:1, imageSpan:7, delay:210, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset019 = Object.freeze({ id:"story-019", reveal:2, imageSpan:8, delay:245, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset020 = Object.freeze({ id:"story-020", reveal:3, imageSpan:9, delay:280, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset021 = Object.freeze({ id:"story-021", reveal:4, imageSpan:3, delay:315, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset022 = Object.freeze({ id:"story-022", reveal:5, imageSpan:4, delay:350, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset023 = Object.freeze({ id:"story-023", reveal:6, imageSpan:5, delay:385, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset024 = Object.freeze({ id:"story-024", reveal:7, imageSpan:6, delay:0, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset025 = Object.freeze({ id:"story-025", reveal:8, imageSpan:7, delay:35, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset026 = Object.freeze({ id:"story-026", reveal:9, imageSpan:8, delay:70, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset027 = Object.freeze({ id:"story-027", reveal:1, imageSpan:9, delay:105, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset028 = Object.freeze({ id:"story-028", reveal:2, imageSpan:3, delay:140, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset029 = Object.freeze({ id:"story-029", reveal:3, imageSpan:4, delay:175, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset030 = Object.freeze({ id:"story-030", reveal:4, imageSpan:5, delay:210, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset031 = Object.freeze({ id:"story-031", reveal:5, imageSpan:6, delay:245, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset032 = Object.freeze({ id:"story-032", reveal:6, imageSpan:7, delay:280, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset033 = Object.freeze({ id:"story-033", reveal:7, imageSpan:8, delay:315, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset034 = Object.freeze({ id:"story-034", reveal:8, imageSpan:9, delay:350, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset035 = Object.freeze({ id:"story-035", reveal:9, imageSpan:3, delay:385, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset036 = Object.freeze({ id:"story-036", reveal:1, imageSpan:4, delay:0, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset037 = Object.freeze({ id:"story-037", reveal:2, imageSpan:5, delay:35, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset038 = Object.freeze({ id:"story-038", reveal:3, imageSpan:6, delay:70, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset039 = Object.freeze({ id:"story-039", reveal:4, imageSpan:7, delay:105, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset040 = Object.freeze({ id:"story-040", reveal:5, imageSpan:8, delay:140, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset041 = Object.freeze({ id:"story-041", reveal:6, imageSpan:9, delay:175, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset042 = Object.freeze({ id:"story-042", reveal:7, imageSpan:3, delay:210, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset043 = Object.freeze({ id:"story-043", reveal:8, imageSpan:4, delay:245, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset044 = Object.freeze({ id:"story-044", reveal:9, imageSpan:5, delay:280, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset045 = Object.freeze({ id:"story-045", reveal:1, imageSpan:6, delay:315, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset046 = Object.freeze({ id:"story-046", reveal:2, imageSpan:7, delay:350, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset047 = Object.freeze({ id:"story-047", reveal:3, imageSpan:8, delay:385, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset048 = Object.freeze({ id:"story-048", reveal:4, imageSpan:9, delay:0, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset049 = Object.freeze({ id:"story-049", reveal:5, imageSpan:3, delay:35, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset050 = Object.freeze({ id:"story-050", reveal:6, imageSpan:4, delay:70, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset051 = Object.freeze({ id:"story-051", reveal:7, imageSpan:5, delay:105, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset052 = Object.freeze({ id:"story-052", reveal:8, imageSpan:6, delay:140, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset053 = Object.freeze({ id:"story-053", reveal:9, imageSpan:7, delay:175, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset054 = Object.freeze({ id:"story-054", reveal:1, imageSpan:8, delay:210, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset055 = Object.freeze({ id:"story-055", reveal:2, imageSpan:9, delay:245, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset056 = Object.freeze({ id:"story-056", reveal:3, imageSpan:3, delay:280, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset057 = Object.freeze({ id:"story-057", reveal:4, imageSpan:4, delay:315, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset058 = Object.freeze({ id:"story-058", reveal:5, imageSpan:5, delay:350, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset059 = Object.freeze({ id:"story-059", reveal:6, imageSpan:6, delay:385, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset060 = Object.freeze({ id:"story-060", reveal:7, imageSpan:7, delay:0, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset061 = Object.freeze({ id:"story-061", reveal:8, imageSpan:8, delay:35, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset062 = Object.freeze({ id:"story-062", reveal:9, imageSpan:9, delay:70, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset063 = Object.freeze({ id:"story-063", reveal:1, imageSpan:3, delay:105, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset064 = Object.freeze({ id:"story-064", reveal:2, imageSpan:4, delay:140, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset065 = Object.freeze({ id:"story-065", reveal:3, imageSpan:5, delay:175, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset066 = Object.freeze({ id:"story-066", reveal:4, imageSpan:6, delay:210, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset067 = Object.freeze({ id:"story-067", reveal:5, imageSpan:7, delay:245, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset068 = Object.freeze({ id:"story-068", reveal:6, imageSpan:8, delay:280, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset069 = Object.freeze({ id:"story-069", reveal:7, imageSpan:9, delay:315, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset070 = Object.freeze({ id:"story-070", reveal:8, imageSpan:3, delay:350, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset071 = Object.freeze({ id:"story-071", reveal:9, imageSpan:4, delay:385, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset072 = Object.freeze({ id:"story-072", reveal:1, imageSpan:5, delay:0, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset073 = Object.freeze({ id:"story-073", reveal:2, imageSpan:6, delay:35, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset074 = Object.freeze({ id:"story-074", reveal:3, imageSpan:7, delay:70, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset075 = Object.freeze({ id:"story-075", reveal:4, imageSpan:8, delay:105, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset076 = Object.freeze({ id:"story-076", reveal:5, imageSpan:9, delay:140, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset077 = Object.freeze({ id:"story-077", reveal:6, imageSpan:3, delay:175, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset078 = Object.freeze({ id:"story-078", reveal:7, imageSpan:4, delay:210, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset079 = Object.freeze({ id:"story-079", reveal:8, imageSpan:5, delay:245, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset080 = Object.freeze({ id:"story-080", reveal:9, imageSpan:6, delay:280, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset081 = Object.freeze({ id:"story-081", reveal:1, imageSpan:7, delay:315, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset082 = Object.freeze({ id:"story-082", reveal:2, imageSpan:8, delay:350, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset083 = Object.freeze({ id:"story-083", reveal:3, imageSpan:9, delay:385, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset084 = Object.freeze({ id:"story-084", reveal:4, imageSpan:3, delay:0, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset085 = Object.freeze({ id:"story-085", reveal:5, imageSpan:4, delay:35, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset086 = Object.freeze({ id:"story-086", reveal:6, imageSpan:5, delay:70, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset087 = Object.freeze({ id:"story-087", reveal:7, imageSpan:6, delay:105, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset088 = Object.freeze({ id:"story-088", reveal:8, imageSpan:7, delay:140, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset089 = Object.freeze({ id:"story-089", reveal:9, imageSpan:8, delay:175, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset090 = Object.freeze({ id:"story-090", reveal:1, imageSpan:9, delay:210, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset091 = Object.freeze({ id:"story-091", reveal:2, imageSpan:3, delay:245, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset092 = Object.freeze({ id:"story-092", reveal:3, imageSpan:4, delay:280, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset093 = Object.freeze({ id:"story-093", reveal:4, imageSpan:5, delay:315, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset094 = Object.freeze({ id:"story-094", reveal:5, imageSpan:6, delay:350, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset095 = Object.freeze({ id:"story-095", reveal:6, imageSpan:7, delay:385, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset096 = Object.freeze({ id:"story-096", reveal:7, imageSpan:8, delay:0, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset097 = Object.freeze({ id:"story-097", reveal:8, imageSpan:9, delay:35, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset098 = Object.freeze({ id:"story-098", reveal:9, imageSpan:3, delay:70, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset099 = Object.freeze({ id:"story-099", reveal:1, imageSpan:4, delay:105, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset100 = Object.freeze({ id:"story-100", reveal:2, imageSpan:5, delay:140, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset101 = Object.freeze({ id:"story-101", reveal:3, imageSpan:6, delay:175, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset102 = Object.freeze({ id:"story-102", reveal:4, imageSpan:7, delay:210, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset103 = Object.freeze({ id:"story-103", reveal:5, imageSpan:8, delay:245, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset104 = Object.freeze({ id:"story-104", reveal:6, imageSpan:9, delay:280, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset105 = Object.freeze({ id:"story-105", reveal:7, imageSpan:3, delay:315, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset106 = Object.freeze({ id:"story-106", reveal:8, imageSpan:4, delay:350, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset107 = Object.freeze({ id:"story-107", reveal:9, imageSpan:5, delay:385, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset108 = Object.freeze({ id:"story-108", reveal:1, imageSpan:6, delay:0, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset109 = Object.freeze({ id:"story-109", reveal:2, imageSpan:7, delay:35, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset110 = Object.freeze({ id:"story-110", reveal:3, imageSpan:8, delay:70, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset111 = Object.freeze({ id:"story-111", reveal:4, imageSpan:9, delay:105, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset112 = Object.freeze({ id:"story-112", reveal:5, imageSpan:3, delay:140, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset113 = Object.freeze({ id:"story-113", reveal:6, imageSpan:4, delay:175, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset114 = Object.freeze({ id:"story-114", reveal:7, imageSpan:5, delay:210, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset115 = Object.freeze({ id:"story-115", reveal:8, imageSpan:6, delay:245, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset116 = Object.freeze({ id:"story-116", reveal:9, imageSpan:7, delay:280, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset117 = Object.freeze({ id:"story-117", reveal:1, imageSpan:8, delay:315, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset118 = Object.freeze({ id:"story-118", reveal:2, imageSpan:9, delay:350, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset119 = Object.freeze({ id:"story-119", reveal:3, imageSpan:3, delay:385, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset120 = Object.freeze({ id:"story-120", reveal:4, imageSpan:4, delay:0, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset121 = Object.freeze({ id:"story-121", reveal:5, imageSpan:5, delay:35, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset122 = Object.freeze({ id:"story-122", reveal:6, imageSpan:6, delay:70, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset123 = Object.freeze({ id:"story-123", reveal:7, imageSpan:7, delay:105, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset124 = Object.freeze({ id:"story-124", reveal:8, imageSpan:8, delay:140, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset125 = Object.freeze({ id:"story-125", reveal:9, imageSpan:9, delay:175, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset126 = Object.freeze({ id:"story-126", reveal:1, imageSpan:3, delay:210, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset127 = Object.freeze({ id:"story-127", reveal:2, imageSpan:4, delay:245, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset128 = Object.freeze({ id:"story-128", reveal:3, imageSpan:5, delay:280, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset129 = Object.freeze({ id:"story-129", reveal:4, imageSpan:6, delay:315, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset130 = Object.freeze({ id:"story-130", reveal:5, imageSpan:7, delay:350, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset131 = Object.freeze({ id:"story-131", reveal:6, imageSpan:8, delay:385, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset132 = Object.freeze({ id:"story-132", reveal:7, imageSpan:9, delay:0, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset133 = Object.freeze({ id:"story-133", reveal:8, imageSpan:3, delay:35, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset134 = Object.freeze({ id:"story-134", reveal:9, imageSpan:4, delay:70, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset135 = Object.freeze({ id:"story-135", reveal:1, imageSpan:5, delay:105, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset136 = Object.freeze({ id:"story-136", reveal:2, imageSpan:6, delay:140, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset137 = Object.freeze({ id:"story-137", reveal:3, imageSpan:7, delay:175, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset138 = Object.freeze({ id:"story-138", reveal:4, imageSpan:8, delay:210, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset139 = Object.freeze({ id:"story-139", reveal:5, imageSpan:9, delay:245, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset140 = Object.freeze({ id:"story-140", reveal:6, imageSpan:3, delay:280, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset141 = Object.freeze({ id:"story-141", reveal:7, imageSpan:4, delay:315, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset142 = Object.freeze({ id:"story-142", reveal:8, imageSpan:5, delay:350, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset143 = Object.freeze({ id:"story-143", reveal:9, imageSpan:6, delay:385, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset144 = Object.freeze({ id:"story-144", reveal:1, imageSpan:7, delay:0, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset145 = Object.freeze({ id:"story-145", reveal:2, imageSpan:8, delay:35, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset146 = Object.freeze({ id:"story-146", reveal:3, imageSpan:9, delay:70, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset147 = Object.freeze({ id:"story-147", reveal:4, imageSpan:3, delay:105, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset148 = Object.freeze({ id:"story-148", reveal:5, imageSpan:4, delay:140, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset149 = Object.freeze({ id:"story-149", reveal:6, imageSpan:5, delay:175, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset150 = Object.freeze({ id:"story-150", reveal:7, imageSpan:6, delay:210, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset151 = Object.freeze({ id:"story-151", reveal:8, imageSpan:7, delay:245, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset152 = Object.freeze({ id:"story-152", reveal:9, imageSpan:8, delay:280, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset153 = Object.freeze({ id:"story-153", reveal:1, imageSpan:9, delay:315, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset154 = Object.freeze({ id:"story-154", reveal:2, imageSpan:3, delay:350, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset155 = Object.freeze({ id:"story-155", reveal:3, imageSpan:4, delay:385, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset156 = Object.freeze({ id:"story-156", reveal:4, imageSpan:5, delay:0, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset157 = Object.freeze({ id:"story-157", reveal:5, imageSpan:6, delay:35, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset158 = Object.freeze({ id:"story-158", reveal:6, imageSpan:7, delay:70, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset159 = Object.freeze({ id:"story-159", reveal:7, imageSpan:8, delay:105, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset160 = Object.freeze({ id:"story-160", reveal:8, imageSpan:9, delay:140, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset161 = Object.freeze({ id:"story-161", reveal:9, imageSpan:3, delay:175, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset162 = Object.freeze({ id:"story-162", reveal:1, imageSpan:4, delay:210, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset163 = Object.freeze({ id:"story-163", reveal:2, imageSpan:5, delay:245, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset164 = Object.freeze({ id:"story-164", reveal:3, imageSpan:6, delay:280, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset165 = Object.freeze({ id:"story-165", reveal:4, imageSpan:7, delay:315, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset166 = Object.freeze({ id:"story-166", reveal:5, imageSpan:8, delay:350, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset167 = Object.freeze({ id:"story-167", reveal:6, imageSpan:9, delay:385, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset168 = Object.freeze({ id:"story-168", reveal:7, imageSpan:3, delay:0, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset169 = Object.freeze({ id:"story-169", reveal:8, imageSpan:4, delay:35, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset170 = Object.freeze({ id:"story-170", reveal:9, imageSpan:5, delay:70, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset171 = Object.freeze({ id:"story-171", reveal:1, imageSpan:6, delay:105, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset172 = Object.freeze({ id:"story-172", reveal:2, imageSpan:7, delay:140, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset173 = Object.freeze({ id:"story-173", reveal:3, imageSpan:8, delay:175, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset174 = Object.freeze({ id:"story-174", reveal:4, imageSpan:9, delay:210, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset175 = Object.freeze({ id:"story-175", reveal:5, imageSpan:3, delay:245, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset176 = Object.freeze({ id:"story-176", reveal:6, imageSpan:4, delay:280, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset177 = Object.freeze({ id:"story-177", reveal:7, imageSpan:5, delay:315, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset178 = Object.freeze({ id:"story-178", reveal:8, imageSpan:6, delay:350, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset179 = Object.freeze({ id:"story-179", reveal:9, imageSpan:7, delay:385, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset180 = Object.freeze({ id:"story-180", reveal:1, imageSpan:8, delay:0, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset181 = Object.freeze({ id:"story-181", reveal:2, imageSpan:9, delay:35, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset182 = Object.freeze({ id:"story-182", reveal:3, imageSpan:3, delay:70, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset183 = Object.freeze({ id:"story-183", reveal:4, imageSpan:4, delay:105, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset184 = Object.freeze({ id:"story-184", reveal:5, imageSpan:5, delay:140, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset185 = Object.freeze({ id:"story-185", reveal:6, imageSpan:6, delay:175, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset186 = Object.freeze({ id:"story-186", reveal:7, imageSpan:7, delay:210, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset187 = Object.freeze({ id:"story-187", reveal:8, imageSpan:8, delay:245, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset188 = Object.freeze({ id:"story-188", reveal:9, imageSpan:9, delay:280, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset189 = Object.freeze({ id:"story-189", reveal:1, imageSpan:3, delay:315, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset190 = Object.freeze({ id:"story-190", reveal:2, imageSpan:4, delay:350, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset191 = Object.freeze({ id:"story-191", reveal:3, imageSpan:5, delay:385, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset192 = Object.freeze({ id:"story-192", reveal:4, imageSpan:6, delay:0, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset193 = Object.freeze({ id:"story-193", reveal:5, imageSpan:7, delay:35, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset194 = Object.freeze({ id:"story-194", reveal:6, imageSpan:8, delay:70, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset195 = Object.freeze({ id:"story-195", reveal:7, imageSpan:9, delay:105, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset196 = Object.freeze({ id:"story-196", reveal:8, imageSpan:3, delay:140, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset197 = Object.freeze({ id:"story-197", reveal:9, imageSpan:4, delay:175, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset198 = Object.freeze({ id:"story-198", reveal:1, imageSpan:5, delay:210, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset199 = Object.freeze({ id:"story-199", reveal:2, imageSpan:6, delay:245, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset200 = Object.freeze({ id:"story-200", reveal:3, imageSpan:7, delay:280, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset201 = Object.freeze({ id:"story-201", reveal:4, imageSpan:8, delay:315, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset202 = Object.freeze({ id:"story-202", reveal:5, imageSpan:9, delay:350, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset203 = Object.freeze({ id:"story-203", reveal:6, imageSpan:3, delay:385, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset204 = Object.freeze({ id:"story-204", reveal:7, imageSpan:4, delay:0, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset205 = Object.freeze({ id:"story-205", reveal:8, imageSpan:5, delay:35, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset206 = Object.freeze({ id:"story-206", reveal:9, imageSpan:6, delay:70, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset207 = Object.freeze({ id:"story-207", reveal:1, imageSpan:7, delay:105, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset208 = Object.freeze({ id:"story-208", reveal:2, imageSpan:8, delay:140, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset209 = Object.freeze({ id:"story-209", reveal:3, imageSpan:9, delay:175, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset210 = Object.freeze({ id:"story-210", reveal:4, imageSpan:3, delay:210, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset211 = Object.freeze({ id:"story-211", reveal:5, imageSpan:4, delay:245, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset212 = Object.freeze({ id:"story-212", reveal:6, imageSpan:5, delay:280, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset213 = Object.freeze({ id:"story-213", reveal:7, imageSpan:6, delay:315, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset214 = Object.freeze({ id:"story-214", reveal:8, imageSpan:7, delay:350, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset215 = Object.freeze({ id:"story-215", reveal:9, imageSpan:8, delay:385, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset216 = Object.freeze({ id:"story-216", reveal:1, imageSpan:9, delay:0, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset217 = Object.freeze({ id:"story-217", reveal:2, imageSpan:3, delay:35, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset218 = Object.freeze({ id:"story-218", reveal:3, imageSpan:4, delay:70, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset219 = Object.freeze({ id:"story-219", reveal:4, imageSpan:5, delay:105, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset220 = Object.freeze({ id:"story-220", reveal:5, imageSpan:6, delay:140, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset221 = Object.freeze({ id:"story-221", reveal:6, imageSpan:7, delay:175, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset222 = Object.freeze({ id:"story-222", reveal:7, imageSpan:8, delay:210, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset223 = Object.freeze({ id:"story-223", reveal:8, imageSpan:9, delay:245, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset224 = Object.freeze({ id:"story-224", reveal:9, imageSpan:3, delay:280, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset225 = Object.freeze({ id:"story-225", reveal:1, imageSpan:4, delay:315, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset226 = Object.freeze({ id:"story-226", reveal:2, imageSpan:5, delay:350, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset227 = Object.freeze({ id:"story-227", reveal:3, imageSpan:6, delay:385, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset228 = Object.freeze({ id:"story-228", reveal:4, imageSpan:7, delay:0, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset229 = Object.freeze({ id:"story-229", reveal:5, imageSpan:8, delay:35, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset230 = Object.freeze({ id:"story-230", reveal:6, imageSpan:9, delay:70, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset231 = Object.freeze({ id:"story-231", reveal:7, imageSpan:3, delay:105, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset232 = Object.freeze({ id:"story-232", reveal:8, imageSpan:4, delay:140, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset233 = Object.freeze({ id:"story-233", reveal:9, imageSpan:5, delay:175, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset234 = Object.freeze({ id:"story-234", reveal:1, imageSpan:6, delay:210, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset235 = Object.freeze({ id:"story-235", reveal:2, imageSpan:7, delay:245, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset236 = Object.freeze({ id:"story-236", reveal:3, imageSpan:8, delay:280, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset237 = Object.freeze({ id:"story-237", reveal:4, imageSpan:9, delay:315, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset238 = Object.freeze({ id:"story-238", reveal:5, imageSpan:3, delay:350, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset239 = Object.freeze({ id:"story-239", reveal:6, imageSpan:4, delay:385, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset240 = Object.freeze({ id:"story-240", reveal:7, imageSpan:5, delay:0, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset241 = Object.freeze({ id:"story-241", reveal:8, imageSpan:6, delay:35, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset242 = Object.freeze({ id:"story-242", reveal:9, imageSpan:7, delay:70, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset243 = Object.freeze({ id:"story-243", reveal:1, imageSpan:8, delay:105, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset244 = Object.freeze({ id:"story-244", reveal:2, imageSpan:9, delay:140, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset245 = Object.freeze({ id:"story-245", reveal:3, imageSpan:3, delay:175, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset246 = Object.freeze({ id:"story-246", reveal:4, imageSpan:4, delay:210, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset247 = Object.freeze({ id:"story-247", reveal:5, imageSpan:5, delay:245, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset248 = Object.freeze({ id:"story-248", reveal:6, imageSpan:6, delay:280, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset249 = Object.freeze({ id:"story-249", reveal:7, imageSpan:7, delay:315, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset250 = Object.freeze({ id:"story-250", reveal:8, imageSpan:8, delay:350, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset251 = Object.freeze({ id:"story-251", reveal:9, imageSpan:9, delay:385, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset252 = Object.freeze({ id:"story-252", reveal:1, imageSpan:3, delay:0, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset253 = Object.freeze({ id:"story-253", reveal:2, imageSpan:4, delay:35, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset254 = Object.freeze({ id:"story-254", reveal:3, imageSpan:5, delay:70, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset255 = Object.freeze({ id:"story-255", reveal:4, imageSpan:6, delay:105, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset256 = Object.freeze({ id:"story-256", reveal:5, imageSpan:7, delay:140, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset257 = Object.freeze({ id:"story-257", reveal:6, imageSpan:8, delay:175, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset258 = Object.freeze({ id:"story-258", reveal:7, imageSpan:9, delay:210, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset259 = Object.freeze({ id:"story-259", reveal:8, imageSpan:3, delay:245, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset260 = Object.freeze({ id:"story-260", reveal:9, imageSpan:4, delay:280, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset261 = Object.freeze({ id:"story-261", reveal:1, imageSpan:5, delay:315, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset262 = Object.freeze({ id:"story-262", reveal:2, imageSpan:6, delay:350, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset263 = Object.freeze({ id:"story-263", reveal:3, imageSpan:7, delay:385, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset264 = Object.freeze({ id:"story-264", reveal:4, imageSpan:8, delay:0, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset265 = Object.freeze({ id:"story-265", reveal:5, imageSpan:9, delay:35, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset266 = Object.freeze({ id:"story-266", reveal:6, imageSpan:3, delay:70, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset267 = Object.freeze({ id:"story-267", reveal:7, imageSpan:4, delay:105, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset268 = Object.freeze({ id:"story-268", reveal:8, imageSpan:5, delay:140, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset269 = Object.freeze({ id:"story-269", reveal:9, imageSpan:6, delay:175, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset270 = Object.freeze({ id:"story-270", reveal:1, imageSpan:7, delay:210, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset271 = Object.freeze({ id:"story-271", reveal:2, imageSpan:8, delay:245, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset272 = Object.freeze({ id:"story-272", reveal:3, imageSpan:9, delay:280, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset273 = Object.freeze({ id:"story-273", reveal:4, imageSpan:3, delay:315, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset274 = Object.freeze({ id:"story-274", reveal:5, imageSpan:4, delay:350, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset275 = Object.freeze({ id:"story-275", reveal:6, imageSpan:5, delay:385, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset276 = Object.freeze({ id:"story-276", reveal:7, imageSpan:6, delay:0, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset277 = Object.freeze({ id:"story-277", reveal:8, imageSpan:7, delay:35, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset278 = Object.freeze({ id:"story-278", reveal:9, imageSpan:8, delay:70, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset279 = Object.freeze({ id:"story-279", reveal:1, imageSpan:9, delay:105, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset280 = Object.freeze({ id:"story-280", reveal:2, imageSpan:3, delay:140, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset281 = Object.freeze({ id:"story-281", reveal:3, imageSpan:4, delay:175, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset282 = Object.freeze({ id:"story-282", reveal:4, imageSpan:5, delay:210, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset283 = Object.freeze({ id:"story-283", reveal:5, imageSpan:6, delay:245, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset284 = Object.freeze({ id:"story-284", reveal:6, imageSpan:7, delay:280, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset285 = Object.freeze({ id:"story-285", reveal:7, imageSpan:8, delay:315, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset286 = Object.freeze({ id:"story-286", reveal:8, imageSpan:9, delay:350, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset287 = Object.freeze({ id:"story-287", reveal:9, imageSpan:3, delay:385, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset288 = Object.freeze({ id:"story-288", reveal:1, imageSpan:4, delay:0, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset289 = Object.freeze({ id:"story-289", reveal:2, imageSpan:5, delay:35, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset290 = Object.freeze({ id:"story-290", reveal:3, imageSpan:6, delay:70, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset291 = Object.freeze({ id:"story-291", reveal:4, imageSpan:7, delay:105, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset292 = Object.freeze({ id:"story-292", reveal:5, imageSpan:8, delay:140, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset293 = Object.freeze({ id:"story-293", reveal:6, imageSpan:9, delay:175, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset294 = Object.freeze({ id:"story-294", reveal:7, imageSpan:3, delay:210, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset295 = Object.freeze({ id:"story-295", reveal:8, imageSpan:4, delay:245, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset296 = Object.freeze({ id:"story-296", reveal:9, imageSpan:5, delay:280, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset297 = Object.freeze({ id:"story-297", reveal:1, imageSpan:6, delay:315, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset298 = Object.freeze({ id:"story-298", reveal:2, imageSpan:7, delay:350, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset299 = Object.freeze({ id:"story-299", reveal:3, imageSpan:8, delay:385, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset300 = Object.freeze({ id:"story-300", reveal:4, imageSpan:9, delay:0, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset301 = Object.freeze({ id:"story-301", reveal:5, imageSpan:3, delay:35, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset302 = Object.freeze({ id:"story-302", reveal:6, imageSpan:4, delay:70, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset303 = Object.freeze({ id:"story-303", reveal:7, imageSpan:5, delay:105, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset304 = Object.freeze({ id:"story-304", reveal:8, imageSpan:6, delay:140, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset305 = Object.freeze({ id:"story-305", reveal:9, imageSpan:7, delay:175, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset306 = Object.freeze({ id:"story-306", reveal:1, imageSpan:8, delay:210, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset307 = Object.freeze({ id:"story-307", reveal:2, imageSpan:9, delay:245, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset308 = Object.freeze({ id:"story-308", reveal:3, imageSpan:3, delay:280, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset309 = Object.freeze({ id:"story-309", reveal:4, imageSpan:4, delay:315, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset310 = Object.freeze({ id:"story-310", reveal:5, imageSpan:5, delay:350, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset311 = Object.freeze({ id:"story-311", reveal:6, imageSpan:6, delay:385, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset312 = Object.freeze({ id:"story-312", reveal:7, imageSpan:7, delay:0, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset313 = Object.freeze({ id:"story-313", reveal:8, imageSpan:8, delay:35, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset314 = Object.freeze({ id:"story-314", reveal:9, imageSpan:9, delay:70, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset315 = Object.freeze({ id:"story-315", reveal:1, imageSpan:3, delay:105, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset316 = Object.freeze({ id:"story-316", reveal:2, imageSpan:4, delay:140, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset317 = Object.freeze({ id:"story-317", reveal:3, imageSpan:5, delay:175, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset318 = Object.freeze({ id:"story-318", reveal:4, imageSpan:6, delay:210, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset319 = Object.freeze({ id:"story-319", reveal:5, imageSpan:7, delay:245, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset320 = Object.freeze({ id:"story-320", reveal:6, imageSpan:8, delay:280, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset321 = Object.freeze({ id:"story-321", reveal:7, imageSpan:9, delay:315, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset322 = Object.freeze({ id:"story-322", reveal:8, imageSpan:3, delay:350, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset323 = Object.freeze({ id:"story-323", reveal:9, imageSpan:4, delay:385, lightbox:true, keyboard:"ArrowLeft ArrowRight Escape" });

export const projectStoryPreset324 = Object.freeze({ id:"story-324", reveal:1, imageSpan:5, delay:0, lightbox:false, keyboard:"ArrowLeft ArrowRight Escape" });
export function storyMotionFrame325(progress:number):number { return Math.min(1,Math.max(0,progress*1/10)); }
export function storyMotionFrame326(progress:number):number { return Math.min(1,Math.max(0,progress*2/10)); }
export function storyMotionFrame327(progress:number):number { return Math.min(1,Math.max(0,progress*3/10)); }
export function storyMotionFrame328(progress:number):number { return Math.min(1,Math.max(0,progress*4/10)); }
export function storyMotionFrame329(progress:number):number { return Math.min(1,Math.max(0,progress*5/10)); }
export function storyMotionFrame330(progress:number):number { return Math.min(1,Math.max(0,progress*6/10)); }
export function storyMotionFrame331(progress:number):number { return Math.min(1,Math.max(0,progress*7/10)); }
export function storyMotionFrame332(progress:number):number { return Math.min(1,Math.max(0,progress*8/10)); }
export function storyMotionFrame333(progress:number):number { return Math.min(1,Math.max(0,progress*9/10)); }
export function storyMotionFrame334(progress:number):number { return Math.min(1,Math.max(0,progress*10/10)); }
export function storyMotionFrame335(progress:number):number { return Math.min(1,Math.max(0,progress*11/10)); }
export function storyMotionFrame336(progress:number):number { return Math.min(1,Math.max(0,progress*12/10)); }
export function storyMotionFrame337(progress:number):number { return Math.min(1,Math.max(0,progress*13/10)); }
export function storyMotionFrame338(progress:number):number { return Math.min(1,Math.max(0,progress*1/10)); }
export function storyMotionFrame339(progress:number):number { return Math.min(1,Math.max(0,progress*2/10)); }
export function storyMotionFrame340(progress:number):number { return Math.min(1,Math.max(0,progress*3/10)); }
export function storyMotionFrame341(progress:number):number { return Math.min(1,Math.max(0,progress*4/10)); }
export function storyMotionFrame342(progress:number):number { return Math.min(1,Math.max(0,progress*5/10)); }
export function storyMotionFrame343(progress:number):number { return Math.min(1,Math.max(0,progress*6/10)); }
export function storyMotionFrame344(progress:number):number { return Math.min(1,Math.max(0,progress*7/10)); }
export function storyMotionFrame345(progress:number):number { return Math.min(1,Math.max(0,progress*8/10)); }
export function storyMotionFrame346(progress:number):number { return Math.min(1,Math.max(0,progress*9/10)); }
export function storyMotionFrame347(progress:number):number { return Math.min(1,Math.max(0,progress*10/10)); }
export function storyMotionFrame348(progress:number):number { return Math.min(1,Math.max(0,progress*11/10)); }
export function storyMotionFrame349(progress:number):number { return Math.min(1,Math.max(0,progress*12/10)); }
export function storyMotionFrame350(progress:number):number { return Math.min(1,Math.max(0,progress*13/10)); }
export function storyMotionFrame351(progress:number):number { return Math.min(1,Math.max(0,progress*1/10)); }
export function storyMotionFrame352(progress:number):number { return Math.min(1,Math.max(0,progress*2/10)); }
export function storyMotionFrame353(progress:number):number { return Math.min(1,Math.max(0,progress*3/10)); }
export function storyMotionFrame354(progress:number):number { return Math.min(1,Math.max(0,progress*4/10)); }
export function storyMotionFrame355(progress:number):number { return Math.min(1,Math.max(0,progress*5/10)); }
export function storyMotionFrame356(progress:number):number { return Math.min(1,Math.max(0,progress*6/10)); }
export function storyMotionFrame357(progress:number):number { return Math.min(1,Math.max(0,progress*7/10)); }
export function storyMotionFrame358(progress:number):number { return Math.min(1,Math.max(0,progress*8/10)); }
export function storyMotionFrame359(progress:number):number { return Math.min(1,Math.max(0,progress*9/10)); }
export function storyMotionFrame360(progress:number):number { return Math.min(1,Math.max(0,progress*10/10)); }
export function storyMotionFrame361(progress:number):number { return Math.min(1,Math.max(0,progress*11/10)); }
export function storyMotionFrame362(progress:number):number { return Math.min(1,Math.max(0,progress*12/10)); }
export function storyMotionFrame363(progress:number):number { return Math.min(1,Math.max(0,progress*13/10)); }
export function storyMotionFrame364(progress:number):number { return Math.min(1,Math.max(0,progress*1/10)); }
export function storyMotionFrame365(progress:number):number { return Math.min(1,Math.max(0,progress*2/10)); }
export function storyMotionFrame366(progress:number):number { return Math.min(1,Math.max(0,progress*3/10)); }
export function storyMotionFrame367(progress:number):number { return Math.min(1,Math.max(0,progress*4/10)); }
export function storyMotionFrame368(progress:number):number { return Math.min(1,Math.max(0,progress*5/10)); }
export function storyMotionFrame369(progress:number):number { return Math.min(1,Math.max(0,progress*6/10)); }
export function storyMotionFrame370(progress:number):number { return Math.min(1,Math.max(0,progress*7/10)); }
export function storyMotionFrame371(progress:number):number { return Math.min(1,Math.max(0,progress*8/10)); }
export function storyMotionFrame372(progress:number):number { return Math.min(1,Math.max(0,progress*9/10)); }
export function storyMotionFrame373(progress:number):number { return Math.min(1,Math.max(0,progress*10/10)); }
export function storyMotionFrame374(progress:number):number { return Math.min(1,Math.max(0,progress*11/10)); }
export function storyMotionFrame375(progress:number):number { return Math.min(1,Math.max(0,progress*12/10)); }
export function storyMotionFrame376(progress:number):number { return Math.min(1,Math.max(0,progress*13/10)); }
export function storyMotionFrame377(progress:number):number { return Math.min(1,Math.max(0,progress*1/10)); }
export function storyMotionFrame378(progress:number):number { return Math.min(1,Math.max(0,progress*2/10)); }
export function storyMotionFrame379(progress:number):number { return Math.min(1,Math.max(0,progress*3/10)); }
export function storyMotionFrame380(progress:number):number { return Math.min(1,Math.max(0,progress*4/10)); }
export function storyMotionFrame381(progress:number):number { return Math.min(1,Math.max(0,progress*5/10)); }
export function storyMotionFrame382(progress:number):number { return Math.min(1,Math.max(0,progress*6/10)); }
export function storyMotionFrame383(progress:number):number { return Math.min(1,Math.max(0,progress*7/10)); }
export function storyMotionFrame384(progress:number):number { return Math.min(1,Math.max(0,progress*8/10)); }
export function storyMotionFrame385(progress:number):number { return Math.min(1,Math.max(0,progress*9/10)); }
export function storyMotionFrame386(progress:number):number { return Math.min(1,Math.max(0,progress*10/10)); }
export function storyMotionFrame387(progress:number):number { return Math.min(1,Math.max(0,progress*11/10)); }
export function storyMotionFrame388(progress:number):number { return Math.min(1,Math.max(0,progress*12/10)); }
export function storyMotionFrame389(progress:number):number { return Math.min(1,Math.max(0,progress*13/10)); }
export function storyMotionFrame390(progress:number):number { return Math.min(1,Math.max(0,progress*1/10)); }
export function storyMotionFrame391(progress:number):number { return Math.min(1,Math.max(0,progress*2/10)); }
export function storyMotionFrame392(progress:number):number { return Math.min(1,Math.max(0,progress*3/10)); }
export function storyMotionFrame393(progress:number):number { return Math.min(1,Math.max(0,progress*4/10)); }
export function storyMotionFrame394(progress:number):number { return Math.min(1,Math.max(0,progress*5/10)); }
export function storyMotionFrame395(progress:number):number { return Math.min(1,Math.max(0,progress*6/10)); }
export function storyMotionFrame396(progress:number):number { return Math.min(1,Math.max(0,progress*7/10)); }
export function storyMotionFrame397(progress:number):number { return Math.min(1,Math.max(0,progress*8/10)); }
export function storyMotionFrame398(progress:number):number { return Math.min(1,Math.max(0,progress*9/10)); }
export function storyMotionFrame399(progress:number):number { return Math.min(1,Math.max(0,progress*10/10)); }
export function storyMotionFrame400(progress:number):number { return Math.min(1,Math.max(0,progress*11/10)); }
export function storyMotionFrame401(progress:number):number { return Math.min(1,Math.max(0,progress*12/10)); }
export function storyMotionFrame402(progress:number):number { return Math.min(1,Math.max(0,progress*13/10)); }
export function storyMotionFrame403(progress:number):number { return Math.min(1,Math.max(0,progress*1/10)); }
export function storyMotionFrame404(progress:number):number { return Math.min(1,Math.max(0,progress*2/10)); }
export function storyMotionFrame405(progress:number):number { return Math.min(1,Math.max(0,progress*3/10)); }
export function storyMotionFrame406(progress:number):number { return Math.min(1,Math.max(0,progress*4/10)); }
export function storyMotionFrame407(progress:number):number { return Math.min(1,Math.max(0,progress*5/10)); }
export function storyMotionFrame408(progress:number):number { return Math.min(1,Math.max(0,progress*6/10)); }
export function storyMotionFrame409(progress:number):number { return Math.min(1,Math.max(0,progress*7/10)); }
export function storyMotionFrame410(progress:number):number { return Math.min(1,Math.max(0,progress*8/10)); }
export function storyMotionFrame411(progress:number):number { return Math.min(1,Math.max(0,progress*9/10)); }
export function storyMotionFrame412(progress:number):number { return Math.min(1,Math.max(0,progress*10/10)); }
export function storyMotionFrame413(progress:number):number { return Math.min(1,Math.max(0,progress*11/10)); }
export function storyMotionFrame414(progress:number):number { return Math.min(1,Math.max(0,progress*12/10)); }
export function storyMotionFrame415(progress:number):number { return Math.min(1,Math.max(0,progress*13/10)); }
export function storyMotionFrame416(progress:number):number { return Math.min(1,Math.max(0,progress*1/10)); }
export function storyMotionFrame417(progress:number):number { return Math.min(1,Math.max(0,progress*2/10)); }
export function storyMotionFrame418(progress:number):number { return Math.min(1,Math.max(0,progress*3/10)); }
export function storyMotionFrame419(progress:number):number { return Math.min(1,Math.max(0,progress*4/10)); }
export function storyMotionFrame420(progress:number):number { return Math.min(1,Math.max(0,progress*5/10)); }
export function storyMotionFrame421(progress:number):number { return Math.min(1,Math.max(0,progress*6/10)); }
export function storyMotionFrame422(progress:number):number { return Math.min(1,Math.max(0,progress*7/10)); }
export function storyMotionFrame423(progress:number):number { return Math.min(1,Math.max(0,progress*8/10)); }
export function storyMotionFrame424(progress:number):number { return Math.min(1,Math.max(0,progress*9/10)); }
export function storyMotionFrame425(progress:number):number { return Math.min(1,Math.max(0,progress*10/10)); }
export function storyMotionFrame426(progress:number):number { return Math.min(1,Math.max(0,progress*11/10)); }
export function storyMotionFrame427(progress:number):number { return Math.min(1,Math.max(0,progress*12/10)); }
export function storyMotionFrame428(progress:number):number { return Math.min(1,Math.max(0,progress*13/10)); }
export function storyMotionFrame429(progress:number):number { return Math.min(1,Math.max(0,progress*1/10)); }
export function storyMotionFrame430(progress:number):number { return Math.min(1,Math.max(0,progress*2/10)); }
export function storyMotionFrame431(progress:number):number { return Math.min(1,Math.max(0,progress*3/10)); }
export function storyMotionFrame432(progress:number):number { return Math.min(1,Math.max(0,progress*4/10)); }
export function storyMotionFrame433(progress:number):number { return Math.min(1,Math.max(0,progress*5/10)); }
export function storyMotionFrame434(progress:number):number { return Math.min(1,Math.max(0,progress*6/10)); }
export function storyMotionFrame435(progress:number):number { return Math.min(1,Math.max(0,progress*7/10)); }
export function storyMotionFrame436(progress:number):number { return Math.min(1,Math.max(0,progress*8/10)); }
export function storyMotionFrame437(progress:number):number { return Math.min(1,Math.max(0,progress*9/10)); }
export function storyMotionFrame438(progress:number):number { return Math.min(1,Math.max(0,progress*10/10)); }
export function storyMotionFrame439(progress:number):number { return Math.min(1,Math.max(0,progress*11/10)); }
export function storyMotionFrame440(progress:number):number { return Math.min(1,Math.max(0,progress*12/10)); }
export function storyMotionFrame441(progress:number):number { return Math.min(1,Math.max(0,progress*13/10)); }
export function storyMotionFrame442(progress:number):number { return Math.min(1,Math.max(0,progress*1/10)); }
export function storyMotionFrame443(progress:number):number { return Math.min(1,Math.max(0,progress*2/10)); }
export function storyMotionFrame444(progress:number):number { return Math.min(1,Math.max(0,progress*3/10)); }
export function storyMotionFrame445(progress:number):number { return Math.min(1,Math.max(0,progress*4/10)); }
export function storyMotionFrame446(progress:number):number { return Math.min(1,Math.max(0,progress*5/10)); }
export function storyMotionFrame447(progress:number):number { return Math.min(1,Math.max(0,progress*6/10)); }
export function storyMotionFrame448(progress:number):number { return Math.min(1,Math.max(0,progress*7/10)); }
export function storyMotionFrame449(progress:number):number { return Math.min(1,Math.max(0,progress*8/10)); }
