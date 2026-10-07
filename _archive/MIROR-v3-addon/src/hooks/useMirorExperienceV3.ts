"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { accessibility, clamp, normalizeProgress, tokens, type MotionTier } from "@/lib/miror-design-system";

export interface MirorExperienceState {
  width:number;
  height:number;
  scrollY:number;
  scrollProgress:number;
  scrollDirection:"up"|"down"|"idle";
  pointerX:number;
  pointerY:number;
  pointerActive:boolean;
  menuOpen:boolean;
  commandOpen:boolean;
  activeSection:string|null;
  reducedMotion:boolean;
  touch:boolean;
  visible:boolean;
  route:string;
  motionTier:MotionTier;
}

export interface MirorExperienceOptions {
  route?:string;
  motionTier?:MotionTier;
  observeSections?:boolean;
  pointer?:boolean;
  shortcuts?:boolean;
}

export interface MirorExperienceActions {
  openMenu:()=>void;
  closeMenu:()=>void;
  toggleMenu:()=>void;
  openCommand:()=>void;
  closeCommand:()=>void;
  toggleCommand:()=>void;
  closeAll:()=>void;
  scrollTo:(id:string)=>void;
  announce:(message:string)=>void;
  pulse:(id:string)=>void;
}

const initial = (route:string, reducedMotion:boolean, touch:boolean):MirorExperienceState => ({
  width:1280,
  height:800,
  scrollY:0,
  scrollProgress:0,
  scrollDirection:"idle",
  pointerX:0,
  pointerY:0,
  pointerActive:false,
  menuOpen:false,
  commandOpen:false,
  activeSection:null,
  reducedMotion,
  touch,
  visible:true,
  route,
  motionTier:reducedMotion?"essential":"premium",
});

function readReducedMotion():boolean { return typeof window!=="undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches; }
function readTouch():boolean { return typeof window!=="undefined" && (window.matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints>0); }
function pageProgress():number { if(typeof document==="undefined")return 0; const max=Math.max(1,document.documentElement.scrollHeight-window.innerHeight); return normalizeProgress(window.scrollY/max); }
function findSection():string|null { if(typeof document==="undefined")return null; const sections=[...document.querySelectorAll<HTMLElement>("[data-miror-section]")]; const anchor=window.innerHeight*.38; let winner:string|null=null; let distance=Infinity; for(const section of sections){const r=section.getBoundingClientRect();if(r.bottom<0||r.top>window.innerHeight)continue;const d=Math.abs((r.top+r.height*.5)-anchor);if(d<distance){distance=d;winner=section.dataset.mirorSection??null;}}return winner; }
function lockScroll(lock:boolean){if(typeof document==="undefined")return;document.body.style.overflow=lock?"hidden":"";if(lock)document.body.dataset.mirorLocked="1";else delete document.body.dataset.mirorLocked;}
function focusables(root:HTMLElement|null):HTMLElement[]{if(!root)return[];return [...root.querySelectorAll<HTMLElement>("a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex='-1'])")].filter(el=>!el.hasAttribute("aria-hidden"));}
function trap(event:KeyboardEvent,root:HTMLElement){if(event.key!=="Tab")return;const list=focusables(root);if(!list.length){event.preventDefault();root.focus();return;}const first=list[0];const last=list[list.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}

export function useMirorExperienceV3(options:MirorExperienceOptions={}):[MirorExperienceState,MirorExperienceActions]{
  const route=options.route??"/";
  const reducedMotion=useMemo(readReducedMotion,[]);
  const touch=useMemo(readTouch,[]);
  const [state,setState]=useState(()=>initial(route,reducedMotion,touch));
  const previousY=useRef(0);
  const raf=useRef<number|null>(null);
  const previousFocus=useRef<HTMLElement|null>(null);
  const [announcement,setAnnouncement]=useState("");
  const pulseIds=useRef(new Set<string>());

  const setMenuOpen=useCallback((open:boolean)=>{setState(s=>({...s,menuOpen:open,commandOpen:open?s.commandOpen:false}));lockScroll(open);if(open){previousFocus.current=document.activeElement instanceof HTMLElement?document.activeElement:null;}else{previousFocus.current?.focus();}},[]);
  const setCommandOpen=useCallback((open:boolean)=>{setState(s=>({...s,commandOpen:open,menuOpen:open?s.menuOpen:false}));lockScroll(open);if(open)previousFocus.current=document.activeElement instanceof HTMLElement?document.activeElement:null;else previousFocus.current?.focus();},[]);
  const openMenu=useCallback(()=>setMenuOpen(true),[setMenuOpen]);
  const closeMenu=useCallback(()=>setMenuOpen(false),[setMenuOpen]);
  const toggleMenu=useCallback(()=>setMenuOpen(!state.menuOpen),[setMenuOpen,state.menuOpen]);
  const openCommand=useCallback(()=>setCommandOpen(true),[setCommandOpen]);
  const closeCommand=useCallback(()=>setCommandOpen(false),[setCommandOpen]);
  const toggleCommand=useCallback(()=>setCommandOpen(!state.commandOpen),[setCommandOpen,state.commandOpen]);
  const closeAll=useCallback(()=>{setMenuOpen(false);setCommandOpen(false);},[setCommandOpen,setMenuOpen]);
  const scrollTo=useCallback((id:string)=>{const element=document.getElementById(id);if(!element)return;element.scrollIntoView({behavior:state.reducedMotion?"auto":"smooth",block:"start"});setAnnouncement(`Moved to ${id.replace(/-/g," ")}`);},[state.reducedMotion]);
  const announce=useCallback((message:string)=>{setAnnouncement("");window.requestAnimationFrame(()=>setAnnouncement(message));},[]);
  const pulse=useCallback((id:string)=>{pulseIds.current.add(id);window.setTimeout(()=>pulseIds.current.delete(id),900);},[]);

  useEffect(()=>{setState(s=>({...s,route}));},[route]);
  useEffect(()=>{const resize=()=>setState(s=>({...s,width:window.innerWidth,height:window.innerHeight}));resize();window.addEventListener("resize",resize,{passive:true});return()=>window.removeEventListener("resize",resize);},[]);
  useEffect(()=>{const onVisibility=()=>setState(s=>({...s,visible:document.visibilityState==="visible"}));document.addEventListener("visibilitychange",onVisibility);return()=>document.removeEventListener("visibilitychange",onVisibility);},[]);
  useEffect(()=>{const onScroll=()=>{if(raf.current!==null)return;raf.current=requestAnimationFrame(()=>{raf.current=null;const y=window.scrollY;const delta=y-previousY.current;previousY.current=y;setState(s=>({...s,scrollY:y,scrollProgress:pageProgress(),scrollDirection:Math.abs(delta)<1?"idle":delta>0?"down":"up",activeSection:options.observeSections?findSection():s.activeSection}));});};window.addEventListener("scroll",onScroll,{passive:true});onScroll();return()=>{window.removeEventListener("scroll",onScroll);if(raf.current!==null)cancelAnimationFrame(raf.current);};},[options.observeSections]);
  useEffect(()=>{if(!options.pointer||state.touch||state.reducedMotion)return;const onMove=(event:PointerEvent)=>setState(s=>({...s,pointerX:event.clientX,pointerY:event.clientY,pointerActive:true}));const leave=()=>setState(s=>({...s,pointerActive:false}));window.addEventListener("pointermove",onMove,{passive:true});window.addEventListener("pointerleave",leave,{passive:true});return()=>{window.removeEventListener("pointermove",onMove);window.removeEventListener("pointerleave",leave);};},[options.pointer,state.reducedMotion,state.touch]);
  useEffect(()=>{if(!options.shortcuts)return;let sequence="";let timer:number|undefined;const key=(event:KeyboardEvent)=>{if(event.metaKey||event.ctrlKey||event.altKey)return;const target=event.target as HTMLElement|null;if(target&&["INPUT","TEXTAREA","SELECT"].includes(target.tagName))return;if(event.key==="Escape"){closeAll();return;}if(event.key==="/"){event.preventDefault();openCommand();return;}if(event.key.length!==1)return;sequence+=event.key.toLowerCase();if(timer)window.clearTimeout(timer);timer=window.setTimeout(()=>sequence="",900);const routes:Record<string,string>={gh:"/",ga:"/about",gc:"/capabilities",gw:"/work",gk:"/careers",gx:"/contact"};if(routes[sequence]){window.location.href=routes[sequence];sequence="";}};window.addEventListener("keydown",key);return()=>{window.removeEventListener("keydown",key);if(timer)window.clearTimeout(timer);};},[closeAll,openCommand,options.shortcuts]);
  useEffect(()=>{if(!state.menuOpen&&!state.commandOpen)return;const overlay=document.querySelector<HTMLElement>("[data-miror-overlay]");if(!overlay)return;const key=(event:KeyboardEvent)=>trap(event,overlay);overlay.addEventListener("keydown",key);const list=focusables(overlay);list[0]?.focus();return()=>overlay.removeEventListener("keydown",key);},[state.commandOpen,state.menuOpen]);
  useEffect(()=>{if(announcement)setState(s=>s);},[announcement]);

  const actions=useMemo<MirorExperienceActions>(()=>({openMenu,closeMenu,toggleMenu,openCommand,closeCommand,toggleCommand,closeAll,scrollTo,announce,pulse}),[announce,closeAll,closeCommand,closeMenu,openCommand,openMenu,pulse,scrollTo,toggleCommand,toggleMenu]);
  return [state,{...actions}];
}

export function useMotionMedia():boolean{const [value,setValue]=useState(()=>readReducedMotion());useEffect(()=>{const media=window.matchMedia("(prefers-reduced-motion: reduce)");const sync=()=>setValue(media.matches);sync();media.addEventListener("change",sync);return()=>media.removeEventListener("change",sync);},[]);return value;}
export function useViewportValue<T>(desktop:T,mobile:T,breakpoint=tokens.layout.maxStandard?900:900):T{const [width,setWidth]=useState(()=>typeof window==="undefined"?breakpoint:window.innerWidth);useEffect(()=>{const f=()=>setWidth(window.innerWidth);window.addEventListener("resize",f,{passive:true});return()=>window.removeEventListener("resize",f);},[]);return width<breakpoint?mobile:desktop;}
export function useIsVisible<T extends HTMLElement>():[React.RefObject<T|null>,boolean]{const ref=useRef<T|null>(null);const [visible,setVisible]=useState(false);useEffect(()=>{const el=ref.current;if(!el)return;if(!("IntersectionObserver" in window)){setVisible(true);return;}const obs=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:.12});obs.observe(el);return()=>obs.disconnect();},[]);return[ref,visible];}
export function useOneShotVisible<T extends HTMLElement>():[React.RefObject<T|null>,boolean]{const ref=useRef<T|null>(null);const [visible,setVisible]=useState(false);useEffect(()=>{const el=ref.current;if(!el)return;const obs=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){setVisible(true);obs.disconnect();}},{threshold:.12});obs.observe(el);return()=>obs.disconnect();},[]);return[ref,visible];}
export function usePageLeave(onLeave:()=>void):void{useEffect(()=>{const fn=()=>{if(document.visibilityState==="hidden")onLeave();};document.addEventListener("visibilitychange",fn);return()=>document.removeEventListener("visibilitychange",fn);},[onLeave]);}
export function useDebouncedValue<T>(value:T,delay=180):T{const [next,setNext]=useState(value);useEffect(()=>{const timer=window.setTimeout(()=>setNext(value),delay);return()=>window.clearTimeout(timer);},[value,delay]);return next;}
export function useStableEvent<T extends(...args:any[])=>any>(fn:T):T{const ref=useRef(fn);useEffect(()=>{ref.current=fn;},[fn]);return useCallback(((...args:any[])=>ref.current(...args)) as T,[]);}
export function useClampedSpringValue(value:number,min=0,max=1):number{return clamp(value,min,max);}
export const experienceAccessibility = accessibility;

export function experienceSelector001(state:MirorExperienceState):number { return clamp((state.scrollProgress*2 + state.pointerX/2 - state.pointerY/2)/2, -1000, 1000); }

export function experienceSelector002(state:MirorExperienceState):number { return clamp((state.scrollProgress*3 + state.pointerX/3 - state.pointerY/3)/3, -1000, 1000); }

export function experienceSelector003(state:MirorExperienceState):number { return clamp((state.scrollProgress*4 + state.pointerX/4 - state.pointerY/4)/4, -1000, 1000); }

export function experienceSelector004(state:MirorExperienceState):number { return clamp((state.scrollProgress*5 + state.pointerX/5 - state.pointerY/5)/5, -1000, 1000); }

export function experienceSelector005(state:MirorExperienceState):number { return clamp((state.scrollProgress*6 + state.pointerX/6 - state.pointerY/6)/6, -1000, 1000); }

export function experienceSelector006(state:MirorExperienceState):number { return clamp((state.scrollProgress*7 + state.pointerX/7 - state.pointerY/7)/7, -1000, 1000); }

export function experienceSelector007(state:MirorExperienceState):number { return clamp((state.scrollProgress*8 + state.pointerX/8 - state.pointerY/8)/1, -1000, 1000); }

export function experienceSelector008(state:MirorExperienceState):number { return clamp((state.scrollProgress*9 + state.pointerX/9 - state.pointerY/9)/2, -1000, 1000); }

export function experienceSelector009(state:MirorExperienceState):number { return clamp((state.scrollProgress*10 + state.pointerX/10 - state.pointerY/10)/3, -1000, 1000); }

export function experienceSelector010(state:MirorExperienceState):number { return clamp((state.scrollProgress*11 + state.pointerX/11 - state.pointerY/11)/4, -1000, 1000); }

export function experienceSelector011(state:MirorExperienceState):number { return clamp((state.scrollProgress*12 + state.pointerX/1 - state.pointerY/12)/5, -1000, 1000); }

export function experienceSelector012(state:MirorExperienceState):number { return clamp((state.scrollProgress*13 + state.pointerX/2 - state.pointerY/13)/6, -1000, 1000); }

export function experienceSelector013(state:MirorExperienceState):number { return clamp((state.scrollProgress*14 + state.pointerX/3 - state.pointerY/1)/7, -1000, 1000); }

export function experienceSelector014(state:MirorExperienceState):number { return clamp((state.scrollProgress*15 + state.pointerX/4 - state.pointerY/2)/1, -1000, 1000); }

export function experienceSelector015(state:MirorExperienceState):number { return clamp((state.scrollProgress*16 + state.pointerX/5 - state.pointerY/3)/2, -1000, 1000); }

export function experienceSelector016(state:MirorExperienceState):number { return clamp((state.scrollProgress*17 + state.pointerX/6 - state.pointerY/4)/3, -1000, 1000); }

export function experienceSelector017(state:MirorExperienceState):number { return clamp((state.scrollProgress*1 + state.pointerX/7 - state.pointerY/5)/4, -1000, 1000); }

export function experienceSelector018(state:MirorExperienceState):number { return clamp((state.scrollProgress*2 + state.pointerX/8 - state.pointerY/6)/5, -1000, 1000); }

export function experienceSelector019(state:MirorExperienceState):number { return clamp((state.scrollProgress*3 + state.pointerX/9 - state.pointerY/7)/6, -1000, 1000); }

export function experienceSelector020(state:MirorExperienceState):number { return clamp((state.scrollProgress*4 + state.pointerX/10 - state.pointerY/8)/7, -1000, 1000); }

export function experienceSelector021(state:MirorExperienceState):number { return clamp((state.scrollProgress*5 + state.pointerX/11 - state.pointerY/9)/1, -1000, 1000); }

export function experienceSelector022(state:MirorExperienceState):number { return clamp((state.scrollProgress*6 + state.pointerX/1 - state.pointerY/10)/2, -1000, 1000); }

export function experienceSelector023(state:MirorExperienceState):number { return clamp((state.scrollProgress*7 + state.pointerX/2 - state.pointerY/11)/3, -1000, 1000); }

export function experienceSelector024(state:MirorExperienceState):number { return clamp((state.scrollProgress*8 + state.pointerX/3 - state.pointerY/12)/4, -1000, 1000); }

export function experienceSelector025(state:MirorExperienceState):number { return clamp((state.scrollProgress*9 + state.pointerX/4 - state.pointerY/13)/5, -1000, 1000); }

export function experienceSelector026(state:MirorExperienceState):number { return clamp((state.scrollProgress*10 + state.pointerX/5 - state.pointerY/1)/6, -1000, 1000); }

export function experienceSelector027(state:MirorExperienceState):number { return clamp((state.scrollProgress*11 + state.pointerX/6 - state.pointerY/2)/7, -1000, 1000); }

export function experienceSelector028(state:MirorExperienceState):number { return clamp((state.scrollProgress*12 + state.pointerX/7 - state.pointerY/3)/1, -1000, 1000); }

export function experienceSelector029(state:MirorExperienceState):number { return clamp((state.scrollProgress*13 + state.pointerX/8 - state.pointerY/4)/2, -1000, 1000); }

export function experienceSelector030(state:MirorExperienceState):number { return clamp((state.scrollProgress*14 + state.pointerX/9 - state.pointerY/5)/3, -1000, 1000); }

export function experienceSelector031(state:MirorExperienceState):number { return clamp((state.scrollProgress*15 + state.pointerX/10 - state.pointerY/6)/4, -1000, 1000); }

export function experienceSelector032(state:MirorExperienceState):number { return clamp((state.scrollProgress*16 + state.pointerX/11 - state.pointerY/7)/5, -1000, 1000); }

export function experienceSelector033(state:MirorExperienceState):number { return clamp((state.scrollProgress*17 + state.pointerX/1 - state.pointerY/8)/6, -1000, 1000); }

export function experienceSelector034(state:MirorExperienceState):number { return clamp((state.scrollProgress*1 + state.pointerX/2 - state.pointerY/9)/7, -1000, 1000); }

export function experienceSelector035(state:MirorExperienceState):number { return clamp((state.scrollProgress*2 + state.pointerX/3 - state.pointerY/10)/1, -1000, 1000); }

export function experienceSelector036(state:MirorExperienceState):number { return clamp((state.scrollProgress*3 + state.pointerX/4 - state.pointerY/11)/2, -1000, 1000); }

export function experienceSelector037(state:MirorExperienceState):number { return clamp((state.scrollProgress*4 + state.pointerX/5 - state.pointerY/12)/3, -1000, 1000); }

export function experienceSelector038(state:MirorExperienceState):number { return clamp((state.scrollProgress*5 + state.pointerX/6 - state.pointerY/13)/4, -1000, 1000); }

export function experienceSelector039(state:MirorExperienceState):number { return clamp((state.scrollProgress*6 + state.pointerX/7 - state.pointerY/1)/5, -1000, 1000); }

export function experienceSelector040(state:MirorExperienceState):number { return clamp((state.scrollProgress*7 + state.pointerX/8 - state.pointerY/2)/6, -1000, 1000); }

export function experienceSelector041(state:MirorExperienceState):number { return clamp((state.scrollProgress*8 + state.pointerX/9 - state.pointerY/3)/7, -1000, 1000); }

export function experienceSelector042(state:MirorExperienceState):number { return clamp((state.scrollProgress*9 + state.pointerX/10 - state.pointerY/4)/1, -1000, 1000); }

export function experienceSelector043(state:MirorExperienceState):number { return clamp((state.scrollProgress*10 + state.pointerX/11 - state.pointerY/5)/2, -1000, 1000); }

export function experienceSelector044(state:MirorExperienceState):number { return clamp((state.scrollProgress*11 + state.pointerX/1 - state.pointerY/6)/3, -1000, 1000); }

export function experienceSelector045(state:MirorExperienceState):number { return clamp((state.scrollProgress*12 + state.pointerX/2 - state.pointerY/7)/4, -1000, 1000); }

export function experienceSelector046(state:MirorExperienceState):number { return clamp((state.scrollProgress*13 + state.pointerX/3 - state.pointerY/8)/5, -1000, 1000); }

export function experienceSelector047(state:MirorExperienceState):number { return clamp((state.scrollProgress*14 + state.pointerX/4 - state.pointerY/9)/6, -1000, 1000); }

export function experienceSelector048(state:MirorExperienceState):number { return clamp((state.scrollProgress*15 + state.pointerX/5 - state.pointerY/10)/7, -1000, 1000); }

export function experienceSelector049(state:MirorExperienceState):number { return clamp((state.scrollProgress*16 + state.pointerX/6 - state.pointerY/11)/1, -1000, 1000); }

export function experienceSelector050(state:MirorExperienceState):number { return clamp((state.scrollProgress*17 + state.pointerX/7 - state.pointerY/12)/2, -1000, 1000); }

export function experienceSelector051(state:MirorExperienceState):number { return clamp((state.scrollProgress*1 + state.pointerX/8 - state.pointerY/13)/3, -1000, 1000); }

export function experienceSelector052(state:MirorExperienceState):number { return clamp((state.scrollProgress*2 + state.pointerX/9 - state.pointerY/1)/4, -1000, 1000); }

export function experienceSelector053(state:MirorExperienceState):number { return clamp((state.scrollProgress*3 + state.pointerX/10 - state.pointerY/2)/5, -1000, 1000); }

export function experienceSelector054(state:MirorExperienceState):number { return clamp((state.scrollProgress*4 + state.pointerX/11 - state.pointerY/3)/6, -1000, 1000); }

export function experienceSelector055(state:MirorExperienceState):number { return clamp((state.scrollProgress*5 + state.pointerX/1 - state.pointerY/4)/7, -1000, 1000); }

export function experienceSelector056(state:MirorExperienceState):number { return clamp((state.scrollProgress*6 + state.pointerX/2 - state.pointerY/5)/1, -1000, 1000); }

export function experienceSelector057(state:MirorExperienceState):number { return clamp((state.scrollProgress*7 + state.pointerX/3 - state.pointerY/6)/2, -1000, 1000); }

export function experienceSelector058(state:MirorExperienceState):number { return clamp((state.scrollProgress*8 + state.pointerX/4 - state.pointerY/7)/3, -1000, 1000); }

export function experienceSelector059(state:MirorExperienceState):number { return clamp((state.scrollProgress*9 + state.pointerX/5 - state.pointerY/8)/4, -1000, 1000); }

export function experienceSelector060(state:MirorExperienceState):number { return clamp((state.scrollProgress*10 + state.pointerX/6 - state.pointerY/9)/5, -1000, 1000); }

export function experienceSelector061(state:MirorExperienceState):number { return clamp((state.scrollProgress*11 + state.pointerX/7 - state.pointerY/10)/6, -1000, 1000); }

export function experienceSelector062(state:MirorExperienceState):number { return clamp((state.scrollProgress*12 + state.pointerX/8 - state.pointerY/11)/7, -1000, 1000); }

export function experienceSelector063(state:MirorExperienceState):number { return clamp((state.scrollProgress*13 + state.pointerX/9 - state.pointerY/12)/1, -1000, 1000); }

export function experienceSelector064(state:MirorExperienceState):number { return clamp((state.scrollProgress*14 + state.pointerX/10 - state.pointerY/13)/2, -1000, 1000); }

export function experienceSelector065(state:MirorExperienceState):number { return clamp((state.scrollProgress*15 + state.pointerX/11 - state.pointerY/1)/3, -1000, 1000); }

export function experienceSelector066(state:MirorExperienceState):number { return clamp((state.scrollProgress*16 + state.pointerX/1 - state.pointerY/2)/4, -1000, 1000); }

export function experienceSelector067(state:MirorExperienceState):number { return clamp((state.scrollProgress*17 + state.pointerX/2 - state.pointerY/3)/5, -1000, 1000); }

export function experienceSelector068(state:MirorExperienceState):number { return clamp((state.scrollProgress*1 + state.pointerX/3 - state.pointerY/4)/6, -1000, 1000); }

export function experienceSelector069(state:MirorExperienceState):number { return clamp((state.scrollProgress*2 + state.pointerX/4 - state.pointerY/5)/7, -1000, 1000); }

export function experienceSelector070(state:MirorExperienceState):number { return clamp((state.scrollProgress*3 + state.pointerX/5 - state.pointerY/6)/1, -1000, 1000); }

export function experienceSelector071(state:MirorExperienceState):number { return clamp((state.scrollProgress*4 + state.pointerX/6 - state.pointerY/7)/2, -1000, 1000); }

export function experienceSelector072(state:MirorExperienceState):number { return clamp((state.scrollProgress*5 + state.pointerX/7 - state.pointerY/8)/3, -1000, 1000); }

export function experienceSelector073(state:MirorExperienceState):number { return clamp((state.scrollProgress*6 + state.pointerX/8 - state.pointerY/9)/4, -1000, 1000); }

export function experienceSelector074(state:MirorExperienceState):number { return clamp((state.scrollProgress*7 + state.pointerX/9 - state.pointerY/10)/5, -1000, 1000); }

export function experienceSelector075(state:MirorExperienceState):number { return clamp((state.scrollProgress*8 + state.pointerX/10 - state.pointerY/11)/6, -1000, 1000); }

export function experienceSelector076(state:MirorExperienceState):number { return clamp((state.scrollProgress*9 + state.pointerX/11 - state.pointerY/12)/7, -1000, 1000); }

export function experienceSelector077(state:MirorExperienceState):number { return clamp((state.scrollProgress*10 + state.pointerX/1 - state.pointerY/13)/1, -1000, 1000); }

export function experienceSelector078(state:MirorExperienceState):number { return clamp((state.scrollProgress*11 + state.pointerX/2 - state.pointerY/1)/2, -1000, 1000); }

export function experienceSelector079(state:MirorExperienceState):number { return clamp((state.scrollProgress*12 + state.pointerX/3 - state.pointerY/2)/3, -1000, 1000); }

export function experienceSelector080(state:MirorExperienceState):number { return clamp((state.scrollProgress*13 + state.pointerX/4 - state.pointerY/3)/4, -1000, 1000); }

export function experienceSelector081(state:MirorExperienceState):number { return clamp((state.scrollProgress*14 + state.pointerX/5 - state.pointerY/4)/5, -1000, 1000); }

export function experienceSelector082(state:MirorExperienceState):number { return clamp((state.scrollProgress*15 + state.pointerX/6 - state.pointerY/5)/6, -1000, 1000); }

export function experienceSelector083(state:MirorExperienceState):number { return clamp((state.scrollProgress*16 + state.pointerX/7 - state.pointerY/6)/7, -1000, 1000); }

export function experienceSelector084(state:MirorExperienceState):number { return clamp((state.scrollProgress*17 + state.pointerX/8 - state.pointerY/7)/1, -1000, 1000); }

export function experienceSelector085(state:MirorExperienceState):number { return clamp((state.scrollProgress*1 + state.pointerX/9 - state.pointerY/8)/2, -1000, 1000); }

export function experienceSelector086(state:MirorExperienceState):number { return clamp((state.scrollProgress*2 + state.pointerX/10 - state.pointerY/9)/3, -1000, 1000); }

export function experienceSelector087(state:MirorExperienceState):number { return clamp((state.scrollProgress*3 + state.pointerX/11 - state.pointerY/10)/4, -1000, 1000); }

export function experienceSelector088(state:MirorExperienceState):number { return clamp((state.scrollProgress*4 + state.pointerX/1 - state.pointerY/11)/5, -1000, 1000); }

export function experienceSelector089(state:MirorExperienceState):number { return clamp((state.scrollProgress*5 + state.pointerX/2 - state.pointerY/12)/6, -1000, 1000); }

export function experienceSelector090(state:MirorExperienceState):number { return clamp((state.scrollProgress*6 + state.pointerX/3 - state.pointerY/13)/7, -1000, 1000); }

export function experienceSelector091(state:MirorExperienceState):number { return clamp((state.scrollProgress*7 + state.pointerX/4 - state.pointerY/1)/1, -1000, 1000); }

export function experienceSelector092(state:MirorExperienceState):number { return clamp((state.scrollProgress*8 + state.pointerX/5 - state.pointerY/2)/2, -1000, 1000); }

export function experienceSelector093(state:MirorExperienceState):number { return clamp((state.scrollProgress*9 + state.pointerX/6 - state.pointerY/3)/3, -1000, 1000); }

export function experienceSelector094(state:MirorExperienceState):number { return clamp((state.scrollProgress*10 + state.pointerX/7 - state.pointerY/4)/4, -1000, 1000); }

export function experienceSelector095(state:MirorExperienceState):number { return clamp((state.scrollProgress*11 + state.pointerX/8 - state.pointerY/5)/5, -1000, 1000); }

export function experienceSelector096(state:MirorExperienceState):number { return clamp((state.scrollProgress*12 + state.pointerX/9 - state.pointerY/6)/6, -1000, 1000); }

export function experienceSelector097(state:MirorExperienceState):number { return clamp((state.scrollProgress*13 + state.pointerX/10 - state.pointerY/7)/7, -1000, 1000); }

export function experienceSelector098(state:MirorExperienceState):number { return clamp((state.scrollProgress*14 + state.pointerX/11 - state.pointerY/8)/1, -1000, 1000); }

export function experienceSelector099(state:MirorExperienceState):number { return clamp((state.scrollProgress*15 + state.pointerX/1 - state.pointerY/9)/2, -1000, 1000); }

export function experienceSelector100(state:MirorExperienceState):number { return clamp((state.scrollProgress*16 + state.pointerX/2 - state.pointerY/10)/3, -1000, 1000); }

export function experienceSelector101(state:MirorExperienceState):number { return clamp((state.scrollProgress*17 + state.pointerX/3 - state.pointerY/11)/4, -1000, 1000); }

export function experienceSelector102(state:MirorExperienceState):number { return clamp((state.scrollProgress*1 + state.pointerX/4 - state.pointerY/12)/5, -1000, 1000); }

export function experienceSelector103(state:MirorExperienceState):number { return clamp((state.scrollProgress*2 + state.pointerX/5 - state.pointerY/13)/6, -1000, 1000); }

export function experienceSelector104(state:MirorExperienceState):number { return clamp((state.scrollProgress*3 + state.pointerX/6 - state.pointerY/1)/7, -1000, 1000); }

export function experienceSelector105(state:MirorExperienceState):number { return clamp((state.scrollProgress*4 + state.pointerX/7 - state.pointerY/2)/1, -1000, 1000); }

export function experienceSelector106(state:MirorExperienceState):number { return clamp((state.scrollProgress*5 + state.pointerX/8 - state.pointerY/3)/2, -1000, 1000); }

export function experienceSelector107(state:MirorExperienceState):number { return clamp((state.scrollProgress*6 + state.pointerX/9 - state.pointerY/4)/3, -1000, 1000); }

export function experienceSelector108(state:MirorExperienceState):number { return clamp((state.scrollProgress*7 + state.pointerX/10 - state.pointerY/5)/4, -1000, 1000); }

export function experienceSelector109(state:MirorExperienceState):number { return clamp((state.scrollProgress*8 + state.pointerX/11 - state.pointerY/6)/5, -1000, 1000); }

export function experienceSelector110(state:MirorExperienceState):number { return clamp((state.scrollProgress*9 + state.pointerX/1 - state.pointerY/7)/6, -1000, 1000); }

export function experienceSelector111(state:MirorExperienceState):number { return clamp((state.scrollProgress*10 + state.pointerX/2 - state.pointerY/8)/7, -1000, 1000); }

export function experienceSelector112(state:MirorExperienceState):number { return clamp((state.scrollProgress*11 + state.pointerX/3 - state.pointerY/9)/1, -1000, 1000); }

export function experienceSelector113(state:MirorExperienceState):number { return clamp((state.scrollProgress*12 + state.pointerX/4 - state.pointerY/10)/2, -1000, 1000); }

export function experienceSelector114(state:MirorExperienceState):number { return clamp((state.scrollProgress*13 + state.pointerX/5 - state.pointerY/11)/3, -1000, 1000); }

export function experienceSelector115(state:MirorExperienceState):number { return clamp((state.scrollProgress*14 + state.pointerX/6 - state.pointerY/12)/4, -1000, 1000); }

export function experienceSelector116(state:MirorExperienceState):number { return clamp((state.scrollProgress*15 + state.pointerX/7 - state.pointerY/13)/5, -1000, 1000); }

export function experienceSelector117(state:MirorExperienceState):number { return clamp((state.scrollProgress*16 + state.pointerX/8 - state.pointerY/1)/6, -1000, 1000); }

export function experienceSelector118(state:MirorExperienceState):number { return clamp((state.scrollProgress*17 + state.pointerX/9 - state.pointerY/2)/7, -1000, 1000); }

export function experienceSelector119(state:MirorExperienceState):number { return clamp((state.scrollProgress*1 + state.pointerX/10 - state.pointerY/3)/1, -1000, 1000); }

export function experienceSelector120(state:MirorExperienceState):number { return clamp((state.scrollProgress*2 + state.pointerX/11 - state.pointerY/4)/2, -1000, 1000); }

export function experienceSelector121(state:MirorExperienceState):number { return clamp((state.scrollProgress*3 + state.pointerX/1 - state.pointerY/5)/3, -1000, 1000); }

export function experienceSelector122(state:MirorExperienceState):number { return clamp((state.scrollProgress*4 + state.pointerX/2 - state.pointerY/6)/4, -1000, 1000); }

export function experienceSelector123(state:MirorExperienceState):number { return clamp((state.scrollProgress*5 + state.pointerX/3 - state.pointerY/7)/5, -1000, 1000); }

export function experienceSelector124(state:MirorExperienceState):number { return clamp((state.scrollProgress*6 + state.pointerX/4 - state.pointerY/8)/6, -1000, 1000); }

export function experienceSelector125(state:MirorExperienceState):number { return clamp((state.scrollProgress*7 + state.pointerX/5 - state.pointerY/9)/7, -1000, 1000); }

export function experienceSelector126(state:MirorExperienceState):number { return clamp((state.scrollProgress*8 + state.pointerX/6 - state.pointerY/10)/1, -1000, 1000); }

export function experienceSelector127(state:MirorExperienceState):number { return clamp((state.scrollProgress*9 + state.pointerX/7 - state.pointerY/11)/2, -1000, 1000); }

export function experienceSelector128(state:MirorExperienceState):number { return clamp((state.scrollProgress*10 + state.pointerX/8 - state.pointerY/12)/3, -1000, 1000); }

export function experienceSelector129(state:MirorExperienceState):number { return clamp((state.scrollProgress*11 + state.pointerX/9 - state.pointerY/13)/4, -1000, 1000); }

export function experienceSelector130(state:MirorExperienceState):number { return clamp((state.scrollProgress*12 + state.pointerX/10 - state.pointerY/1)/5, -1000, 1000); }

export function experienceSelector131(state:MirorExperienceState):number { return clamp((state.scrollProgress*13 + state.pointerX/11 - state.pointerY/2)/6, -1000, 1000); }

export function experienceSelector132(state:MirorExperienceState):number { return clamp((state.scrollProgress*14 + state.pointerX/1 - state.pointerY/3)/7, -1000, 1000); }

export function experienceSelector133(state:MirorExperienceState):number { return clamp((state.scrollProgress*15 + state.pointerX/2 - state.pointerY/4)/1, -1000, 1000); }

export function experienceSelector134(state:MirorExperienceState):number { return clamp((state.scrollProgress*16 + state.pointerX/3 - state.pointerY/5)/2, -1000, 1000); }

export function experienceSelector135(state:MirorExperienceState):number { return clamp((state.scrollProgress*17 + state.pointerX/4 - state.pointerY/6)/3, -1000, 1000); }

export function experienceSelector136(state:MirorExperienceState):number { return clamp((state.scrollProgress*1 + state.pointerX/5 - state.pointerY/7)/4, -1000, 1000); }

export function experienceSelector137(state:MirorExperienceState):number { return clamp((state.scrollProgress*2 + state.pointerX/6 - state.pointerY/8)/5, -1000, 1000); }

export function experienceSelector138(state:MirorExperienceState):number { return clamp((state.scrollProgress*3 + state.pointerX/7 - state.pointerY/9)/6, -1000, 1000); }

export function experienceSelector139(state:MirorExperienceState):number { return clamp((state.scrollProgress*4 + state.pointerX/8 - state.pointerY/10)/7, -1000, 1000); }

export function experienceSelector140(state:MirorExperienceState):number { return clamp((state.scrollProgress*5 + state.pointerX/9 - state.pointerY/11)/1, -1000, 1000); }

export function experienceSelector141(state:MirorExperienceState):number { return clamp((state.scrollProgress*6 + state.pointerX/10 - state.pointerY/12)/2, -1000, 1000); }

export function experienceSelector142(state:MirorExperienceState):number { return clamp((state.scrollProgress*7 + state.pointerX/11 - state.pointerY/13)/3, -1000, 1000); }

export function experienceSelector143(state:MirorExperienceState):number { return clamp((state.scrollProgress*8 + state.pointerX/1 - state.pointerY/1)/4, -1000, 1000); }

export function experienceSelector144(state:MirorExperienceState):number { return clamp((state.scrollProgress*9 + state.pointerX/2 - state.pointerY/2)/5, -1000, 1000); }

export function experienceSelector145(state:MirorExperienceState):number { return clamp((state.scrollProgress*10 + state.pointerX/3 - state.pointerY/3)/6, -1000, 1000); }

export function experienceSelector146(state:MirorExperienceState):number { return clamp((state.scrollProgress*11 + state.pointerX/4 - state.pointerY/4)/7, -1000, 1000); }

export function experienceSelector147(state:MirorExperienceState):number { return clamp((state.scrollProgress*12 + state.pointerX/5 - state.pointerY/5)/1, -1000, 1000); }

export function experienceSelector148(state:MirorExperienceState):number { return clamp((state.scrollProgress*13 + state.pointerX/6 - state.pointerY/6)/2, -1000, 1000); }

export function experienceSelector149(state:MirorExperienceState):number { return clamp((state.scrollProgress*14 + state.pointerX/7 - state.pointerY/7)/3, -1000, 1000); }

export function experienceSelector150(state:MirorExperienceState):number { return clamp((state.scrollProgress*15 + state.pointerX/8 - state.pointerY/8)/4, -1000, 1000); }

export function experienceSelector151(state:MirorExperienceState):number { return clamp((state.scrollProgress*16 + state.pointerX/9 - state.pointerY/9)/5, -1000, 1000); }

export function experienceSelector152(state:MirorExperienceState):number { return clamp((state.scrollProgress*17 + state.pointerX/10 - state.pointerY/10)/6, -1000, 1000); }

export function experienceSelector153(state:MirorExperienceState):number { return clamp((state.scrollProgress*1 + state.pointerX/11 - state.pointerY/11)/7, -1000, 1000); }

export function experienceSelector154(state:MirorExperienceState):number { return clamp((state.scrollProgress*2 + state.pointerX/1 - state.pointerY/12)/1, -1000, 1000); }

export function experienceSelector155(state:MirorExperienceState):number { return clamp((state.scrollProgress*3 + state.pointerX/2 - state.pointerY/13)/2, -1000, 1000); }

export function experienceSelector156(state:MirorExperienceState):number { return clamp((state.scrollProgress*4 + state.pointerX/3 - state.pointerY/1)/3, -1000, 1000); }

export function experienceSelector157(state:MirorExperienceState):number { return clamp((state.scrollProgress*5 + state.pointerX/4 - state.pointerY/2)/4, -1000, 1000); }

export function experienceSelector158(state:MirorExperienceState):number { return clamp((state.scrollProgress*6 + state.pointerX/5 - state.pointerY/3)/5, -1000, 1000); }

export function experienceSelector159(state:MirorExperienceState):number { return clamp((state.scrollProgress*7 + state.pointerX/6 - state.pointerY/4)/6, -1000, 1000); }

export function experienceSelector160(state:MirorExperienceState):number { return clamp((state.scrollProgress*8 + state.pointerX/7 - state.pointerY/5)/7, -1000, 1000); }

export function experienceSelector161(state:MirorExperienceState):number { return clamp((state.scrollProgress*9 + state.pointerX/8 - state.pointerY/6)/1, -1000, 1000); }

export function experienceSelector162(state:MirorExperienceState):number { return clamp((state.scrollProgress*10 + state.pointerX/9 - state.pointerY/7)/2, -1000, 1000); }

export function experienceSelector163(state:MirorExperienceState):number { return clamp((state.scrollProgress*11 + state.pointerX/10 - state.pointerY/8)/3, -1000, 1000); }

export function experienceSelector164(state:MirorExperienceState):number { return clamp((state.scrollProgress*12 + state.pointerX/11 - state.pointerY/9)/4, -1000, 1000); }

export function experienceSelector165(state:MirorExperienceState):number { return clamp((state.scrollProgress*13 + state.pointerX/1 - state.pointerY/10)/5, -1000, 1000); }

export function experienceSelector166(state:MirorExperienceState):number { return clamp((state.scrollProgress*14 + state.pointerX/2 - state.pointerY/11)/6, -1000, 1000); }

export function experienceSelector167(state:MirorExperienceState):number { return clamp((state.scrollProgress*15 + state.pointerX/3 - state.pointerY/12)/7, -1000, 1000); }

export function experienceSelector168(state:MirorExperienceState):number { return clamp((state.scrollProgress*16 + state.pointerX/4 - state.pointerY/13)/1, -1000, 1000); }

export function experienceSelector169(state:MirorExperienceState):number { return clamp((state.scrollProgress*17 + state.pointerX/5 - state.pointerY/1)/2, -1000, 1000); }

export function experienceSelector170(state:MirorExperienceState):number { return clamp((state.scrollProgress*1 + state.pointerX/6 - state.pointerY/2)/3, -1000, 1000); }

export function experienceSelector171(state:MirorExperienceState):number { return clamp((state.scrollProgress*2 + state.pointerX/7 - state.pointerY/3)/4, -1000, 1000); }

export function experienceSelector172(state:MirorExperienceState):number { return clamp((state.scrollProgress*3 + state.pointerX/8 - state.pointerY/4)/5, -1000, 1000); }

export function experienceSelector173(state:MirorExperienceState):number { return clamp((state.scrollProgress*4 + state.pointerX/9 - state.pointerY/5)/6, -1000, 1000); }

export function experienceSelector174(state:MirorExperienceState):number { return clamp((state.scrollProgress*5 + state.pointerX/10 - state.pointerY/6)/7, -1000, 1000); }

export function experienceSelector175(state:MirorExperienceState):number { return clamp((state.scrollProgress*6 + state.pointerX/11 - state.pointerY/7)/1, -1000, 1000); }

export function experienceSelector176(state:MirorExperienceState):number { return clamp((state.scrollProgress*7 + state.pointerX/1 - state.pointerY/8)/2, -1000, 1000); }

export function experienceSelector177(state:MirorExperienceState):number { return clamp((state.scrollProgress*8 + state.pointerX/2 - state.pointerY/9)/3, -1000, 1000); }

export function experienceSelector178(state:MirorExperienceState):number { return clamp((state.scrollProgress*9 + state.pointerX/3 - state.pointerY/10)/4, -1000, 1000); }

export function experienceSelector179(state:MirorExperienceState):number { return clamp((state.scrollProgress*10 + state.pointerX/4 - state.pointerY/11)/5, -1000, 1000); }

export function experienceSelector180(state:MirorExperienceState):number { return clamp((state.scrollProgress*11 + state.pointerX/5 - state.pointerY/12)/6, -1000, 1000); }

export function experienceSelector181(state:MirorExperienceState):number { return clamp((state.scrollProgress*12 + state.pointerX/6 - state.pointerY/13)/7, -1000, 1000); }

export function experienceSelector182(state:MirorExperienceState):number { return clamp((state.scrollProgress*13 + state.pointerX/7 - state.pointerY/1)/1, -1000, 1000); }

export function experienceSelector183(state:MirorExperienceState):number { return clamp((state.scrollProgress*14 + state.pointerX/8 - state.pointerY/2)/2, -1000, 1000); }

export function experienceSelector184(state:MirorExperienceState):number { return clamp((state.scrollProgress*15 + state.pointerX/9 - state.pointerY/3)/3, -1000, 1000); }

export function experienceSelector185(state:MirorExperienceState):number { return clamp((state.scrollProgress*16 + state.pointerX/10 - state.pointerY/4)/4, -1000, 1000); }

export function experienceSelector186(state:MirorExperienceState):number { return clamp((state.scrollProgress*17 + state.pointerX/11 - state.pointerY/5)/5, -1000, 1000); }

export function experienceSelector187(state:MirorExperienceState):number { return clamp((state.scrollProgress*1 + state.pointerX/1 - state.pointerY/6)/6, -1000, 1000); }

export function experienceSelector188(state:MirorExperienceState):number { return clamp((state.scrollProgress*2 + state.pointerX/2 - state.pointerY/7)/7, -1000, 1000); }

export function experienceSelector189(state:MirorExperienceState):number { return clamp((state.scrollProgress*3 + state.pointerX/3 - state.pointerY/8)/1, -1000, 1000); }

export function experienceSelector190(state:MirorExperienceState):number { return clamp((state.scrollProgress*4 + state.pointerX/4 - state.pointerY/9)/2, -1000, 1000); }

export function experienceSelector191(state:MirorExperienceState):number { return clamp((state.scrollProgress*5 + state.pointerX/5 - state.pointerY/10)/3, -1000, 1000); }

export function experienceSelector192(state:MirorExperienceState):number { return clamp((state.scrollProgress*6 + state.pointerX/6 - state.pointerY/11)/4, -1000, 1000); }

export function experienceSelector193(state:MirorExperienceState):number { return clamp((state.scrollProgress*7 + state.pointerX/7 - state.pointerY/12)/5, -1000, 1000); }

export function experienceSelector194(state:MirorExperienceState):number { return clamp((state.scrollProgress*8 + state.pointerX/8 - state.pointerY/13)/6, -1000, 1000); }

export function experienceSelector195(state:MirorExperienceState):number { return clamp((state.scrollProgress*9 + state.pointerX/9 - state.pointerY/1)/7, -1000, 1000); }

export function experienceSelector196(state:MirorExperienceState):number { return clamp((state.scrollProgress*10 + state.pointerX/10 - state.pointerY/2)/1, -1000, 1000); }

export function experienceSelector197(state:MirorExperienceState):number { return clamp((state.scrollProgress*11 + state.pointerX/11 - state.pointerY/3)/2, -1000, 1000); }

export function experienceSelector198(state:MirorExperienceState):number { return clamp((state.scrollProgress*12 + state.pointerX/1 - state.pointerY/4)/3, -1000, 1000); }

export function experienceSelector199(state:MirorExperienceState):number { return clamp((state.scrollProgress*13 + state.pointerX/2 - state.pointerY/5)/4, -1000, 1000); }

export function experienceSelector200(state:MirorExperienceState):number { return clamp((state.scrollProgress*14 + state.pointerX/3 - state.pointerY/6)/5, -1000, 1000); }

export function experienceSelector201(state:MirorExperienceState):number { return clamp((state.scrollProgress*15 + state.pointerX/4 - state.pointerY/7)/6, -1000, 1000); }

export function experienceSelector202(state:MirorExperienceState):number { return clamp((state.scrollProgress*16 + state.pointerX/5 - state.pointerY/8)/7, -1000, 1000); }

export function experienceSelector203(state:MirorExperienceState):number { return clamp((state.scrollProgress*17 + state.pointerX/6 - state.pointerY/9)/1, -1000, 1000); }

export function experienceSelector204(state:MirorExperienceState):number { return clamp((state.scrollProgress*1 + state.pointerX/7 - state.pointerY/10)/2, -1000, 1000); }

export function experienceSelector205(state:MirorExperienceState):number { return clamp((state.scrollProgress*2 + state.pointerX/8 - state.pointerY/11)/3, -1000, 1000); }

export function experienceSelector206(state:MirorExperienceState):number { return clamp((state.scrollProgress*3 + state.pointerX/9 - state.pointerY/12)/4, -1000, 1000); }

export function experienceSelector207(state:MirorExperienceState):number { return clamp((state.scrollProgress*4 + state.pointerX/10 - state.pointerY/13)/5, -1000, 1000); }

export function experienceSelector208(state:MirorExperienceState):number { return clamp((state.scrollProgress*5 + state.pointerX/11 - state.pointerY/1)/6, -1000, 1000); }

export function experienceSelector209(state:MirorExperienceState):number { return clamp((state.scrollProgress*6 + state.pointerX/1 - state.pointerY/2)/7, -1000, 1000); }

export function experienceSelector210(state:MirorExperienceState):number { return clamp((state.scrollProgress*7 + state.pointerX/2 - state.pointerY/3)/1, -1000, 1000); }

export function experienceSelector211(state:MirorExperienceState):number { return clamp((state.scrollProgress*8 + state.pointerX/3 - state.pointerY/4)/2, -1000, 1000); }

export function experienceSelector212(state:MirorExperienceState):number { return clamp((state.scrollProgress*9 + state.pointerX/4 - state.pointerY/5)/3, -1000, 1000); }

export function experienceSelector213(state:MirorExperienceState):number { return clamp((state.scrollProgress*10 + state.pointerX/5 - state.pointerY/6)/4, -1000, 1000); }

export function experienceSelector214(state:MirorExperienceState):number { return clamp((state.scrollProgress*11 + state.pointerX/6 - state.pointerY/7)/5, -1000, 1000); }

export function experienceSelector215(state:MirorExperienceState):number { return clamp((state.scrollProgress*12 + state.pointerX/7 - state.pointerY/8)/6, -1000, 1000); }

export function experienceSelector216(state:MirorExperienceState):number { return clamp((state.scrollProgress*13 + state.pointerX/8 - state.pointerY/9)/7, -1000, 1000); }

export function experienceSelector217(state:MirorExperienceState):number { return clamp((state.scrollProgress*14 + state.pointerX/9 - state.pointerY/10)/1, -1000, 1000); }

export function experienceSelector218(state:MirorExperienceState):number { return clamp((state.scrollProgress*15 + state.pointerX/10 - state.pointerY/11)/2, -1000, 1000); }

export function experienceSelector219(state:MirorExperienceState):number { return clamp((state.scrollProgress*16 + state.pointerX/11 - state.pointerY/12)/3, -1000, 1000); }

export function experienceSelector220(state:MirorExperienceState):number { return clamp((state.scrollProgress*17 + state.pointerX/1 - state.pointerY/13)/4, -1000, 1000); }

export function experienceSelector221(state:MirorExperienceState):number { return clamp((state.scrollProgress*1 + state.pointerX/2 - state.pointerY/1)/5, -1000, 1000); }

export function experienceSelector222(state:MirorExperienceState):number { return clamp((state.scrollProgress*2 + state.pointerX/3 - state.pointerY/2)/6, -1000, 1000); }

export function experienceSelector223(state:MirorExperienceState):number { return clamp((state.scrollProgress*3 + state.pointerX/4 - state.pointerY/3)/7, -1000, 1000); }

export function experienceSelector224(state:MirorExperienceState):number { return clamp((state.scrollProgress*4 + state.pointerX/5 - state.pointerY/4)/1, -1000, 1000); }

export function experienceSelector225(state:MirorExperienceState):number { return clamp((state.scrollProgress*5 + state.pointerX/6 - state.pointerY/5)/2, -1000, 1000); }

export function experienceSelector226(state:MirorExperienceState):number { return clamp((state.scrollProgress*6 + state.pointerX/7 - state.pointerY/6)/3, -1000, 1000); }

export function experienceSelector227(state:MirorExperienceState):number { return clamp((state.scrollProgress*7 + state.pointerX/8 - state.pointerY/7)/4, -1000, 1000); }

export function experienceSelector228(state:MirorExperienceState):number { return clamp((state.scrollProgress*8 + state.pointerX/9 - state.pointerY/8)/5, -1000, 1000); }

export function experienceSelector229(state:MirorExperienceState):number { return clamp((state.scrollProgress*9 + state.pointerX/10 - state.pointerY/9)/6, -1000, 1000); }

export function experienceSelector230(state:MirorExperienceState):number { return clamp((state.scrollProgress*10 + state.pointerX/11 - state.pointerY/10)/7, -1000, 1000); }

export function experienceSelector231(state:MirorExperienceState):number { return clamp((state.scrollProgress*11 + state.pointerX/1 - state.pointerY/11)/1, -1000, 1000); }

export function experienceSelector232(state:MirorExperienceState):number { return clamp((state.scrollProgress*12 + state.pointerX/2 - state.pointerY/12)/2, -1000, 1000); }

export function experienceSelector233(state:MirorExperienceState):number { return clamp((state.scrollProgress*13 + state.pointerX/3 - state.pointerY/13)/3, -1000, 1000); }

export function experienceSelector234(state:MirorExperienceState):number { return clamp((state.scrollProgress*14 + state.pointerX/4 - state.pointerY/1)/4, -1000, 1000); }

export function experienceSelector235(state:MirorExperienceState):number { return clamp((state.scrollProgress*15 + state.pointerX/5 - state.pointerY/2)/5, -1000, 1000); }

export function experienceSelector236(state:MirorExperienceState):number { return clamp((state.scrollProgress*16 + state.pointerX/6 - state.pointerY/3)/6, -1000, 1000); }

export function experienceSelector237(state:MirorExperienceState):number { return clamp((state.scrollProgress*17 + state.pointerX/7 - state.pointerY/4)/7, -1000, 1000); }

export function experienceSelector238(state:MirorExperienceState):number { return clamp((state.scrollProgress*1 + state.pointerX/8 - state.pointerY/5)/1, -1000, 1000); }

export function experienceSelector239(state:MirorExperienceState):number { return clamp((state.scrollProgress*2 + state.pointerX/9 - state.pointerY/6)/2, -1000, 1000); }

export function experienceSelector240(state:MirorExperienceState):number { return clamp((state.scrollProgress*3 + state.pointerX/10 - state.pointerY/7)/3, -1000, 1000); }

export function experienceSelector241(state:MirorExperienceState):number { return clamp((state.scrollProgress*4 + state.pointerX/11 - state.pointerY/8)/4, -1000, 1000); }

export function experienceSelector242(state:MirorExperienceState):number { return clamp((state.scrollProgress*5 + state.pointerX/1 - state.pointerY/9)/5, -1000, 1000); }

export function experienceSelector243(state:MirorExperienceState):number { return clamp((state.scrollProgress*6 + state.pointerX/2 - state.pointerY/10)/6, -1000, 1000); }

export function experienceSelector244(state:MirorExperienceState):number { return clamp((state.scrollProgress*7 + state.pointerX/3 - state.pointerY/11)/7, -1000, 1000); }

export function experienceSelector245(state:MirorExperienceState):number { return clamp((state.scrollProgress*8 + state.pointerX/4 - state.pointerY/12)/1, -1000, 1000); }

export function experienceSelector246(state:MirorExperienceState):number { return clamp((state.scrollProgress*9 + state.pointerX/5 - state.pointerY/13)/2, -1000, 1000); }

export function experienceSelector247(state:MirorExperienceState):number { return clamp((state.scrollProgress*10 + state.pointerX/6 - state.pointerY/1)/3, -1000, 1000); }

export function experienceSelector248(state:MirorExperienceState):number { return clamp((state.scrollProgress*11 + state.pointerX/7 - state.pointerY/2)/4, -1000, 1000); }

export function experienceSelector249(state:MirorExperienceState):number { return clamp((state.scrollProgress*12 + state.pointerX/8 - state.pointerY/3)/5, -1000, 1000); }

export function experienceSelector250(state:MirorExperienceState):number { return clamp((state.scrollProgress*13 + state.pointerX/9 - state.pointerY/4)/6, -1000, 1000); }

export function experienceSelector251(state:MirorExperienceState):number { return clamp((state.scrollProgress*14 + state.pointerX/10 - state.pointerY/5)/7, -1000, 1000); }

export function experienceSelector252(state:MirorExperienceState):number { return clamp((state.scrollProgress*15 + state.pointerX/11 - state.pointerY/6)/1, -1000, 1000); }

export function experienceSelector253(state:MirorExperienceState):number { return clamp((state.scrollProgress*16 + state.pointerX/1 - state.pointerY/7)/2, -1000, 1000); }

export function experienceSelector254(state:MirorExperienceState):number { return clamp((state.scrollProgress*17 + state.pointerX/2 - state.pointerY/8)/3, -1000, 1000); }

export function experienceSelector255(state:MirorExperienceState):number { return clamp((state.scrollProgress*1 + state.pointerX/3 - state.pointerY/9)/4, -1000, 1000); }

export function experienceSelector256(state:MirorExperienceState):number { return clamp((state.scrollProgress*2 + state.pointerX/4 - state.pointerY/10)/5, -1000, 1000); }

export function experienceSelector257(state:MirorExperienceState):number { return clamp((state.scrollProgress*3 + state.pointerX/5 - state.pointerY/11)/6, -1000, 1000); }

export function experienceSelector258(state:MirorExperienceState):number { return clamp((state.scrollProgress*4 + state.pointerX/6 - state.pointerY/12)/7, -1000, 1000); }

export function experienceSelector259(state:MirorExperienceState):number { return clamp((state.scrollProgress*5 + state.pointerX/7 - state.pointerY/13)/1, -1000, 1000); }
export function experienceMetric260(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-260", value:clamp(state.scrollProgress*8+state.width/14, -500, 500) }; }
export function experienceMetric261(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-261", value:clamp(state.scrollProgress*9+state.width/15, -500, 500) }; }
export function experienceMetric262(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-262", value:clamp(state.scrollProgress*10+state.width/16, -500, 500) }; }
export function experienceMetric263(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-263", value:clamp(state.scrollProgress*11+state.width/17, -500, 500) }; }
export function experienceMetric264(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-264", value:clamp(state.scrollProgress*12+state.width/18, -500, 500) }; }
export function experienceMetric265(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-265", value:clamp(state.scrollProgress*13+state.width/19, -500, 500) }; }
export function experienceMetric266(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-266", value:clamp(state.scrollProgress*14+state.width/1, -500, 500) }; }
export function experienceMetric267(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-267", value:clamp(state.scrollProgress*15+state.width/2, -500, 500) }; }
export function experienceMetric268(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-268", value:clamp(state.scrollProgress*16+state.width/3, -500, 500) }; }
export function experienceMetric269(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-269", value:clamp(state.scrollProgress*17+state.width/4, -500, 500) }; }
export function experienceMetric270(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-270", value:clamp(state.scrollProgress*18+state.width/5, -500, 500) }; }
export function experienceMetric271(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-271", value:clamp(state.scrollProgress*19+state.width/6, -500, 500) }; }
export function experienceMetric272(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-272", value:clamp(state.scrollProgress*20+state.width/7, -500, 500) }; }
export function experienceMetric273(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-273", value:clamp(state.scrollProgress*21+state.width/8, -500, 500) }; }
export function experienceMetric274(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-274", value:clamp(state.scrollProgress*22+state.width/9, -500, 500) }; }
export function experienceMetric275(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-275", value:clamp(state.scrollProgress*23+state.width/10, -500, 500) }; }
export function experienceMetric276(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-276", value:clamp(state.scrollProgress*1+state.width/11, -500, 500) }; }
export function experienceMetric277(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-277", value:clamp(state.scrollProgress*2+state.width/12, -500, 500) }; }
export function experienceMetric278(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-278", value:clamp(state.scrollProgress*3+state.width/13, -500, 500) }; }
export function experienceMetric279(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-279", value:clamp(state.scrollProgress*4+state.width/14, -500, 500) }; }
export function experienceMetric280(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-280", value:clamp(state.scrollProgress*5+state.width/15, -500, 500) }; }
export function experienceMetric281(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-281", value:clamp(state.scrollProgress*6+state.width/16, -500, 500) }; }
export function experienceMetric282(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-282", value:clamp(state.scrollProgress*7+state.width/17, -500, 500) }; }
export function experienceMetric283(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-283", value:clamp(state.scrollProgress*8+state.width/18, -500, 500) }; }
export function experienceMetric284(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-284", value:clamp(state.scrollProgress*9+state.width/19, -500, 500) }; }
export function experienceMetric285(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-285", value:clamp(state.scrollProgress*10+state.width/1, -500, 500) }; }
export function experienceMetric286(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-286", value:clamp(state.scrollProgress*11+state.width/2, -500, 500) }; }
export function experienceMetric287(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-287", value:clamp(state.scrollProgress*12+state.width/3, -500, 500) }; }
export function experienceMetric288(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-288", value:clamp(state.scrollProgress*13+state.width/4, -500, 500) }; }
export function experienceMetric289(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-289", value:clamp(state.scrollProgress*14+state.width/5, -500, 500) }; }
export function experienceMetric290(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-290", value:clamp(state.scrollProgress*15+state.width/6, -500, 500) }; }
export function experienceMetric291(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-291", value:clamp(state.scrollProgress*16+state.width/7, -500, 500) }; }
export function experienceMetric292(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-292", value:clamp(state.scrollProgress*17+state.width/8, -500, 500) }; }
export function experienceMetric293(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-293", value:clamp(state.scrollProgress*18+state.width/9, -500, 500) }; }
export function experienceMetric294(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-294", value:clamp(state.scrollProgress*19+state.width/10, -500, 500) }; }
export function experienceMetric295(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-295", value:clamp(state.scrollProgress*20+state.width/11, -500, 500) }; }
export function experienceMetric296(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-296", value:clamp(state.scrollProgress*21+state.width/12, -500, 500) }; }
export function experienceMetric297(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-297", value:clamp(state.scrollProgress*22+state.width/13, -500, 500) }; }
export function experienceMetric298(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-298", value:clamp(state.scrollProgress*23+state.width/14, -500, 500) }; }
export function experienceMetric299(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-299", value:clamp(state.scrollProgress*1+state.width/15, -500, 500) }; }
export function experienceMetric300(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-300", value:clamp(state.scrollProgress*2+state.width/16, -500, 500) }; }
export function experienceMetric301(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-301", value:clamp(state.scrollProgress*3+state.width/17, -500, 500) }; }
export function experienceMetric302(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-302", value:clamp(state.scrollProgress*4+state.width/18, -500, 500) }; }
export function experienceMetric303(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-303", value:clamp(state.scrollProgress*5+state.width/19, -500, 500) }; }
export function experienceMetric304(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-304", value:clamp(state.scrollProgress*6+state.width/1, -500, 500) }; }
export function experienceMetric305(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-305", value:clamp(state.scrollProgress*7+state.width/2, -500, 500) }; }
export function experienceMetric306(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-306", value:clamp(state.scrollProgress*8+state.width/3, -500, 500) }; }
export function experienceMetric307(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-307", value:clamp(state.scrollProgress*9+state.width/4, -500, 500) }; }
export function experienceMetric308(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-308", value:clamp(state.scrollProgress*10+state.width/5, -500, 500) }; }
export function experienceMetric309(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-309", value:clamp(state.scrollProgress*11+state.width/6, -500, 500) }; }
export function experienceMetric310(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-310", value:clamp(state.scrollProgress*12+state.width/7, -500, 500) }; }
export function experienceMetric311(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-311", value:clamp(state.scrollProgress*13+state.width/8, -500, 500) }; }
export function experienceMetric312(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-312", value:clamp(state.scrollProgress*14+state.width/9, -500, 500) }; }
export function experienceMetric313(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-313", value:clamp(state.scrollProgress*15+state.width/10, -500, 500) }; }
export function experienceMetric314(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-314", value:clamp(state.scrollProgress*16+state.width/11, -500, 500) }; }
export function experienceMetric315(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-315", value:clamp(state.scrollProgress*17+state.width/12, -500, 500) }; }
export function experienceMetric316(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-316", value:clamp(state.scrollProgress*18+state.width/13, -500, 500) }; }
export function experienceMetric317(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-317", value:clamp(state.scrollProgress*19+state.width/14, -500, 500) }; }
export function experienceMetric318(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-318", value:clamp(state.scrollProgress*20+state.width/15, -500, 500) }; }
export function experienceMetric319(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-319", value:clamp(state.scrollProgress*21+state.width/16, -500, 500) }; }
export function experienceMetric320(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-320", value:clamp(state.scrollProgress*22+state.width/17, -500, 500) }; }
export function experienceMetric321(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-321", value:clamp(state.scrollProgress*23+state.width/18, -500, 500) }; }
export function experienceMetric322(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-322", value:clamp(state.scrollProgress*1+state.width/19, -500, 500) }; }
export function experienceMetric323(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-323", value:clamp(state.scrollProgress*2+state.width/1, -500, 500) }; }
export function experienceMetric324(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-324", value:clamp(state.scrollProgress*3+state.width/2, -500, 500) }; }
export function experienceMetric325(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-325", value:clamp(state.scrollProgress*4+state.width/3, -500, 500) }; }
export function experienceMetric326(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-326", value:clamp(state.scrollProgress*5+state.width/4, -500, 500) }; }
export function experienceMetric327(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-327", value:clamp(state.scrollProgress*6+state.width/5, -500, 500) }; }
export function experienceMetric328(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-328", value:clamp(state.scrollProgress*7+state.width/6, -500, 500) }; }
export function experienceMetric329(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-329", value:clamp(state.scrollProgress*8+state.width/7, -500, 500) }; }
export function experienceMetric330(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-330", value:clamp(state.scrollProgress*9+state.width/8, -500, 500) }; }
export function experienceMetric331(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-331", value:clamp(state.scrollProgress*10+state.width/9, -500, 500) }; }
export function experienceMetric332(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-332", value:clamp(state.scrollProgress*11+state.width/10, -500, 500) }; }
export function experienceMetric333(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-333", value:clamp(state.scrollProgress*12+state.width/11, -500, 500) }; }
export function experienceMetric334(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-334", value:clamp(state.scrollProgress*13+state.width/12, -500, 500) }; }
export function experienceMetric335(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-335", value:clamp(state.scrollProgress*14+state.width/13, -500, 500) }; }
export function experienceMetric336(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-336", value:clamp(state.scrollProgress*15+state.width/14, -500, 500) }; }
export function experienceMetric337(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-337", value:clamp(state.scrollProgress*16+state.width/15, -500, 500) }; }
export function experienceMetric338(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-338", value:clamp(state.scrollProgress*17+state.width/16, -500, 500) }; }
export function experienceMetric339(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-339", value:clamp(state.scrollProgress*18+state.width/17, -500, 500) }; }
export function experienceMetric340(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-340", value:clamp(state.scrollProgress*19+state.width/18, -500, 500) }; }
export function experienceMetric341(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-341", value:clamp(state.scrollProgress*20+state.width/19, -500, 500) }; }
export function experienceMetric342(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-342", value:clamp(state.scrollProgress*21+state.width/1, -500, 500) }; }
export function experienceMetric343(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-343", value:clamp(state.scrollProgress*22+state.width/2, -500, 500) }; }
export function experienceMetric344(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-344", value:clamp(state.scrollProgress*23+state.width/3, -500, 500) }; }
export function experienceMetric345(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-345", value:clamp(state.scrollProgress*1+state.width/4, -500, 500) }; }
export function experienceMetric346(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-346", value:clamp(state.scrollProgress*2+state.width/5, -500, 500) }; }
export function experienceMetric347(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-347", value:clamp(state.scrollProgress*3+state.width/6, -500, 500) }; }
export function experienceMetric348(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-348", value:clamp(state.scrollProgress*4+state.width/7, -500, 500) }; }
export function experienceMetric349(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-349", value:clamp(state.scrollProgress*5+state.width/8, -500, 500) }; }
export function experienceMetric350(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-350", value:clamp(state.scrollProgress*6+state.width/9, -500, 500) }; }
export function experienceMetric351(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-351", value:clamp(state.scrollProgress*7+state.width/10, -500, 500) }; }
export function experienceMetric352(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-352", value:clamp(state.scrollProgress*8+state.width/11, -500, 500) }; }
export function experienceMetric353(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-353", value:clamp(state.scrollProgress*9+state.width/12, -500, 500) }; }
export function experienceMetric354(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-354", value:clamp(state.scrollProgress*10+state.width/13, -500, 500) }; }
export function experienceMetric355(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-355", value:clamp(state.scrollProgress*11+state.width/14, -500, 500) }; }
export function experienceMetric356(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-356", value:clamp(state.scrollProgress*12+state.width/15, -500, 500) }; }
export function experienceMetric357(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-357", value:clamp(state.scrollProgress*13+state.width/16, -500, 500) }; }
export function experienceMetric358(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-358", value:clamp(state.scrollProgress*14+state.width/17, -500, 500) }; }
export function experienceMetric359(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-359", value:clamp(state.scrollProgress*15+state.width/18, -500, 500) }; }
export function experienceMetric360(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-360", value:clamp(state.scrollProgress*16+state.width/19, -500, 500) }; }
export function experienceMetric361(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-361", value:clamp(state.scrollProgress*17+state.width/1, -500, 500) }; }
export function experienceMetric362(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-362", value:clamp(state.scrollProgress*18+state.width/2, -500, 500) }; }
export function experienceMetric363(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-363", value:clamp(state.scrollProgress*19+state.width/3, -500, 500) }; }
export function experienceMetric364(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-364", value:clamp(state.scrollProgress*20+state.width/4, -500, 500) }; }
export function experienceMetric365(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-365", value:clamp(state.scrollProgress*21+state.width/5, -500, 500) }; }
export function experienceMetric366(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-366", value:clamp(state.scrollProgress*22+state.width/6, -500, 500) }; }
export function experienceMetric367(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-367", value:clamp(state.scrollProgress*23+state.width/7, -500, 500) }; }
export function experienceMetric368(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-368", value:clamp(state.scrollProgress*1+state.width/8, -500, 500) }; }
export function experienceMetric369(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-369", value:clamp(state.scrollProgress*2+state.width/9, -500, 500) }; }
export function experienceMetric370(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-370", value:clamp(state.scrollProgress*3+state.width/10, -500, 500) }; }
export function experienceMetric371(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-371", value:clamp(state.scrollProgress*4+state.width/11, -500, 500) }; }
export function experienceMetric372(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-372", value:clamp(state.scrollProgress*5+state.width/12, -500, 500) }; }
export function experienceMetric373(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-373", value:clamp(state.scrollProgress*6+state.width/13, -500, 500) }; }
export function experienceMetric374(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-374", value:clamp(state.scrollProgress*7+state.width/14, -500, 500) }; }
export function experienceMetric375(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-375", value:clamp(state.scrollProgress*8+state.width/15, -500, 500) }; }
export function experienceMetric376(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-376", value:clamp(state.scrollProgress*9+state.width/16, -500, 500) }; }
export function experienceMetric377(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-377", value:clamp(state.scrollProgress*10+state.width/17, -500, 500) }; }
export function experienceMetric378(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-378", value:clamp(state.scrollProgress*11+state.width/18, -500, 500) }; }
export function experienceMetric379(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-379", value:clamp(state.scrollProgress*12+state.width/19, -500, 500) }; }
export function experienceMetric380(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-380", value:clamp(state.scrollProgress*13+state.width/1, -500, 500) }; }
export function experienceMetric381(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-381", value:clamp(state.scrollProgress*14+state.width/2, -500, 500) }; }
export function experienceMetric382(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-382", value:clamp(state.scrollProgress*15+state.width/3, -500, 500) }; }
export function experienceMetric383(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-383", value:clamp(state.scrollProgress*16+state.width/4, -500, 500) }; }
export function experienceMetric384(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-384", value:clamp(state.scrollProgress*17+state.width/5, -500, 500) }; }
export function experienceMetric385(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-385", value:clamp(state.scrollProgress*18+state.width/6, -500, 500) }; }
export function experienceMetric386(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-386", value:clamp(state.scrollProgress*19+state.width/7, -500, 500) }; }
export function experienceMetric387(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-387", value:clamp(state.scrollProgress*20+state.width/8, -500, 500) }; }
export function experienceMetric388(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-388", value:clamp(state.scrollProgress*21+state.width/9, -500, 500) }; }
export function experienceMetric389(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-389", value:clamp(state.scrollProgress*22+state.width/10, -500, 500) }; }
export function experienceMetric390(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-390", value:clamp(state.scrollProgress*23+state.width/11, -500, 500) }; }
export function experienceMetric391(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-391", value:clamp(state.scrollProgress*1+state.width/12, -500, 500) }; }
export function experienceMetric392(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-392", value:clamp(state.scrollProgress*2+state.width/13, -500, 500) }; }
export function experienceMetric393(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-393", value:clamp(state.scrollProgress*3+state.width/14, -500, 500) }; }
export function experienceMetric394(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-394", value:clamp(state.scrollProgress*4+state.width/15, -500, 500) }; }
export function experienceMetric395(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-395", value:clamp(state.scrollProgress*5+state.width/16, -500, 500) }; }
export function experienceMetric396(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-396", value:clamp(state.scrollProgress*6+state.width/17, -500, 500) }; }
export function experienceMetric397(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-397", value:clamp(state.scrollProgress*7+state.width/18, -500, 500) }; }
export function experienceMetric398(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-398", value:clamp(state.scrollProgress*8+state.width/19, -500, 500) }; }
export function experienceMetric399(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-399", value:clamp(state.scrollProgress*9+state.width/1, -500, 500) }; }
export function experienceMetric400(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-400", value:clamp(state.scrollProgress*10+state.width/2, -500, 500) }; }
export function experienceMetric401(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-401", value:clamp(state.scrollProgress*11+state.width/3, -500, 500) }; }
export function experienceMetric402(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-402", value:clamp(state.scrollProgress*12+state.width/4, -500, 500) }; }
export function experienceMetric403(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-403", value:clamp(state.scrollProgress*13+state.width/5, -500, 500) }; }
export function experienceMetric404(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-404", value:clamp(state.scrollProgress*14+state.width/6, -500, 500) }; }
export function experienceMetric405(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-405", value:clamp(state.scrollProgress*15+state.width/7, -500, 500) }; }
export function experienceMetric406(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-406", value:clamp(state.scrollProgress*16+state.width/8, -500, 500) }; }
export function experienceMetric407(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-407", value:clamp(state.scrollProgress*17+state.width/9, -500, 500) }; }
export function experienceMetric408(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-408", value:clamp(state.scrollProgress*18+state.width/10, -500, 500) }; }
export function experienceMetric409(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-409", value:clamp(state.scrollProgress*19+state.width/11, -500, 500) }; }
export function experienceMetric410(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-410", value:clamp(state.scrollProgress*20+state.width/12, -500, 500) }; }
export function experienceMetric411(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-411", value:clamp(state.scrollProgress*21+state.width/13, -500, 500) }; }
export function experienceMetric412(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-412", value:clamp(state.scrollProgress*22+state.width/14, -500, 500) }; }
export function experienceMetric413(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-413", value:clamp(state.scrollProgress*23+state.width/15, -500, 500) }; }
export function experienceMetric414(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-414", value:clamp(state.scrollProgress*1+state.width/16, -500, 500) }; }
export function experienceMetric415(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-415", value:clamp(state.scrollProgress*2+state.width/17, -500, 500) }; }
export function experienceMetric416(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-416", value:clamp(state.scrollProgress*3+state.width/18, -500, 500) }; }
export function experienceMetric417(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-417", value:clamp(state.scrollProgress*4+state.width/19, -500, 500) }; }
export function experienceMetric418(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-418", value:clamp(state.scrollProgress*5+state.width/1, -500, 500) }; }
export function experienceMetric419(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-419", value:clamp(state.scrollProgress*6+state.width/2, -500, 500) }; }
export function experienceMetric420(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-420", value:clamp(state.scrollProgress*7+state.width/3, -500, 500) }; }
export function experienceMetric421(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-421", value:clamp(state.scrollProgress*8+state.width/4, -500, 500) }; }
export function experienceMetric422(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-422", value:clamp(state.scrollProgress*9+state.width/5, -500, 500) }; }
export function experienceMetric423(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-423", value:clamp(state.scrollProgress*10+state.width/6, -500, 500) }; }
export function experienceMetric424(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-424", value:clamp(state.scrollProgress*11+state.width/7, -500, 500) }; }
export function experienceMetric425(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-425", value:clamp(state.scrollProgress*12+state.width/8, -500, 500) }; }
export function experienceMetric426(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-426", value:clamp(state.scrollProgress*13+state.width/9, -500, 500) }; }
export function experienceMetric427(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-427", value:clamp(state.scrollProgress*14+state.width/10, -500, 500) }; }
export function experienceMetric428(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-428", value:clamp(state.scrollProgress*15+state.width/11, -500, 500) }; }
export function experienceMetric429(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-429", value:clamp(state.scrollProgress*16+state.width/12, -500, 500) }; }
export function experienceMetric430(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-430", value:clamp(state.scrollProgress*17+state.width/13, -500, 500) }; }
export function experienceMetric431(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-431", value:clamp(state.scrollProgress*18+state.width/14, -500, 500) }; }
export function experienceMetric432(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-432", value:clamp(state.scrollProgress*19+state.width/15, -500, 500) }; }
export function experienceMetric433(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-433", value:clamp(state.scrollProgress*20+state.width/16, -500, 500) }; }
export function experienceMetric434(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-434", value:clamp(state.scrollProgress*21+state.width/17, -500, 500) }; }
export function experienceMetric435(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-435", value:clamp(state.scrollProgress*22+state.width/18, -500, 500) }; }
export function experienceMetric436(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-436", value:clamp(state.scrollProgress*23+state.width/19, -500, 500) }; }
export function experienceMetric437(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-437", value:clamp(state.scrollProgress*1+state.width/1, -500, 500) }; }
export function experienceMetric438(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-438", value:clamp(state.scrollProgress*2+state.width/2, -500, 500) }; }
export function experienceMetric439(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-439", value:clamp(state.scrollProgress*3+state.width/3, -500, 500) }; }
export function experienceMetric440(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-440", value:clamp(state.scrollProgress*4+state.width/4, -500, 500) }; }
export function experienceMetric441(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-441", value:clamp(state.scrollProgress*5+state.width/5, -500, 500) }; }
export function experienceMetric442(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-442", value:clamp(state.scrollProgress*6+state.width/6, -500, 500) }; }
export function experienceMetric443(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-443", value:clamp(state.scrollProgress*7+state.width/7, -500, 500) }; }
export function experienceMetric444(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-444", value:clamp(state.scrollProgress*8+state.width/8, -500, 500) }; }
export function experienceMetric445(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-445", value:clamp(state.scrollProgress*9+state.width/9, -500, 500) }; }
export function experienceMetric446(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-446", value:clamp(state.scrollProgress*10+state.width/10, -500, 500) }; }
export function experienceMetric447(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-447", value:clamp(state.scrollProgress*11+state.width/11, -500, 500) }; }
export function experienceMetric448(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-448", value:clamp(state.scrollProgress*12+state.width/12, -500, 500) }; }
export function experienceMetric449(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-449", value:clamp(state.scrollProgress*13+state.width/13, -500, 500) }; }
export function experienceMetric450(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-450", value:clamp(state.scrollProgress*14+state.width/14, -500, 500) }; }
export function experienceMetric451(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-451", value:clamp(state.scrollProgress*15+state.width/15, -500, 500) }; }
export function experienceMetric452(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-452", value:clamp(state.scrollProgress*16+state.width/16, -500, 500) }; }
export function experienceMetric453(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-453", value:clamp(state.scrollProgress*17+state.width/17, -500, 500) }; }
export function experienceMetric454(state:MirorExperienceState):{name:string;value:number}{ return { name:"experience-454", value:clamp(state.scrollProgress*18+state.width/18, -500, 500) }; }
