"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Command, Menu, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { commands, navigation, safeHref, type NavigationItem } from "@/lib/miror-design-system";
import { useMirorExperienceV3 } from "@/hooks/useMirorExperienceV3";

export interface MirorCommandCenterProps {
  route?:string;
  children?:React.ReactNode;
  showFooter?:boolean;
  showSearch?:boolean;
  showPointerField?:boolean;
}

function MenuRow({item,index,onClose}:{item:NavigationItem;index:number;onClose:()=>void}){
  return <motion.a href={safeHref(item.href)} onClick={onClose} initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-18}} transition={{duration:.52,delay:index*.045,ease:[.16,1,.3,1]}} className="group flex items-start justify-between border-t border-black/10 py-5">
    <span className="flex gap-4"><span className="pt-2 font-mono text-[9px] tracking-[.18em] text-black/30">{String(index+1).padStart(2,"0")}</span><span><span className="block text-[clamp(1.8rem,4vw,4.3rem)] leading-[.9] tracking-[-.05em]">{item.label}</span><span className="mt-2 block max-w-xl text-sm leading-6 text-black/45">{item.description}</span></span></span>
    <ArrowUpRight className="mt-2 transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" size={21} strokeWidth={1.4}/>
  </motion.a>;
}

function SearchPanel({open,onClose}:{open:boolean;onClose:()=>void}){
  const [query,setQuery]=useState("");
  const input=useRef<HTMLInputElement|null>(null);
  const results=useMemo(()=>{const q=query.trim().toLowerCase();return q?commands.filter(item=>`${item.label} ${item.group}`.toLowerCase().includes(q)):commands;},[query]);
  useEffect(()=>{if(open){setQuery("");const id=window.setTimeout(()=>input.current?.focus(),120);return()=>window.clearTimeout(id);}},[open]);
  return <AnimatePresence>{open?<motion.div data-miror-overlay className="fixed inset-0 z-[130] bg-black/55 p-4 backdrop-blur-md" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><motion.div role="dialog" aria-modal="true" className="mx-auto mt-[8vh] w-full max-w-2xl overflow-hidden rounded-[22px] bg-[#f4f1ea] shadow-2xl" initial={{opacity:0,y:26,scale:.985}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:18,scale:.985}} transition={{duration:.36,ease:[.16,1,.3,1]}}>
    <div className="flex items-center gap-3 border-b border-black/10 p-4"><Search size={18} className="text-black/40"/><input ref={input} value={query} onChange={e=>setQuery(e.target.value)} className="min-w-0 flex-1 bg-transparent outline-none" placeholder="Search the experience" aria-label="Search navigation"/><button onClick={onClose} className="rounded-full p-2 hover:bg-black/5" aria-label="Close search"><X size={18}/></button></div>
    <div className="max-h-[58vh] overflow-auto p-2">{results.map(item=><a key={item.id} href={item.href} onClick={onClose} className="flex items-center justify-between rounded-xl p-4 hover:bg-black/5"><span><span className="block text-sm">{item.label}</span><span className="mt-1 block text-xs text-black/40">{item.group}</span></span>{item.shortcut?<kbd className="rounded border border-black/10 px-2 py-1 font-mono text-[9px] text-black/40">{item.shortcut}</kbd>:null}</a>)}{!results.length?<p className="p-5 text-sm text-black/40">No matching route.</p>:null}</div>
  </motion.div></motion.div>:null}</AnimatePresence>;
}

export default function MirorCommandCenter({route="/",children,showFooter=true,showSearch=true,showPointerField=true}:MirorCommandCenterProps){
  const [experience,actions]=useMirorExperienceV3({route,observeSections:true,pointer:true,shortcuts:true});
  const reduced=useReducedMotion();
  const [headerDense,setHeaderDense]=useState(false);
  useEffect(()=>{const scroll=()=>setHeaderDense(window.scrollY>20);scroll();window.addEventListener("scroll",scroll,{passive:true});return()=>window.removeEventListener("scroll",scroll);},[]);
  return <div className="min-h-screen bg-[#f4f1ea] text-[#111214]">
    <a href="#miror-content" className="fixed left-4 top-4 z-[200] -translate-y-24 rounded-full bg-[#111214] px-4 py-2 text-xs text-[#f4f1ea] focus:translate-y-0">Skip to content</a>
    <div className="fixed inset-x-0 top-0 z-[160] h-[2px] bg-black/5"><motion.div className="h-full origin-left bg-[#b58a37]" style={{scaleX:experience.scrollProgress}}/></div>
    {showPointerField&&!experience.touch&&!experience.reducedMotion?<motion.div aria-hidden className="pointer-events-none fixed z-30 h-64 w-64 rounded-full bg-[#b58a37]/10 blur-3xl" animate={{x:experience.pointerX-128,y:experience.pointerY-128,opacity:experience.pointerActive?.9:0}} transition={{type:"spring",stiffness:95,damping:24}}/>:null}
    <header className={`fixed inset-x-0 top-[2px] z-[150] border-b border-black/10 transition-all duration-500 ${headerDense?"bg-[#f4f1ea]/88 backdrop-blur-xl":"bg-transparent"}`}>
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 md:px-8 lg:px-12"><a href="/" className="text-sm font-semibold tracking-[.24em]">MIROR<span className="text-[#b58a37]">.</span></a><div className="hidden text-[10px] uppercase tracking-[.16em] text-black/35 md:block">{route==="/"?"Construction & infrastructure":route.replaceAll("/"," · ")}</div><div className="flex items-center gap-2">{showSearch?<button onClick={actions.openCommand} className="hidden items-center gap-2 rounded-full border border-black/10 px-3 py-2 text-[10px] uppercase tracking-[.13em] text-black/50 hover:bg-black/5 md:inline-flex"><Search size={14}/> Search <kbd className="font-mono">/</kbd></button>:null}<button onClick={actions.toggleMenu} data-miror-menu-trigger aria-expanded={experience.menuOpen} className="inline-flex items-center gap-3 rounded-full border border-black/15 px-4 py-2 text-[10px] uppercase tracking-[.14em] hover:bg-black/5"><span>{experience.menuOpen?"Close":"Menu"}</span>{experience.menuOpen?<X size={17}/>:<Menu size={17}/>}</button></div></div>
    </header>
    <main id="miror-content">{children}</main>
    <AnimatePresence>{experience.menuOpen?<motion.div id="miror-main-menu" data-miror-overlay className="fixed inset-0 z-[140] overflow-y-auto bg-[#f4f1ea]" initial={{clipPath:"inset(100% 0 0 0)"}} animate={{clipPath:"inset(0 0 0 0)"}} exit={{clipPath:"inset(0 0 100% 0)"}} transition={{duration:reduced?.12:.66,ease:[.16,1,.3,1]}}>
      <div className="mx-auto flex min-h-full max-w-[1440px] flex-col px-6 py-7 md:px-10 lg:px-16"><div className="flex items-center justify-between"><span className="text-sm font-semibold tracking-[.24em]">MIROR<span className="text-[#b58a37]">.</span></span><button onClick={actions.closeMenu} className="rounded-full border border-black/15 px-4 py-2 text-[10px] uppercase tracking-[.14em]">Close</button></div><div className="grid flex-1 gap-10 py-16 lg:grid-cols-[1fr_280px] lg:items-center"><nav aria-label="Primary navigation"><p className="mb-5 text-[10px] uppercase tracking-[.18em] text-black/35">Explore</p><div>{navigation.map((item,i)=><MenuRow key={item.id} item={item} index={i} onClose={actions.closeMenu}/>)}</div></nav><aside className="space-y-7 border-t border-black/10 pt-7 lg:border-l lg:border-t-0 lg:pl-8"><div><p className="text-[10px] uppercase tracking-[.17em] text-black/35">Command</p><button onClick={()=>{actions.closeMenu();actions.openCommand();}} className="mt-3 inline-flex items-center gap-2 text-sm"><Command size={16}/> Search destinations <span className="rounded border border-black/10 px-1.5 py-0.5 font-mono text-[9px]">/</span></button></div><div><p className="text-[10px] uppercase tracking-[.17em] text-black/35">Office</p><p className="mt-3 text-sm leading-6 text-black/60">Ongole, Prakasam<br/>Andhra Pradesh, India</p></div><div><p className="text-[10px] uppercase tracking-[.17em] text-black/35">Direct</p><a href="/contact#enquiry" onClick={actions.closeMenu} className="mt-3 inline-flex items-center gap-2 text-sm">Start an enquiry <ArrowUpRight size={15}/></a></div></aside></div></div>
    </motion.div>:null}</AnimatePresence>
    {showSearch?<SearchPanel open={experience.commandOpen} onClose={actions.closeCommand}/>:null}
    {showFooter?<footer className="border-t border-black/10 bg-[#111214] text-[#f4f1ea]"><div className="mx-auto grid max-w-[1440px] gap-10 px-6 py-12 md:grid-cols-2 lg:grid-cols-4 lg:px-12"><div className="lg:col-span-2"><span className="text-lg font-semibold tracking-[.24em]">MIROR<span className="text-[#b58a37]">.</span></span><p className="mt-5 max-w-md text-sm leading-6 text-white/50">Construction and infrastructure execution represented through documented projects, capabilities and field evidence.</p></div>{navigation.slice(0,3).map(item=><div key={item.id}><a href={item.href} className="text-sm text-white/65 hover:text-white">{item.label}</a><p className="mt-2 max-w-xs text-xs leading-5 text-white/35">{item.description}</p></div>)}</div><div className="border-t border-white/10 px-6 py-4 text-[9px] uppercase tracking-[.14em] text-white/30 md:px-12">© {new Date().getFullYear()} Miror Constructions & Consultancy Private Limited · Ongole · Andhra Pradesh</div></footer>:null}
  </div>;
}

export const commandInteractionPreset001 = Object.freeze({ id:"command-001", duration:200, stagger:43, intensity:0.33, keyboard:true, reducedMotion:true });

export const commandInteractionPreset002 = Object.freeze({ id:"command-002", duration:240, stagger:51, intensity:0.41, keyboard:true, reducedMotion:true });

export const commandInteractionPreset003 = Object.freeze({ id:"command-003", duration:280, stagger:59, intensity:0.49, keyboard:true, reducedMotion:false });

export const commandInteractionPreset004 = Object.freeze({ id:"command-004", duration:320, stagger:67, intensity:0.57, keyboard:true, reducedMotion:true });

export const commandInteractionPreset005 = Object.freeze({ id:"command-005", duration:360, stagger:75, intensity:0.65, keyboard:true, reducedMotion:true });

export const commandInteractionPreset006 = Object.freeze({ id:"command-006", duration:400, stagger:35, intensity:0.73, keyboard:true, reducedMotion:false });

export const commandInteractionPreset007 = Object.freeze({ id:"command-007", duration:440, stagger:43, intensity:0.81, keyboard:true, reducedMotion:true });

export const commandInteractionPreset008 = Object.freeze({ id:"command-008", duration:480, stagger:51, intensity:0.25, keyboard:true, reducedMotion:true });

export const commandInteractionPreset009 = Object.freeze({ id:"command-009", duration:160, stagger:59, intensity:0.33, keyboard:true, reducedMotion:false });

export const commandInteractionPreset010 = Object.freeze({ id:"command-010", duration:200, stagger:67, intensity:0.41, keyboard:true, reducedMotion:true });

export const commandInteractionPreset011 = Object.freeze({ id:"command-011", duration:240, stagger:75, intensity:0.49, keyboard:true, reducedMotion:true });

export const commandInteractionPreset012 = Object.freeze({ id:"command-012", duration:280, stagger:35, intensity:0.57, keyboard:true, reducedMotion:false });

export const commandInteractionPreset013 = Object.freeze({ id:"command-013", duration:320, stagger:43, intensity:0.65, keyboard:true, reducedMotion:true });

export const commandInteractionPreset014 = Object.freeze({ id:"command-014", duration:360, stagger:51, intensity:0.73, keyboard:true, reducedMotion:true });

export const commandInteractionPreset015 = Object.freeze({ id:"command-015", duration:400, stagger:59, intensity:0.81, keyboard:true, reducedMotion:false });

export const commandInteractionPreset016 = Object.freeze({ id:"command-016", duration:440, stagger:67, intensity:0.25, keyboard:true, reducedMotion:true });

export const commandInteractionPreset017 = Object.freeze({ id:"command-017", duration:480, stagger:75, intensity:0.33, keyboard:true, reducedMotion:true });

export const commandInteractionPreset018 = Object.freeze({ id:"command-018", duration:160, stagger:35, intensity:0.41, keyboard:true, reducedMotion:false });

export const commandInteractionPreset019 = Object.freeze({ id:"command-019", duration:200, stagger:43, intensity:0.49, keyboard:true, reducedMotion:true });

export const commandInteractionPreset020 = Object.freeze({ id:"command-020", duration:240, stagger:51, intensity:0.57, keyboard:true, reducedMotion:true });

export const commandInteractionPreset021 = Object.freeze({ id:"command-021", duration:280, stagger:59, intensity:0.65, keyboard:true, reducedMotion:false });

export const commandInteractionPreset022 = Object.freeze({ id:"command-022", duration:320, stagger:67, intensity:0.73, keyboard:true, reducedMotion:true });

export const commandInteractionPreset023 = Object.freeze({ id:"command-023", duration:360, stagger:75, intensity:0.81, keyboard:true, reducedMotion:true });

export const commandInteractionPreset024 = Object.freeze({ id:"command-024", duration:400, stagger:35, intensity:0.25, keyboard:true, reducedMotion:false });

export const commandInteractionPreset025 = Object.freeze({ id:"command-025", duration:440, stagger:43, intensity:0.33, keyboard:true, reducedMotion:true });

export const commandInteractionPreset026 = Object.freeze({ id:"command-026", duration:480, stagger:51, intensity:0.41, keyboard:true, reducedMotion:true });

export const commandInteractionPreset027 = Object.freeze({ id:"command-027", duration:160, stagger:59, intensity:0.49, keyboard:true, reducedMotion:false });

export const commandInteractionPreset028 = Object.freeze({ id:"command-028", duration:200, stagger:67, intensity:0.57, keyboard:true, reducedMotion:true });

export const commandInteractionPreset029 = Object.freeze({ id:"command-029", duration:240, stagger:75, intensity:0.65, keyboard:true, reducedMotion:true });

export const commandInteractionPreset030 = Object.freeze({ id:"command-030", duration:280, stagger:35, intensity:0.73, keyboard:true, reducedMotion:false });

export const commandInteractionPreset031 = Object.freeze({ id:"command-031", duration:320, stagger:43, intensity:0.81, keyboard:true, reducedMotion:true });

export const commandInteractionPreset032 = Object.freeze({ id:"command-032", duration:360, stagger:51, intensity:0.25, keyboard:true, reducedMotion:true });

export const commandInteractionPreset033 = Object.freeze({ id:"command-033", duration:400, stagger:59, intensity:0.33, keyboard:true, reducedMotion:false });

export const commandInteractionPreset034 = Object.freeze({ id:"command-034", duration:440, stagger:67, intensity:0.41, keyboard:true, reducedMotion:true });

export const commandInteractionPreset035 = Object.freeze({ id:"command-035", duration:480, stagger:75, intensity:0.49, keyboard:true, reducedMotion:true });

export const commandInteractionPreset036 = Object.freeze({ id:"command-036", duration:160, stagger:35, intensity:0.57, keyboard:true, reducedMotion:false });

export const commandInteractionPreset037 = Object.freeze({ id:"command-037", duration:200, stagger:43, intensity:0.65, keyboard:true, reducedMotion:true });

export const commandInteractionPreset038 = Object.freeze({ id:"command-038", duration:240, stagger:51, intensity:0.73, keyboard:true, reducedMotion:true });

export const commandInteractionPreset039 = Object.freeze({ id:"command-039", duration:280, stagger:59, intensity:0.81, keyboard:true, reducedMotion:false });

export const commandInteractionPreset040 = Object.freeze({ id:"command-040", duration:320, stagger:67, intensity:0.25, keyboard:true, reducedMotion:true });

export const commandInteractionPreset041 = Object.freeze({ id:"command-041", duration:360, stagger:75, intensity:0.33, keyboard:true, reducedMotion:true });

export const commandInteractionPreset042 = Object.freeze({ id:"command-042", duration:400, stagger:35, intensity:0.41, keyboard:true, reducedMotion:false });

export const commandInteractionPreset043 = Object.freeze({ id:"command-043", duration:440, stagger:43, intensity:0.49, keyboard:true, reducedMotion:true });

export const commandInteractionPreset044 = Object.freeze({ id:"command-044", duration:480, stagger:51, intensity:0.57, keyboard:true, reducedMotion:true });

export const commandInteractionPreset045 = Object.freeze({ id:"command-045", duration:160, stagger:59, intensity:0.65, keyboard:true, reducedMotion:false });

export const commandInteractionPreset046 = Object.freeze({ id:"command-046", duration:200, stagger:67, intensity:0.73, keyboard:true, reducedMotion:true });

export const commandInteractionPreset047 = Object.freeze({ id:"command-047", duration:240, stagger:75, intensity:0.81, keyboard:true, reducedMotion:true });

export const commandInteractionPreset048 = Object.freeze({ id:"command-048", duration:280, stagger:35, intensity:0.25, keyboard:true, reducedMotion:false });

export const commandInteractionPreset049 = Object.freeze({ id:"command-049", duration:320, stagger:43, intensity:0.33, keyboard:true, reducedMotion:true });

export const commandInteractionPreset050 = Object.freeze({ id:"command-050", duration:360, stagger:51, intensity:0.41, keyboard:true, reducedMotion:true });

export const commandInteractionPreset051 = Object.freeze({ id:"command-051", duration:400, stagger:59, intensity:0.49, keyboard:true, reducedMotion:false });

export const commandInteractionPreset052 = Object.freeze({ id:"command-052", duration:440, stagger:67, intensity:0.57, keyboard:true, reducedMotion:true });

export const commandInteractionPreset053 = Object.freeze({ id:"command-053", duration:480, stagger:75, intensity:0.65, keyboard:true, reducedMotion:true });

export const commandInteractionPreset054 = Object.freeze({ id:"command-054", duration:160, stagger:35, intensity:0.73, keyboard:true, reducedMotion:false });

export const commandInteractionPreset055 = Object.freeze({ id:"command-055", duration:200, stagger:43, intensity:0.81, keyboard:true, reducedMotion:true });

export const commandInteractionPreset056 = Object.freeze({ id:"command-056", duration:240, stagger:51, intensity:0.25, keyboard:true, reducedMotion:true });

export const commandInteractionPreset057 = Object.freeze({ id:"command-057", duration:280, stagger:59, intensity:0.33, keyboard:true, reducedMotion:false });

export const commandInteractionPreset058 = Object.freeze({ id:"command-058", duration:320, stagger:67, intensity:0.41, keyboard:true, reducedMotion:true });

export const commandInteractionPreset059 = Object.freeze({ id:"command-059", duration:360, stagger:75, intensity:0.49, keyboard:true, reducedMotion:true });

export const commandInteractionPreset060 = Object.freeze({ id:"command-060", duration:400, stagger:35, intensity:0.57, keyboard:true, reducedMotion:false });

export const commandInteractionPreset061 = Object.freeze({ id:"command-061", duration:440, stagger:43, intensity:0.65, keyboard:true, reducedMotion:true });

export const commandInteractionPreset062 = Object.freeze({ id:"command-062", duration:480, stagger:51, intensity:0.73, keyboard:true, reducedMotion:true });

export const commandInteractionPreset063 = Object.freeze({ id:"command-063", duration:160, stagger:59, intensity:0.81, keyboard:true, reducedMotion:false });

export const commandInteractionPreset064 = Object.freeze({ id:"command-064", duration:200, stagger:67, intensity:0.25, keyboard:true, reducedMotion:true });

export const commandInteractionPreset065 = Object.freeze({ id:"command-065", duration:240, stagger:75, intensity:0.33, keyboard:true, reducedMotion:true });

export const commandInteractionPreset066 = Object.freeze({ id:"command-066", duration:280, stagger:35, intensity:0.41, keyboard:true, reducedMotion:false });

export const commandInteractionPreset067 = Object.freeze({ id:"command-067", duration:320, stagger:43, intensity:0.49, keyboard:true, reducedMotion:true });

export const commandInteractionPreset068 = Object.freeze({ id:"command-068", duration:360, stagger:51, intensity:0.57, keyboard:true, reducedMotion:true });

export const commandInteractionPreset069 = Object.freeze({ id:"command-069", duration:400, stagger:59, intensity:0.65, keyboard:true, reducedMotion:false });

export const commandInteractionPreset070 = Object.freeze({ id:"command-070", duration:440, stagger:67, intensity:0.73, keyboard:true, reducedMotion:true });

export const commandInteractionPreset071 = Object.freeze({ id:"command-071", duration:480, stagger:75, intensity:0.81, keyboard:true, reducedMotion:true });

export const commandInteractionPreset072 = Object.freeze({ id:"command-072", duration:160, stagger:35, intensity:0.25, keyboard:true, reducedMotion:false });

export const commandInteractionPreset073 = Object.freeze({ id:"command-073", duration:200, stagger:43, intensity:0.33, keyboard:true, reducedMotion:true });

export const commandInteractionPreset074 = Object.freeze({ id:"command-074", duration:240, stagger:51, intensity:0.41, keyboard:true, reducedMotion:true });

export const commandInteractionPreset075 = Object.freeze({ id:"command-075", duration:280, stagger:59, intensity:0.49, keyboard:true, reducedMotion:false });

export const commandInteractionPreset076 = Object.freeze({ id:"command-076", duration:320, stagger:67, intensity:0.57, keyboard:true, reducedMotion:true });

export const commandInteractionPreset077 = Object.freeze({ id:"command-077", duration:360, stagger:75, intensity:0.65, keyboard:true, reducedMotion:true });

export const commandInteractionPreset078 = Object.freeze({ id:"command-078", duration:400, stagger:35, intensity:0.73, keyboard:true, reducedMotion:false });

export const commandInteractionPreset079 = Object.freeze({ id:"command-079", duration:440, stagger:43, intensity:0.81, keyboard:true, reducedMotion:true });

export const commandInteractionPreset080 = Object.freeze({ id:"command-080", duration:480, stagger:51, intensity:0.25, keyboard:true, reducedMotion:true });

export const commandInteractionPreset081 = Object.freeze({ id:"command-081", duration:160, stagger:59, intensity:0.33, keyboard:true, reducedMotion:false });

export const commandInteractionPreset082 = Object.freeze({ id:"command-082", duration:200, stagger:67, intensity:0.41, keyboard:true, reducedMotion:true });

export const commandInteractionPreset083 = Object.freeze({ id:"command-083", duration:240, stagger:75, intensity:0.49, keyboard:true, reducedMotion:true });

export const commandInteractionPreset084 = Object.freeze({ id:"command-084", duration:280, stagger:35, intensity:0.57, keyboard:true, reducedMotion:false });

export const commandInteractionPreset085 = Object.freeze({ id:"command-085", duration:320, stagger:43, intensity:0.65, keyboard:true, reducedMotion:true });

export const commandInteractionPreset086 = Object.freeze({ id:"command-086", duration:360, stagger:51, intensity:0.73, keyboard:true, reducedMotion:true });

export const commandInteractionPreset087 = Object.freeze({ id:"command-087", duration:400, stagger:59, intensity:0.81, keyboard:true, reducedMotion:false });

export const commandInteractionPreset088 = Object.freeze({ id:"command-088", duration:440, stagger:67, intensity:0.25, keyboard:true, reducedMotion:true });

export const commandInteractionPreset089 = Object.freeze({ id:"command-089", duration:480, stagger:75, intensity:0.33, keyboard:true, reducedMotion:true });

export const commandInteractionPreset090 = Object.freeze({ id:"command-090", duration:160, stagger:35, intensity:0.41, keyboard:true, reducedMotion:false });

export const commandInteractionPreset091 = Object.freeze({ id:"command-091", duration:200, stagger:43, intensity:0.49, keyboard:true, reducedMotion:true });

export const commandInteractionPreset092 = Object.freeze({ id:"command-092", duration:240, stagger:51, intensity:0.57, keyboard:true, reducedMotion:true });

export const commandInteractionPreset093 = Object.freeze({ id:"command-093", duration:280, stagger:59, intensity:0.65, keyboard:true, reducedMotion:false });

export const commandInteractionPreset094 = Object.freeze({ id:"command-094", duration:320, stagger:67, intensity:0.73, keyboard:true, reducedMotion:true });

export const commandInteractionPreset095 = Object.freeze({ id:"command-095", duration:360, stagger:75, intensity:0.81, keyboard:true, reducedMotion:true });

export const commandInteractionPreset096 = Object.freeze({ id:"command-096", duration:400, stagger:35, intensity:0.25, keyboard:true, reducedMotion:false });

export const commandInteractionPreset097 = Object.freeze({ id:"command-097", duration:440, stagger:43, intensity:0.33, keyboard:true, reducedMotion:true });

export const commandInteractionPreset098 = Object.freeze({ id:"command-098", duration:480, stagger:51, intensity:0.41, keyboard:true, reducedMotion:true });

export const commandInteractionPreset099 = Object.freeze({ id:"command-099", duration:160, stagger:59, intensity:0.49, keyboard:true, reducedMotion:false });

export const commandInteractionPreset100 = Object.freeze({ id:"command-100", duration:200, stagger:67, intensity:0.57, keyboard:true, reducedMotion:true });

export const commandInteractionPreset101 = Object.freeze({ id:"command-101", duration:240, stagger:75, intensity:0.65, keyboard:true, reducedMotion:true });

export const commandInteractionPreset102 = Object.freeze({ id:"command-102", duration:280, stagger:35, intensity:0.73, keyboard:true, reducedMotion:false });

export const commandInteractionPreset103 = Object.freeze({ id:"command-103", duration:320, stagger:43, intensity:0.81, keyboard:true, reducedMotion:true });

export const commandInteractionPreset104 = Object.freeze({ id:"command-104", duration:360, stagger:51, intensity:0.25, keyboard:true, reducedMotion:true });

export const commandInteractionPreset105 = Object.freeze({ id:"command-105", duration:400, stagger:59, intensity:0.33, keyboard:true, reducedMotion:false });

export const commandInteractionPreset106 = Object.freeze({ id:"command-106", duration:440, stagger:67, intensity:0.41, keyboard:true, reducedMotion:true });

export const commandInteractionPreset107 = Object.freeze({ id:"command-107", duration:480, stagger:75, intensity:0.49, keyboard:true, reducedMotion:true });

export const commandInteractionPreset108 = Object.freeze({ id:"command-108", duration:160, stagger:35, intensity:0.57, keyboard:true, reducedMotion:false });

export const commandInteractionPreset109 = Object.freeze({ id:"command-109", duration:200, stagger:43, intensity:0.65, keyboard:true, reducedMotion:true });

export const commandInteractionPreset110 = Object.freeze({ id:"command-110", duration:240, stagger:51, intensity:0.73, keyboard:true, reducedMotion:true });

export const commandInteractionPreset111 = Object.freeze({ id:"command-111", duration:280, stagger:59, intensity:0.81, keyboard:true, reducedMotion:false });

export const commandInteractionPreset112 = Object.freeze({ id:"command-112", duration:320, stagger:67, intensity:0.25, keyboard:true, reducedMotion:true });

export const commandInteractionPreset113 = Object.freeze({ id:"command-113", duration:360, stagger:75, intensity:0.33, keyboard:true, reducedMotion:true });

export const commandInteractionPreset114 = Object.freeze({ id:"command-114", duration:400, stagger:35, intensity:0.41, keyboard:true, reducedMotion:false });

export const commandInteractionPreset115 = Object.freeze({ id:"command-115", duration:440, stagger:43, intensity:0.49, keyboard:true, reducedMotion:true });

export const commandInteractionPreset116 = Object.freeze({ id:"command-116", duration:480, stagger:51, intensity:0.57, keyboard:true, reducedMotion:true });

export const commandInteractionPreset117 = Object.freeze({ id:"command-117", duration:160, stagger:59, intensity:0.65, keyboard:true, reducedMotion:false });

export const commandInteractionPreset118 = Object.freeze({ id:"command-118", duration:200, stagger:67, intensity:0.73, keyboard:true, reducedMotion:true });

export const commandInteractionPreset119 = Object.freeze({ id:"command-119", duration:240, stagger:75, intensity:0.81, keyboard:true, reducedMotion:true });

export const commandInteractionPreset120 = Object.freeze({ id:"command-120", duration:280, stagger:35, intensity:0.25, keyboard:true, reducedMotion:false });

export const commandInteractionPreset121 = Object.freeze({ id:"command-121", duration:320, stagger:43, intensity:0.33, keyboard:true, reducedMotion:true });

export const commandInteractionPreset122 = Object.freeze({ id:"command-122", duration:360, stagger:51, intensity:0.41, keyboard:true, reducedMotion:true });

export const commandInteractionPreset123 = Object.freeze({ id:"command-123", duration:400, stagger:59, intensity:0.49, keyboard:true, reducedMotion:false });

export const commandInteractionPreset124 = Object.freeze({ id:"command-124", duration:440, stagger:67, intensity:0.57, keyboard:true, reducedMotion:true });

export const commandInteractionPreset125 = Object.freeze({ id:"command-125", duration:480, stagger:75, intensity:0.65, keyboard:true, reducedMotion:true });

export const commandInteractionPreset126 = Object.freeze({ id:"command-126", duration:160, stagger:35, intensity:0.73, keyboard:true, reducedMotion:false });

export const commandInteractionPreset127 = Object.freeze({ id:"command-127", duration:200, stagger:43, intensity:0.81, keyboard:true, reducedMotion:true });

export const commandInteractionPreset128 = Object.freeze({ id:"command-128", duration:240, stagger:51, intensity:0.25, keyboard:true, reducedMotion:true });

export const commandInteractionPreset129 = Object.freeze({ id:"command-129", duration:280, stagger:59, intensity:0.33, keyboard:true, reducedMotion:false });

export const commandInteractionPreset130 = Object.freeze({ id:"command-130", duration:320, stagger:67, intensity:0.41, keyboard:true, reducedMotion:true });

export const commandInteractionPreset131 = Object.freeze({ id:"command-131", duration:360, stagger:75, intensity:0.49, keyboard:true, reducedMotion:true });

export const commandInteractionPreset132 = Object.freeze({ id:"command-132", duration:400, stagger:35, intensity:0.57, keyboard:true, reducedMotion:false });

export const commandInteractionPreset133 = Object.freeze({ id:"command-133", duration:440, stagger:43, intensity:0.65, keyboard:true, reducedMotion:true });

export const commandInteractionPreset134 = Object.freeze({ id:"command-134", duration:480, stagger:51, intensity:0.73, keyboard:true, reducedMotion:true });

export const commandInteractionPreset135 = Object.freeze({ id:"command-135", duration:160, stagger:59, intensity:0.81, keyboard:true, reducedMotion:false });

export const commandInteractionPreset136 = Object.freeze({ id:"command-136", duration:200, stagger:67, intensity:0.25, keyboard:true, reducedMotion:true });

export const commandInteractionPreset137 = Object.freeze({ id:"command-137", duration:240, stagger:75, intensity:0.33, keyboard:true, reducedMotion:true });

export const commandInteractionPreset138 = Object.freeze({ id:"command-138", duration:280, stagger:35, intensity:0.41, keyboard:true, reducedMotion:false });

export const commandInteractionPreset139 = Object.freeze({ id:"command-139", duration:320, stagger:43, intensity:0.49, keyboard:true, reducedMotion:true });

export const commandInteractionPreset140 = Object.freeze({ id:"command-140", duration:360, stagger:51, intensity:0.57, keyboard:true, reducedMotion:true });

export const commandInteractionPreset141 = Object.freeze({ id:"command-141", duration:400, stagger:59, intensity:0.65, keyboard:true, reducedMotion:false });

export const commandInteractionPreset142 = Object.freeze({ id:"command-142", duration:440, stagger:67, intensity:0.73, keyboard:true, reducedMotion:true });

export const commandInteractionPreset143 = Object.freeze({ id:"command-143", duration:480, stagger:75, intensity:0.81, keyboard:true, reducedMotion:true });

export const commandInteractionPreset144 = Object.freeze({ id:"command-144", duration:160, stagger:35, intensity:0.25, keyboard:true, reducedMotion:false });

export const commandInteractionPreset145 = Object.freeze({ id:"command-145", duration:200, stagger:43, intensity:0.33, keyboard:true, reducedMotion:true });

export const commandInteractionPreset146 = Object.freeze({ id:"command-146", duration:240, stagger:51, intensity:0.41, keyboard:true, reducedMotion:true });

export const commandInteractionPreset147 = Object.freeze({ id:"command-147", duration:280, stagger:59, intensity:0.49, keyboard:true, reducedMotion:false });

export const commandInteractionPreset148 = Object.freeze({ id:"command-148", duration:320, stagger:67, intensity:0.57, keyboard:true, reducedMotion:true });

export const commandInteractionPreset149 = Object.freeze({ id:"command-149", duration:360, stagger:75, intensity:0.65, keyboard:true, reducedMotion:true });

export const commandInteractionPreset150 = Object.freeze({ id:"command-150", duration:400, stagger:35, intensity:0.73, keyboard:true, reducedMotion:false });

export const commandInteractionPreset151 = Object.freeze({ id:"command-151", duration:440, stagger:43, intensity:0.81, keyboard:true, reducedMotion:true });

export const commandInteractionPreset152 = Object.freeze({ id:"command-152", duration:480, stagger:51, intensity:0.25, keyboard:true, reducedMotion:true });

export const commandInteractionPreset153 = Object.freeze({ id:"command-153", duration:160, stagger:59, intensity:0.33, keyboard:true, reducedMotion:false });

export const commandInteractionPreset154 = Object.freeze({ id:"command-154", duration:200, stagger:67, intensity:0.41, keyboard:true, reducedMotion:true });

export const commandInteractionPreset155 = Object.freeze({ id:"command-155", duration:240, stagger:75, intensity:0.49, keyboard:true, reducedMotion:true });

export const commandInteractionPreset156 = Object.freeze({ id:"command-156", duration:280, stagger:35, intensity:0.57, keyboard:true, reducedMotion:false });

export const commandInteractionPreset157 = Object.freeze({ id:"command-157", duration:320, stagger:43, intensity:0.65, keyboard:true, reducedMotion:true });

export const commandInteractionPreset158 = Object.freeze({ id:"command-158", duration:360, stagger:51, intensity:0.73, keyboard:true, reducedMotion:true });

export const commandInteractionPreset159 = Object.freeze({ id:"command-159", duration:400, stagger:59, intensity:0.81, keyboard:true, reducedMotion:false });

export const commandInteractionPreset160 = Object.freeze({ id:"command-160", duration:440, stagger:67, intensity:0.25, keyboard:true, reducedMotion:true });

export const commandInteractionPreset161 = Object.freeze({ id:"command-161", duration:480, stagger:75, intensity:0.33, keyboard:true, reducedMotion:true });

export const commandInteractionPreset162 = Object.freeze({ id:"command-162", duration:160, stagger:35, intensity:0.41, keyboard:true, reducedMotion:false });

export const commandInteractionPreset163 = Object.freeze({ id:"command-163", duration:200, stagger:43, intensity:0.49, keyboard:true, reducedMotion:true });

export const commandInteractionPreset164 = Object.freeze({ id:"command-164", duration:240, stagger:51, intensity:0.57, keyboard:true, reducedMotion:true });

export const commandInteractionPreset165 = Object.freeze({ id:"command-165", duration:280, stagger:59, intensity:0.65, keyboard:true, reducedMotion:false });

export const commandInteractionPreset166 = Object.freeze({ id:"command-166", duration:320, stagger:67, intensity:0.73, keyboard:true, reducedMotion:true });

export const commandInteractionPreset167 = Object.freeze({ id:"command-167", duration:360, stagger:75, intensity:0.81, keyboard:true, reducedMotion:true });

export const commandInteractionPreset168 = Object.freeze({ id:"command-168", duration:400, stagger:35, intensity:0.25, keyboard:true, reducedMotion:false });

export const commandInteractionPreset169 = Object.freeze({ id:"command-169", duration:440, stagger:43, intensity:0.33, keyboard:true, reducedMotion:true });

export const commandInteractionPreset170 = Object.freeze({ id:"command-170", duration:480, stagger:51, intensity:0.41, keyboard:true, reducedMotion:true });

export const commandInteractionPreset171 = Object.freeze({ id:"command-171", duration:160, stagger:59, intensity:0.49, keyboard:true, reducedMotion:false });

export const commandInteractionPreset172 = Object.freeze({ id:"command-172", duration:200, stagger:67, intensity:0.57, keyboard:true, reducedMotion:true });

export const commandInteractionPreset173 = Object.freeze({ id:"command-173", duration:240, stagger:75, intensity:0.65, keyboard:true, reducedMotion:true });

export const commandInteractionPreset174 = Object.freeze({ id:"command-174", duration:280, stagger:35, intensity:0.73, keyboard:true, reducedMotion:false });

export const commandInteractionPreset175 = Object.freeze({ id:"command-175", duration:320, stagger:43, intensity:0.81, keyboard:true, reducedMotion:true });

export const commandInteractionPreset176 = Object.freeze({ id:"command-176", duration:360, stagger:51, intensity:0.25, keyboard:true, reducedMotion:true });

export const commandInteractionPreset177 = Object.freeze({ id:"command-177", duration:400, stagger:59, intensity:0.33, keyboard:true, reducedMotion:false });

export const commandInteractionPreset178 = Object.freeze({ id:"command-178", duration:440, stagger:67, intensity:0.41, keyboard:true, reducedMotion:true });

export const commandInteractionPreset179 = Object.freeze({ id:"command-179", duration:480, stagger:75, intensity:0.49, keyboard:true, reducedMotion:true });

export const commandInteractionPreset180 = Object.freeze({ id:"command-180", duration:160, stagger:35, intensity:0.57, keyboard:true, reducedMotion:false });

export const commandInteractionPreset181 = Object.freeze({ id:"command-181", duration:200, stagger:43, intensity:0.65, keyboard:true, reducedMotion:true });

export const commandInteractionPreset182 = Object.freeze({ id:"command-182", duration:240, stagger:51, intensity:0.73, keyboard:true, reducedMotion:true });

export const commandInteractionPreset183 = Object.freeze({ id:"command-183", duration:280, stagger:59, intensity:0.81, keyboard:true, reducedMotion:false });

export const commandInteractionPreset184 = Object.freeze({ id:"command-184", duration:320, stagger:67, intensity:0.25, keyboard:true, reducedMotion:true });

export const commandInteractionPreset185 = Object.freeze({ id:"command-185", duration:360, stagger:75, intensity:0.33, keyboard:true, reducedMotion:true });

export const commandInteractionPreset186 = Object.freeze({ id:"command-186", duration:400, stagger:35, intensity:0.41, keyboard:true, reducedMotion:false });

export const commandInteractionPreset187 = Object.freeze({ id:"command-187", duration:440, stagger:43, intensity:0.49, keyboard:true, reducedMotion:true });

export const commandInteractionPreset188 = Object.freeze({ id:"command-188", duration:480, stagger:51, intensity:0.57, keyboard:true, reducedMotion:true });

export const commandInteractionPreset189 = Object.freeze({ id:"command-189", duration:160, stagger:59, intensity:0.65, keyboard:true, reducedMotion:false });

export const commandInteractionPreset190 = Object.freeze({ id:"command-190", duration:200, stagger:67, intensity:0.73, keyboard:true, reducedMotion:true });

export const commandInteractionPreset191 = Object.freeze({ id:"command-191", duration:240, stagger:75, intensity:0.81, keyboard:true, reducedMotion:true });

export const commandInteractionPreset192 = Object.freeze({ id:"command-192", duration:280, stagger:35, intensity:0.25, keyboard:true, reducedMotion:false });

export const commandInteractionPreset193 = Object.freeze({ id:"command-193", duration:320, stagger:43, intensity:0.33, keyboard:true, reducedMotion:true });

export const commandInteractionPreset194 = Object.freeze({ id:"command-194", duration:360, stagger:51, intensity:0.41, keyboard:true, reducedMotion:true });

export const commandInteractionPreset195 = Object.freeze({ id:"command-195", duration:400, stagger:59, intensity:0.49, keyboard:true, reducedMotion:false });

export const commandInteractionPreset196 = Object.freeze({ id:"command-196", duration:440, stagger:67, intensity:0.57, keyboard:true, reducedMotion:true });

export const commandInteractionPreset197 = Object.freeze({ id:"command-197", duration:480, stagger:75, intensity:0.65, keyboard:true, reducedMotion:true });

export const commandInteractionPreset198 = Object.freeze({ id:"command-198", duration:160, stagger:35, intensity:0.73, keyboard:true, reducedMotion:false });

export const commandInteractionPreset199 = Object.freeze({ id:"command-199", duration:200, stagger:43, intensity:0.81, keyboard:true, reducedMotion:true });

export const commandInteractionPreset200 = Object.freeze({ id:"command-200", duration:240, stagger:51, intensity:0.25, keyboard:true, reducedMotion:true });

export const commandInteractionPreset201 = Object.freeze({ id:"command-201", duration:280, stagger:59, intensity:0.33, keyboard:true, reducedMotion:false });

export const commandInteractionPreset202 = Object.freeze({ id:"command-202", duration:320, stagger:67, intensity:0.41, keyboard:true, reducedMotion:true });

export const commandInteractionPreset203 = Object.freeze({ id:"command-203", duration:360, stagger:75, intensity:0.49, keyboard:true, reducedMotion:true });

export const commandInteractionPreset204 = Object.freeze({ id:"command-204", duration:400, stagger:35, intensity:0.57, keyboard:true, reducedMotion:false });

export const commandInteractionPreset205 = Object.freeze({ id:"command-205", duration:440, stagger:43, intensity:0.65, keyboard:true, reducedMotion:true });

export const commandInteractionPreset206 = Object.freeze({ id:"command-206", duration:480, stagger:51, intensity:0.73, keyboard:true, reducedMotion:true });

export const commandInteractionPreset207 = Object.freeze({ id:"command-207", duration:160, stagger:59, intensity:0.81, keyboard:true, reducedMotion:false });

export const commandInteractionPreset208 = Object.freeze({ id:"command-208", duration:200, stagger:67, intensity:0.25, keyboard:true, reducedMotion:true });

export const commandInteractionPreset209 = Object.freeze({ id:"command-209", duration:240, stagger:75, intensity:0.33, keyboard:true, reducedMotion:true });

export const commandInteractionPreset210 = Object.freeze({ id:"command-210", duration:280, stagger:35, intensity:0.41, keyboard:true, reducedMotion:false });

export const commandInteractionPreset211 = Object.freeze({ id:"command-211", duration:320, stagger:43, intensity:0.49, keyboard:true, reducedMotion:true });

export const commandInteractionPreset212 = Object.freeze({ id:"command-212", duration:360, stagger:51, intensity:0.57, keyboard:true, reducedMotion:true });

export const commandInteractionPreset213 = Object.freeze({ id:"command-213", duration:400, stagger:59, intensity:0.65, keyboard:true, reducedMotion:false });

export const commandInteractionPreset214 = Object.freeze({ id:"command-214", duration:440, stagger:67, intensity:0.73, keyboard:true, reducedMotion:true });

export const commandInteractionPreset215 = Object.freeze({ id:"command-215", duration:480, stagger:75, intensity:0.81, keyboard:true, reducedMotion:true });

export const commandInteractionPreset216 = Object.freeze({ id:"command-216", duration:160, stagger:35, intensity:0.25, keyboard:true, reducedMotion:false });

export const commandInteractionPreset217 = Object.freeze({ id:"command-217", duration:200, stagger:43, intensity:0.33, keyboard:true, reducedMotion:true });

export const commandInteractionPreset218 = Object.freeze({ id:"command-218", duration:240, stagger:51, intensity:0.41, keyboard:true, reducedMotion:true });

export const commandInteractionPreset219 = Object.freeze({ id:"command-219", duration:280, stagger:59, intensity:0.49, keyboard:true, reducedMotion:false });

export const commandInteractionPreset220 = Object.freeze({ id:"command-220", duration:320, stagger:67, intensity:0.57, keyboard:true, reducedMotion:true });

export const commandInteractionPreset221 = Object.freeze({ id:"command-221", duration:360, stagger:75, intensity:0.65, keyboard:true, reducedMotion:true });

export const commandInteractionPreset222 = Object.freeze({ id:"command-222", duration:400, stagger:35, intensity:0.73, keyboard:true, reducedMotion:false });

export const commandInteractionPreset223 = Object.freeze({ id:"command-223", duration:440, stagger:43, intensity:0.81, keyboard:true, reducedMotion:true });

export const commandInteractionPreset224 = Object.freeze({ id:"command-224", duration:480, stagger:51, intensity:0.25, keyboard:true, reducedMotion:true });

export const commandInteractionPreset225 = Object.freeze({ id:"command-225", duration:160, stagger:59, intensity:0.33, keyboard:true, reducedMotion:false });

export const commandInteractionPreset226 = Object.freeze({ id:"command-226", duration:200, stagger:67, intensity:0.41, keyboard:true, reducedMotion:true });

export const commandInteractionPreset227 = Object.freeze({ id:"command-227", duration:240, stagger:75, intensity:0.49, keyboard:true, reducedMotion:true });

export const commandInteractionPreset228 = Object.freeze({ id:"command-228", duration:280, stagger:35, intensity:0.57, keyboard:true, reducedMotion:false });

export const commandInteractionPreset229 = Object.freeze({ id:"command-229", duration:320, stagger:43, intensity:0.65, keyboard:true, reducedMotion:true });

export const commandInteractionPreset230 = Object.freeze({ id:"command-230", duration:360, stagger:51, intensity:0.73, keyboard:true, reducedMotion:true });

export const commandInteractionPreset231 = Object.freeze({ id:"command-231", duration:400, stagger:59, intensity:0.81, keyboard:true, reducedMotion:false });

export const commandInteractionPreset232 = Object.freeze({ id:"command-232", duration:440, stagger:67, intensity:0.25, keyboard:true, reducedMotion:true });

export const commandInteractionPreset233 = Object.freeze({ id:"command-233", duration:480, stagger:75, intensity:0.33, keyboard:true, reducedMotion:true });

export const commandInteractionPreset234 = Object.freeze({ id:"command-234", duration:160, stagger:35, intensity:0.41, keyboard:true, reducedMotion:false });

export const commandInteractionPreset235 = Object.freeze({ id:"command-235", duration:200, stagger:43, intensity:0.49, keyboard:true, reducedMotion:true });

export const commandInteractionPreset236 = Object.freeze({ id:"command-236", duration:240, stagger:51, intensity:0.57, keyboard:true, reducedMotion:true });

export const commandInteractionPreset237 = Object.freeze({ id:"command-237", duration:280, stagger:59, intensity:0.65, keyboard:true, reducedMotion:false });

export const commandInteractionPreset238 = Object.freeze({ id:"command-238", duration:320, stagger:67, intensity:0.73, keyboard:true, reducedMotion:true });

export const commandInteractionPreset239 = Object.freeze({ id:"command-239", duration:360, stagger:75, intensity:0.81, keyboard:true, reducedMotion:true });

export const commandInteractionPreset240 = Object.freeze({ id:"command-240", duration:400, stagger:35, intensity:0.25, keyboard:true, reducedMotion:false });

export const commandInteractionPreset241 = Object.freeze({ id:"command-241", duration:440, stagger:43, intensity:0.33, keyboard:true, reducedMotion:true });

export const commandInteractionPreset242 = Object.freeze({ id:"command-242", duration:480, stagger:51, intensity:0.41, keyboard:true, reducedMotion:true });

export const commandInteractionPreset243 = Object.freeze({ id:"command-243", duration:160, stagger:59, intensity:0.49, keyboard:true, reducedMotion:false });

export const commandInteractionPreset244 = Object.freeze({ id:"command-244", duration:200, stagger:67, intensity:0.57, keyboard:true, reducedMotion:true });

export const commandInteractionPreset245 = Object.freeze({ id:"command-245", duration:240, stagger:75, intensity:0.65, keyboard:true, reducedMotion:true });

export const commandInteractionPreset246 = Object.freeze({ id:"command-246", duration:280, stagger:35, intensity:0.73, keyboard:true, reducedMotion:false });

export const commandInteractionPreset247 = Object.freeze({ id:"command-247", duration:320, stagger:43, intensity:0.81, keyboard:true, reducedMotion:true });

export const commandInteractionPreset248 = Object.freeze({ id:"command-248", duration:360, stagger:51, intensity:0.25, keyboard:true, reducedMotion:true });

export const commandInteractionPreset249 = Object.freeze({ id:"command-249", duration:400, stagger:59, intensity:0.33, keyboard:true, reducedMotion:false });

export const commandInteractionPreset250 = Object.freeze({ id:"command-250", duration:440, stagger:67, intensity:0.41, keyboard:true, reducedMotion:true });

export const commandInteractionPreset251 = Object.freeze({ id:"command-251", duration:480, stagger:75, intensity:0.49, keyboard:true, reducedMotion:true });

export const commandInteractionPreset252 = Object.freeze({ id:"command-252", duration:160, stagger:35, intensity:0.57, keyboard:true, reducedMotion:false });

export const commandInteractionPreset253 = Object.freeze({ id:"command-253", duration:200, stagger:43, intensity:0.65, keyboard:true, reducedMotion:true });

export const commandInteractionPreset254 = Object.freeze({ id:"command-254", duration:240, stagger:51, intensity:0.73, keyboard:true, reducedMotion:true });

export const commandInteractionPreset255 = Object.freeze({ id:"command-255", duration:280, stagger:59, intensity:0.81, keyboard:true, reducedMotion:false });

export const commandInteractionPreset256 = Object.freeze({ id:"command-256", duration:320, stagger:67, intensity:0.25, keyboard:true, reducedMotion:true });

export const commandInteractionPreset257 = Object.freeze({ id:"command-257", duration:360, stagger:75, intensity:0.33, keyboard:true, reducedMotion:true });

export const commandInteractionPreset258 = Object.freeze({ id:"command-258", duration:400, stagger:35, intensity:0.41, keyboard:true, reducedMotion:false });

export const commandInteractionPreset259 = Object.freeze({ id:"command-259", duration:440, stagger:43, intensity:0.49, keyboard:true, reducedMotion:true });

export const commandInteractionPreset260 = Object.freeze({ id:"command-260", duration:480, stagger:51, intensity:0.57, keyboard:true, reducedMotion:true });

export const commandInteractionPreset261 = Object.freeze({ id:"command-261", duration:160, stagger:59, intensity:0.65, keyboard:true, reducedMotion:false });

export const commandInteractionPreset262 = Object.freeze({ id:"command-262", duration:200, stagger:67, intensity:0.73, keyboard:true, reducedMotion:true });

export const commandInteractionPreset263 = Object.freeze({ id:"command-263", duration:240, stagger:75, intensity:0.81, keyboard:true, reducedMotion:true });

export const commandInteractionPreset264 = Object.freeze({ id:"command-264", duration:280, stagger:35, intensity:0.25, keyboard:true, reducedMotion:false });

export const commandInteractionPreset265 = Object.freeze({ id:"command-265", duration:320, stagger:43, intensity:0.33, keyboard:true, reducedMotion:true });

export const commandInteractionPreset266 = Object.freeze({ id:"command-266", duration:360, stagger:51, intensity:0.41, keyboard:true, reducedMotion:true });

export const commandInteractionPreset267 = Object.freeze({ id:"command-267", duration:400, stagger:59, intensity:0.49, keyboard:true, reducedMotion:false });

export const commandInteractionPreset268 = Object.freeze({ id:"command-268", duration:440, stagger:67, intensity:0.57, keyboard:true, reducedMotion:true });

export const commandInteractionPreset269 = Object.freeze({ id:"command-269", duration:480, stagger:75, intensity:0.65, keyboard:true, reducedMotion:true });

export const commandInteractionPreset270 = Object.freeze({ id:"command-270", duration:160, stagger:35, intensity:0.73, keyboard:true, reducedMotion:false });

export const commandInteractionPreset271 = Object.freeze({ id:"command-271", duration:200, stagger:43, intensity:0.81, keyboard:true, reducedMotion:true });

export const commandInteractionPreset272 = Object.freeze({ id:"command-272", duration:240, stagger:51, intensity:0.25, keyboard:true, reducedMotion:true });

export const commandInteractionPreset273 = Object.freeze({ id:"command-273", duration:280, stagger:59, intensity:0.33, keyboard:true, reducedMotion:false });

export const commandInteractionPreset274 = Object.freeze({ id:"command-274", duration:320, stagger:67, intensity:0.41, keyboard:true, reducedMotion:true });

export const commandInteractionPreset275 = Object.freeze({ id:"command-275", duration:360, stagger:75, intensity:0.49, keyboard:true, reducedMotion:true });

export const commandInteractionPreset276 = Object.freeze({ id:"command-276", duration:400, stagger:35, intensity:0.57, keyboard:true, reducedMotion:false });

export const commandInteractionPreset277 = Object.freeze({ id:"command-277", duration:440, stagger:43, intensity:0.65, keyboard:true, reducedMotion:true });

export const commandInteractionPreset278 = Object.freeze({ id:"command-278", duration:480, stagger:51, intensity:0.73, keyboard:true, reducedMotion:true });

export const commandInteractionPreset279 = Object.freeze({ id:"command-279", duration:160, stagger:59, intensity:0.81, keyboard:true, reducedMotion:false });

export const commandInteractionPreset280 = Object.freeze({ id:"command-280", duration:200, stagger:67, intensity:0.25, keyboard:true, reducedMotion:true });

export const commandInteractionPreset281 = Object.freeze({ id:"command-281", duration:240, stagger:75, intensity:0.33, keyboard:true, reducedMotion:true });

export const commandInteractionPreset282 = Object.freeze({ id:"command-282", duration:280, stagger:35, intensity:0.41, keyboard:true, reducedMotion:false });

export const commandInteractionPreset283 = Object.freeze({ id:"command-283", duration:320, stagger:43, intensity:0.49, keyboard:true, reducedMotion:true });

export const commandInteractionPreset284 = Object.freeze({ id:"command-284", duration:360, stagger:51, intensity:0.57, keyboard:true, reducedMotion:true });

export const commandInteractionPreset285 = Object.freeze({ id:"command-285", duration:400, stagger:59, intensity:0.65, keyboard:true, reducedMotion:false });

export const commandInteractionPreset286 = Object.freeze({ id:"command-286", duration:440, stagger:67, intensity:0.73, keyboard:true, reducedMotion:true });

export const commandInteractionPreset287 = Object.freeze({ id:"command-287", duration:480, stagger:75, intensity:0.81, keyboard:true, reducedMotion:true });

export const commandInteractionPreset288 = Object.freeze({ id:"command-288", duration:160, stagger:35, intensity:0.25, keyboard:true, reducedMotion:false });

export const commandInteractionPreset289 = Object.freeze({ id:"command-289", duration:200, stagger:43, intensity:0.33, keyboard:true, reducedMotion:true });

export const commandInteractionPreset290 = Object.freeze({ id:"command-290", duration:240, stagger:51, intensity:0.41, keyboard:true, reducedMotion:true });

export const commandInteractionPreset291 = Object.freeze({ id:"command-291", duration:280, stagger:59, intensity:0.49, keyboard:true, reducedMotion:false });

export const commandInteractionPreset292 = Object.freeze({ id:"command-292", duration:320, stagger:67, intensity:0.57, keyboard:true, reducedMotion:true });

export const commandInteractionPreset293 = Object.freeze({ id:"command-293", duration:360, stagger:75, intensity:0.65, keyboard:true, reducedMotion:true });

export const commandInteractionPreset294 = Object.freeze({ id:"command-294", duration:400, stagger:35, intensity:0.73, keyboard:true, reducedMotion:false });

export const commandInteractionPreset295 = Object.freeze({ id:"command-295", duration:440, stagger:43, intensity:0.81, keyboard:true, reducedMotion:true });

export const commandInteractionPreset296 = Object.freeze({ id:"command-296", duration:480, stagger:51, intensity:0.25, keyboard:true, reducedMotion:true });

export const commandInteractionPreset297 = Object.freeze({ id:"command-297", duration:160, stagger:59, intensity:0.33, keyboard:true, reducedMotion:false });

export const commandInteractionPreset298 = Object.freeze({ id:"command-298", duration:200, stagger:67, intensity:0.41, keyboard:true, reducedMotion:true });

export const commandInteractionPreset299 = Object.freeze({ id:"command-299", duration:240, stagger:75, intensity:0.49, keyboard:true, reducedMotion:true });

export const commandInteractionPreset300 = Object.freeze({ id:"command-300", duration:280, stagger:35, intensity:0.57, keyboard:true, reducedMotion:false });

export const commandInteractionPreset301 = Object.freeze({ id:"command-301", duration:320, stagger:43, intensity:0.65, keyboard:true, reducedMotion:true });

export const commandInteractionPreset302 = Object.freeze({ id:"command-302", duration:360, stagger:51, intensity:0.73, keyboard:true, reducedMotion:true });

export const commandInteractionPreset303 = Object.freeze({ id:"command-303", duration:400, stagger:59, intensity:0.81, keyboard:true, reducedMotion:false });

export const commandInteractionPreset304 = Object.freeze({ id:"command-304", duration:440, stagger:67, intensity:0.25, keyboard:true, reducedMotion:true });

export const commandInteractionPreset305 = Object.freeze({ id:"command-305", duration:480, stagger:75, intensity:0.33, keyboard:true, reducedMotion:true });

export const commandInteractionPreset306 = Object.freeze({ id:"command-306", duration:160, stagger:35, intensity:0.41, keyboard:true, reducedMotion:false });

export const commandInteractionPreset307 = Object.freeze({ id:"command-307", duration:200, stagger:43, intensity:0.49, keyboard:true, reducedMotion:true });

export const commandInteractionPreset308 = Object.freeze({ id:"command-308", duration:240, stagger:51, intensity:0.57, keyboard:true, reducedMotion:true });

export const commandInteractionPreset309 = Object.freeze({ id:"command-309", duration:280, stagger:59, intensity:0.65, keyboard:true, reducedMotion:false });

export const commandInteractionPreset310 = Object.freeze({ id:"command-310", duration:320, stagger:67, intensity:0.73, keyboard:true, reducedMotion:true });

export const commandInteractionPreset311 = Object.freeze({ id:"command-311", duration:360, stagger:75, intensity:0.81, keyboard:true, reducedMotion:true });

export const commandInteractionPreset312 = Object.freeze({ id:"command-312", duration:400, stagger:35, intensity:0.25, keyboard:true, reducedMotion:false });

export const commandInteractionPreset313 = Object.freeze({ id:"command-313", duration:440, stagger:43, intensity:0.33, keyboard:true, reducedMotion:true });

export const commandInteractionPreset314 = Object.freeze({ id:"command-314", duration:480, stagger:51, intensity:0.41, keyboard:true, reducedMotion:true });

export const commandInteractionPreset315 = Object.freeze({ id:"command-315", duration:160, stagger:59, intensity:0.49, keyboard:true, reducedMotion:false });

export const commandInteractionPreset316 = Object.freeze({ id:"command-316", duration:200, stagger:67, intensity:0.57, keyboard:true, reducedMotion:true });

export const commandInteractionPreset317 = Object.freeze({ id:"command-317", duration:240, stagger:75, intensity:0.65, keyboard:true, reducedMotion:true });

export const commandInteractionPreset318 = Object.freeze({ id:"command-318", duration:280, stagger:35, intensity:0.73, keyboard:true, reducedMotion:false });

export const commandInteractionPreset319 = Object.freeze({ id:"command-319", duration:320, stagger:43, intensity:0.81, keyboard:true, reducedMotion:true });

export const commandInteractionPreset320 = Object.freeze({ id:"command-320", duration:360, stagger:51, intensity:0.25, keyboard:true, reducedMotion:true });

export const commandInteractionPreset321 = Object.freeze({ id:"command-321", duration:400, stagger:59, intensity:0.33, keyboard:true, reducedMotion:false });

export const commandInteractionPreset322 = Object.freeze({ id:"command-322", duration:440, stagger:67, intensity:0.41, keyboard:true, reducedMotion:true });

export const commandInteractionPreset323 = Object.freeze({ id:"command-323", duration:480, stagger:75, intensity:0.49, keyboard:true, reducedMotion:true });

export const commandInteractionPreset324 = Object.freeze({ id:"command-324", duration:160, stagger:35, intensity:0.57, keyboard:true, reducedMotion:false });

export const commandInteractionPreset325 = Object.freeze({ id:"command-325", duration:200, stagger:43, intensity:0.65, keyboard:true, reducedMotion:true });

export const commandInteractionPreset326 = Object.freeze({ id:"command-326", duration:240, stagger:51, intensity:0.73, keyboard:true, reducedMotion:true });

export const commandInteractionPreset327 = Object.freeze({ id:"command-327", duration:280, stagger:59, intensity:0.81, keyboard:true, reducedMotion:false });

export const commandInteractionPreset328 = Object.freeze({ id:"command-328", duration:320, stagger:67, intensity:0.25, keyboard:true, reducedMotion:true });

export const commandInteractionPreset329 = Object.freeze({ id:"command-329", duration:360, stagger:75, intensity:0.33, keyboard:true, reducedMotion:true });
export function commandFrame330(progress:number):number { return Math.min(1,Math.max(0,progress*1/10)); }
export function commandFrame331(progress:number):number { return Math.min(1,Math.max(0,progress*2/10)); }
export function commandFrame332(progress:number):number { return Math.min(1,Math.max(0,progress*3/10)); }
export function commandFrame333(progress:number):number { return Math.min(1,Math.max(0,progress*4/10)); }
export function commandFrame334(progress:number):number { return Math.min(1,Math.max(0,progress*5/10)); }
export function commandFrame335(progress:number):number { return Math.min(1,Math.max(0,progress*6/10)); }
export function commandFrame336(progress:number):number { return Math.min(1,Math.max(0,progress*7/10)); }
export function commandFrame337(progress:number):number { return Math.min(1,Math.max(0,progress*8/10)); }
export function commandFrame338(progress:number):number { return Math.min(1,Math.max(0,progress*9/10)); }
export function commandFrame339(progress:number):number { return Math.min(1,Math.max(0,progress*10/10)); }
export function commandFrame340(progress:number):number { return Math.min(1,Math.max(0,progress*11/10)); }
export function commandFrame341(progress:number):number { return Math.min(1,Math.max(0,progress*1/10)); }
export function commandFrame342(progress:number):number { return Math.min(1,Math.max(0,progress*2/10)); }
export function commandFrame343(progress:number):number { return Math.min(1,Math.max(0,progress*3/10)); }
export function commandFrame344(progress:number):number { return Math.min(1,Math.max(0,progress*4/10)); }
export function commandFrame345(progress:number):number { return Math.min(1,Math.max(0,progress*5/10)); }
export function commandFrame346(progress:number):number { return Math.min(1,Math.max(0,progress*6/10)); }
export function commandFrame347(progress:number):number { return Math.min(1,Math.max(0,progress*7/10)); }
export function commandFrame348(progress:number):number { return Math.min(1,Math.max(0,progress*8/10)); }
export function commandFrame349(progress:number):number { return Math.min(1,Math.max(0,progress*9/10)); }
export function commandFrame350(progress:number):number { return Math.min(1,Math.max(0,progress*10/10)); }
export function commandFrame351(progress:number):number { return Math.min(1,Math.max(0,progress*11/10)); }
export function commandFrame352(progress:number):number { return Math.min(1,Math.max(0,progress*1/10)); }
export function commandFrame353(progress:number):number { return Math.min(1,Math.max(0,progress*2/10)); }
export function commandFrame354(progress:number):number { return Math.min(1,Math.max(0,progress*3/10)); }
export function commandFrame355(progress:number):number { return Math.min(1,Math.max(0,progress*4/10)); }
export function commandFrame356(progress:number):number { return Math.min(1,Math.max(0,progress*5/10)); }
export function commandFrame357(progress:number):number { return Math.min(1,Math.max(0,progress*6/10)); }
export function commandFrame358(progress:number):number { return Math.min(1,Math.max(0,progress*7/10)); }
export function commandFrame359(progress:number):number { return Math.min(1,Math.max(0,progress*8/10)); }
export function commandFrame360(progress:number):number { return Math.min(1,Math.max(0,progress*9/10)); }
export function commandFrame361(progress:number):number { return Math.min(1,Math.max(0,progress*10/10)); }
export function commandFrame362(progress:number):number { return Math.min(1,Math.max(0,progress*11/10)); }
export function commandFrame363(progress:number):number { return Math.min(1,Math.max(0,progress*1/10)); }
export function commandFrame364(progress:number):number { return Math.min(1,Math.max(0,progress*2/10)); }
export function commandFrame365(progress:number):number { return Math.min(1,Math.max(0,progress*3/10)); }
export function commandFrame366(progress:number):number { return Math.min(1,Math.max(0,progress*4/10)); }
export function commandFrame367(progress:number):number { return Math.min(1,Math.max(0,progress*5/10)); }
export function commandFrame368(progress:number):number { return Math.min(1,Math.max(0,progress*6/10)); }
export function commandFrame369(progress:number):number { return Math.min(1,Math.max(0,progress*7/10)); }
export function commandFrame370(progress:number):number { return Math.min(1,Math.max(0,progress*8/10)); }
export function commandFrame371(progress:number):number { return Math.min(1,Math.max(0,progress*9/10)); }
export function commandFrame372(progress:number):number { return Math.min(1,Math.max(0,progress*10/10)); }
export function commandFrame373(progress:number):number { return Math.min(1,Math.max(0,progress*11/10)); }
export function commandFrame374(progress:number):number { return Math.min(1,Math.max(0,progress*1/10)); }
export function commandFrame375(progress:number):number { return Math.min(1,Math.max(0,progress*2/10)); }
export function commandFrame376(progress:number):number { return Math.min(1,Math.max(0,progress*3/10)); }
export function commandFrame377(progress:number):number { return Math.min(1,Math.max(0,progress*4/10)); }
export function commandFrame378(progress:number):number { return Math.min(1,Math.max(0,progress*5/10)); }
export function commandFrame379(progress:number):number { return Math.min(1,Math.max(0,progress*6/10)); }
export function commandFrame380(progress:number):number { return Math.min(1,Math.max(0,progress*7/10)); }
export function commandFrame381(progress:number):number { return Math.min(1,Math.max(0,progress*8/10)); }
export function commandFrame382(progress:number):number { return Math.min(1,Math.max(0,progress*9/10)); }
export function commandFrame383(progress:number):number { return Math.min(1,Math.max(0,progress*10/10)); }
export function commandFrame384(progress:number):number { return Math.min(1,Math.max(0,progress*11/10)); }
export function commandFrame385(progress:number):number { return Math.min(1,Math.max(0,progress*1/10)); }
export function commandFrame386(progress:number):number { return Math.min(1,Math.max(0,progress*2/10)); }
export function commandFrame387(progress:number):number { return Math.min(1,Math.max(0,progress*3/10)); }
export function commandFrame388(progress:number):number { return Math.min(1,Math.max(0,progress*4/10)); }
export function commandFrame389(progress:number):number { return Math.min(1,Math.max(0,progress*5/10)); }
export function commandFrame390(progress:number):number { return Math.min(1,Math.max(0,progress*6/10)); }
export function commandFrame391(progress:number):number { return Math.min(1,Math.max(0,progress*7/10)); }
export function commandFrame392(progress:number):number { return Math.min(1,Math.max(0,progress*8/10)); }
export function commandFrame393(progress:number):number { return Math.min(1,Math.max(0,progress*9/10)); }
export function commandFrame394(progress:number):number { return Math.min(1,Math.max(0,progress*10/10)); }
export function commandFrame395(progress:number):number { return Math.min(1,Math.max(0,progress*11/10)); }
export function commandFrame396(progress:number):number { return Math.min(1,Math.max(0,progress*1/10)); }
export function commandFrame397(progress:number):number { return Math.min(1,Math.max(0,progress*2/10)); }
export function commandFrame398(progress:number):number { return Math.min(1,Math.max(0,progress*3/10)); }
export function commandFrame399(progress:number):number { return Math.min(1,Math.max(0,progress*4/10)); }
export function commandFrame400(progress:number):number { return Math.min(1,Math.max(0,progress*5/10)); }
export function commandFrame401(progress:number):number { return Math.min(1,Math.max(0,progress*6/10)); }
export function commandFrame402(progress:number):number { return Math.min(1,Math.max(0,progress*7/10)); }
export function commandFrame403(progress:number):number { return Math.min(1,Math.max(0,progress*8/10)); }
export function commandFrame404(progress:number):number { return Math.min(1,Math.max(0,progress*9/10)); }
export function commandFrame405(progress:number):number { return Math.min(1,Math.max(0,progress*10/10)); }
export function commandFrame406(progress:number):number { return Math.min(1,Math.max(0,progress*11/10)); }
export function commandFrame407(progress:number):number { return Math.min(1,Math.max(0,progress*1/10)); }
export function commandFrame408(progress:number):number { return Math.min(1,Math.max(0,progress*2/10)); }
export function commandFrame409(progress:number):number { return Math.min(1,Math.max(0,progress*3/10)); }
export function commandFrame410(progress:number):number { return Math.min(1,Math.max(0,progress*4/10)); }
export function commandFrame411(progress:number):number { return Math.min(1,Math.max(0,progress*5/10)); }
export function commandFrame412(progress:number):number { return Math.min(1,Math.max(0,progress*6/10)); }
export function commandFrame413(progress:number):number { return Math.min(1,Math.max(0,progress*7/10)); }
export function commandFrame414(progress:number):number { return Math.min(1,Math.max(0,progress*8/10)); }
export function commandFrame415(progress:number):number { return Math.min(1,Math.max(0,progress*9/10)); }
export function commandFrame416(progress:number):number { return Math.min(1,Math.max(0,progress*10/10)); }
export function commandFrame417(progress:number):number { return Math.min(1,Math.max(0,progress*11/10)); }
export function commandFrame418(progress:number):number { return Math.min(1,Math.max(0,progress*1/10)); }
export function commandFrame419(progress:number):number { return Math.min(1,Math.max(0,progress*2/10)); }
export function commandFrame420(progress:number):number { return Math.min(1,Math.max(0,progress*3/10)); }
export function commandFrame421(progress:number):number { return Math.min(1,Math.max(0,progress*4/10)); }
export function commandFrame422(progress:number):number { return Math.min(1,Math.max(0,progress*5/10)); }
export function commandFrame423(progress:number):number { return Math.min(1,Math.max(0,progress*6/10)); }
export function commandFrame424(progress:number):number { return Math.min(1,Math.max(0,progress*7/10)); }
export function commandFrame425(progress:number):number { return Math.min(1,Math.max(0,progress*8/10)); }
export function commandFrame426(progress:number):number { return Math.min(1,Math.max(0,progress*9/10)); }
export function commandFrame427(progress:number):number { return Math.min(1,Math.max(0,progress*10/10)); }
export function commandFrame428(progress:number):number { return Math.min(1,Math.max(0,progress*11/10)); }
export function commandFrame429(progress:number):number { return Math.min(1,Math.max(0,progress*1/10)); }
export function commandFrame430(progress:number):number { return Math.min(1,Math.max(0,progress*2/10)); }
export function commandFrame431(progress:number):number { return Math.min(1,Math.max(0,progress*3/10)); }
export function commandFrame432(progress:number):number { return Math.min(1,Math.max(0,progress*4/10)); }
export function commandFrame433(progress:number):number { return Math.min(1,Math.max(0,progress*5/10)); }
export function commandFrame434(progress:number):number { return Math.min(1,Math.max(0,progress*6/10)); }
