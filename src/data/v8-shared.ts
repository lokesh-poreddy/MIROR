export type V8Theme = "paper" | "ink" | "technical";
export type V8Density = "airy" | "balanced" | "compact";
export type V8MotionMode = "full" | "reduced" | "off";
export type V8Breakpoint = "mobile" | "tablet" | "desktop" | "wide";
export type V8Interaction = "pointer" | "keyboard" | "touch" | "programmatic";
export type V8Publication = "draft" | "review" | "approved" | "verified";
export type V8ProjectCardData = { slug:string; title:string; category:string; region:"Andhra Pradesh"|"Telangana"|"Other / confirm"; location:string; role:string; scope:string[]; state:V8Publication; summary:string; image:string; poster:string; placeholder:boolean; evidence:string; featured:boolean; };
export const V8_PROJECTS:V8ProjectCardData[]=[
{slug:"hnss-kuppam-branch-canal-phase-ii",title:"HNSS Kuppam Branch Canal — Phase II",category:"Irrigation & Infrastructure",region:"Andhra Pradesh",location:"Andhra Pradesh",role:"CM & CD works contractor within the larger project package",scope:["CM & CD works","Canal-associated civil structures"],state:"verified",summary:"Publicly indexed project documentation identifies Miror in connection with CM & CD works associated with the HNSS Kuppam Branch Canal Phase II package.",image:"/media/projects/hnss-kuppam/hero-placeholder.jpg",poster:"/media/projects/hnss-kuppam/poster-placeholder.jpg",placeholder:true,evidence:"Publicly indexed project documentation; final website copy requires client approval.",featured:true},
{slug:"revasa-la-valora",title:"Revasa Là Valora",category:"Residential Construction",region:"Telangana",location:"Kardanur / Hyderabad region, Telangana",role:"Contractor identified in publicly indexed construction documentation",scope:["Aluminium formwork","RCC / structural execution"],state:"verified",summary:"Publicly indexed construction documentation identifies Miror in connection with aluminium formwork and structural execution at the development.",image:"/media/projects/revasa-la-valora/hero-placeholder.jpg",poster:"/media/projects/revasa-la-valora/poster-placeholder.jpg",placeholder:true,evidence:"Publicly indexed project documentation; final website copy requires client approval.",featured:true}
];
for(let i=3;i<=18;i++){V8_PROJECTS.push({slug:`client-project-${String(i).padStart(2,"0")}`,title:`Project ${String(i).padStart(2,"0")} — Details Pending`,category:"Client supplied",region:"Other / confirm",location:"Update soon",role:"Update soon",scope:["Update scope"],state:"draft",summary:"Reserved portfolio record for client-provided project information.",image:"/media/projects/placeholder.jpg",poster:"/media/projects/placeholder-poster.jpg",placeholder:true,evidence:"Client project data sheet required.",featured:false});}
export function v8Clamp(v:number,min:number,max:number){return Math.min(Math.max(v,min),max);}
export function v8Cx(...v:Array<string|false|null|undefined>){return v.filter(Boolean).join(" ");}
export function v8Breakpoint(w:number):V8Breakpoint{return w<640?"mobile":w<1024?"tablet":w<1440?"desktop":"wide";}
export function v8MotionMode(reduced:boolean,configured:V8MotionMode):V8MotionMode{return configured==="off"?"off":reduced||configured==="reduced"?"reduced":"full";}
export function v8PublicationLabel(s:V8Publication){return s==="verified"?"Verified public evidence":s==="approved"?"Approved for publication":s==="review"?"Under content review":"Client data pending";}
export type V8Action={id:string;label:string;href?:string;section?:string;interaction:V8Interaction};
export function v8Action(id:string,label:string,href?:string,section?:string,interaction:V8Interaction="programmatic"):V8Action{return{id,label,href,section,interaction};}
export type V8MediaPolicy={mode:"placeholder"|"image"|"video"|"model"|"svg";src?:string;poster?:string;alt:string;lazy:boolean;priority:boolean;rightsApproved:boolean};
export function v8MediaPolicy(i:Partial<V8MediaPolicy>&Pick<V8MediaPolicy,"mode"|"alt">):V8MediaPolicy{return{mode:i.mode,src:i.src,poster:i.poster,alt:i.alt,lazy:i.lazy??true,priority:i.priority??false,rightsApproved:i.rightsApproved??false};}
