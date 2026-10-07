"use client";

import * as React from "react";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { v8Action, v8Breakpoint, v8Clamp, v8Cx, v8MediaPolicy, v8MotionMode, v8PublicationLabel, type V8Action, type V8Breakpoint, type V8Interaction, type V8MediaPolicy, type V8MotionMode, type V8ProjectCardData, type V8Publication } from "@/data/v8-shared";
type ConfigEntry={id:string;label:string;enabled:boolean;value:string|number|boolean;reason:string;};

export type EngineeringHudProps={className?:string;id?:string;theme?:'paper'|'ink'|'technical';density?:'airy'|'balanced'|'compact';motion?:V8MotionMode;enabled?:boolean;onAction?:(action:V8Action)=>void;};
const SECTION_ID='engineering-hud-02';
const TITLE="Engineering HUD";
const DESCRIPTION="A technical interface for project metadata, geometry context, model controls and visual orientation.";
const PRIMARY="Open engineering view";
const SECONDARY="View project data";
type SectionItem={id:string;label:string;detail:string;interaction:V8Interaction;};
const ITEM_01:SectionItem={id:'engineering-hud-01',label:"MODEL",detail:"Model is a structured part of the engineering hud system, presented with approved content and safe fallbacks.",interaction:'programmatic'};
const ITEM_02:SectionItem={id:'engineering-hud-02',label:"GRID",detail:"Grid is a structured part of the engineering hud system, presented with approved content and safe fallbacks.",interaction:'pointer'};
const ITEM_03:SectionItem={id:'engineering-hud-03',label:"AXIS",detail:"Axis is a structured part of the engineering hud system, presented with approved content and safe fallbacks.",interaction:'keyboard'};
const ITEM_04:SectionItem={id:'engineering-hud-04',label:"SCALE",detail:"Scale is a structured part of the engineering hud system, presented with approved content and safe fallbacks.",interaction:'touch'};
const ITEM_05:SectionItem={id:'engineering-hud-05',label:"LAYER",detail:"Layer is a structured part of the engineering hud system, presented with approved content and safe fallbacks.",interaction:'programmatic'};
const ITEM_06:SectionItem={id:'engineering-hud-06',label:"EVIDENCE",detail:"Evidence is a structured part of the engineering hud system, presented with approved content and safe fallbacks.",interaction:'pointer'};
const ITEM_07:SectionItem={id:'engineering-hud-07',label:"MEDIA",detail:"Media is a structured part of the engineering hud system, presented with approved content and safe fallbacks.",interaction:'keyboard'};
const ITEM_08:SectionItem={id:'engineering-hud-08',label:"STATUS",detail:"Status is a structured part of the engineering hud system, presented with approved content and safe fallbacks.",interaction:'touch'};
const ITEMS:readonly SectionItem[]=[ITEM_01,ITEM_02,ITEM_03,ITEM_04,ITEM_05,ITEM_06,ITEM_07,ITEM_08];

const FOCUSABLE='a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
function winWidth(fallback=1280){return typeof window==='undefined'?fallback:window.innerWidth;}
function typingTarget(target:EventTarget|null){if(!(target instanceof HTMLElement))return false;return ['input','textarea','select'].includes(target.tagName.toLowerCase())||target.isContentEditable;}
function safeFocus(root:HTMLElement|null){root?.querySelector<HTMLElement>(FOCUSABLE)?.focus();}
function safeScroll(id:string){const target=document.getElementById(id);if(target instanceof HTMLElement)target.scrollIntoView({behavior:'smooth',block:'start'});}
function canAnimate(mode:V8MotionMode){if(mode!=='full')return false;if(typeof window==='undefined'||!window.matchMedia)return true;return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;}
function formatIndex(n:number){return String(n).padStart(2,'0');}
function clampIndex(n:number,count:number){return count?((n%count)+count)%count:0;}
function percent(n:number){return `${Math.round(v8Clamp(n,0,1)*100)}%`;}
function scrollProgress(node:HTMLElement|null){if(!node||typeof window==='undefined')return 0;const r=node.getBoundingClientRect();return v8Clamp((window.innerHeight-r.top)/(window.innerHeight+r.height),0,1);}
function mediaCopy(policy:V8MediaPolicy){return policy.mode==='placeholder'?'MEDIA PLACEHOLDER — UPDATE AFTER CLIENT ASSET APPROVAL':policy.rightsApproved?'APPROVED MEDIA':'MEDIA PENDING RIGHTS REVIEW';}
function action(onAction:((a:V8Action)=>void)|undefined,id:string,label:string,href?:string,section?:string,interaction:V8Interaction='programmatic'){onAction?.(v8Action(id,label,href,section,interaction));}
function analyticsPayload(section:string,event:string,extra:Record<string,string|number|boolean>={}){return{section,event,extra,timestamp:Date.now()};}
function statusTone(state:V8Publication){return state==='verified'||state==='approved'?'verified':'pending';}
const MOTION_001:ConfigEntry={id:'engineering-hud-motion-001',label:'MOTION 001',enabled:true,value:"line-draw",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_002:ConfigEntry={id:'engineering-hud-motion-002',label:'MOTION 002',enabled:true,value:"clip",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_003:ConfigEntry={id:'engineering-hud-motion-003',label:'MOTION 003',enabled:true,value:"scale",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_004:ConfigEntry={id:'engineering-hud-motion-004',label:'MOTION 004',enabled:true,value:"parallax",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_005:ConfigEntry={id:'engineering-hud-motion-005',label:'MOTION 005',enabled:true,value:"scan",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_006:ConfigEntry={id:'engineering-hud-motion-006',label:'MOTION 006',enabled:true,value:"model-drift",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_007:ConfigEntry={id:'engineering-hud-motion-007',label:'MOTION 007',enabled:true,value:"color-shift",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_008:ConfigEntry={id:'engineering-hud-motion-008',label:'MOTION 008',enabled:true,value:"fade-up",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_009:ConfigEntry={id:'engineering-hud-motion-009',label:'MOTION 009',enabled:true,value:"line-draw",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_010:ConfigEntry={id:'engineering-hud-motion-010',label:'MOTION 010',enabled:true,value:"clip",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_011:ConfigEntry={id:'engineering-hud-motion-011',label:'MOTION 011',enabled:true,value:"scale",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_012:ConfigEntry={id:'engineering-hud-motion-012',label:'MOTION 012',enabled:true,value:"parallax",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_013:ConfigEntry={id:'engineering-hud-motion-013',label:'MOTION 013',enabled:true,value:"scan",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_014:ConfigEntry={id:'engineering-hud-motion-014',label:'MOTION 014',enabled:true,value:"model-drift",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_015:ConfigEntry={id:'engineering-hud-motion-015',label:'MOTION 015',enabled:true,value:"color-shift",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_016:ConfigEntry={id:'engineering-hud-motion-016',label:'MOTION 016',enabled:true,value:"fade-up",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_017:ConfigEntry={id:'engineering-hud-motion-017',label:'MOTION 017',enabled:true,value:"line-draw",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_018:ConfigEntry={id:'engineering-hud-motion-018',label:'MOTION 018',enabled:true,value:"clip",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_019:ConfigEntry={id:'engineering-hud-motion-019',label:'MOTION 019',enabled:true,value:"scale",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_020:ConfigEntry={id:'engineering-hud-motion-020',label:'MOTION 020',enabled:true,value:"parallax",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_021:ConfigEntry={id:'engineering-hud-motion-021',label:'MOTION 021',enabled:true,value:"scan",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_022:ConfigEntry={id:'engineering-hud-motion-022',label:'MOTION 022',enabled:true,value:"model-drift",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_023:ConfigEntry={id:'engineering-hud-motion-023',label:'MOTION 023',enabled:true,value:"color-shift",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_024:ConfigEntry={id:'engineering-hud-motion-024',label:'MOTION 024',enabled:true,value:"fade-up",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_025:ConfigEntry={id:'engineering-hud-motion-025',label:'MOTION 025',enabled:true,value:"line-draw",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_026:ConfigEntry={id:'engineering-hud-motion-026',label:'MOTION 026',enabled:true,value:"clip",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_027:ConfigEntry={id:'engineering-hud-motion-027',label:'MOTION 027',enabled:true,value:"scale",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_028:ConfigEntry={id:'engineering-hud-motion-028',label:'MOTION 028',enabled:true,value:"parallax",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_029:ConfigEntry={id:'engineering-hud-motion-029',label:'MOTION 029',enabled:true,value:"scan",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_030:ConfigEntry={id:'engineering-hud-motion-030',label:'MOTION 030',enabled:true,value:"model-drift",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_031:ConfigEntry={id:'engineering-hud-motion-031',label:'MOTION 031',enabled:true,value:"color-shift",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_032:ConfigEntry={id:'engineering-hud-motion-032',label:'MOTION 032',enabled:true,value:"fade-up",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_033:ConfigEntry={id:'engineering-hud-motion-033',label:'MOTION 033',enabled:true,value:"line-draw",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_034:ConfigEntry={id:'engineering-hud-motion-034',label:'MOTION 034',enabled:true,value:"clip",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_035:ConfigEntry={id:'engineering-hud-motion-035',label:'MOTION 035',enabled:true,value:"scale",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_036:ConfigEntry={id:'engineering-hud-motion-036',label:'MOTION 036',enabled:true,value:"parallax",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_037:ConfigEntry={id:'engineering-hud-motion-037',label:'MOTION 037',enabled:true,value:"scan",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_038:ConfigEntry={id:'engineering-hud-motion-038',label:'MOTION 038',enabled:true,value:"model-drift",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_039:ConfigEntry={id:'engineering-hud-motion-039',label:'MOTION 039',enabled:true,value:"color-shift",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_040:ConfigEntry={id:'engineering-hud-motion-040',label:'MOTION 040',enabled:true,value:"fade-up",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_041:ConfigEntry={id:'engineering-hud-motion-041',label:'MOTION 041',enabled:true,value:"line-draw",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_042:ConfigEntry={id:'engineering-hud-motion-042',label:'MOTION 042',enabled:true,value:"clip",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_043:ConfigEntry={id:'engineering-hud-motion-043',label:'MOTION 043',enabled:true,value:"scale",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_044:ConfigEntry={id:'engineering-hud-motion-044',label:'MOTION 044',enabled:true,value:"parallax",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_045:ConfigEntry={id:'engineering-hud-motion-045',label:'MOTION 045',enabled:true,value:"scan",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_046:ConfigEntry={id:'engineering-hud-motion-046',label:'MOTION 046',enabled:true,value:"model-drift",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_047:ConfigEntry={id:'engineering-hud-motion-047',label:'MOTION 047',enabled:true,value:"color-shift",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_048:ConfigEntry={id:'engineering-hud-motion-048',label:'MOTION 048',enabled:true,value:"fade-up",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_049:ConfigEntry={id:'engineering-hud-motion-049',label:'MOTION 049',enabled:true,value:"line-draw",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_050:ConfigEntry={id:'engineering-hud-motion-050',label:'MOTION 050',enabled:true,value:"clip",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_051:ConfigEntry={id:'engineering-hud-motion-051',label:'MOTION 051',enabled:true,value:"scale",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_052:ConfigEntry={id:'engineering-hud-motion-052',label:'MOTION 052',enabled:true,value:"parallax",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_053:ConfigEntry={id:'engineering-hud-motion-053',label:'MOTION 053',enabled:true,value:"scan",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_054:ConfigEntry={id:'engineering-hud-motion-054',label:'MOTION 054',enabled:true,value:"model-drift",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_055:ConfigEntry={id:'engineering-hud-motion-055',label:'MOTION 055',enabled:true,value:"color-shift",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_056:ConfigEntry={id:'engineering-hud-motion-056',label:'MOTION 056',enabled:true,value:"fade-up",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_057:ConfigEntry={id:'engineering-hud-motion-057',label:'MOTION 057',enabled:true,value:"line-draw",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_058:ConfigEntry={id:'engineering-hud-motion-058',label:'MOTION 058',enabled:true,value:"clip",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_059:ConfigEntry={id:'engineering-hud-motion-059',label:'MOTION 059',enabled:true,value:"scale",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_060:ConfigEntry={id:'engineering-hud-motion-060',label:'MOTION 060',enabled:true,value:"parallax",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_061:ConfigEntry={id:'engineering-hud-motion-061',label:'MOTION 061',enabled:true,value:"scan",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_062:ConfigEntry={id:'engineering-hud-motion-062',label:'MOTION 062',enabled:true,value:"model-drift",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_063:ConfigEntry={id:'engineering-hud-motion-063',label:'MOTION 063',enabled:true,value:"color-shift",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_064:ConfigEntry={id:'engineering-hud-motion-064',label:'MOTION 064',enabled:true,value:"fade-up",reason:"keeps animation local, reversible and disabled under reduced motion"};
const MOTION_RULES=[MOTION_001,MOTION_002,MOTION_003,MOTION_004,MOTION_005,MOTION_006,MOTION_007,MOTION_008,MOTION_009,MOTION_010,MOTION_011,MOTION_012,MOTION_013,MOTION_014,MOTION_015,MOTION_016,MOTION_017,MOTION_018,MOTION_019,MOTION_020,MOTION_021,MOTION_022,MOTION_023,MOTION_024,MOTION_025,MOTION_026,MOTION_027,MOTION_028,MOTION_029,MOTION_030,MOTION_031,MOTION_032,MOTION_033,MOTION_034,MOTION_035,MOTION_036,MOTION_037,MOTION_038,MOTION_039,MOTION_040,MOTION_041,MOTION_042,MOTION_043,MOTION_044,MOTION_045,MOTION_046,MOTION_047,MOTION_048,MOTION_049,MOTION_050,MOTION_051,MOTION_052,MOTION_053,MOTION_054,MOTION_055,MOTION_056,MOTION_057,MOTION_058,MOTION_059,MOTION_060,MOTION_061,MOTION_062,MOTION_063,MOTION_064] as const;
const VIEWPORT_001:ConfigEntry={id:'engineering-hud-viewport-001',label:'VIEWPORT 001',enabled:true,value:390,reason:"explicit responsive checkpoint"};
const VIEWPORT_002:ConfigEntry={id:'engineering-hud-viewport-002',label:'VIEWPORT 002',enabled:true,value:414,reason:"explicit responsive checkpoint"};
const VIEWPORT_003:ConfigEntry={id:'engineering-hud-viewport-003',label:'VIEWPORT 003',enabled:true,value:480,reason:"explicit responsive checkpoint"};
const VIEWPORT_004:ConfigEntry={id:'engineering-hud-viewport-004',label:'VIEWPORT 004',enabled:true,value:640,reason:"explicit responsive checkpoint"};
const VIEWPORT_005:ConfigEntry={id:'engineering-hud-viewport-005',label:'VIEWPORT 005',enabled:true,value:768,reason:"explicit responsive checkpoint"};
const VIEWPORT_006:ConfigEntry={id:'engineering-hud-viewport-006',label:'VIEWPORT 006',enabled:true,value:820,reason:"explicit responsive checkpoint"};
const VIEWPORT_007:ConfigEntry={id:'engineering-hud-viewport-007',label:'VIEWPORT 007',enabled:true,value:900,reason:"explicit responsive checkpoint"};
const VIEWPORT_008:ConfigEntry={id:'engineering-hud-viewport-008',label:'VIEWPORT 008',enabled:true,value:1024,reason:"explicit responsive checkpoint"};
const VIEWPORT_009:ConfigEntry={id:'engineering-hud-viewport-009',label:'VIEWPORT 009',enabled:true,value:1180,reason:"explicit responsive checkpoint"};
const VIEWPORT_010:ConfigEntry={id:'engineering-hud-viewport-010',label:'VIEWPORT 010',enabled:true,value:1280,reason:"explicit responsive checkpoint"};
const VIEWPORT_011:ConfigEntry={id:'engineering-hud-viewport-011',label:'VIEWPORT 011',enabled:true,value:1366,reason:"explicit responsive checkpoint"};
const VIEWPORT_012:ConfigEntry={id:'engineering-hud-viewport-012',label:'VIEWPORT 012',enabled:true,value:1440,reason:"explicit responsive checkpoint"};
const VIEWPORT_013:ConfigEntry={id:'engineering-hud-viewport-013',label:'VIEWPORT 013',enabled:true,value:1536,reason:"explicit responsive checkpoint"};
const VIEWPORT_014:ConfigEntry={id:'engineering-hud-viewport-014',label:'VIEWPORT 014',enabled:true,value:1728,reason:"explicit responsive checkpoint"};
const VIEWPORT_015:ConfigEntry={id:'engineering-hud-viewport-015',label:'VIEWPORT 015',enabled:true,value:1920,reason:"explicit responsive checkpoint"};
const VIEWPORT_016:ConfigEntry={id:'engineering-hud-viewport-016',label:'VIEWPORT 016',enabled:true,value:360,reason:"explicit responsive checkpoint"};
const VIEWPORT_017:ConfigEntry={id:'engineering-hud-viewport-017',label:'VIEWPORT 017',enabled:true,value:390,reason:"explicit responsive checkpoint"};
const VIEWPORT_018:ConfigEntry={id:'engineering-hud-viewport-018',label:'VIEWPORT 018',enabled:true,value:414,reason:"explicit responsive checkpoint"};
const VIEWPORT_019:ConfigEntry={id:'engineering-hud-viewport-019',label:'VIEWPORT 019',enabled:true,value:480,reason:"explicit responsive checkpoint"};
const VIEWPORT_020:ConfigEntry={id:'engineering-hud-viewport-020',label:'VIEWPORT 020',enabled:true,value:640,reason:"explicit responsive checkpoint"};
const VIEWPORT_021:ConfigEntry={id:'engineering-hud-viewport-021',label:'VIEWPORT 021',enabled:true,value:768,reason:"explicit responsive checkpoint"};
const VIEWPORT_022:ConfigEntry={id:'engineering-hud-viewport-022',label:'VIEWPORT 022',enabled:true,value:820,reason:"explicit responsive checkpoint"};
const VIEWPORT_023:ConfigEntry={id:'engineering-hud-viewport-023',label:'VIEWPORT 023',enabled:true,value:900,reason:"explicit responsive checkpoint"};
const VIEWPORT_024:ConfigEntry={id:'engineering-hud-viewport-024',label:'VIEWPORT 024',enabled:true,value:1024,reason:"explicit responsive checkpoint"};
const VIEWPORT_025:ConfigEntry={id:'engineering-hud-viewport-025',label:'VIEWPORT 025',enabled:true,value:1180,reason:"explicit responsive checkpoint"};
const VIEWPORT_026:ConfigEntry={id:'engineering-hud-viewport-026',label:'VIEWPORT 026',enabled:true,value:1280,reason:"explicit responsive checkpoint"};
const VIEWPORT_027:ConfigEntry={id:'engineering-hud-viewport-027',label:'VIEWPORT 027',enabled:true,value:1366,reason:"explicit responsive checkpoint"};
const VIEWPORT_028:ConfigEntry={id:'engineering-hud-viewport-028',label:'VIEWPORT 028',enabled:true,value:1440,reason:"explicit responsive checkpoint"};
const VIEWPORT_029:ConfigEntry={id:'engineering-hud-viewport-029',label:'VIEWPORT 029',enabled:true,value:1536,reason:"explicit responsive checkpoint"};
const VIEWPORT_030:ConfigEntry={id:'engineering-hud-viewport-030',label:'VIEWPORT 030',enabled:true,value:1728,reason:"explicit responsive checkpoint"};
const VIEWPORT_031:ConfigEntry={id:'engineering-hud-viewport-031',label:'VIEWPORT 031',enabled:true,value:1920,reason:"explicit responsive checkpoint"};
const VIEWPORT_032:ConfigEntry={id:'engineering-hud-viewport-032',label:'VIEWPORT 032',enabled:true,value:360,reason:"explicit responsive checkpoint"};
const VIEWPORT_RULES=[VIEWPORT_001,VIEWPORT_002,VIEWPORT_003,VIEWPORT_004,VIEWPORT_005,VIEWPORT_006,VIEWPORT_007,VIEWPORT_008,VIEWPORT_009,VIEWPORT_010,VIEWPORT_011,VIEWPORT_012,VIEWPORT_013,VIEWPORT_014,VIEWPORT_015,VIEWPORT_016,VIEWPORT_017,VIEWPORT_018,VIEWPORT_019,VIEWPORT_020,VIEWPORT_021,VIEWPORT_022,VIEWPORT_023,VIEWPORT_024,VIEWPORT_025,VIEWPORT_026,VIEWPORT_027,VIEWPORT_028,VIEWPORT_029,VIEWPORT_030,VIEWPORT_031,VIEWPORT_032] as const;
const INTERACTION_001:ConfigEntry={id:'engineering-hud-interaction-001',label:'INTERACTION 001',enabled:true,value:"focus-visible",reason:"each pointer interaction keeps a keyboard or touch fallback"};
const INTERACTION_002:ConfigEntry={id:'engineering-hud-interaction-002',label:'INTERACTION 002',enabled:true,value:"click",reason:"each pointer interaction keeps a keyboard or touch fallback"};
const INTERACTION_003:ConfigEntry={id:'engineering-hud-interaction-003',label:'INTERACTION 003',enabled:true,value:"drag",reason:"each pointer interaction keeps a keyboard or touch fallback"};
const INTERACTION_004:ConfigEntry={id:'engineering-hud-interaction-004',label:'INTERACTION 004',enabled:true,value:"touch",reason:"each pointer interaction keeps a keyboard or touch fallback"};
const INTERACTION_005:ConfigEntry={id:'engineering-hud-interaction-005',label:'INTERACTION 005',enabled:true,value:"scroll",reason:"each pointer interaction keeps a keyboard or touch fallback"};
const INTERACTION_006:ConfigEntry={id:'engineering-hud-interaction-006',label:'INTERACTION 006',enabled:true,value:"hover",reason:"each pointer interaction keeps a keyboard or touch fallback"};
const INTERACTION_007:ConfigEntry={id:'engineering-hud-interaction-007',label:'INTERACTION 007',enabled:true,value:"focus-visible",reason:"each pointer interaction keeps a keyboard or touch fallback"};
const INTERACTION_008:ConfigEntry={id:'engineering-hud-interaction-008',label:'INTERACTION 008',enabled:true,value:"click",reason:"each pointer interaction keeps a keyboard or touch fallback"};
const INTERACTION_009:ConfigEntry={id:'engineering-hud-interaction-009',label:'INTERACTION 009',enabled:true,value:"drag",reason:"each pointer interaction keeps a keyboard or touch fallback"};
const INTERACTION_010:ConfigEntry={id:'engineering-hud-interaction-010',label:'INTERACTION 010',enabled:true,value:"touch",reason:"each pointer interaction keeps a keyboard or touch fallback"};
const INTERACTION_011:ConfigEntry={id:'engineering-hud-interaction-011',label:'INTERACTION 011',enabled:true,value:"scroll",reason:"each pointer interaction keeps a keyboard or touch fallback"};
const INTERACTION_012:ConfigEntry={id:'engineering-hud-interaction-012',label:'INTERACTION 012',enabled:true,value:"hover",reason:"each pointer interaction keeps a keyboard or touch fallback"};
const INTERACTION_013:ConfigEntry={id:'engineering-hud-interaction-013',label:'INTERACTION 013',enabled:true,value:"focus-visible",reason:"each pointer interaction keeps a keyboard or touch fallback"};
const INTERACTION_014:ConfigEntry={id:'engineering-hud-interaction-014',label:'INTERACTION 014',enabled:true,value:"click",reason:"each pointer interaction keeps a keyboard or touch fallback"};
const INTERACTION_015:ConfigEntry={id:'engineering-hud-interaction-015',label:'INTERACTION 015',enabled:true,value:"drag",reason:"each pointer interaction keeps a keyboard or touch fallback"};
const INTERACTION_016:ConfigEntry={id:'engineering-hud-interaction-016',label:'INTERACTION 016',enabled:true,value:"touch",reason:"each pointer interaction keeps a keyboard or touch fallback"};
const INTERACTION_017:ConfigEntry={id:'engineering-hud-interaction-017',label:'INTERACTION 017',enabled:true,value:"scroll",reason:"each pointer interaction keeps a keyboard or touch fallback"};
const INTERACTION_018:ConfigEntry={id:'engineering-hud-interaction-018',label:'INTERACTION 018',enabled:true,value:"hover",reason:"each pointer interaction keeps a keyboard or touch fallback"};
const INTERACTION_019:ConfigEntry={id:'engineering-hud-interaction-019',label:'INTERACTION 019',enabled:true,value:"focus-visible",reason:"each pointer interaction keeps a keyboard or touch fallback"};
const INTERACTION_020:ConfigEntry={id:'engineering-hud-interaction-020',label:'INTERACTION 020',enabled:true,value:"click",reason:"each pointer interaction keeps a keyboard or touch fallback"};
const INTERACTION_021:ConfigEntry={id:'engineering-hud-interaction-021',label:'INTERACTION 021',enabled:true,value:"drag",reason:"each pointer interaction keeps a keyboard or touch fallback"};
const INTERACTION_022:ConfigEntry={id:'engineering-hud-interaction-022',label:'INTERACTION 022',enabled:true,value:"touch",reason:"each pointer interaction keeps a keyboard or touch fallback"};
const INTERACTION_023:ConfigEntry={id:'engineering-hud-interaction-023',label:'INTERACTION 023',enabled:true,value:"scroll",reason:"each pointer interaction keeps a keyboard or touch fallback"};
const INTERACTION_024:ConfigEntry={id:'engineering-hud-interaction-024',label:'INTERACTION 024',enabled:true,value:"hover",reason:"each pointer interaction keeps a keyboard or touch fallback"};
const INTERACTION_025:ConfigEntry={id:'engineering-hud-interaction-025',label:'INTERACTION 025',enabled:true,value:"focus-visible",reason:"each pointer interaction keeps a keyboard or touch fallback"};
const INTERACTION_026:ConfigEntry={id:'engineering-hud-interaction-026',label:'INTERACTION 026',enabled:true,value:"click",reason:"each pointer interaction keeps a keyboard or touch fallback"};
const INTERACTION_027:ConfigEntry={id:'engineering-hud-interaction-027',label:'INTERACTION 027',enabled:true,value:"drag",reason:"each pointer interaction keeps a keyboard or touch fallback"};
const INTERACTION_028:ConfigEntry={id:'engineering-hud-interaction-028',label:'INTERACTION 028',enabled:true,value:"touch",reason:"each pointer interaction keeps a keyboard or touch fallback"};
const INTERACTION_029:ConfigEntry={id:'engineering-hud-interaction-029',label:'INTERACTION 029',enabled:true,value:"scroll",reason:"each pointer interaction keeps a keyboard or touch fallback"};
const INTERACTION_030:ConfigEntry={id:'engineering-hud-interaction-030',label:'INTERACTION 030',enabled:true,value:"hover",reason:"each pointer interaction keeps a keyboard or touch fallback"};
const INTERACTION_031:ConfigEntry={id:'engineering-hud-interaction-031',label:'INTERACTION 031',enabled:true,value:"focus-visible",reason:"each pointer interaction keeps a keyboard or touch fallback"};
const INTERACTION_032:ConfigEntry={id:'engineering-hud-interaction-032',label:'INTERACTION 032',enabled:true,value:"click",reason:"each pointer interaction keeps a keyboard or touch fallback"};
const INTERACTION_RULES=[INTERACTION_001,INTERACTION_002,INTERACTION_003,INTERACTION_004,INTERACTION_005,INTERACTION_006,INTERACTION_007,INTERACTION_008,INTERACTION_009,INTERACTION_010,INTERACTION_011,INTERACTION_012,INTERACTION_013,INTERACTION_014,INTERACTION_015,INTERACTION_016,INTERACTION_017,INTERACTION_018,INTERACTION_019,INTERACTION_020,INTERACTION_021,INTERACTION_022,INTERACTION_023,INTERACTION_024,INTERACTION_025,INTERACTION_026,INTERACTION_027,INTERACTION_028,INTERACTION_029,INTERACTION_030,INTERACTION_031,INTERACTION_032] as const;
const A11Y_001:ConfigEntry={id:'engineering-hud-a11y-001',label:'A11Y 001',enabled:true,value:true,reason:"focus state must be preserved"};
const A11Y_002:ConfigEntry={id:'engineering-hud-a11y-002',label:'A11Y 002',enabled:true,value:true,reason:"screen-reader label must be preserved"};
const A11Y_003:ConfigEntry={id:'engineering-hud-a11y-003',label:'A11Y 003',enabled:true,value:true,reason:"reduced motion must be preserved"};
const A11Y_004:ConfigEntry={id:'engineering-hud-a11y-004',label:'A11Y 004',enabled:true,value:true,reason:"touch target must be preserved"};
const A11Y_005:ConfigEntry={id:'engineering-hud-a11y-005',label:'A11Y 005',enabled:true,value:true,reason:"contrast must be preserved"};
const A11Y_006:ConfigEntry={id:'engineering-hud-a11y-006',label:'A11Y 006',enabled:true,value:true,reason:"semantic heading must be preserved"};
const A11Y_007:ConfigEntry={id:'engineering-hud-a11y-007',label:'A11Y 007',enabled:true,value:true,reason:"focus state must be preserved"};
const A11Y_008:ConfigEntry={id:'engineering-hud-a11y-008',label:'A11Y 008',enabled:true,value:true,reason:"screen-reader label must be preserved"};
const A11Y_009:ConfigEntry={id:'engineering-hud-a11y-009',label:'A11Y 009',enabled:true,value:true,reason:"reduced motion must be preserved"};
const A11Y_010:ConfigEntry={id:'engineering-hud-a11y-010',label:'A11Y 010',enabled:true,value:true,reason:"touch target must be preserved"};
const A11Y_011:ConfigEntry={id:'engineering-hud-a11y-011',label:'A11Y 011',enabled:true,value:true,reason:"contrast must be preserved"};
const A11Y_012:ConfigEntry={id:'engineering-hud-a11y-012',label:'A11Y 012',enabled:true,value:true,reason:"semantic heading must be preserved"};
const A11Y_013:ConfigEntry={id:'engineering-hud-a11y-013',label:'A11Y 013',enabled:true,value:true,reason:"focus state must be preserved"};
const A11Y_014:ConfigEntry={id:'engineering-hud-a11y-014',label:'A11Y 014',enabled:true,value:true,reason:"screen-reader label must be preserved"};
const A11Y_015:ConfigEntry={id:'engineering-hud-a11y-015',label:'A11Y 015',enabled:true,value:true,reason:"reduced motion must be preserved"};
const A11Y_016:ConfigEntry={id:'engineering-hud-a11y-016',label:'A11Y 016',enabled:true,value:true,reason:"touch target must be preserved"};
const A11Y_017:ConfigEntry={id:'engineering-hud-a11y-017',label:'A11Y 017',enabled:true,value:true,reason:"contrast must be preserved"};
const A11Y_018:ConfigEntry={id:'engineering-hud-a11y-018',label:'A11Y 018',enabled:true,value:true,reason:"semantic heading must be preserved"};
const A11Y_019:ConfigEntry={id:'engineering-hud-a11y-019',label:'A11Y 019',enabled:true,value:true,reason:"focus state must be preserved"};
const A11Y_020:ConfigEntry={id:'engineering-hud-a11y-020',label:'A11Y 020',enabled:true,value:true,reason:"screen-reader label must be preserved"};
const A11Y_021:ConfigEntry={id:'engineering-hud-a11y-021',label:'A11Y 021',enabled:true,value:true,reason:"reduced motion must be preserved"};
const A11Y_022:ConfigEntry={id:'engineering-hud-a11y-022',label:'A11Y 022',enabled:true,value:true,reason:"touch target must be preserved"};
const A11Y_023:ConfigEntry={id:'engineering-hud-a11y-023',label:'A11Y 023',enabled:true,value:true,reason:"contrast must be preserved"};
const A11Y_024:ConfigEntry={id:'engineering-hud-a11y-024',label:'A11Y 024',enabled:true,value:true,reason:"semantic heading must be preserved"};
const A11Y_025:ConfigEntry={id:'engineering-hud-a11y-025',label:'A11Y 025',enabled:true,value:true,reason:"focus state must be preserved"};
const A11Y_026:ConfigEntry={id:'engineering-hud-a11y-026',label:'A11Y 026',enabled:true,value:true,reason:"screen-reader label must be preserved"};
const A11Y_027:ConfigEntry={id:'engineering-hud-a11y-027',label:'A11Y 027',enabled:true,value:true,reason:"reduced motion must be preserved"};
const A11Y_028:ConfigEntry={id:'engineering-hud-a11y-028',label:'A11Y 028',enabled:true,value:true,reason:"touch target must be preserved"};
const A11Y_029:ConfigEntry={id:'engineering-hud-a11y-029',label:'A11Y 029',enabled:true,value:true,reason:"contrast must be preserved"};
const A11Y_030:ConfigEntry={id:'engineering-hud-a11y-030',label:'A11Y 030',enabled:true,value:true,reason:"semantic heading must be preserved"};
const A11Y_031:ConfigEntry={id:'engineering-hud-a11y-031',label:'A11Y 031',enabled:true,value:true,reason:"focus state must be preserved"};
const A11Y_032:ConfigEntry={id:'engineering-hud-a11y-032',label:'A11Y 032',enabled:true,value:true,reason:"screen-reader label must be preserved"};
const A11Y_RULES=[A11Y_001,A11Y_002,A11Y_003,A11Y_004,A11Y_005,A11Y_006,A11Y_007,A11Y_008,A11Y_009,A11Y_010,A11Y_011,A11Y_012,A11Y_013,A11Y_014,A11Y_015,A11Y_016,A11Y_017,A11Y_018,A11Y_019,A11Y_020,A11Y_021,A11Y_022,A11Y_023,A11Y_024,A11Y_025,A11Y_026,A11Y_027,A11Y_028,A11Y_029,A11Y_030,A11Y_031,A11Y_032] as const;
const MEDIA_001:ConfigEntry={id:'engineering-hud-media-001',label:'MEDIA 001',enabled:true,value:"image",reason:"assets remain replaceable and rights-aware"};
const MEDIA_002:ConfigEntry={id:'engineering-hud-media-002',label:'MEDIA 002',enabled:true,value:"video",reason:"assets remain replaceable and rights-aware"};
const MEDIA_003:ConfigEntry={id:'engineering-hud-media-003',label:'MEDIA 003',enabled:true,value:"model",reason:"assets remain replaceable and rights-aware"};
const MEDIA_004:ConfigEntry={id:'engineering-hud-media-004',label:'MEDIA 004',enabled:true,value:"svg",reason:"assets remain replaceable and rights-aware"};
const MEDIA_005:ConfigEntry={id:'engineering-hud-media-005',label:'MEDIA 005',enabled:true,value:"placeholder",reason:"assets remain replaceable and rights-aware"};
const MEDIA_006:ConfigEntry={id:'engineering-hud-media-006',label:'MEDIA 006',enabled:true,value:"image",reason:"assets remain replaceable and rights-aware"};
const MEDIA_007:ConfigEntry={id:'engineering-hud-media-007',label:'MEDIA 007',enabled:true,value:"video",reason:"assets remain replaceable and rights-aware"};
const MEDIA_008:ConfigEntry={id:'engineering-hud-media-008',label:'MEDIA 008',enabled:true,value:"model",reason:"assets remain replaceable and rights-aware"};
const MEDIA_009:ConfigEntry={id:'engineering-hud-media-009',label:'MEDIA 009',enabled:true,value:"svg",reason:"assets remain replaceable and rights-aware"};
const MEDIA_010:ConfigEntry={id:'engineering-hud-media-010',label:'MEDIA 010',enabled:true,value:"placeholder",reason:"assets remain replaceable and rights-aware"};
const MEDIA_011:ConfigEntry={id:'engineering-hud-media-011',label:'MEDIA 011',enabled:true,value:"image",reason:"assets remain replaceable and rights-aware"};
const MEDIA_012:ConfigEntry={id:'engineering-hud-media-012',label:'MEDIA 012',enabled:true,value:"video",reason:"assets remain replaceable and rights-aware"};
const MEDIA_013:ConfigEntry={id:'engineering-hud-media-013',label:'MEDIA 013',enabled:true,value:"model",reason:"assets remain replaceable and rights-aware"};
const MEDIA_014:ConfigEntry={id:'engineering-hud-media-014',label:'MEDIA 014',enabled:true,value:"svg",reason:"assets remain replaceable and rights-aware"};
const MEDIA_015:ConfigEntry={id:'engineering-hud-media-015',label:'MEDIA 015',enabled:true,value:"placeholder",reason:"assets remain replaceable and rights-aware"};
const MEDIA_016:ConfigEntry={id:'engineering-hud-media-016',label:'MEDIA 016',enabled:true,value:"image",reason:"assets remain replaceable and rights-aware"};
const MEDIA_017:ConfigEntry={id:'engineering-hud-media-017',label:'MEDIA 017',enabled:true,value:"video",reason:"assets remain replaceable and rights-aware"};
const MEDIA_018:ConfigEntry={id:'engineering-hud-media-018',label:'MEDIA 018',enabled:true,value:"model",reason:"assets remain replaceable and rights-aware"};
const MEDIA_019:ConfigEntry={id:'engineering-hud-media-019',label:'MEDIA 019',enabled:true,value:"svg",reason:"assets remain replaceable and rights-aware"};
const MEDIA_020:ConfigEntry={id:'engineering-hud-media-020',label:'MEDIA 020',enabled:true,value:"placeholder",reason:"assets remain replaceable and rights-aware"};
const MEDIA_021:ConfigEntry={id:'engineering-hud-media-021',label:'MEDIA 021',enabled:true,value:"image",reason:"assets remain replaceable and rights-aware"};
const MEDIA_022:ConfigEntry={id:'engineering-hud-media-022',label:'MEDIA 022',enabled:true,value:"video",reason:"assets remain replaceable and rights-aware"};
const MEDIA_023:ConfigEntry={id:'engineering-hud-media-023',label:'MEDIA 023',enabled:true,value:"model",reason:"assets remain replaceable and rights-aware"};
const MEDIA_024:ConfigEntry={id:'engineering-hud-media-024',label:'MEDIA 024',enabled:true,value:"svg",reason:"assets remain replaceable and rights-aware"};
const MEDIA_025:ConfigEntry={id:'engineering-hud-media-025',label:'MEDIA 025',enabled:true,value:"placeholder",reason:"assets remain replaceable and rights-aware"};
const MEDIA_026:ConfigEntry={id:'engineering-hud-media-026',label:'MEDIA 026',enabled:true,value:"image",reason:"assets remain replaceable and rights-aware"};
const MEDIA_027:ConfigEntry={id:'engineering-hud-media-027',label:'MEDIA 027',enabled:true,value:"video",reason:"assets remain replaceable and rights-aware"};
const MEDIA_028:ConfigEntry={id:'engineering-hud-media-028',label:'MEDIA 028',enabled:true,value:"model",reason:"assets remain replaceable and rights-aware"};
const MEDIA_029:ConfigEntry={id:'engineering-hud-media-029',label:'MEDIA 029',enabled:true,value:"svg",reason:"assets remain replaceable and rights-aware"};
const MEDIA_030:ConfigEntry={id:'engineering-hud-media-030',label:'MEDIA 030',enabled:true,value:"placeholder",reason:"assets remain replaceable and rights-aware"};
const MEDIA_031:ConfigEntry={id:'engineering-hud-media-031',label:'MEDIA 031',enabled:true,value:"image",reason:"assets remain replaceable and rights-aware"};
const MEDIA_032:ConfigEntry={id:'engineering-hud-media-032',label:'MEDIA 032',enabled:true,value:"video",reason:"assets remain replaceable and rights-aware"};
const MEDIA_RULES=[MEDIA_001,MEDIA_002,MEDIA_003,MEDIA_004,MEDIA_005,MEDIA_006,MEDIA_007,MEDIA_008,MEDIA_009,MEDIA_010,MEDIA_011,MEDIA_012,MEDIA_013,MEDIA_014,MEDIA_015,MEDIA_016,MEDIA_017,MEDIA_018,MEDIA_019,MEDIA_020,MEDIA_021,MEDIA_022,MEDIA_023,MEDIA_024,MEDIA_025,MEDIA_026,MEDIA_027,MEDIA_028,MEDIA_029,MEDIA_030,MEDIA_031,MEDIA_032] as const;
const CONTENT_001:ConfigEntry={id:'engineering-hud-content-001',label:'CONTENT 001',enabled:true,value:true,reason:"unsupported claims must not be published"};
const CONTENT_002:ConfigEntry={id:'engineering-hud-content-002',label:'CONTENT 002',enabled:true,value:true,reason:"unsupported claims must not be published"};
const CONTENT_003:ConfigEntry={id:'engineering-hud-content-003',label:'CONTENT 003',enabled:true,value:true,reason:"unsupported claims must not be published"};
const CONTENT_004:ConfigEntry={id:'engineering-hud-content-004',label:'CONTENT 004',enabled:true,value:true,reason:"unsupported claims must not be published"};
const CONTENT_005:ConfigEntry={id:'engineering-hud-content-005',label:'CONTENT 005',enabled:true,value:true,reason:"unsupported claims must not be published"};
const CONTENT_006:ConfigEntry={id:'engineering-hud-content-006',label:'CONTENT 006',enabled:true,value:true,reason:"unsupported claims must not be published"};
const CONTENT_007:ConfigEntry={id:'engineering-hud-content-007',label:'CONTENT 007',enabled:false,value:false,reason:"unsupported claims must not be published"};
const CONTENT_008:ConfigEntry={id:'engineering-hud-content-008',label:'CONTENT 008',enabled:true,value:true,reason:"unsupported claims must not be published"};
const CONTENT_009:ConfigEntry={id:'engineering-hud-content-009',label:'CONTENT 009',enabled:true,value:true,reason:"unsupported claims must not be published"};
const CONTENT_010:ConfigEntry={id:'engineering-hud-content-010',label:'CONTENT 010',enabled:true,value:true,reason:"unsupported claims must not be published"};
const CONTENT_011:ConfigEntry={id:'engineering-hud-content-011',label:'CONTENT 011',enabled:true,value:true,reason:"unsupported claims must not be published"};
const CONTENT_012:ConfigEntry={id:'engineering-hud-content-012',label:'CONTENT 012',enabled:true,value:true,reason:"unsupported claims must not be published"};
const CONTENT_013:ConfigEntry={id:'engineering-hud-content-013',label:'CONTENT 013',enabled:true,value:true,reason:"unsupported claims must not be published"};
const CONTENT_014:ConfigEntry={id:'engineering-hud-content-014',label:'CONTENT 014',enabled:false,value:false,reason:"unsupported claims must not be published"};
const CONTENT_015:ConfigEntry={id:'engineering-hud-content-015',label:'CONTENT 015',enabled:true,value:true,reason:"unsupported claims must not be published"};
const CONTENT_016:ConfigEntry={id:'engineering-hud-content-016',label:'CONTENT 016',enabled:true,value:true,reason:"unsupported claims must not be published"};
const CONTENT_017:ConfigEntry={id:'engineering-hud-content-017',label:'CONTENT 017',enabled:true,value:true,reason:"unsupported claims must not be published"};
const CONTENT_018:ConfigEntry={id:'engineering-hud-content-018',label:'CONTENT 018',enabled:true,value:true,reason:"unsupported claims must not be published"};
const CONTENT_019:ConfigEntry={id:'engineering-hud-content-019',label:'CONTENT 019',enabled:true,value:true,reason:"unsupported claims must not be published"};
const CONTENT_020:ConfigEntry={id:'engineering-hud-content-020',label:'CONTENT 020',enabled:true,value:true,reason:"unsupported claims must not be published"};
const CONTENT_021:ConfigEntry={id:'engineering-hud-content-021',label:'CONTENT 021',enabled:false,value:false,reason:"unsupported claims must not be published"};
const CONTENT_022:ConfigEntry={id:'engineering-hud-content-022',label:'CONTENT 022',enabled:true,value:true,reason:"unsupported claims must not be published"};
const CONTENT_023:ConfigEntry={id:'engineering-hud-content-023',label:'CONTENT 023',enabled:true,value:true,reason:"unsupported claims must not be published"};
const CONTENT_024:ConfigEntry={id:'engineering-hud-content-024',label:'CONTENT 024',enabled:true,value:true,reason:"unsupported claims must not be published"};
const CONTENT_025:ConfigEntry={id:'engineering-hud-content-025',label:'CONTENT 025',enabled:true,value:true,reason:"unsupported claims must not be published"};
const CONTENT_026:ConfigEntry={id:'engineering-hud-content-026',label:'CONTENT 026',enabled:true,value:true,reason:"unsupported claims must not be published"};
const CONTENT_027:ConfigEntry={id:'engineering-hud-content-027',label:'CONTENT 027',enabled:true,value:true,reason:"unsupported claims must not be published"};
const CONTENT_028:ConfigEntry={id:'engineering-hud-content-028',label:'CONTENT 028',enabled:false,value:false,reason:"unsupported claims must not be published"};
const CONTENT_029:ConfigEntry={id:'engineering-hud-content-029',label:'CONTENT 029',enabled:true,value:true,reason:"unsupported claims must not be published"};
const CONTENT_030:ConfigEntry={id:'engineering-hud-content-030',label:'CONTENT 030',enabled:true,value:true,reason:"unsupported claims must not be published"};
const CONTENT_031:ConfigEntry={id:'engineering-hud-content-031',label:'CONTENT 031',enabled:true,value:true,reason:"unsupported claims must not be published"};
const CONTENT_032:ConfigEntry={id:'engineering-hud-content-032',label:'CONTENT 032',enabled:true,value:true,reason:"unsupported claims must not be published"};
const CONTENT_RULES=[CONTENT_001,CONTENT_002,CONTENT_003,CONTENT_004,CONTENT_005,CONTENT_006,CONTENT_007,CONTENT_008,CONTENT_009,CONTENT_010,CONTENT_011,CONTENT_012,CONTENT_013,CONTENT_014,CONTENT_015,CONTENT_016,CONTENT_017,CONTENT_018,CONTENT_019,CONTENT_020,CONTENT_021,CONTENT_022,CONTENT_023,CONTENT_024,CONTENT_025,CONTENT_026,CONTENT_027,CONTENT_028,CONTENT_029,CONTENT_030,CONTENT_031,CONTENT_032] as const;
const ANALYTICS_001:ConfigEntry={id:'engineering-hud-analytics-001',label:'ANALYTICS 001',enabled:true,value:"v8_engineering-hud_001",reason:"track meaningful UX events without collecting unnecessary personal data"};
const ANALYTICS_002:ConfigEntry={id:'engineering-hud-analytics-002',label:'ANALYTICS 002',enabled:true,value:"v8_engineering-hud_002",reason:"track meaningful UX events without collecting unnecessary personal data"};
const ANALYTICS_003:ConfigEntry={id:'engineering-hud-analytics-003',label:'ANALYTICS 003',enabled:true,value:"v8_engineering-hud_003",reason:"track meaningful UX events without collecting unnecessary personal data"};
const ANALYTICS_004:ConfigEntry={id:'engineering-hud-analytics-004',label:'ANALYTICS 004',enabled:true,value:"v8_engineering-hud_004",reason:"track meaningful UX events without collecting unnecessary personal data"};
const ANALYTICS_005:ConfigEntry={id:'engineering-hud-analytics-005',label:'ANALYTICS 005',enabled:true,value:"v8_engineering-hud_005",reason:"track meaningful UX events without collecting unnecessary personal data"};
const ANALYTICS_006:ConfigEntry={id:'engineering-hud-analytics-006',label:'ANALYTICS 006',enabled:true,value:"v8_engineering-hud_006",reason:"track meaningful UX events without collecting unnecessary personal data"};
const ANALYTICS_007:ConfigEntry={id:'engineering-hud-analytics-007',label:'ANALYTICS 007',enabled:true,value:"v8_engineering-hud_007",reason:"track meaningful UX events without collecting unnecessary personal data"};
const ANALYTICS_008:ConfigEntry={id:'engineering-hud-analytics-008',label:'ANALYTICS 008',enabled:true,value:"v8_engineering-hud_008",reason:"track meaningful UX events without collecting unnecessary personal data"};
const ANALYTICS_009:ConfigEntry={id:'engineering-hud-analytics-009',label:'ANALYTICS 009',enabled:true,value:"v8_engineering-hud_009",reason:"track meaningful UX events without collecting unnecessary personal data"};
const ANALYTICS_010:ConfigEntry={id:'engineering-hud-analytics-010',label:'ANALYTICS 010',enabled:true,value:"v8_engineering-hud_010",reason:"track meaningful UX events without collecting unnecessary personal data"};
const ANALYTICS_011:ConfigEntry={id:'engineering-hud-analytics-011',label:'ANALYTICS 011',enabled:true,value:"v8_engineering-hud_011",reason:"track meaningful UX events without collecting unnecessary personal data"};
const ANALYTICS_012:ConfigEntry={id:'engineering-hud-analytics-012',label:'ANALYTICS 012',enabled:true,value:"v8_engineering-hud_012",reason:"track meaningful UX events without collecting unnecessary personal data"};
const ANALYTICS_013:ConfigEntry={id:'engineering-hud-analytics-013',label:'ANALYTICS 013',enabled:true,value:"v8_engineering-hud_013",reason:"track meaningful UX events without collecting unnecessary personal data"};
const ANALYTICS_014:ConfigEntry={id:'engineering-hud-analytics-014',label:'ANALYTICS 014',enabled:true,value:"v8_engineering-hud_014",reason:"track meaningful UX events without collecting unnecessary personal data"};
const ANALYTICS_015:ConfigEntry={id:'engineering-hud-analytics-015',label:'ANALYTICS 015',enabled:true,value:"v8_engineering-hud_015",reason:"track meaningful UX events without collecting unnecessary personal data"};
const ANALYTICS_016:ConfigEntry={id:'engineering-hud-analytics-016',label:'ANALYTICS 016',enabled:true,value:"v8_engineering-hud_016",reason:"track meaningful UX events without collecting unnecessary personal data"};
const ANALYTICS_017:ConfigEntry={id:'engineering-hud-analytics-017',label:'ANALYTICS 017',enabled:true,value:"v8_engineering-hud_017",reason:"track meaningful UX events without collecting unnecessary personal data"};
const ANALYTICS_018:ConfigEntry={id:'engineering-hud-analytics-018',label:'ANALYTICS 018',enabled:true,value:"v8_engineering-hud_018",reason:"track meaningful UX events without collecting unnecessary personal data"};
const ANALYTICS_019:ConfigEntry={id:'engineering-hud-analytics-019',label:'ANALYTICS 019',enabled:true,value:"v8_engineering-hud_019",reason:"track meaningful UX events without collecting unnecessary personal data"};
const ANALYTICS_020:ConfigEntry={id:'engineering-hud-analytics-020',label:'ANALYTICS 020',enabled:true,value:"v8_engineering-hud_020",reason:"track meaningful UX events without collecting unnecessary personal data"};
const ANALYTICS_021:ConfigEntry={id:'engineering-hud-analytics-021',label:'ANALYTICS 021',enabled:true,value:"v8_engineering-hud_021",reason:"track meaningful UX events without collecting unnecessary personal data"};
const ANALYTICS_022:ConfigEntry={id:'engineering-hud-analytics-022',label:'ANALYTICS 022',enabled:true,value:"v8_engineering-hud_022",reason:"track meaningful UX events without collecting unnecessary personal data"};
const ANALYTICS_023:ConfigEntry={id:'engineering-hud-analytics-023',label:'ANALYTICS 023',enabled:true,value:"v8_engineering-hud_023",reason:"track meaningful UX events without collecting unnecessary personal data"};
const ANALYTICS_024:ConfigEntry={id:'engineering-hud-analytics-024',label:'ANALYTICS 024',enabled:true,value:"v8_engineering-hud_024",reason:"track meaningful UX events without collecting unnecessary personal data"};
const ANALYTICS_025:ConfigEntry={id:'engineering-hud-analytics-025',label:'ANALYTICS 025',enabled:true,value:"v8_engineering-hud_025",reason:"track meaningful UX events without collecting unnecessary personal data"};
const ANALYTICS_026:ConfigEntry={id:'engineering-hud-analytics-026',label:'ANALYTICS 026',enabled:true,value:"v8_engineering-hud_026",reason:"track meaningful UX events without collecting unnecessary personal data"};
const ANALYTICS_027:ConfigEntry={id:'engineering-hud-analytics-027',label:'ANALYTICS 027',enabled:true,value:"v8_engineering-hud_027",reason:"track meaningful UX events without collecting unnecessary personal data"};
const ANALYTICS_028:ConfigEntry={id:'engineering-hud-analytics-028',label:'ANALYTICS 028',enabled:true,value:"v8_engineering-hud_028",reason:"track meaningful UX events without collecting unnecessary personal data"};
const ANALYTICS_029:ConfigEntry={id:'engineering-hud-analytics-029',label:'ANALYTICS 029',enabled:true,value:"v8_engineering-hud_029",reason:"track meaningful UX events without collecting unnecessary personal data"};
const ANALYTICS_030:ConfigEntry={id:'engineering-hud-analytics-030',label:'ANALYTICS 030',enabled:true,value:"v8_engineering-hud_030",reason:"track meaningful UX events without collecting unnecessary personal data"};
const ANALYTICS_031:ConfigEntry={id:'engineering-hud-analytics-031',label:'ANALYTICS 031',enabled:true,value:"v8_engineering-hud_031",reason:"track meaningful UX events without collecting unnecessary personal data"};
const ANALYTICS_032:ConfigEntry={id:'engineering-hud-analytics-032',label:'ANALYTICS 032',enabled:true,value:"v8_engineering-hud_032",reason:"track meaningful UX events without collecting unnecessary personal data"};
const ANALYTICS_RULES=[ANALYTICS_001,ANALYTICS_002,ANALYTICS_003,ANALYTICS_004,ANALYTICS_005,ANALYTICS_006,ANALYTICS_007,ANALYTICS_008,ANALYTICS_009,ANALYTICS_010,ANALYTICS_011,ANALYTICS_012,ANALYTICS_013,ANALYTICS_014,ANALYTICS_015,ANALYTICS_016,ANALYTICS_017,ANALYTICS_018,ANALYTICS_019,ANALYTICS_020,ANALYTICS_021,ANALYTICS_022,ANALYTICS_023,ANALYTICS_024,ANALYTICS_025,ANALYTICS_026,ANALYTICS_027,ANALYTICS_028,ANALYTICS_029,ANALYTICS_030,ANALYTICS_031,ANALYTICS_032] as const;

function useViewport(){
 const [width,setWidth]=useState(()=>winWidth());
 const [height,setHeight]=useState(()=>typeof window==='undefined'?900:window.innerHeight);
 useEffect(()=>{const onResize=()=>{setWidth(winWidth());setHeight(window.innerHeight);};window.addEventListener('resize',onResize,{passive:true});return()=>window.removeEventListener('resize',onResize);},[]);
 return {width,height,breakpoint:v8Breakpoint(width)};
}
function useReducedMotion(){
 const [reduced,setReduced]=useState(false);
 useEffect(()=>{if(!window.matchMedia)return;const query=window.matchMedia('(prefers-reduced-motion: reduce)');const sync=()=>setReduced(query.matches);sync();query.addEventListener?.('change',sync);return()=>query.removeEventListener?.('change',sync);},[]);
 return reduced;
}
function usePointer(enabled:boolean){
 const [point,setPoint]=useState({x:0.5,y:0.5});
 useEffect(()=>{if(!enabled)return;let raf=0;let next={x:.5,y:.5};const onMove=(event:PointerEvent)=>{next={x:event.clientX/Math.max(window.innerWidth,1),y:event.clientY/Math.max(window.innerHeight,1)};if(raf)return;raf=requestAnimationFrame(()=>{raf=0;setPoint(next);});};window.addEventListener('pointermove',onMove,{passive:true});return()=>{window.removeEventListener('pointermove',onMove);if(raf)cancelAnimationFrame(raf);};},[enabled]);
 return point;
}
function useVisibility(ref:React.RefObject<HTMLElement|null>){
 const [visible,setVisible]=useState(false);
 useEffect(()=>{const node=ref.current;if(!node||typeof IntersectionObserver==='undefined'){setVisible(true);return;}const observer=new IntersectionObserver(entries=>setVisible(Boolean(entries[0]?.isIntersecting)),{threshold:.12});observer.observe(node);return()=>observer.disconnect();},[ref]);
 return visible;
}

function SectionHeader({theme}:{theme:'paper'|'ink'|'technical'}){
 return <header className={`${"miror-v8-engineering-hud"}__header ${"miror-v8-engineering-hud"}__header--${theme}`}><span>002 / MIROR ENGINEERING SYSTEM</span><i aria-hidden="true"/></header>;
}
function Actions({onPrimary,onSecondary}:{onPrimary:()=>void;onSecondary:()=>void}){
 return <div className={`${"miror-v8-engineering-hud"}__actions`}><button type="button" onClick={onPrimary}>{PRIMARY}<b aria-hidden="true">↗</b></button><button type="button" onClick={onSecondary}>{SECONDARY}<b aria-hidden="true">↗</b></button></div>;
}
function Graphic({progress,point,index}:{progress:number;point:{x:number;y:number};index:number}){
 const driftX=(point.x-.5)*18; const driftY=(point.y-.5)*12;
 return <div className={`${"miror-v8-engineering-hud"}__graphic`} aria-hidden="true"><div className={`${"miror-v8-engineering-hud"}__grid`}/><div className={`${"miror-v8-engineering-hud"}__building`} style={{transform:`translate3d(${driftX}px,${driftY}px,0) rotate(${(progress-.5)*2}deg)`}}><span/><span/><span/><span/><span/></div><div className={`${"miror-v8-engineering-hud"}__scan`} style={{transform:`translateY(${progress*100}%)`}}/><div className={`${"miror-v8-engineering-hud"}__crosshair`}><i/><i/></div><small>VIEW {formatIndex(index+1)}</small></div>;
}
function Media({policy}:{policy:V8MediaPolicy}){
 return <div className={`${"miror-v8-engineering-hud"}__media`} role="img" aria-label={policy.alt}><div/><strong>{TITLE}</strong><small>{mediaCopy(policy)}</small></div>;
}
function Item({item,index,active,onSelect}:{item:SectionItem;index:number;active:boolean;onSelect:(i:number,k:V8Interaction)=>void}){
 return <button id={`${SECTION_ID}-${index}`} type="button" role="option" aria-selected={active} className={v8Cx(`${"miror-v8-engineering-hud"}__item`,active&&`${"miror-v8-engineering-hud"}__item--active`)} onMouseEnter={()=>onSelect(index,'pointer')} onFocus={()=>onSelect(index,'keyboard')} onClick={()=>onSelect(index,'programmatic')}><span>{formatIndex(index+1)}</span><strong>{item.label}</strong><small>{item.interaction.toUpperCase()}</small><em>{item.detail}</em></button>;
}

function DetailStage01({active,progress,breakpoint}:{active:boolean;progress:number;breakpoint:V8Breakpoint}){
 if(!active)return null;
 const compact=breakpoint==='mobile';
 const opacity=0.72+progress*0.28;
 const y=(1-progress)*(compact?8:18);
 return <article className="miror-v8-engineering-hud__detail-stage" data-stage="01" style={{opacity,transform:`translateY(${y}px)`}}><span>01</span><div><strong>MODEL</strong><p>Detailed content stage for model. This is where approved Miror facts, photographs, engineering notes or technical assets can be inserted without changing the surrounding application contract.</p></div></article>;
}

function DetailStage02({active,progress,breakpoint}:{active:boolean;progress:number;breakpoint:V8Breakpoint}){
 if(!active)return null;
 const compact=breakpoint==='mobile';
 const opacity=0.72+progress*0.28;
 const y=(1-progress)*(compact?8:18);
 return <article className="miror-v8-engineering-hud__detail-stage" data-stage="02" style={{opacity,transform:`translateY(${y}px)`}}><span>02</span><div><strong>GRID</strong><p>Detailed content stage for grid. This is where approved Miror facts, photographs, engineering notes or technical assets can be inserted without changing the surrounding application contract.</p></div></article>;
}

function DetailStage03({active,progress,breakpoint}:{active:boolean;progress:number;breakpoint:V8Breakpoint}){
 if(!active)return null;
 const compact=breakpoint==='mobile';
 const opacity=0.72+progress*0.28;
 const y=(1-progress)*(compact?8:18);
 return <article className="miror-v8-engineering-hud__detail-stage" data-stage="03" style={{opacity,transform:`translateY(${y}px)`}}><span>03</span><div><strong>AXIS</strong><p>Detailed content stage for axis. This is where approved Miror facts, photographs, engineering notes or technical assets can be inserted without changing the surrounding application contract.</p></div></article>;
}

function DetailStage04({active,progress,breakpoint}:{active:boolean;progress:number;breakpoint:V8Breakpoint}){
 if(!active)return null;
 const compact=breakpoint==='mobile';
 const opacity=0.72+progress*0.28;
 const y=(1-progress)*(compact?8:18);
 return <article className="miror-v8-engineering-hud__detail-stage" data-stage="04" style={{opacity,transform:`translateY(${y}px)`}}><span>04</span><div><strong>SCALE</strong><p>Detailed content stage for scale. This is where approved Miror facts, photographs, engineering notes or technical assets can be inserted without changing the surrounding application contract.</p></div></article>;
}

function DetailStage05({active,progress,breakpoint}:{active:boolean;progress:number;breakpoint:V8Breakpoint}){
 if(!active)return null;
 const compact=breakpoint==='mobile';
 const opacity=0.72+progress*0.28;
 const y=(1-progress)*(compact?8:18);
 return <article className="miror-v8-engineering-hud__detail-stage" data-stage="05" style={{opacity,transform:`translateY(${y}px)`}}><span>05</span><div><strong>LAYER</strong><p>Detailed content stage for layer. This is where approved Miror facts, photographs, engineering notes or technical assets can be inserted without changing the surrounding application contract.</p></div></article>;
}

function DetailStage06({active,progress,breakpoint}:{active:boolean;progress:number;breakpoint:V8Breakpoint}){
 if(!active)return null;
 const compact=breakpoint==='mobile';
 const opacity=0.72+progress*0.28;
 const y=(1-progress)*(compact?8:18);
 return <article className="miror-v8-engineering-hud__detail-stage" data-stage="06" style={{opacity,transform:`translateY(${y}px)`}}><span>06</span><div><strong>EVIDENCE</strong><p>Detailed content stage for evidence. This is where approved Miror facts, photographs, engineering notes or technical assets can be inserted without changing the surrounding application contract.</p></div></article>;
}

function DetailStage07({active,progress,breakpoint}:{active:boolean;progress:number;breakpoint:V8Breakpoint}){
 if(!active)return null;
 const compact=breakpoint==='mobile';
 const opacity=0.72+progress*0.28;
 const y=(1-progress)*(compact?8:18);
 return <article className="miror-v8-engineering-hud__detail-stage" data-stage="07" style={{opacity,transform:`translateY(${y}px)`}}><span>07</span><div><strong>MEDIA</strong><p>Detailed content stage for media. This is where approved Miror facts, photographs, engineering notes or technical assets can be inserted without changing the surrounding application contract.</p></div></article>;
}

function DetailStage08({active,progress,breakpoint}:{active:boolean;progress:number;breakpoint:V8Breakpoint}){
 if(!active)return null;
 const compact=breakpoint==='mobile';
 const opacity=0.72+progress*0.28;
 const y=(1-progress)*(compact?8:18);
 return <article className="miror-v8-engineering-hud__detail-stage" data-stage="08" style={{opacity,transform:`translateY(${y}px)`}}><span>08</span><div><strong>STATUS</strong><p>Detailed content stage for status. This is where approved Miror facts, photographs, engineering notes or technical assets can be inserted without changing the surrounding application contract.</p></div></article>;
}

function DetailStage09({active,progress,breakpoint}:{active:boolean;progress:number;breakpoint:V8Breakpoint}){
 if(!active)return null;
 const compact=breakpoint==='mobile';
 const opacity=0.72+progress*0.28;
 const y=(1-progress)*(compact?8:18);
 return <article className="miror-v8-engineering-hud__detail-stage" data-stage="09" style={{opacity,transform:`translateY(${y}px)`}}><span>09</span><div><strong>MODEL</strong><p>Detailed content stage for model. This is where approved Miror facts, photographs, engineering notes or technical assets can be inserted without changing the surrounding application contract.</p></div></article>;
}

function DetailStage10({active,progress,breakpoint}:{active:boolean;progress:number;breakpoint:V8Breakpoint}){
 if(!active)return null;
 const compact=breakpoint==='mobile';
 const opacity=0.72+progress*0.28;
 const y=(1-progress)*(compact?8:18);
 return <article className="miror-v8-engineering-hud__detail-stage" data-stage="10" style={{opacity,transform:`translateY(${y}px)`}}><span>10</span><div><strong>GRID</strong><p>Detailed content stage for grid. This is where approved Miror facts, photographs, engineering notes or technical assets can be inserted without changing the surrounding application contract.</p></div></article>;
}

function DetailStage11({active,progress,breakpoint}:{active:boolean;progress:number;breakpoint:V8Breakpoint}){
 if(!active)return null;
 const compact=breakpoint==='mobile';
 const opacity=0.72+progress*0.28;
 const y=(1-progress)*(compact?8:18);
 return <article className="miror-v8-engineering-hud__detail-stage" data-stage="11" style={{opacity,transform:`translateY(${y}px)`}}><span>11</span><div><strong>AXIS</strong><p>Detailed content stage for axis. This is where approved Miror facts, photographs, engineering notes or technical assets can be inserted without changing the surrounding application contract.</p></div></article>;
}

function DetailStage12({active,progress,breakpoint}:{active:boolean;progress:number;breakpoint:V8Breakpoint}){
 if(!active)return null;
 const compact=breakpoint==='mobile';
 const opacity=0.72+progress*0.28;
 const y=(1-progress)*(compact?8:18);
 return <article className="miror-v8-engineering-hud__detail-stage" data-stage="12" style={{opacity,transform:`translateY(${y}px)`}}><span>12</span><div><strong>SCALE</strong><p>Detailed content stage for scale. This is where approved Miror facts, photographs, engineering notes or technical assets can be inserted without changing the surrounding application contract.</p></div></article>;
}

function DetailStage13({active,progress,breakpoint}:{active:boolean;progress:number;breakpoint:V8Breakpoint}){
 if(!active)return null;
 const compact=breakpoint==='mobile';
 const opacity=0.72+progress*0.28;
 const y=(1-progress)*(compact?8:18);
 return <article className="miror-v8-engineering-hud__detail-stage" data-stage="13" style={{opacity,transform:`translateY(${y}px)`}}><span>13</span><div><strong>LAYER</strong><p>Detailed content stage for layer. This is where approved Miror facts, photographs, engineering notes or technical assets can be inserted without changing the surrounding application contract.</p></div></article>;
}

function DetailStage14({active,progress,breakpoint}:{active:boolean;progress:number;breakpoint:V8Breakpoint}){
 if(!active)return null;
 const compact=breakpoint==='mobile';
 const opacity=0.72+progress*0.28;
 const y=(1-progress)*(compact?8:18);
 return <article className="miror-v8-engineering-hud__detail-stage" data-stage="14" style={{opacity,transform:`translateY(${y}px)`}}><span>14</span><div><strong>EVIDENCE</strong><p>Detailed content stage for evidence. This is where approved Miror facts, photographs, engineering notes or technical assets can be inserted without changing the surrounding application contract.</p></div></article>;
}

function DetailStage15({active,progress,breakpoint}:{active:boolean;progress:number;breakpoint:V8Breakpoint}){
 if(!active)return null;
 const compact=breakpoint==='mobile';
 const opacity=0.72+progress*0.28;
 const y=(1-progress)*(compact?8:18);
 return <article className="miror-v8-engineering-hud__detail-stage" data-stage="15" style={{opacity,transform:`translateY(${y}px)`}}><span>15</span><div><strong>MEDIA</strong><p>Detailed content stage for media. This is where approved Miror facts, photographs, engineering notes or technical assets can be inserted without changing the surrounding application contract.</p></div></article>;
}

function DetailStage16({active,progress,breakpoint}:{active:boolean;progress:number;breakpoint:V8Breakpoint}){
 if(!active)return null;
 const compact=breakpoint==='mobile';
 const opacity=0.72+progress*0.28;
 const y=(1-progress)*(compact?8:18);
 return <article className="miror-v8-engineering-hud__detail-stage" data-stage="16" style={{opacity,transform:`translateY(${y}px)`}}><span>16</span><div><strong>STATUS</strong><p>Detailed content stage for status. This is where approved Miror facts, photographs, engineering notes or technical assets can be inserted without changing the surrounding application contract.</p></div></article>;
}

function DetailStage17({active,progress,breakpoint}:{active:boolean;progress:number;breakpoint:V8Breakpoint}){
 if(!active)return null;
 const compact=breakpoint==='mobile';
 const opacity=0.72+progress*0.28;
 const y=(1-progress)*(compact?8:18);
 return <article className="miror-v8-engineering-hud__detail-stage" data-stage="17" style={{opacity,transform:`translateY(${y}px)`}}><span>17</span><div><strong>MODEL</strong><p>Detailed content stage for model. This is where approved Miror facts, photographs, engineering notes or technical assets can be inserted without changing the surrounding application contract.</p></div></article>;
}

function DetailStage18({active,progress,breakpoint}:{active:boolean;progress:number;breakpoint:V8Breakpoint}){
 if(!active)return null;
 const compact=breakpoint==='mobile';
 const opacity=0.72+progress*0.28;
 const y=(1-progress)*(compact?8:18);
 return <article className="miror-v8-engineering-hud__detail-stage" data-stage="18" style={{opacity,transform:`translateY(${y}px)`}}><span>18</span><div><strong>GRID</strong><p>Detailed content stage for grid. This is where approved Miror facts, photographs, engineering notes or technical assets can be inserted without changing the surrounding application contract.</p></div></article>;
}

function DetailStage19({active,progress,breakpoint}:{active:boolean;progress:number;breakpoint:V8Breakpoint}){
 if(!active)return null;
 const compact=breakpoint==='mobile';
 const opacity=0.72+progress*0.28;
 const y=(1-progress)*(compact?8:18);
 return <article className="miror-v8-engineering-hud__detail-stage" data-stage="19" style={{opacity,transform:`translateY(${y}px)`}}><span>19</span><div><strong>AXIS</strong><p>Detailed content stage for axis. This is where approved Miror facts, photographs, engineering notes or technical assets can be inserted without changing the surrounding application contract.</p></div></article>;
}

function DetailStage20({active,progress,breakpoint}:{active:boolean;progress:number;breakpoint:V8Breakpoint}){
 if(!active)return null;
 const compact=breakpoint==='mobile';
 const opacity=0.72+progress*0.28;
 const y=(1-progress)*(compact?8:18);
 return <article className="miror-v8-engineering-hud__detail-stage" data-stage="20" style={{opacity,transform:`translateY(${y}px)`}}><span>20</span><div><strong>SCALE</strong><p>Detailed content stage for scale. This is where approved Miror facts, photographs, engineering notes or technical assets can be inserted without changing the surrounding application contract.</p></div></article>;
}

function DetailStage21({active,progress,breakpoint}:{active:boolean;progress:number;breakpoint:V8Breakpoint}){
 if(!active)return null;
 const compact=breakpoint==='mobile';
 const opacity=0.72+progress*0.28;
 const y=(1-progress)*(compact?8:18);
 return <article className="miror-v8-engineering-hud__detail-stage" data-stage="21" style={{opacity,transform:`translateY(${y}px)`}}><span>21</span><div><strong>LAYER</strong><p>Detailed content stage for layer. This is where approved Miror facts, photographs, engineering notes or technical assets can be inserted without changing the surrounding application contract.</p></div></article>;
}

function DetailStage22({active,progress,breakpoint}:{active:boolean;progress:number;breakpoint:V8Breakpoint}){
 if(!active)return null;
 const compact=breakpoint==='mobile';
 const opacity=0.72+progress*0.28;
 const y=(1-progress)*(compact?8:18);
 return <article className="miror-v8-engineering-hud__detail-stage" data-stage="22" style={{opacity,transform:`translateY(${y}px)`}}><span>22</span><div><strong>EVIDENCE</strong><p>Detailed content stage for evidence. This is where approved Miror facts, photographs, engineering notes or technical assets can be inserted without changing the surrounding application contract.</p></div></article>;
}

function DetailStage23({active,progress,breakpoint}:{active:boolean;progress:number;breakpoint:V8Breakpoint}){
 if(!active)return null;
 const compact=breakpoint==='mobile';
 const opacity=0.72+progress*0.28;
 const y=(1-progress)*(compact?8:18);
 return <article className="miror-v8-engineering-hud__detail-stage" data-stage="23" style={{opacity,transform:`translateY(${y}px)`}}><span>23</span><div><strong>MEDIA</strong><p>Detailed content stage for media. This is where approved Miror facts, photographs, engineering notes or technical assets can be inserted without changing the surrounding application contract.</p></div></article>;
}

function DetailStage24({active,progress,breakpoint}:{active:boolean;progress:number;breakpoint:V8Breakpoint}){
 if(!active)return null;
 const compact=breakpoint==='mobile';
 const opacity=0.72+progress*0.28;
 const y=(1-progress)*(compact?8:18);
 return <article className="miror-v8-engineering-hud__detail-stage" data-stage="24" style={{opacity,transform:`translateY(${y}px)`}}><span>24</span><div><strong>STATUS</strong><p>Detailed content stage for status. This is where approved Miror facts, photographs, engineering notes or technical assets can be inserted without changing the surrounding application contract.</p></div></article>;
}

function DetailStage25({active,progress,breakpoint}:{active:boolean;progress:number;breakpoint:V8Breakpoint}){
 if(!active)return null;
 const compact=breakpoint==='mobile';
 const opacity=0.72+progress*0.28;
 const y=(1-progress)*(compact?8:18);
 return <article className="miror-v8-engineering-hud__detail-stage" data-stage="25" style={{opacity,transform:`translateY(${y}px)`}}><span>25</span><div><strong>MODEL</strong><p>Detailed content stage for model. This is where approved Miror facts, photographs, engineering notes or technical assets can be inserted without changing the surrounding application contract.</p></div></article>;
}

function DetailStage26({active,progress,breakpoint}:{active:boolean;progress:number;breakpoint:V8Breakpoint}){
 if(!active)return null;
 const compact=breakpoint==='mobile';
 const opacity=0.72+progress*0.28;
 const y=(1-progress)*(compact?8:18);
 return <article className="miror-v8-engineering-hud__detail-stage" data-stage="26" style={{opacity,transform:`translateY(${y}px)`}}><span>26</span><div><strong>GRID</strong><p>Detailed content stage for grid. This is where approved Miror facts, photographs, engineering notes or technical assets can be inserted without changing the surrounding application contract.</p></div></article>;
}

function DetailStage27({active,progress,breakpoint}:{active:boolean;progress:number;breakpoint:V8Breakpoint}){
 if(!active)return null;
 const compact=breakpoint==='mobile';
 const opacity=0.72+progress*0.28;
 const y=(1-progress)*(compact?8:18);
 return <article className="miror-v8-engineering-hud__detail-stage" data-stage="27" style={{opacity,transform:`translateY(${y}px)`}}><span>27</span><div><strong>AXIS</strong><p>Detailed content stage for axis. This is where approved Miror facts, photographs, engineering notes or technical assets can be inserted without changing the surrounding application contract.</p></div></article>;
}

function DetailStage28({active,progress,breakpoint}:{active:boolean;progress:number;breakpoint:V8Breakpoint}){
 if(!active)return null;
 const compact=breakpoint==='mobile';
 const opacity=0.72+progress*0.28;
 const y=(1-progress)*(compact?8:18);
 return <article className="miror-v8-engineering-hud__detail-stage" data-stage="28" style={{opacity,transform:`translateY(${y}px)`}}><span>28</span><div><strong>SCALE</strong><p>Detailed content stage for scale. This is where approved Miror facts, photographs, engineering notes or technical assets can be inserted without changing the surrounding application contract.</p></div></article>;
}

function DetailStage29({active,progress,breakpoint}:{active:boolean;progress:number;breakpoint:V8Breakpoint}){
 if(!active)return null;
 const compact=breakpoint==='mobile';
 const opacity=0.72+progress*0.28;
 const y=(1-progress)*(compact?8:18);
 return <article className="miror-v8-engineering-hud__detail-stage" data-stage="29" style={{opacity,transform:`translateY(${y}px)`}}><span>29</span><div><strong>LAYER</strong><p>Detailed content stage for layer. This is where approved Miror facts, photographs, engineering notes or technical assets can be inserted without changing the surrounding application contract.</p></div></article>;
}

function DetailStage30({active,progress,breakpoint}:{active:boolean;progress:number;breakpoint:V8Breakpoint}){
 if(!active)return null;
 const compact=breakpoint==='mobile';
 const opacity=0.72+progress*0.28;
 const y=(1-progress)*(compact?8:18);
 return <article className="miror-v8-engineering-hud__detail-stage" data-stage="30" style={{opacity,transform:`translateY(${y}px)`}}><span>30</span><div><strong>EVIDENCE</strong><p>Detailed content stage for evidence. This is where approved Miror facts, photographs, engineering notes or technical assets can be inserted without changing the surrounding application contract.</p></div></article>;
}

function DetailStage31({active,progress,breakpoint}:{active:boolean;progress:number;breakpoint:V8Breakpoint}){
 if(!active)return null;
 const compact=breakpoint==='mobile';
 const opacity=0.72+progress*0.28;
 const y=(1-progress)*(compact?8:18);
 return <article className="miror-v8-engineering-hud__detail-stage" data-stage="31" style={{opacity,transform:`translateY(${y}px)`}}><span>31</span><div><strong>MEDIA</strong><p>Detailed content stage for media. This is where approved Miror facts, photographs, engineering notes or technical assets can be inserted without changing the surrounding application contract.</p></div></article>;
}

function DetailStage32({active,progress,breakpoint}:{active:boolean;progress:number;breakpoint:V8Breakpoint}){
 if(!active)return null;
 const compact=breakpoint==='mobile';
 const opacity=0.72+progress*0.28;
 const y=(1-progress)*(compact?8:18);
 return <article className="miror-v8-engineering-hud__detail-stage" data-stage="32" style={{opacity,transform:`translateY(${y}px)`}}><span>32</span><div><strong>STATUS</strong><p>Detailed content stage for status. This is where approved Miror facts, photographs, engineering notes or technical assets can be inserted without changing the surrounding application contract.</p></div></article>;
}

function DetailStage33({active,progress,breakpoint}:{active:boolean;progress:number;breakpoint:V8Breakpoint}){
 if(!active)return null;
 const compact=breakpoint==='mobile';
 const opacity=0.72+progress*0.28;
 const y=(1-progress)*(compact?8:18);
 return <article className="miror-v8-engineering-hud__detail-stage" data-stage="33" style={{opacity,transform:`translateY(${y}px)`}}><span>33</span><div><strong>MODEL</strong><p>Detailed content stage for model. This is where approved Miror facts, photographs, engineering notes or technical assets can be inserted without changing the surrounding application contract.</p></div></article>;
}

function DetailStage34({active,progress,breakpoint}:{active:boolean;progress:number;breakpoint:V8Breakpoint}){
 if(!active)return null;
 const compact=breakpoint==='mobile';
 const opacity=0.72+progress*0.28;
 const y=(1-progress)*(compact?8:18);
 return <article className="miror-v8-engineering-hud__detail-stage" data-stage="34" style={{opacity,transform:`translateY(${y}px)`}}><span>34</span><div><strong>GRID</strong><p>Detailed content stage for grid. This is where approved Miror facts, photographs, engineering notes or technical assets can be inserted without changing the surrounding application contract.</p></div></article>;
}

function DetailStage35({active,progress,breakpoint}:{active:boolean;progress:number;breakpoint:V8Breakpoint}){
 if(!active)return null;
 const compact=breakpoint==='mobile';
 const opacity=0.72+progress*0.28;
 const y=(1-progress)*(compact?8:18);
 return <article className="miror-v8-engineering-hud__detail-stage" data-stage="35" style={{opacity,transform:`translateY(${y}px)`}}><span>35</span><div><strong>AXIS</strong><p>Detailed content stage for axis. This is where approved Miror facts, photographs, engineering notes or technical assets can be inserted without changing the surrounding application contract.</p></div></article>;
}

function DetailStage36({active,progress,breakpoint}:{active:boolean;progress:number;breakpoint:V8Breakpoint}){
 if(!active)return null;
 const compact=breakpoint==='mobile';
 const opacity=0.72+progress*0.28;
 const y=(1-progress)*(compact?8:18);
 return <article className="miror-v8-engineering-hud__detail-stage" data-stage="36" style={{opacity,transform:`translateY(${y}px)`}}><span>36</span><div><strong>SCALE</strong><p>Detailed content stage for scale. This is where approved Miror facts, photographs, engineering notes or technical assets can be inserted without changing the surrounding application contract.</p></div></article>;
}

function DetailStage37({active,progress,breakpoint}:{active:boolean;progress:number;breakpoint:V8Breakpoint}){
 if(!active)return null;
 const compact=breakpoint==='mobile';
 const opacity=0.72+progress*0.28;
 const y=(1-progress)*(compact?8:18);
 return <article className="miror-v8-engineering-hud__detail-stage" data-stage="37" style={{opacity,transform:`translateY(${y}px)`}}><span>37</span><div><strong>LAYER</strong><p>Detailed content stage for layer. This is where approved Miror facts, photographs, engineering notes or technical assets can be inserted without changing the surrounding application contract.</p></div></article>;
}

function DetailStage38({active,progress,breakpoint}:{active:boolean;progress:number;breakpoint:V8Breakpoint}){
 if(!active)return null;
 const compact=breakpoint==='mobile';
 const opacity=0.72+progress*0.28;
 const y=(1-progress)*(compact?8:18);
 return <article className="miror-v8-engineering-hud__detail-stage" data-stage="38" style={{opacity,transform:`translateY(${y}px)`}}><span>38</span><div><strong>EVIDENCE</strong><p>Detailed content stage for evidence. This is where approved Miror facts, photographs, engineering notes or technical assets can be inserted without changing the surrounding application contract.</p></div></article>;
}

function DetailStage39({active,progress,breakpoint}:{active:boolean;progress:number;breakpoint:V8Breakpoint}){
 if(!active)return null;
 const compact=breakpoint==='mobile';
 const opacity=0.72+progress*0.28;
 const y=(1-progress)*(compact?8:18);
 return <article className="miror-v8-engineering-hud__detail-stage" data-stage="39" style={{opacity,transform:`translateY(${y}px)`}}><span>39</span><div><strong>MEDIA</strong><p>Detailed content stage for media. This is where approved Miror facts, photographs, engineering notes or technical assets can be inserted without changing the surrounding application contract.</p></div></article>;
}

function DetailStage40({active,progress,breakpoint}:{active:boolean;progress:number;breakpoint:V8Breakpoint}){
 if(!active)return null;
 const compact=breakpoint==='mobile';
 const opacity=0.72+progress*0.28;
 const y=(1-progress)*(compact?8:18);
 return <article className="miror-v8-engineering-hud__detail-stage" data-stage="40" style={{opacity,transform:`translateY(${y}px)`}}><span>40</span><div><strong>STATUS</strong><p>Detailed content stage for status. This is where approved Miror facts, photographs, engineering notes or technical assets can be inserted without changing the surrounding application contract.</p></div></article>;
}

function DetailStage41({active,progress,breakpoint}:{active:boolean;progress:number;breakpoint:V8Breakpoint}){
 if(!active)return null;
 const compact=breakpoint==='mobile';
 const opacity=0.72+progress*0.28;
 const y=(1-progress)*(compact?8:18);
 return <article className="miror-v8-engineering-hud__detail-stage" data-stage="41" style={{opacity,transform:`translateY(${y}px)`}}><span>41</span><div><strong>MODEL</strong><p>Detailed content stage for model. This is where approved Miror facts, photographs, engineering notes or technical assets can be inserted without changing the surrounding application contract.</p></div></article>;
}

function DetailStage42({active,progress,breakpoint}:{active:boolean;progress:number;breakpoint:V8Breakpoint}){
 if(!active)return null;
 const compact=breakpoint==='mobile';
 const opacity=0.72+progress*0.28;
 const y=(1-progress)*(compact?8:18);
 return <article className="miror-v8-engineering-hud__detail-stage" data-stage="42" style={{opacity,transform:`translateY(${y}px)`}}><span>42</span><div><strong>GRID</strong><p>Detailed content stage for grid. This is where approved Miror facts, photographs, engineering notes or technical assets can be inserted without changing the surrounding application contract.</p></div></article>;
}

function DetailStage43({active,progress,breakpoint}:{active:boolean;progress:number;breakpoint:V8Breakpoint}){
 if(!active)return null;
 const compact=breakpoint==='mobile';
 const opacity=0.72+progress*0.28;
 const y=(1-progress)*(compact?8:18);
 return <article className="miror-v8-engineering-hud__detail-stage" data-stage="43" style={{opacity,transform:`translateY(${y}px)`}}><span>43</span><div><strong>AXIS</strong><p>Detailed content stage for axis. This is where approved Miror facts, photographs, engineering notes or technical assets can be inserted without changing the surrounding application contract.</p></div></article>;
}

function DetailStage44({active,progress,breakpoint}:{active:boolean;progress:number;breakpoint:V8Breakpoint}){
 if(!active)return null;
 const compact=breakpoint==='mobile';
 const opacity=0.72+progress*0.28;
 const y=(1-progress)*(compact?8:18);
 return <article className="miror-v8-engineering-hud__detail-stage" data-stage="44" style={{opacity,transform:`translateY(${y}px)`}}><span>44</span><div><strong>SCALE</strong><p>Detailed content stage for scale. This is where approved Miror facts, photographs, engineering notes or technical assets can be inserted without changing the surrounding application contract.</p></div></article>;
}

function DetailStage45({active,progress,breakpoint}:{active:boolean;progress:number;breakpoint:V8Breakpoint}){
 if(!active)return null;
 const compact=breakpoint==='mobile';
 const opacity=0.72+progress*0.28;
 const y=(1-progress)*(compact?8:18);
 return <article className="miror-v8-engineering-hud__detail-stage" data-stage="45" style={{opacity,transform:`translateY(${y}px)`}}><span>45</span><div><strong>LAYER</strong><p>Detailed content stage for layer. This is where approved Miror facts, photographs, engineering notes or technical assets can be inserted without changing the surrounding application contract.</p></div></article>;
}

function DetailStage46({active,progress,breakpoint}:{active:boolean;progress:number;breakpoint:V8Breakpoint}){
 if(!active)return null;
 const compact=breakpoint==='mobile';
 const opacity=0.72+progress*0.28;
 const y=(1-progress)*(compact?8:18);
 return <article className="miror-v8-engineering-hud__detail-stage" data-stage="46" style={{opacity,transform:`translateY(${y}px)`}}><span>46</span><div><strong>EVIDENCE</strong><p>Detailed content stage for evidence. This is where approved Miror facts, photographs, engineering notes or technical assets can be inserted without changing the surrounding application contract.</p></div></article>;
}

function DetailStage47({active,progress,breakpoint}:{active:boolean;progress:number;breakpoint:V8Breakpoint}){
 if(!active)return null;
 const compact=breakpoint==='mobile';
 const opacity=0.72+progress*0.28;
 const y=(1-progress)*(compact?8:18);
 return <article className="miror-v8-engineering-hud__detail-stage" data-stage="47" style={{opacity,transform:`translateY(${y}px)`}}><span>47</span><div><strong>MEDIA</strong><p>Detailed content stage for media. This is where approved Miror facts, photographs, engineering notes or technical assets can be inserted without changing the surrounding application contract.</p></div></article>;
}

function DetailStage48({active,progress,breakpoint}:{active:boolean;progress:number;breakpoint:V8Breakpoint}){
 if(!active)return null;
 const compact=breakpoint==='mobile';
 const opacity=0.72+progress*0.28;
 const y=(1-progress)*(compact?8:18);
 return <article className="miror-v8-engineering-hud__detail-stage" data-stage="48" style={{opacity,transform:`translateY(${y}px)`}}><span>48</span><div><strong>STATUS</strong><p>Detailed content stage for status. This is where approved Miror facts, photographs, engineering notes or technical assets can be inserted without changing the surrounding application contract.</p></div></article>;
}

function DetailStage49({active,progress,breakpoint}:{active:boolean;progress:number;breakpoint:V8Breakpoint}){
 if(!active)return null;
 const compact=breakpoint==='mobile';
 const opacity=0.72+progress*0.28;
 const y=(1-progress)*(compact?8:18);
 return <article className="miror-v8-engineering-hud__detail-stage" data-stage="49" style={{opacity,transform:`translateY(${y}px)`}}><span>49</span><div><strong>MODEL</strong><p>Detailed content stage for model. This is where approved Miror facts, photographs, engineering notes or technical assets can be inserted without changing the surrounding application contract.</p></div></article>;
}

function DetailStage50({active,progress,breakpoint}:{active:boolean;progress:number;breakpoint:V8Breakpoint}){
 if(!active)return null;
 const compact=breakpoint==='mobile';
 const opacity=0.72+progress*0.28;
 const y=(1-progress)*(compact?8:18);
 return <article className="miror-v8-engineering-hud__detail-stage" data-stage="50" style={{opacity,transform:`translateY(${y}px)`}}><span>50</span><div><strong>GRID</strong><p>Detailed content stage for grid. This is where approved Miror facts, photographs, engineering notes or technical assets can be inserted without changing the surrounding application contract.</p></div></article>;
}

export default function EngineeringHud({className,id,theme='paper',density='airy',motion='full',enabled=true,onAction}:EngineeringHudProps){
 const reduced=useReducedMotion();
 const effective=v8MotionMode(reduced,motion);
 const {breakpoint}=useViewport();
 const point=usePointer(enabled&&canAnimate(effective));
 const ref=useRef<HTMLElement|null>(null);
 const visible=useVisibility(ref);
 const [activeIndex,setActiveIndex]=useState(0);
 const [progress,setProgress]=useState(0);
 const [expanded,setExpanded]=useState(false);
 const headingId=useId(); const descId=useId();
 const current=ITEMS[activeIndex]||ITEMS[0];
 const policy=useMemo(()=>v8MediaPolicy({mode:'placeholder',alt:`${TITLE} visual placeholder`,lazy:breakpoint!=='mobile',priority:breakpoint==='desktop'}),[breakpoint]);
 useEffect(()=>{if(!visible||effective==='off'||!ref.current)return;let raf=0;const loop=()=>{setProgress(scrollProgress(ref.current));raf=requestAnimationFrame(loop);};raf=requestAnimationFrame(loop);return()=>cancelAnimationFrame(raf);},[visible,effective]);
 useEffect(()=>{if(!enabled||breakpoint==='mobile')return;const onKey=(event:KeyboardEvent)=>{if(typingTarget(event.target))return;if(event.key==='ArrowRight'||event.key==='ArrowDown'){event.preventDefault();setActiveIndex(v=>clampIndex(v+1,ITEMS.length));}if(event.key==='ArrowLeft'||event.key==='ArrowUp'){event.preventDefault();setActiveIndex(v=>clampIndex(v-1,ITEMS.length));}if(event.key==='Home')setActiveIndex(0);if(event.key==='End')setActiveIndex(ITEMS.length-1);};window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey);},[breakpoint,enabled]);
 const select=useCallback((index:number,interaction:V8Interaction)=>{setActiveIndex(index);action(onAction,`${SECTION_ID}-${index+1}`,ITEMS[index]?.label||'Section item',undefined,SECTION_ID,interaction);},[onAction]);
 const primary=useCallback(()=>{action(onAction,`${SECTION_ID}-primary`,PRIMARY,'/work',SECTION_ID);safeScroll('work');},[onAction]);
 const secondary=useCallback(()=>{action(onAction,`${SECTION_ID}-secondary`,SECONDARY,'/contact',SECTION_ID);safeScroll('contact');},[onAction]);
 const style=effective==='full'&&visible?({'--v8-pointer-x':`${(point.x-.5)*20}px`,'--v8-pointer-y':`${(point.y-.5)*16}px`,'--v8-progress':percent(progress)} as React.CSSProperties):undefined;
 return <section ref={ref} id={id||SECTION_ID} className={v8Cx("miror-v8-engineering-hud",`${"miror-v8-engineering-hud"}--${theme}`,`${"miror-v8-engineering-hud"}--${density}`,effective==='reduced'&&`${"miror-v8-engineering-hud"}--reduced`,!enabled&&`${"miror-v8-engineering-hud"}--disabled`,className)} aria-labelledby={headingId} aria-describedby={descId} data-section={SECTION_ID} data-breakpoint={breakpoint} data-motion={effective} style={style}>
  <div className={`${"miror-v8-engineering-hud"}__ambient`} aria-hidden="true"><span/><span/><span/></div>
  <div className={`${"miror-v8-engineering-hud"}__container`}>
   <SectionHeader theme={theme}/>
   <div className={`${"miror-v8-engineering-hud"}__intro`}><div><span className={`${"miror-v8-engineering-hud"}__intro-label`}>ENGINEERING-LED / EVIDENCE-FIRST</span><h2 id={headingId}>{TITLE}</h2></div><p id={descId}>{DESCRIPTION}</p></div>
   <div className={`${"miror-v8-engineering-hud"}__stage`}><div className={`${"miror-v8-engineering-hud"}__visual`}><Graphic progress={progress} point={point} index={activeIndex}/><Media policy={policy}/><div className={`${"miror-v8-engineering-hud"}__stage-meta`}><span>GRID / 02</span><span>{breakpoint.toUpperCase()}</span><span>{effective.toUpperCase()}</span></div></div><aside className={`${"miror-v8-engineering-hud"}__panel`} aria-label={`${TITLE} controls`}><span className={`${"miror-v8-engineering-hud"}__panel-label`}>CURRENT ELEMENT</span><h3>{current?.label}</h3><p>{current?.detail}</p><div className={`${"miror-v8-engineering-hud"}__meter`}><span style={{width:percent((activeIndex+1)/ITEMS.length)}}/></div><div className={`${"miror-v8-engineering-hud"}__panel-meta`}><span>ITEM {formatIndex(activeIndex+1)} / {formatIndex(ITEMS.length)}</span><span>{statusTone('draft').toUpperCase()}</span></div><Actions onPrimary={primary} onSecondary={secondary}/></aside></div>
   <div className={`${"miror-v8-engineering-hud"}__items`} role="listbox" aria-label={`${TITLE} controls`}>{ITEMS.map((item,index)=><Item key={item.id} item={item} index={index} active={activeIndex===index} onSelect={select}/>)}</div>
   <div className={`${"miror-v8-engineering-hud"}__details`}>{ITEMS.map((item,index)=>expanded&&index===activeIndex?<div key={item.id} className={`${"miror-v8-engineering-hud"}__detail`}><span>0{index+1}</span><div><strong>{item.label}</strong><p>{item.detail} Approved client content can replace this placeholder later without changing the layout contract.</p></div></div>:null)}</div>
   <footer className={`${"miror-v8-engineering-hud"}__footer`}><div><span>PUBLICATION</span><strong>{v8PublicationLabel('draft')}</strong></div><div><span>REGION</span><strong>Andhra Pradesh / Telangana</strong></div><div><span>MEDIA</span><strong>{mediaCopy(policy)}</strong></div><button type="button" onClick={()=>setExpanded(v=>!v)} aria-expanded={expanded}>{expanded?'Collapse detail':'Expand detail'}</button></footer>
   <p className={`${"miror-v8-engineering-hud"}__sr-only`}>Current {TITLE} element: {current?.label}. Use arrow keys on desktop to navigate.</p>
  </div>
 </section>;
}

export function validateEngineeringHud():string[]{
 const errors:string[]=[];
 if(!SECTION_ID)errors.push('Section id missing');
 if(ITEMS.length!==8)errors.push('Eight interaction items required');
 if(!PRIMARY.trim())errors.push('Primary action label required');
 if(!SECONDARY.trim())errors.push('Secondary action label required');
 if(!MEDIA_RULES.some(v=>v.value==='placeholder'))errors.push('Placeholder media rule missing');
 if(!A11Y_RULES.some(v=>v.reason.includes('reduced motion')))errors.push('Reduced-motion rule missing');
 return errors;
}

export const EngineeringHudDetailStages=[DetailStage01,DetailStage02,DetailStage03,DetailStage04,DetailStage05,DetailStage06,DetailStage07,DetailStage08,DetailStage09,DetailStage10,DetailStage11,DetailStage12,DetailStage13,DetailStage14,DetailStage15,DetailStage16,DetailStage17,DetailStage18,DetailStage19,DetailStage20,DetailStage21,DetailStage22,DetailStage23,DetailStage24,DetailStage25,DetailStage26,DetailStage27,DetailStage28,DetailStage29,DetailStage30,DetailStage31,DetailStage32,DetailStage33,DetailStage34,DetailStage35,DetailStage36,DetailStage37,DetailStage38,DetailStage39,DetailStage40,DetailStage41,DetailStage42,DetailStage43,DetailStage44,DetailStage45,DetailStage46,DetailStage47,DetailStage48,DetailStage49,DetailStage50] as const;
export const EngineeringHudContract0793={section:SECTION_ID,line:793,required:true,purpose:"placeholder media remains available",testId:'engineering-hud-contract-0793',mobileSafe:true,accessible:true} as const;
export const EngineeringHudContract0794={section:SECTION_ID,line:794,required:true,purpose:"publication remains evidence-aware",testId:'engineering-hud-contract-0794',mobileSafe:true,accessible:true} as const;
export const EngineeringHudContract0795={section:SECTION_ID,line:795,required:true,purpose:"mobile hierarchy remains intact",testId:'engineering-hud-contract-0795',mobileSafe:true,accessible:true} as const;
export const EngineeringHudContract0796={section:SECTION_ID,line:796,required:true,purpose:"reduced motion disables displacement",testId:'engineering-hud-contract-0796',mobileSafe:true,accessible:true} as const;
export const EngineeringHudContract0797={section:SECTION_ID,line:797,required:true,purpose:"action events remain scoped",testId:'engineering-hud-contract-0797',mobileSafe:true,accessible:true} as const;
export const EngineeringHudContract0798={section:SECTION_ID,line:798,required:true,purpose:"technical overlays remain decorative",testId:'engineering-hud-contract-0798',mobileSafe:true,accessible:true} as const;
export const EngineeringHudContract0799={section:SECTION_ID,line:799,required:true,purpose:"project data remains replaceable",testId:'engineering-hud-contract-0799',mobileSafe:true,accessible:true} as const;
export const EngineeringHudContract0800={section:SECTION_ID,line:800,required:true,purpose:"keyboard traversal remains deterministic",testId:'engineering-hud-contract-0800',mobileSafe:true,accessible:true} as const;
export const EngineeringHudContract0801={section:SECTION_ID,line:801,required:true,purpose:"placeholder media remains available",testId:'engineering-hud-contract-0801',mobileSafe:true,accessible:true} as const;
export const EngineeringHudContract0802={section:SECTION_ID,line:802,required:true,purpose:"publication remains evidence-aware",testId:'engineering-hud-contract-0802',mobileSafe:true,accessible:true} as const;
export const EngineeringHudContract0803={section:SECTION_ID,line:803,required:true,purpose:"mobile hierarchy remains intact",testId:'engineering-hud-contract-0803',mobileSafe:true,accessible:true} as const;
export const EngineeringHudContract0804={section:SECTION_ID,line:804,required:true,purpose:"reduced motion disables displacement",testId:'engineering-hud-contract-0804',mobileSafe:true,accessible:true} as const;
export const EngineeringHudContract0805={section:SECTION_ID,line:805,required:true,purpose:"action events remain scoped",testId:'engineering-hud-contract-0805',mobileSafe:true,accessible:true} as const;
export const EngineeringHudContract0806={section:SECTION_ID,line:806,required:true,purpose:"technical overlays remain decorative",testId:'engineering-hud-contract-0806',mobileSafe:true,accessible:true} as const;
export const EngineeringHudContract0807={section:SECTION_ID,line:807,required:true,purpose:"project data remains replaceable",testId:'engineering-hud-contract-0807',mobileSafe:true,accessible:true} as const;
export const EngineeringHudContract0808={section:SECTION_ID,line:808,required:true,purpose:"keyboard traversal remains deterministic",testId:'engineering-hud-contract-0808',mobileSafe:true,accessible:true} as const;
export const EngineeringHudContract0809={section:SECTION_ID,line:809,required:true,purpose:"placeholder media remains available",testId:'engineering-hud-contract-0809',mobileSafe:true,accessible:true} as const;
export const EngineeringHudContract0810={section:SECTION_ID,line:810,required:true,purpose:"publication remains evidence-aware",testId:'engineering-hud-contract-0810',mobileSafe:true,accessible:true} as const;
export const EngineeringHudContract0811={section:SECTION_ID,line:811,required:true,purpose:"mobile hierarchy remains intact",testId:'engineering-hud-contract-0811',mobileSafe:true,accessible:true} as const;
export const EngineeringHudContract0812={section:SECTION_ID,line:812,required:true,purpose:"reduced motion disables displacement",testId:'engineering-hud-contract-0812',mobileSafe:true,accessible:true} as const;
export const EngineeringHudContract0813={section:SECTION_ID,line:813,required:true,purpose:"action events remain scoped",testId:'engineering-hud-contract-0813',mobileSafe:true,accessible:true} as const;
export const EngineeringHudContract0814={section:SECTION_ID,line:814,required:true,purpose:"technical overlays remain decorative",testId:'engineering-hud-contract-0814',mobileSafe:true,accessible:true} as const;
export const EngineeringHudContract0815={section:SECTION_ID,line:815,required:true,purpose:"project data remains replaceable",testId:'engineering-hud-contract-0815',mobileSafe:true,accessible:true} as const;
export const EngineeringHudContract0816={section:SECTION_ID,line:816,required:true,purpose:"keyboard traversal remains deterministic",testId:'engineering-hud-contract-0816',mobileSafe:true,accessible:true} as const;
export const EngineeringHudContract0817={section:SECTION_ID,line:817,required:true,purpose:"placeholder media remains available",testId:'engineering-hud-contract-0817',mobileSafe:true,accessible:true} as const;
export const EngineeringHudContract0818={section:SECTION_ID,line:818,required:true,purpose:"publication remains evidence-aware",testId:'engineering-hud-contract-0818',mobileSafe:true,accessible:true} as const;
export const EngineeringHudContract0819={section:SECTION_ID,line:819,required:true,purpose:"mobile hierarchy remains intact",testId:'engineering-hud-contract-0819',mobileSafe:true,accessible:true} as const;
export const EngineeringHudContract0820={section:SECTION_ID,line:820,required:true,purpose:"reduced motion disables displacement",testId:'engineering-hud-contract-0820',mobileSafe:true,accessible:true} as const;
