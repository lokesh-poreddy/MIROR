import type { Metadata } from "next";
import type { ProjectRecord } from "./miror-v6-contracts";
import { MIROR_COMPANY, cleanText, projectRoute, safeHttpUrl } from "./miror-v6-contracts";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://miror.example.com";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og/miror-default.jpg`;

export interface SEOInput { title: string; description: string; path: string; image?: string; noIndex?: boolean; }

function normalizeTitle(value:string):string { return cleanText(value, 68); }
function normalizeDescription(value:string):string { return cleanText(value, 180); }
function canonical(path:string):string { return `${SITE_URL}${path.startsWith("/")?path:`/${path}`}`; }

export function buildMetadata(input: SEOInput): Metadata {
  const title=normalizeTitle(input.title);const description=normalizeDescription(input.description);const image=safeHttpUrl(input.image)||DEFAULT_OG_IMAGE;
  return { title, description, alternates:{canonical:canonical(input.path)}, robots:input.noIndex?{index:false,follow:false}:{index:true,follow:true}, openGraph:{title,description,url:canonical(input.path),siteName:"Miror Constructions & Consultancy",images:[{url:image,width:1200,height:630,alt:title}],type:"website"}, twitter:{card:"summary_large_image",title,description,images:[image]} };
}

export function projectMetadata(project:ProjectRecord): Metadata { return buildMetadata({title:project.seoTitle||`${project.title} | Miror Constructions`,description:project.seoDescription||project.summary,path:projectRoute(project),image:project.cover?.src}); }

export function organizationJsonLd() { return { "@context":"https://schema.org", "@type":"Organization", name:"Miror Constructions & Consultancy Private Limited", identifier:MIROR_COMPANY.cin, url:SITE_URL, address:{"@type":"PostalAddress",streetAddress:"D. No: 7-642(3), Gandhi Nagar, Mangamur Road",addressLocality:"Ongole",addressRegion:"Andhra Pradesh",postalCode:"523001",addressCountry:"IN"} }; }

export function breadcrumbJsonLd(items:Array<{name:string;url:string}>) { return {"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:items.map((item,index)=>({"@type":"ListItem",position:index+1,name:item.name,item:{"@id":safeHttpUrl(item.url)||canonical(item.url)}}))}; }

export function projectJsonLd(project:ProjectRecord) { if(!project.title||!project.summary)return null; return {"@context":"https://schema.org","@type":"CreativeWork",name:project.title,description:project.summary,url:canonical(projectRoute(project)),locationCreated:{"@type":"Place",name:project.location},creator:{"@type":"Organization",name:MIROR_COMPANY.legalName},keywords:[project.category,project.discipline,...project.scope].filter(Boolean).join(", ")}; }

export const ANALYTICS_EVENTS = ["page_view","nav_open","nav_close","search_open","search_query","project_filter","project_open","project_media_open","cta_click","enquiry_start","enquiry_submit","enquiry_error","career_open","career_apply_start","career_apply_submit","performance_warning","media_error"] as const;
export type AnalyticsEventName=typeof ANALYTICS_EVENTS[number];
export interface ClientAnalyticsEvent { name:AnalyticsEventName;path:string;timestamp:string;session?:string;metadata?:Record<string,string|number|boolean>; }

export function makeEvent(name:AnalyticsEventName,path:string,metadata?:ClientAnalyticsEvent["metadata"]):ClientAnalyticsEvent{return{name,path,timestamp:new Date().toISOString(),metadata};}
export function safeAnalyticsPayload(event:ClientAnalyticsEvent):ClientAnalyticsEvent{ const blocked=["email","phone","message","resumeUrl","ip"]; const metadata=Object.fromEntries(Object.entries(event.metadata||{}).filter(([key])=>!blocked.includes(key))); return {...event,metadata}; }
export async function sendAnalytics(event:ClientAnalyticsEvent):Promise<boolean>{ if(typeof window==="undefined")return false; try{ const payload=safeAnalyticsPayload(event); if(navigator.sendBeacon){const body=new Blob([JSON.stringify(payload)],{type:"application/json"});return navigator.sendBeacon("/api/v6/analytics",body);} const response=await fetch("/api/v6/analytics",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(payload),keepalive:true});return response.ok;}catch{return false;} }

export function pagePerformanceBudget(metrics:{lcp?:number;inp?:number;cls?:number;longTaskMs?:number}):string[]{const warnings:string[]=[];if((metrics.lcp??0)>2500)warnings.push("LCP over 2.5s");if((metrics.inp??0)>200)warnings.push("INP over 200ms");if((metrics.cls??0)>.1)warnings.push("CLS over 0.1");if((metrics.longTaskMs??0)>80)warnings.push("Long task budget exceeded");return warnings;}

export function routeGroup(path:string):"marketing"|"portfolio"|"conversion"|"system"{if(path.startsWith("/work"))return"portfolio";if(path.startsWith("/contact")||path.startsWith("/careers"))return"conversion";if(path.startsWith("/404")||path.startsWith("/api"))return"system";return"marketing";}

export function absoluteUrl(path:string):string{return canonical(path);}

export function seoRule001(value:string):string {
  return cleanText(value, 77);
}

export function seoRule002(value:string):string {
  return cleanText(value, 84);
}

export function seoRule003(value:string):string {
  return cleanText(value, 91);
}

export function seoRule004(value:string):string {
  return cleanText(value, 98);
}

export function seoRule005(value:string):string {
  return cleanText(value, 105);
}

export function seoRule006(value:string):string {
  return cleanText(value, 112);
}

export function seoRule007(value:string):string {
  return cleanText(value, 119);
}

export function seoRule008(value:string):string {
  return cleanText(value, 126);
}

export function seoRule009(value:string):string {
  return cleanText(value, 133);
}

export function seoRule010(value:string):string {
  return cleanText(value, 140);
}

export function seoRule011(value:string):string {
  return cleanText(value, 147);
}

export function seoRule012(value:string):string {
  return cleanText(value, 154);
}

export function seoRule013(value:string):string {
  return cleanText(value, 161);
}

export function seoRule014(value:string):string {
  return cleanText(value, 168);
}

export function seoRule015(value:string):string {
  return cleanText(value, 175);
}

export function seoRule016(value:string):string {
  return cleanText(value, 70);
}

export function seoRule017(value:string):string {
  return cleanText(value, 77);
}

export function seoRule018(value:string):string {
  return cleanText(value, 84);
}

export function seoRule019(value:string):string {
  return cleanText(value, 91);
}

export function seoRule020(value:string):string {
  return cleanText(value, 98);
}

export function seoRule021(value:string):string {
  return cleanText(value, 105);
}

export function seoRule022(value:string):string {
  return cleanText(value, 112);
}

export function seoRule023(value:string):string {
  return cleanText(value, 119);
}

export function seoRule024(value:string):string {
  return cleanText(value, 126);
}

export function seoRule025(value:string):string {
  return cleanText(value, 133);
}

export function seoRule026(value:string):string {
  return cleanText(value, 140);
}

export function seoRule027(value:string):string {
  return cleanText(value, 147);
}

export function seoRule028(value:string):string {
  return cleanText(value, 154);
}

export function seoRule029(value:string):string {
  return cleanText(value, 161);
}

export function seoRule030(value:string):string {
  return cleanText(value, 168);
}

export function seoRule031(value:string):string {
  return cleanText(value, 175);
}

export function seoRule032(value:string):string {
  return cleanText(value, 70);
}

export function seoRule033(value:string):string {
  return cleanText(value, 77);
}

export function seoRule034(value:string):string {
  return cleanText(value, 84);
}

export function seoRule035(value:string):string {
  return cleanText(value, 91);
}

export function seoRule036(value:string):string {
  return cleanText(value, 98);
}

export function seoRule037(value:string):string {
  return cleanText(value, 105);
}

export function seoRule038(value:string):string {
  return cleanText(value, 112);
}

export function seoRule039(value:string):string {
  return cleanText(value, 119);
}

export function seoRule040(value:string):string {
  return cleanText(value, 126);
}

export function seoRule041(value:string):string {
  return cleanText(value, 133);
}

export function seoRule042(value:string):string {
  return cleanText(value, 140);
}

export function seoRule043(value:string):string {
  return cleanText(value, 147);
}

export function seoRule044(value:string):string {
  return cleanText(value, 154);
}

export function seoRule045(value:string):string {
  return cleanText(value, 161);
}

export function seoRule046(value:string):string {
  return cleanText(value, 168);
}

export function seoRule047(value:string):string {
  return cleanText(value, 175);
}

export function seoRule048(value:string):string {
  return cleanText(value, 70);
}

export function seoRule049(value:string):string {
  return cleanText(value, 77);
}

export function seoRule050(value:string):string {
  return cleanText(value, 84);
}

export function seoRule051(value:string):string {
  return cleanText(value, 91);
}

export function seoRule052(value:string):string {
  return cleanText(value, 98);
}

export function seoRule053(value:string):string {
  return cleanText(value, 105);
}

export function seoRule054(value:string):string {
  return cleanText(value, 112);
}

export function seoRule055(value:string):string {
  return cleanText(value, 119);
}

export function seoRule056(value:string):string {
  return cleanText(value, 126);
}

export function seoRule057(value:string):string {
  return cleanText(value, 133);
}

export function seoRule058(value:string):string {
  return cleanText(value, 140);
}

export function seoRule059(value:string):string {
  return cleanText(value, 147);
}

export function seoRule060(value:string):string {
  return cleanText(value, 154);
}

export function seoRule061(value:string):string {
  return cleanText(value, 161);
}

export function seoRule062(value:string):string {
  return cleanText(value, 168);
}

export function seoRule063(value:string):string {
  return cleanText(value, 175);
}

export function seoRule064(value:string):string {
  return cleanText(value, 70);
}

export function seoRule065(value:string):string {
  return cleanText(value, 77);
}

export function seoRule066(value:string):string {
  return cleanText(value, 84);
}

export function seoRule067(value:string):string {
  return cleanText(value, 91);
}

export function seoRule068(value:string):string {
  return cleanText(value, 98);
}

export function seoRule069(value:string):string {
  return cleanText(value, 105);
}

export function seoRule070(value:string):string {
  return cleanText(value, 112);
}

export function seoRule071(value:string):string {
  return cleanText(value, 119);
}

export function seoRule072(value:string):string {
  return cleanText(value, 126);
}

export function seoRule073(value:string):string {
  return cleanText(value, 133);
}

export function seoRule074(value:string):string {
  return cleanText(value, 140);
}

export function seoRule075(value:string):string {
  return cleanText(value, 147);
}

export function seoRule076(value:string):string {
  return cleanText(value, 154);
}

export function seoRule077(value:string):string {
  return cleanText(value, 161);
}

export function seoRule078(value:string):string {
  return cleanText(value, 168);
}

export function seoRule079(value:string):string {
  return cleanText(value, 175);
}

export function seoRule080(value:string):string {
  return cleanText(value, 70);
}

export function seoRule081(value:string):string {
  return cleanText(value, 77);
}

export function seoRule082(value:string):string {
  return cleanText(value, 84);
}

export function seoRule083(value:string):string {
  return cleanText(value, 91);
}

export function seoRule084(value:string):string {
  return cleanText(value, 98);
}

export function seoRule085(value:string):string {
  return cleanText(value, 105);
}

export function seoRule086(value:string):string {
  return cleanText(value, 112);
}

export function seoRule087(value:string):string {
  return cleanText(value, 119);
}

export function seoRule088(value:string):string {
  return cleanText(value, 126);
}

export function seoRule089(value:string):string {
  return cleanText(value, 133);
}

export function seoRule090(value:string):string {
  return cleanText(value, 140);
}

export function seoRule091(value:string):string {
  return cleanText(value, 147);
}

export function seoRule092(value:string):string {
  return cleanText(value, 154);
}

export function seoRule093(value:string):string {
  return cleanText(value, 161);
}

export function seoRule094(value:string):string {
  return cleanText(value, 168);
}

export function seoRule095(value:string):string {
  return cleanText(value, 175);
}

export function seoRule096(value:string):string {
  return cleanText(value, 70);
}

export function seoRule097(value:string):string {
  return cleanText(value, 77);
}

export function seoRule098(value:string):string {
  return cleanText(value, 84);
}

export function seoRule099(value:string):string {
  return cleanText(value, 91);
}

export function seoRule100(value:string):string {
  return cleanText(value, 98);
}

export function seoRule101(value:string):string {
  return cleanText(value, 105);
}

export function seoRule102(value:string):string {
  return cleanText(value, 112);
}

export function seoRule103(value:string):string {
  return cleanText(value, 119);
}

export function seoRule104(value:string):string {
  return cleanText(value, 126);
}

export function seoRule105(value:string):string {
  return cleanText(value, 133);
}

export function seoRule106(value:string):string {
  return cleanText(value, 140);
}

export function seoRule107(value:string):string {
  return cleanText(value, 147);
}

export function seoRule108(value:string):string {
  return cleanText(value, 154);
}

export function seoRule109(value:string):string {
  return cleanText(value, 161);
}

export function seoRule110(value:string):string {
  return cleanText(value, 168);
}

export function seoRule111(value:string):string {
  return cleanText(value, 175);
}

export function seoRule112(value:string):string {
  return cleanText(value, 70);
}

export function seoRule113(value:string):string {
  return cleanText(value, 77);
}

export function seoRule114(value:string):string {
  return cleanText(value, 84);
}

export function seoRule115(value:string):string {
  return cleanText(value, 91);
}

export function seoRule116(value:string):string {
  return cleanText(value, 98);
}

export function seoRule117(value:string):string {
  return cleanText(value, 105);
}

export function seoRule118(value:string):string {
  return cleanText(value, 112);
}

export function seoRule119(value:string):string {
  return cleanText(value, 119);
}

export function seoRule120(value:string):string {
  return cleanText(value, 126);
}

export function seoRule121(value:string):string {
  return cleanText(value, 133);
}

export function seoRule122(value:string):string {
  return cleanText(value, 140);
}

export function seoRule123(value:string):string {
  return cleanText(value, 147);
}

export function seoRule124(value:string):string {
  return cleanText(value, 154);
}

export function seoRule125(value:string):string {
  return cleanText(value, 161);
}

export function seoRule126(value:string):string {
  return cleanText(value, 168);
}

export function seoRule127(value:string):string {
  return cleanText(value, 175);
}

export function seoRule128(value:string):string {
  return cleanText(value, 70);
}

export function seoRule129(value:string):string {
  return cleanText(value, 77);
}

export function seoRule130(value:string):string {
  return cleanText(value, 84);
}

export function seoRule131(value:string):string {
  return cleanText(value, 91);
}

export function seoRule132(value:string):string {
  return cleanText(value, 98);
}

export function seoRule133(value:string):string {
  return cleanText(value, 105);
}

export function seoRule134(value:string):string {
  return cleanText(value, 112);
}

export function seoRule135(value:string):string {
  return cleanText(value, 119);
}

export function seoRule136(value:string):string {
  return cleanText(value, 126);
}

export function seoRule137(value:string):string {
  return cleanText(value, 133);
}

export function seoRule138(value:string):string {
  return cleanText(value, 140);
}

export function seoRule139(value:string):string {
  return cleanText(value, 147);
}

export function seoRule140(value:string):string {
  return cleanText(value, 154);
}

export function seoRule141(value:string):string {
  return cleanText(value, 161);
}

export function seoRule142(value:string):string {
  return cleanText(value, 168);
}

export function seoRule143(value:string):string {
  return cleanText(value, 175);
}

export function seoRule144(value:string):string {
  return cleanText(value, 70);
}

export function seoRule145(value:string):string {
  return cleanText(value, 77);
}

export function seoRule146(value:string):string {
  return cleanText(value, 84);
}

export function seoRule147(value:string):string {
  return cleanText(value, 91);
}

export function seoRule148(value:string):string {
  return cleanText(value, 98);
}

export function seoRule149(value:string):string {
  return cleanText(value, 105);
}

export function seoRule150(value:string):string {
  return cleanText(value, 112);
}

export function seoRule151(value:string):string {
  return cleanText(value, 119);
}

export function seoRule152(value:string):string {
  return cleanText(value, 126);
}

export function seoRule153(value:string):string {
  return cleanText(value, 133);
}

export function seoRule154(value:string):string {
  return cleanText(value, 140);
}

export function seoRule155(value:string):string {
  return cleanText(value, 147);
}

export function seoRule156(value:string):string {
  return cleanText(value, 154);
}

export function seoRule157(value:string):string {
  return cleanText(value, 161);
}

export function seoRule158(value:string):string {
  return cleanText(value, 168);
}

export function seoRule159(value:string):string {
  return cleanText(value, 175);
}

export function seoRule160(value:string):string {
  return cleanText(value, 70);
}

export function seoRule161(value:string):string {
  return cleanText(value, 77);
}

export function seoRule162(value:string):string {
  return cleanText(value, 84);
}

export function seoRule163(value:string):string {
  return cleanText(value, 91);
}

export function seoRule164(value:string):string {
  return cleanText(value, 98);
}

export function seoRule165(value:string):string {
  return cleanText(value, 105);
}

export function seoRule166(value:string):string {
  return cleanText(value, 112);
}

export function seoRule167(value:string):string {
  return cleanText(value, 119);
}

export function seoRule168(value:string):string {
  return cleanText(value, 126);
}

export function seoRule169(value:string):string {
  return cleanText(value, 133);
}

export function seoRule170(value:string):string {
  return cleanText(value, 140);
}

export function seoRule171(value:string):string {
  return cleanText(value, 147);
}

export function seoRule172(value:string):string {
  return cleanText(value, 154);
}

export function seoRule173(value:string):string {
  return cleanText(value, 161);
}

export function seoRule174(value:string):string {
  return cleanText(value, 168);
}

export function seoRule175(value:string):string {
  return cleanText(value, 175);
}

export function seoRule176(value:string):string {
  return cleanText(value, 70);
}

export function seoRule177(value:string):string {
  return cleanText(value, 77);
}

export function seoRule178(value:string):string {
  return cleanText(value, 84);
}

export function seoRule179(value:string):string {
  return cleanText(value, 91);
}

export function seoRule180(value:string):string {
  return cleanText(value, 98);
}

export function seoRule181(value:string):string {
  return cleanText(value, 105);
}

export function seoRule182(value:string):string {
  return cleanText(value, 112);
}

export function seoRule183(value:string):string {
  return cleanText(value, 119);
}

export function seoRule184(value:string):string {
  return cleanText(value, 126);
}

export function seoRule185(value:string):string {
  return cleanText(value, 133);
}

export function seoRule186(value:string):string {
  return cleanText(value, 140);
}

export function seoRule187(value:string):string {
  return cleanText(value, 147);
}

export function seoRule188(value:string):string {
  return cleanText(value, 154);
}

export function seoRule189(value:string):string {
  return cleanText(value, 161);
}

export function seoRule190(value:string):string {
  return cleanText(value, 168);
}

export function seoRule191(value:string):string {
  return cleanText(value, 175);
}

export function seoRule192(value:string):string {
  return cleanText(value, 70);
}

export function seoRule193(value:string):string {
  return cleanText(value, 77);
}

export function seoRule194(value:string):string {
  return cleanText(value, 84);
}

export function seoRule195(value:string):string {
  return cleanText(value, 91);
}

export function seoRule196(value:string):string {
  return cleanText(value, 98);
}

export function seoRule197(value:string):string {
  return cleanText(value, 105);
}

export function seoRule198(value:string):string {
  return cleanText(value, 112);
}

export function seoRule199(value:string):string {
  return cleanText(value, 119);
}

export function seoRule200(value:string):string {
  return cleanText(value, 126);
}

export function seoRule201(value:string):string {
  return cleanText(value, 133);
}

export function seoRule202(value:string):string {
  return cleanText(value, 140);
}

export function seoRule203(value:string):string {
  return cleanText(value, 147);
}

export function seoRule204(value:string):string {
  return cleanText(value, 154);
}

export function seoRule205(value:string):string {
  return cleanText(value, 161);
}

export function seoRule206(value:string):string {
  return cleanText(value, 168);
}

export function seoRule207(value:string):string {
  return cleanText(value, 175);
}

export function seoRule208(value:string):string {
  return cleanText(value, 70);
}

export function seoRule209(value:string):string {
  return cleanText(value, 77);
}

export function seoRule210(value:string):string {
  return cleanText(value, 84);
}

export function seoRule211(value:string):string {
  return cleanText(value, 91);
}

export function seoRule212(value:string):string {
  return cleanText(value, 98);
}

export function seoRule213(value:string):string {
  return cleanText(value, 105);
}

export function seoRule214(value:string):string {
  return cleanText(value, 112);
}

export function seoRule215(value:string):string {
  return cleanText(value, 119);
}

export function seoRule216(value:string):string {
  return cleanText(value, 126);
}

export function seoRule217(value:string):string {
  return cleanText(value, 133);
}

export function seoRule218(value:string):string {
  return cleanText(value, 140);
}

export function seoRule219(value:string):string {
  return cleanText(value, 147);
}

export function seoRule220(value:string):string {
  return cleanText(value, 154);
}
