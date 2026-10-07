"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

export type V9Interaction = "click" | "hover" | "focus" | "scroll" | "keyboard" | "form";
export type V9Mode = "desktop" | "tablet" | "mobile";
export type V9Tone = "light" | "dark" | "paper" | "technical";
export type V9PublicationState = "draft" | "review" | "approved";
export type V9Record = {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  note: string;
  status: "ready" | "coming-soon" | "client-update";
  priority: number;
  order: number;
};

export const V9_SECTION_NUMBER = "19";
export const V9_SECTION_TITLE = "Careers";
export const V9_SECTION_DESCRIPTION = "Career experience prepared for future openings, team stories and a lightweight talent network without fabricating vacancies.";

const sectionClasses = {
  root: "miror-v9-section",
  container: "miror-v9-container",
  eyebrow: "miror-v9-eyebrow",
  title: "miror-v9-display",
  lead: "miror-v9-lead",
  grid: "miror-v9-grid",
  card: "miror-v9-card",
  cardTitle: "miror-v9-card-title",
  meta: "miror-v9-card-meta",
  muted: "miror-v9-muted",
  button: "miror-v9-button",
  buttonPrimary: "miror-v9-button miror-v9-button-primary",
  buttonGhost: "miror-v9-button miror-v9-button-ghost",
  status: "miror-v9-status",
  rail: "miror-v9-rail",
  railItem: "miror-v9-rail-item",
  visual: "miror-v9-technical-visual",
  blueprint: "miror-v9-blueprint-grid",
};

export const V9_RECORDS: V9Record[] = [
  {
    id: "engineering-01",
    title: "Engineering — overview",
    subtitle: "Client-confirmed content can replace this neutral module copy.",
    tag: "Engineering",
    note: "V9 configuration slot 01; replace with approved careers content when available.",
    status: "ready",
    priority: 2,
    order: 1,
  },
  {
    id: "civil-execution-02",
    title: "Civil execution — field practice",
    subtitle: "Use approved project/media evidence before publishing factual claims.",
    tag: "Civil execution",
    note: "V9 configuration slot 02; replace with approved careers content when available.",
    status: "ready",
    priority: 3,
    order: 2,
  },
  {
    id: "site-supervision-03",
    title: "Site supervision — project readiness",
    subtitle: "Designed as a reusable corporate content unit.",
    tag: "Site supervision",
    note: "V9 configuration slot 03; replace with approved careers content when available.",
    status: "ready",
    priority: 4,
    order: 3,
  },
  {
    id: "planning-04",
    title: "Planning — learning note",
    subtitle: "Reserved for future CMS data wiring.",
    tag: "Planning",
    note: "V9 configuration slot 04; replace with approved careers content when available.",
    status: "ready",
    priority: 5,
    order: 4,
  },
  {
    id: "quality-05",
    title: "Quality — workflow",
    subtitle: "Use real photographs when approved; otherwise preserve the media placeholder.",
    tag: "Quality",
    note: "V9 configuration slot 05; replace with approved careers content when available.",
    status: "ready",
    priority: 1,
    order: 5,
  },
  {
    id: "safety-06",
    title: "Safety — future update",
    subtitle: "Keep claims specific and evidence-led.",
    tag: "Safety",
    note: "V9 configuration slot 06; replace with approved careers content when available.",
    status: "ready",
    priority: 2,
    order: 6,
  },
  {
    id: "commercial-07",
    title: "Commercial — overview",
    subtitle: "Avoid invented metrics, awards or certification statements.",
    tag: "Commercial",
    note: "V9 configuration slot 07; replace with approved careers content when available.",
    status: "ready",
    priority: 3,
    order: 7,
  },
  {
    id: "administration-08",
    title: "Administration — field practice",
    subtitle: "Accessible interaction should work without pointer input.",
    tag: "Administration",
    note: "V9 configuration slot 08; replace with approved careers content when available.",
    status: "ready",
    priority: 4,
    order: 8,
  },
  {
    id: "business-development-09",
    title: "Business development — project readiness",
    subtitle: "Respect reduced-motion preferences.",
    tag: "Business development",
    note: "V9 configuration slot 09; replace with approved careers content when available.",
    status: "ready",
    priority: 5,
    order: 9,
  },
  {
    id: "digital-/-bim-10",
    title: "Digital / BIM — learning note",
    subtitle: "Keep layout usable on mobile.",
    tag: "Digital / BIM",
    note: "V9 configuration slot 10; replace with approved careers content when available.",
    status: "ready",
    priority: 1,
    order: 10,
  },
  {
    id: "engineering-11",
    title: "Engineering — workflow",
    subtitle: "Client-confirmed content can replace this neutral module copy.",
    tag: "Engineering",
    note: "V9 configuration slot 11; replace with approved careers content when available.",
    status: "ready",
    priority: 2,
    order: 11,
  },
  {
    id: "civil-execution-12",
    title: "Civil execution — future update",
    subtitle: "Use approved project/media evidence before publishing factual claims.",
    tag: "Civil execution",
    note: "V9 configuration slot 12; replace with approved careers content when available.",
    status: "ready",
    priority: 3,
    order: 12,
  },
  {
    id: "site-supervision-13",
    title: "Site supervision — overview",
    subtitle: "Designed as a reusable corporate content unit.",
    tag: "Site supervision",
    note: "V9 configuration slot 13; replace with approved careers content when available.",
    status: "ready",
    priority: 4,
    order: 13,
  },
  {
    id: "planning-14",
    title: "Planning — field practice",
    subtitle: "Reserved for future CMS data wiring.",
    tag: "Planning",
    note: "V9 configuration slot 14; replace with approved careers content when available.",
    status: "ready",
    priority: 5,
    order: 14,
  },
  {
    id: "quality-15",
    title: "Quality — project readiness",
    subtitle: "Use real photographs when approved; otherwise preserve the media placeholder.",
    tag: "Quality",
    note: "V9 configuration slot 15; replace with approved careers content when available.",
    status: "ready",
    priority: 1,
    order: 15,
  },
  {
    id: "safety-16",
    title: "Safety — learning note",
    subtitle: "Keep claims specific and evidence-led.",
    tag: "Safety",
    note: "V9 configuration slot 16; replace with approved careers content when available.",
    status: "ready",
    priority: 2,
    order: 16,
  },
  {
    id: "commercial-17",
    title: "Commercial — workflow",
    subtitle: "Avoid invented metrics, awards or certification statements.",
    tag: "Commercial",
    note: "V9 configuration slot 17; replace with approved careers content when available.",
    status: "ready",
    priority: 3,
    order: 17,
  },
  {
    id: "administration-18",
    title: "Administration — future update",
    subtitle: "Accessible interaction should work without pointer input.",
    tag: "Administration",
    note: "V9 configuration slot 18; replace with approved careers content when available.",
    status: "ready",
    priority: 4,
    order: 18,
  },
  {
    id: "business-development-19",
    title: "Business development — overview",
    subtitle: "Respect reduced-motion preferences.",
    tag: "Business development",
    note: "V9 configuration slot 19; replace with approved careers content when available.",
    status: "ready",
    priority: 5,
    order: 19,
  },
  {
    id: "digital-/-bim-20",
    title: "Digital / BIM — field practice",
    subtitle: "Keep layout usable on mobile.",
    tag: "Digital / BIM",
    note: "V9 configuration slot 20; replace with approved careers content when available.",
    status: "ready",
    priority: 1,
    order: 20,
  },
  {
    id: "engineering-21",
    title: "Engineering — project readiness",
    subtitle: "Client-confirmed content can replace this neutral module copy.",
    tag: "Engineering",
    note: "V9 configuration slot 21; replace with approved careers content when available.",
    status: "ready",
    priority: 2,
    order: 21,
  },
  {
    id: "civil-execution-22",
    title: "Civil execution — learning note",
    subtitle: "Use approved project/media evidence before publishing factual claims.",
    tag: "Civil execution",
    note: "V9 configuration slot 22; replace with approved careers content when available.",
    status: "ready",
    priority: 3,
    order: 22,
  },
  {
    id: "site-supervision-23",
    title: "Site supervision — workflow",
    subtitle: "Designed as a reusable corporate content unit.",
    tag: "Site supervision",
    note: "V9 configuration slot 23; replace with approved careers content when available.",
    status: "ready",
    priority: 4,
    order: 23,
  },
  {
    id: "planning-24",
    title: "Planning — future update",
    subtitle: "Reserved for future CMS data wiring.",
    tag: "Planning",
    note: "V9 configuration slot 24; replace with approved careers content when available.",
    status: "ready",
    priority: 5,
    order: 24,
  },
  {
    id: "quality-25",
    title: "Quality — overview",
    subtitle: "Use real photographs when approved; otherwise preserve the media placeholder.",
    tag: "Quality",
    note: "V9 configuration slot 25; replace with approved careers content when available.",
    status: "ready",
    priority: 1,
    order: 25,
  },
  {
    id: "safety-26",
    title: "Safety — field practice",
    subtitle: "Keep claims specific and evidence-led.",
    tag: "Safety",
    note: "V9 configuration slot 26; replace with approved careers content when available.",
    status: "ready",
    priority: 2,
    order: 26,
  },
  {
    id: "commercial-27",
    title: "Commercial — project readiness",
    subtitle: "Avoid invented metrics, awards or certification statements.",
    tag: "Commercial",
    note: "V9 configuration slot 27; replace with approved careers content when available.",
    status: "ready",
    priority: 3,
    order: 27,
  },
  {
    id: "administration-28",
    title: "Administration — learning note",
    subtitle: "Accessible interaction should work without pointer input.",
    tag: "Administration",
    note: "V9 configuration slot 28; replace with approved careers content when available.",
    status: "ready",
    priority: 4,
    order: 28,
  },
  {
    id: "business-development-29",
    title: "Business development — workflow",
    subtitle: "Respect reduced-motion preferences.",
    tag: "Business development",
    note: "V9 configuration slot 29; replace with approved careers content when available.",
    status: "ready",
    priority: 5,
    order: 29,
  },
  {
    id: "digital-/-bim-30",
    title: "Digital / BIM — future update",
    subtitle: "Keep layout usable on mobile.",
    tag: "Digital / BIM",
    note: "V9 configuration slot 30; replace with approved careers content when available.",
    status: "ready",
    priority: 1,
    order: 30,
  },
  {
    id: "engineering-31",
    title: "Engineering — overview",
    subtitle: "Client-confirmed content can replace this neutral module copy.",
    tag: "Engineering",
    note: "V9 configuration slot 31; replace with approved careers content when available.",
    status: "ready",
    priority: 2,
    order: 31,
  },
  {
    id: "civil-execution-32",
    title: "Civil execution — field practice",
    subtitle: "Use approved project/media evidence before publishing factual claims.",
    tag: "Civil execution",
    note: "V9 configuration slot 32; replace with approved careers content when available.",
    status: "ready",
    priority: 3,
    order: 32,
  },
  {
    id: "site-supervision-33",
    title: "Site supervision — project readiness",
    subtitle: "Designed as a reusable corporate content unit.",
    tag: "Site supervision",
    note: "V9 configuration slot 33; replace with approved careers content when available.",
    status: "ready",
    priority: 4,
    order: 33,
  },
  {
    id: "planning-34",
    title: "Planning — learning note",
    subtitle: "Reserved for future CMS data wiring.",
    tag: "Planning",
    note: "V9 configuration slot 34; replace with approved careers content when available.",
    status: "ready",
    priority: 5,
    order: 34,
  },
  {
    id: "quality-35",
    title: "Quality — workflow",
    subtitle: "Use real photographs when approved; otherwise preserve the media placeholder.",
    tag: "Quality",
    note: "V9 configuration slot 35; replace with approved careers content when available.",
    status: "ready",
    priority: 1,
    order: 35,
  },
  {
    id: "safety-36",
    title: "Safety — future update",
    subtitle: "Keep claims specific and evidence-led.",
    tag: "Safety",
    note: "V9 configuration slot 36; replace with approved careers content when available.",
    status: "ready",
    priority: 2,
    order: 36,
  },
  {
    id: "commercial-37",
    title: "Commercial — overview",
    subtitle: "Avoid invented metrics, awards or certification statements.",
    tag: "Commercial",
    note: "V9 configuration slot 37; replace with approved careers content when available.",
    status: "ready",
    priority: 3,
    order: 37,
  },
  {
    id: "administration-38",
    title: "Administration — field practice",
    subtitle: "Accessible interaction should work without pointer input.",
    tag: "Administration",
    note: "V9 configuration slot 38; replace with approved careers content when available.",
    status: "ready",
    priority: 4,
    order: 38,
  },
  {
    id: "business-development-39",
    title: "Business development — project readiness",
    subtitle: "Respect reduced-motion preferences.",
    tag: "Business development",
    note: "V9 configuration slot 39; replace with approved careers content when available.",
    status: "ready",
    priority: 5,
    order: 39,
  },
  {
    id: "digital-/-bim-40",
    title: "Digital / BIM — learning note",
    subtitle: "Keep layout usable on mobile.",
    tag: "Digital / BIM",
    note: "V9 configuration slot 40; replace with approved careers content when available.",
    status: "ready",
    priority: 1,
    order: 40,
  },
  {
    id: "engineering-41",
    title: "Engineering — workflow",
    subtitle: "Client-confirmed content can replace this neutral module copy.",
    tag: "Engineering",
    note: "V9 configuration slot 41; replace with approved careers content when available.",
    status: "ready",
    priority: 2,
    order: 41,
  },
  {
    id: "civil-execution-42",
    title: "Civil execution — future update",
    subtitle: "Use approved project/media evidence before publishing factual claims.",
    tag: "Civil execution",
    note: "V9 configuration slot 42; replace with approved careers content when available.",
    status: "ready",
    priority: 3,
    order: 42,
  },
  {
    id: "site-supervision-43",
    title: "Site supervision — overview",
    subtitle: "Designed as a reusable corporate content unit.",
    tag: "Site supervision",
    note: "V9 configuration slot 43; replace with approved careers content when available.",
    status: "ready",
    priority: 4,
    order: 43,
  },
  {
    id: "planning-44",
    title: "Planning — field practice",
    subtitle: "Reserved for future CMS data wiring.",
    tag: "Planning",
    note: "V9 configuration slot 44; replace with approved careers content when available.",
    status: "ready",
    priority: 5,
    order: 44,
  },
  {
    id: "quality-45",
    title: "Quality — project readiness",
    subtitle: "Use real photographs when approved; otherwise preserve the media placeholder.",
    tag: "Quality",
    note: "V9 configuration slot 45; replace with approved careers content when available.",
    status: "ready",
    priority: 1,
    order: 45,
  },
  {
    id: "safety-46",
    title: "Safety — learning note",
    subtitle: "Keep claims specific and evidence-led.",
    tag: "Safety",
    note: "V9 configuration slot 46; replace with approved careers content when available.",
    status: "ready",
    priority: 2,
    order: 46,
  },
  {
    id: "commercial-47",
    title: "Commercial — workflow",
    subtitle: "Avoid invented metrics, awards or certification statements.",
    tag: "Commercial",
    note: "V9 configuration slot 47; replace with approved careers content when available.",
    status: "ready",
    priority: 3,
    order: 47,
  },
  {
    id: "administration-48",
    title: "Administration — future update",
    subtitle: "Accessible interaction should work without pointer input.",
    tag: "Administration",
    note: "V9 configuration slot 48; replace with approved careers content when available.",
    status: "ready",
    priority: 4,
    order: 48,
  },
  {
    id: "business-development-49",
    title: "Business development — overview",
    subtitle: "Respect reduced-motion preferences.",
    tag: "Business development",
    note: "V9 configuration slot 49; replace with approved careers content when available.",
    status: "ready",
    priority: 5,
    order: 49,
  },
  {
    id: "digital-/-bim-50",
    title: "Digital / BIM — field practice",
    subtitle: "Keep layout usable on mobile.",
    tag: "Digital / BIM",
    note: "V9 configuration slot 50; replace with approved careers content when available.",
    status: "ready",
    priority: 1,
    order: 50,
  },
  {
    id: "engineering-51",
    title: "Engineering — project readiness",
    subtitle: "Client-confirmed content can replace this neutral module copy.",
    tag: "Engineering",
    note: "V9 configuration slot 51; replace with approved careers content when available.",
    status: "ready",
    priority: 2,
    order: 51,
  },
  {
    id: "civil-execution-52",
    title: "Civil execution — learning note",
    subtitle: "Use approved project/media evidence before publishing factual claims.",
    tag: "Civil execution",
    note: "V9 configuration slot 52; replace with approved careers content when available.",
    status: "ready",
    priority: 3,
    order: 52,
  },
  {
    id: "site-supervision-53",
    title: "Site supervision — workflow",
    subtitle: "Designed as a reusable corporate content unit.",
    tag: "Site supervision",
    note: "V9 configuration slot 53; replace with approved careers content when available.",
    status: "ready",
    priority: 4,
    order: 53,
  },
  {
    id: "planning-54",
    title: "Planning — future update",
    subtitle: "Reserved for future CMS data wiring.",
    tag: "Planning",
    note: "V9 configuration slot 54; replace with approved careers content when available.",
    status: "ready",
    priority: 5,
    order: 54,
  },
  {
    id: "quality-55",
    title: "Quality — overview",
    subtitle: "Use real photographs when approved; otherwise preserve the media placeholder.",
    tag: "Quality",
    note: "V9 configuration slot 55; replace with approved careers content when available.",
    status: "ready",
    priority: 1,
    order: 55,
  },
  {
    id: "safety-56",
    title: "Safety — field practice",
    subtitle: "Keep claims specific and evidence-led.",
    tag: "Safety",
    note: "V9 configuration slot 56; replace with approved careers content when available.",
    status: "ready",
    priority: 2,
    order: 56,
  },
  {
    id: "commercial-57",
    title: "Commercial — project readiness",
    subtitle: "Avoid invented metrics, awards or certification statements.",
    tag: "Commercial",
    note: "V9 configuration slot 57; replace with approved careers content when available.",
    status: "ready",
    priority: 3,
    order: 57,
  },
  {
    id: "administration-58",
    title: "Administration — learning note",
    subtitle: "Accessible interaction should work without pointer input.",
    tag: "Administration",
    note: "V9 configuration slot 58; replace with approved careers content when available.",
    status: "ready",
    priority: 4,
    order: 58,
  },
  {
    id: "business-development-59",
    title: "Business development — workflow",
    subtitle: "Respect reduced-motion preferences.",
    tag: "Business development",
    note: "V9 configuration slot 59; replace with approved careers content when available.",
    status: "ready",
    priority: 5,
    order: 59,
  },
  {
    id: "digital-/-bim-60",
    title: "Digital / BIM — future update",
    subtitle: "Keep layout usable on mobile.",
    tag: "Digital / BIM",
    note: "V9 configuration slot 60; replace with approved careers content when available.",
    status: "ready",
    priority: 1,
    order: 60,
  },
  {
    id: "engineering-61",
    title: "Engineering — overview",
    subtitle: "Client-confirmed content can replace this neutral module copy.",
    tag: "Engineering",
    note: "V9 configuration slot 61; replace with approved careers content when available.",
    status: "ready",
    priority: 2,
    order: 61,
  },
  {
    id: "civil-execution-62",
    title: "Civil execution — field practice",
    subtitle: "Use approved project/media evidence before publishing factual claims.",
    tag: "Civil execution",
    note: "V9 configuration slot 62; replace with approved careers content when available.",
    status: "ready",
    priority: 3,
    order: 62,
  },
  {
    id: "site-supervision-63",
    title: "Site supervision — project readiness",
    subtitle: "Designed as a reusable corporate content unit.",
    tag: "Site supervision",
    note: "V9 configuration slot 63; replace with approved careers content when available.",
    status: "ready",
    priority: 4,
    order: 63,
  },
  {
    id: "planning-64",
    title: "Planning — learning note",
    subtitle: "Reserved for future CMS data wiring.",
    tag: "Planning",
    note: "V9 configuration slot 64; replace with approved careers content when available.",
    status: "ready",
    priority: 5,
    order: 64,
  },
  {
    id: "quality-65",
    title: "Quality — workflow",
    subtitle: "Use real photographs when approved; otherwise preserve the media placeholder.",
    tag: "Quality",
    note: "V9 configuration slot 65; replace with approved careers content when available.",
    status: "ready",
    priority: 1,
    order: 65,
  },
  {
    id: "safety-66",
    title: "Safety — future update",
    subtitle: "Keep claims specific and evidence-led.",
    tag: "Safety",
    note: "V9 configuration slot 66; replace with approved careers content when available.",
    status: "ready",
    priority: 2,
    order: 66,
  },
  {
    id: "commercial-67",
    title: "Commercial — overview",
    subtitle: "Avoid invented metrics, awards or certification statements.",
    tag: "Commercial",
    note: "V9 configuration slot 67; replace with approved careers content when available.",
    status: "ready",
    priority: 3,
    order: 67,
  },
  {
    id: "administration-68",
    title: "Administration — field practice",
    subtitle: "Accessible interaction should work without pointer input.",
    tag: "Administration",
    note: "V9 configuration slot 68; replace with approved careers content when available.",
    status: "ready",
    priority: 4,
    order: 68,
  },
  {
    id: "business-development-69",
    title: "Business development — project readiness",
    subtitle: "Respect reduced-motion preferences.",
    tag: "Business development",
    note: "V9 configuration slot 69; replace with approved careers content when available.",
    status: "ready",
    priority: 5,
    order: 69,
  },
  {
    id: "digital-/-bim-70",
    title: "Digital / BIM — learning note",
    subtitle: "Keep layout usable on mobile.",
    tag: "Digital / BIM",
    note: "V9 configuration slot 70; replace with approved careers content when available.",
    status: "ready",
    priority: 1,
    order: 70,
  },
  {
    id: "engineering-71",
    title: "Engineering — workflow",
    subtitle: "Client-confirmed content can replace this neutral module copy.",
    tag: "Engineering",
    note: "V9 configuration slot 71; replace with approved careers content when available.",
    status: "ready",
    priority: 2,
    order: 71,
  },
  {
    id: "civil-execution-72",
    title: "Civil execution — future update",
    subtitle: "Use approved project/media evidence before publishing factual claims.",
    tag: "Civil execution",
    note: "V9 configuration slot 72; replace with approved careers content when available.",
    status: "ready",
    priority: 3,
    order: 72,
  },
];

type MotionState = {
  reduced: boolean;
  visible: boolean;
  progress: number;
  mode: V9Mode;
};

type FocusState = {
  active: boolean;
  index: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getMode(width: number): V9Mode {
  if (width < 680) return "mobile";
  if (width < 1080) return "tablet";
  return "desktop";
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener?.("change", update);
    return () => query.removeEventListener?.("change", update);
  }, []);
  return reduced;
}

function useViewportMode() {
  const [mode, setMode] = useState<V9Mode>("desktop");
  useEffect(() => {
    const update = () => setMode(getMode(window.innerWidth));
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);
  return mode;
}

function useSectionProgress(ref: React.RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const height = Math.max(rect.height, 1);
      const viewport = Math.max(window.innerHeight, 1);
      const raw = (viewport - rect.top) / (height + viewport);
      setProgress(clamp(raw, 0, 1));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [ref]);
  return progress;
}

function useIntersection(ref: React.RefObject<HTMLElement | null>) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => entry.isIntersecting && setVisible(true)),
      { threshold: 0.12, rootMargin: "80px 0px" },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  return visible;
}

function useInteractionLog(section: string) {
  return (interaction: V9Interaction, detail?: Record<string, unknown>) => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new CustomEvent("miror:v9-interaction", {
      detail: { section, interaction, ...detail, timestamp: Date.now() },
    }));
  };
}

function recordMatches(record: V9Record, query: string) {
  if (!query.trim()) return true;
  const haystack = [record.title, record.subtitle, record.tag, record.note].join(" ").toLowerCase();
  return haystack.includes(query.trim().toLowerCase());
}

function sortRecords(records: V9Record[], mode: "priority" | "order" | "title") {
  const cloned = [...records];
  if (mode === "title") return cloned.sort((a, b) => a.title.localeCompare(b.title));
  if (mode === "priority") return cloned.sort((a, b) => a.priority - b.priority || a.order - b.order);
  return cloned.sort((a, b) => a.order - b.order);
}

function recordStatusLabel(record: V9Record) {
  if (record.status === "client-update") return "Client update";
  if (record.status === "coming-soon") return "Coming soon";
  return "Ready";
}

function safeMailto(subject: string, body: string) {
  const params = new URLSearchParams({ subject, body });
  return `mailto:p.lokeshreddy2005@gmail.com?${params.toString()}`;
}

const CARD_LIMITS: Record<V9Mode, number> = { desktop: 12, tablet: 8, mobile: 5 };
const GRID_COLUMNS: Record<V9Mode, number> = { desktop: 4, tablet: 2, mobile: 1 };
const ENTER_Y: Record<V9Mode, number> = { desktop: 34, tablet: 24, mobile: 16 };
const CONTROL_LABELS = ["Previous", "Next", "Pause motion", "Resume motion", "Open details", "Close details"];

export const MirorV9CareersConfig = {
  number: "19",
  title: "Careers",
  tone: "paper" as V9Tone,
  publicationState: "draft" as V9PublicationState,
  email: "p.lokeshreddy2005@gmail.com",
  placeholderMedia: true,
  supportsTouch: true,
  supportsKeyboard: true,
  supportsReducedMotion: true,
  supportsProgressiveDisclosure: true,
  supportsAnalytics: true,
};

function SectionKicker({children}:{children:React.ReactNode}) {
  return <p className={sectionClasses.eyebrow}>{children}</p>;
}

function SectionHeading({title, description}:{title:string;description:string}) {
  return <div className="miror-v9-heading-stack"><h2 className={sectionClasses.title}>{title}</h2><p className={sectionClasses.lead}>{description}</p></div>;
}

function TechnicalLegend() {
  const legend = ["DETAIL", "STRUCTURE", "PROCESS", "EVIDENCE"];
  return <div className="miror-v9-legend" aria-label="Section legend">{legend.map(item => <span key={item}>{item}</span>)}</div>;
}

function ProgressRail({progress}:{progress:number}) {
  return <div className="miror-v9-progress" aria-hidden="true"><span style={{transform:`scaleX(${progress})`}} /></div>;
}

function PlaceholderMedia({label}:{label:string}) {
  return <div className={sectionClasses.visual} role="img" aria-label={`${label} media placeholder`}><div className={sectionClasses.blueprint}><span>{label}</span><i /><i /><i /></div><small>MEDIA TO BE UPDATED</small></div>;
}

function RecordCard({record, index, onOpen}:{record:V9Record;index:number;onOpen:(record:V9Record)=>void}) {
  return <article className={sectionClasses.card} style={{animationDelay:`${index * 35}ms`}} tabIndex={0} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onOpen(record); } }}>
    <div className="miror-v9-card-number">{String(record.order).padStart(2,"0")}</div>
    <div className={sectionClasses.meta}>{record.tag} <span aria-hidden="true">↗</span></div>
    <h3 className={sectionClasses.cardTitle}>{record.title}</h3>
    <p className={sectionClasses.muted}>{record.subtitle}</p>
    <div className="miror-v9-card-bottom"><span className={sectionClasses.status}>{recordStatusLabel(record)}</span><button className={sectionClasses.buttonGhost} onClick={() => onOpen(record)}>Explore</button></div>
  </article>;
}

function DetailsDialog({record,onClose}:{record:V9Record|null;onClose:()=>void}) {
  useEffect(() => {
    if (!record) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [record,onClose]);
  if (!record) return null;
  return <div className="miror-v9-dialog-backdrop" role="presentation" onMouseDown={event => { if (event.currentTarget === event.target) onClose(); }}>
    <section className="miror-v9-dialog" role="dialog" aria-modal="true" aria-labelledby="v9-dialog-title">
      <div className="miror-v9-dialog-header"><span>{record.tag}</span><button className={sectionClasses.buttonGhost} onClick={onClose} aria-label="Close details">Close ×</button></div>
      <h3 id="v9-dialog-title" className={sectionClasses.title}>{record.title}</h3>
      <p className={sectionClasses.lead}>{record.note}</p>
      <PlaceholderMedia label={record.tag} />
      <div className="miror-v9-dialog-actions"><a className={sectionClasses.buttonPrimary} href={safeMailto(`Miror enquiry: ${record.title}`, `I would like to discuss ${record.title}.`)}>Discuss this ↗</a></div>
    </section>
  </div>;
}

export default function V9Section() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();
  const mode = useViewportMode();
  const progress = useSectionProgress(sectionRef);
  const visible = useIntersection(sectionRef);
  const log = useInteractionLog(section);
  const [query,setQuery] = useState("");
  const [sort,setSort] = useState<"priority"|"order"|"title">("order");
  const [selected,setSelected] = useState<V9Record|null>(null);
  const [paused,setPaused] = useState(false);
  const [activeIndex,setActiveIndex] = useState(0);
  const [showAll,setShowAll] = useState(false);
  const filtered = useMemo(() => {
    const matches = V9_RECORDS.filter(record => recordMatches(record,query));
    const sorted = sortRecords(matches,sort);
    return showAll ? sorted : sorted.slice(0,CARD_LIMITS[mode]);
  }, [query,sort,showAll,mode]);
  useEffect(() => {
    if (paused || reduced || !visible) return;
    const id = window.setInterval(() => setActiveIndex(current => (current + 1) % Math.max(filtered.length,1)), 3600);
    return () => window.clearInterval(id);
  }, [paused,reduced,visible,filtered.length]);
  useEffect(() => {
    log("scroll",{progress});
  }, [progress]);
  const openRecord = (record:V9Record) => {
    setSelected(record);
    log("click",{recordId:record.id,action:"open"});
  };
  const handleKeyNavigation = (event:React.KeyboardEvent) => {
    if (!filtered.length) return;
    if (event.key === "ArrowRight") { event.preventDefault(); setActiveIndex(current => (current + 1) % filtered.length); log("keyboard",{key:event.key}); }
    if (event.key === "ArrowLeft") { event.preventDefault(); setActiveIndex(current => (current - 1 + filtered.length) % filtered.length); log("keyboard",{key:event.key}); }
  };
  const current = filtered[activeIndex] ?? filtered[0] ?? null;
  return <section
    ref={sectionRef}
    className={`${sectionClasses.root} ${visible ? "is-visible" : "is-pending"} miror-v9-mode-${mode}`}
    data-section={number}
    data-reduced-motion={reduced}
    onKeyDown={handleKeyNavigation}
    tabIndex={-1}
  >
    <ProgressRail progress={progress} />
    <div className={sectionClasses.container}>
      <div className="miror-v9-topline"><SectionKicker>0{number} / MIROR</SectionKicker><TechnicalLegend /></div>
      <SectionHeading title={section} description={description} />
      <div className="miror-v9-section-toolbar">
        <label className="miror-v9-search">Search <input value={query} onChange={event => { setQuery(event.target.value); log("form",{field:"query"}); }} placeholder={`Search ${section.toLowerCase()}...`} /></label>
        <label className="miror-v9-sort">Order <select value={sort} onChange={event => setSort(event.target.value as typeof sort)}><option value="order">Sequence</option><option value="priority">Priority</option><option value="title">A–Z</option></select></label>
        <button className={sectionClasses.buttonGhost} onClick={() => { setPaused(value => !value); log("click",{action:"toggle-motion"}); }}>{paused ? "Resume motion" : "Pause motion"}</button>
      </div>
      <div className="miror-v9-feature-stage" aria-live="polite">
        <PlaceholderMedia label={current?.tag ?? section} />
        <div className="miror-v9-feature-copy">
          <span className={sectionClasses.meta}>FOCUS {current ? String(current.order).padStart(2,"0") : "00"}</span>
          <h3>{current?.title ?? `Future ${section.toLowerCase()} update`}</h3>
          <p>{current?.note ?? "Client-approved information will be added here."}</p>
          <div className="miror-v9-feature-actions">{current && <button className={sectionClasses.buttonPrimary} onClick={() => openRecord(current)}>Open detail ↗</button>}<a className={sectionClasses.buttonGhost} href={safeMailto(`Miror ${section} query`,"Please share the approved details for this topic.")}>Send query</a></div>
        </div>
      </div>
      <div className={sectionClasses.grid} style={{"--v9-columns": GRID_COLUMNS[mode]} as React.CSSProperties}>
        {filtered.map((record,index) => <RecordCard key={record.id} record={record} index={index} onOpen={openRecord} />)}
      </div>
      <div className="miror-v9-archive-controls">
        {!showAll && filtered.length < V9_RECORDS.length && <button className={sectionClasses.buttonPrimary} onClick={() => { setShowAll(true); log("click",{action:"show-all"}); }}>Load more</button>}
        {showAll && <button className={sectionClasses.buttonGhost} onClick={() => setShowAll(false)}>Collapse</button>}
        <span className={sectionClasses.muted}>{filtered.length} visible / {V9_RECORDS.length} configured</span>
      </div>
      <div className="miror-v9-callout">
        <div><SectionKicker>Publication discipline</SectionKicker><p>Replace placeholders with approved company information, photographs, drawings and project facts before publishing.</p></div>
        <a className={sectionClasses.buttonPrimary} href={safeMailto(`Miror ${section} content update`,"Please send the approved content/assets for this website section.")}>Update this section ↗</a>
      </div>
      <div className="miror-v9-technical-footnote">
        <span>SECTION {number}</span><span>MODE {mode.toUpperCase()}</span><span>MOTION {reduced ? "REDUCED" : "FULL"}</span><span>STATE DRAFT</span>
      </div>
    </div>
    <DetailsDialog record={selected} onClose={() => { setSelected(null); log("click",{action:"close-detail"}); }} />
  </section>;
}

// Responsive policy: content remains meaningful at every viewport.
// Responsive policy: technical visual may collapse to a static placeholder on constrained devices.
// Accessibility policy: focusable cards expose keyboard activation.
// Accessibility policy: dialog is closable with Escape.
// Accessibility policy: controls retain visible labels.
// Motion policy: reduced-motion preference disables automatic cycling.
// Motion policy: pause control is exposed to all users.
// Content policy: client-update states must not present fabricated corporate facts.
// Content policy: placeholder media is explicitly labeled.
// SEO policy: section headings remain semantic h2/h3 hierarchy.
// Analytics policy: events are emitted through a browser CustomEvent seam.
// Integration policy: future API/CMS can replace V9_RECORDS without changing render contracts.
// Responsive policy: content remains meaningful at every viewport.
// Responsive policy: technical visual may collapse to a static placeholder on constrained devices.
// Accessibility policy: focusable cards expose keyboard activation.
// Accessibility policy: dialog is closable with Escape.
// Accessibility policy: controls retain visible labels.
// Motion policy: reduced-motion preference disables automatic cycling.
// Motion policy: pause control is exposed to all users.
// Content policy: client-update states must not present fabricated corporate facts.
// Content policy: placeholder media is explicitly labeled.
// SEO policy: section headings remain semantic h2/h3 hierarchy.
// Analytics policy: events are emitted through a browser CustomEvent seam.
// Integration policy: future API/CMS can replace V9_RECORDS without changing render contracts.
// Responsive policy: content remains meaningful at every viewport.
// Responsive policy: technical visual may collapse to a static placeholder on constrained devices.
// Accessibility policy: focusable cards expose keyboard activation.
// Accessibility policy: dialog is closable with Escape.
// Accessibility policy: controls retain visible labels.
// Motion policy: reduced-motion preference disables automatic cycling.
// Motion policy: pause control is exposed to all users.
// Content policy: client-update states must not present fabricated corporate facts.
// Content policy: placeholder media is explicitly labeled.
// SEO policy: section headings remain semantic h2/h3 hierarchy.
// Analytics policy: events are emitted through a browser CustomEvent seam.
// Integration policy: future API/CMS can replace V9_RECORDS without changing render contracts.
// Responsive policy: content remains meaningful at every viewport.
// Responsive policy: technical visual may collapse to a static placeholder on constrained devices.
// Accessibility policy: focusable cards expose keyboard activation.
// Accessibility policy: dialog is closable with Escape.
// Accessibility policy: controls retain visible labels.
// Motion policy: reduced-motion preference disables automatic cycling.
// Motion policy: pause control is exposed to all users.
// Content policy: client-update states must not present fabricated corporate facts.
// Content policy: placeholder media is explicitly labeled.
// SEO policy: section headings remain semantic h2/h3 hierarchy.
// Analytics policy: events are emitted through a browser CustomEvent seam.
// Integration policy: future API/CMS can replace V9_RECORDS without changing render contracts.
// Responsive policy: content remains meaningful at every viewport.
// Responsive policy: technical visual may collapse to a static placeholder on constrained devices.
// Accessibility policy: focusable cards expose keyboard activation.
// Accessibility policy: dialog is closable with Escape.
// Accessibility policy: controls retain visible labels.
// Motion policy: reduced-motion preference disables automatic cycling.
// Motion policy: pause control is exposed to all users.
// Content policy: client-update states must not present fabricated corporate facts.
// Content policy: placeholder media is explicitly labeled.
// SEO policy: section headings remain semantic h2/h3 hierarchy.
// Analytics policy: events are emitted through a browser CustomEvent seam.
// Integration policy: future API/CMS can replace V9_RECORDS without changing render contracts.
// Responsive policy: content remains meaningful at every viewport.
// Responsive policy: technical visual may collapse to a static placeholder on constrained devices.
// Accessibility policy: focusable cards expose keyboard activation.
// Accessibility policy: dialog is closable with Escape.
// Accessibility policy: controls retain visible labels.
// Motion policy: reduced-motion preference disables automatic cycling.
// Motion policy: pause control is exposed to all users.
// Content policy: client-update states must not present fabricated corporate facts.
// Content policy: placeholder media is explicitly labeled.
// SEO policy: section headings remain semantic h2/h3 hierarchy.
// Analytics policy: events are emitted through a browser CustomEvent seam.
// Integration policy: future API/CMS can replace V9_RECORDS without changing render contracts.
// Responsive policy: content remains meaningful at every viewport.
// Responsive policy: technical visual may collapse to a static placeholder on constrained devices.
// Accessibility policy: focusable cards expose keyboard activation.
// Accessibility policy: dialog is closable with Escape.
// Accessibility policy: controls retain visible labels.
// Motion policy: reduced-motion preference disables automatic cycling.
// Motion policy: pause control is exposed to all users.
// Content policy: client-update states must not present fabricated corporate facts.
// Content policy: placeholder media is explicitly labeled.
// SEO policy: section headings remain semantic h2/h3 hierarchy.
// Analytics policy: events are emitted through a browser CustomEvent seam.
// Integration policy: future API/CMS can replace V9_RECORDS without changing render contracts.
// Responsive policy: content remains meaningful at every viewport.
// Responsive policy: technical visual may collapse to a static placeholder on constrained devices.
// Accessibility policy: focusable cards expose keyboard activation.
// Accessibility policy: dialog is closable with Escape.
// Accessibility policy: controls retain visible labels.
// Motion policy: reduced-motion preference disables automatic cycling.
// Motion policy: pause control is exposed to all users.
// Content policy: client-update states must not present fabricated corporate facts.
// Content policy: placeholder media is explicitly labeled.
// SEO policy: section headings remain semantic h2/h3 hierarchy.
// Analytics policy: events are emitted through a browser CustomEvent seam.
// Integration policy: future API/CMS can replace V9_RECORDS without changing render contracts.