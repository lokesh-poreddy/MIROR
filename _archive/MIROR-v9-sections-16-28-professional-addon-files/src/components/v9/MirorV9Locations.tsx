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

export const V9_SECTION_NUMBER = "21";
export const V9_SECTION_TITLE = "Locations";
export const V9_SECTION_DESCRIPTION = "A focused India footprint experience centered on Andhra Pradesh and Telangana.";

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
    id: "andhra-pradesh-01",
    title: "Andhra Pradesh — overview",
    subtitle: "Client-confirmed content can replace this neutral module copy.",
    tag: "Andhra Pradesh",
    note: "V9 configuration slot 01; replace with approved locations content when available.",
    status: "ready",
    priority: 2,
    order: 1,
  },
  {
    id: "telangana-02",
    title: "Telangana — field practice",
    subtitle: "Use approved project/media evidence before publishing factual claims.",
    tag: "Telangana",
    note: "V9 configuration slot 02; replace with approved locations content when available.",
    status: "ready",
    priority: 3,
    order: 2,
  },
  {
    id: "ongole-base-03",
    title: "Ongole base — project readiness",
    subtitle: "Designed as a reusable corporate content unit.",
    tag: "Ongole base",
    note: "V9 configuration slot 03; replace with approved locations content when available.",
    status: "ready",
    priority: 4,
    order: 3,
  },
  {
    id: "kuppam-region-04",
    title: "Kuppam region — learning note",
    subtitle: "Reserved for future CMS data wiring.",
    tag: "Kuppam region",
    note: "V9 configuration slot 04; replace with approved locations content when available.",
    status: "ready",
    priority: 5,
    order: 4,
  },
  {
    id: "palamaneru-region-05",
    title: "Palamaneru region — workflow",
    subtitle: "Use real photographs when approved; otherwise preserve the media placeholder.",
    tag: "Palamaneru region",
    note: "V9 configuration slot 05; replace with approved locations content when available.",
    status: "ready",
    priority: 1,
    order: 5,
  },
  {
    id: "hyderabad-region-06",
    title: "Hyderabad region — future update",
    subtitle: "Keep claims specific and evidence-led.",
    tag: "Hyderabad region",
    note: "V9 configuration slot 06; replace with approved locations content when available.",
    status: "ready",
    priority: 2,
    order: 6,
  },
  {
    id: "project-travel-07",
    title: "Project travel — overview",
    subtitle: "Avoid invented metrics, awards or certification statements.",
    tag: "Project travel",
    note: "V9 configuration slot 07; replace with approved locations content when available.",
    status: "ready",
    priority: 3,
    order: 7,
  },
  {
    id: "future-expansion-08",
    title: "Future expansion — field practice",
    subtitle: "Accessible interaction should work without pointer input.",
    tag: "Future expansion",
    note: "V9 configuration slot 08; replace with approved locations content when available.",
    status: "ready",
    priority: 4,
    order: 8,
  },
  {
    id: "andhra-pradesh-09",
    title: "Andhra Pradesh — project readiness",
    subtitle: "Respect reduced-motion preferences.",
    tag: "Andhra Pradesh",
    note: "V9 configuration slot 09; replace with approved locations content when available.",
    status: "ready",
    priority: 5,
    order: 9,
  },
  {
    id: "telangana-10",
    title: "Telangana — learning note",
    subtitle: "Keep layout usable on mobile.",
    tag: "Telangana",
    note: "V9 configuration slot 10; replace with approved locations content when available.",
    status: "ready",
    priority: 1,
    order: 10,
  },
  {
    id: "ongole-base-11",
    title: "Ongole base — workflow",
    subtitle: "Client-confirmed content can replace this neutral module copy.",
    tag: "Ongole base",
    note: "V9 configuration slot 11; replace with approved locations content when available.",
    status: "ready",
    priority: 2,
    order: 11,
  },
  {
    id: "kuppam-region-12",
    title: "Kuppam region — future update",
    subtitle: "Use approved project/media evidence before publishing factual claims.",
    tag: "Kuppam region",
    note: "V9 configuration slot 12; replace with approved locations content when available.",
    status: "ready",
    priority: 3,
    order: 12,
  },
  {
    id: "palamaneru-region-13",
    title: "Palamaneru region — overview",
    subtitle: "Designed as a reusable corporate content unit.",
    tag: "Palamaneru region",
    note: "V9 configuration slot 13; replace with approved locations content when available.",
    status: "ready",
    priority: 4,
    order: 13,
  },
  {
    id: "hyderabad-region-14",
    title: "Hyderabad region — field practice",
    subtitle: "Reserved for future CMS data wiring.",
    tag: "Hyderabad region",
    note: "V9 configuration slot 14; replace with approved locations content when available.",
    status: "ready",
    priority: 5,
    order: 14,
  },
  {
    id: "project-travel-15",
    title: "Project travel — project readiness",
    subtitle: "Use real photographs when approved; otherwise preserve the media placeholder.",
    tag: "Project travel",
    note: "V9 configuration slot 15; replace with approved locations content when available.",
    status: "ready",
    priority: 1,
    order: 15,
  },
  {
    id: "future-expansion-16",
    title: "Future expansion — learning note",
    subtitle: "Keep claims specific and evidence-led.",
    tag: "Future expansion",
    note: "V9 configuration slot 16; replace with approved locations content when available.",
    status: "ready",
    priority: 2,
    order: 16,
  },
  {
    id: "andhra-pradesh-17",
    title: "Andhra Pradesh — workflow",
    subtitle: "Avoid invented metrics, awards or certification statements.",
    tag: "Andhra Pradesh",
    note: "V9 configuration slot 17; replace with approved locations content when available.",
    status: "ready",
    priority: 3,
    order: 17,
  },
  {
    id: "telangana-18",
    title: "Telangana — future update",
    subtitle: "Accessible interaction should work without pointer input.",
    tag: "Telangana",
    note: "V9 configuration slot 18; replace with approved locations content when available.",
    status: "ready",
    priority: 4,
    order: 18,
  },
  {
    id: "ongole-base-19",
    title: "Ongole base — overview",
    subtitle: "Respect reduced-motion preferences.",
    tag: "Ongole base",
    note: "V9 configuration slot 19; replace with approved locations content when available.",
    status: "ready",
    priority: 5,
    order: 19,
  },
  {
    id: "kuppam-region-20",
    title: "Kuppam region — field practice",
    subtitle: "Keep layout usable on mobile.",
    tag: "Kuppam region",
    note: "V9 configuration slot 20; replace with approved locations content when available.",
    status: "ready",
    priority: 1,
    order: 20,
  },
  {
    id: "palamaneru-region-21",
    title: "Palamaneru region — project readiness",
    subtitle: "Client-confirmed content can replace this neutral module copy.",
    tag: "Palamaneru region",
    note: "V9 configuration slot 21; replace with approved locations content when available.",
    status: "ready",
    priority: 2,
    order: 21,
  },
  {
    id: "hyderabad-region-22",
    title: "Hyderabad region — learning note",
    subtitle: "Use approved project/media evidence before publishing factual claims.",
    tag: "Hyderabad region",
    note: "V9 configuration slot 22; replace with approved locations content when available.",
    status: "ready",
    priority: 3,
    order: 22,
  },
  {
    id: "project-travel-23",
    title: "Project travel — workflow",
    subtitle: "Designed as a reusable corporate content unit.",
    tag: "Project travel",
    note: "V9 configuration slot 23; replace with approved locations content when available.",
    status: "ready",
    priority: 4,
    order: 23,
  },
  {
    id: "future-expansion-24",
    title: "Future expansion — future update",
    subtitle: "Reserved for future CMS data wiring.",
    tag: "Future expansion",
    note: "V9 configuration slot 24; replace with approved locations content when available.",
    status: "ready",
    priority: 5,
    order: 24,
  },
  {
    id: "andhra-pradesh-25",
    title: "Andhra Pradesh — overview",
    subtitle: "Use real photographs when approved; otherwise preserve the media placeholder.",
    tag: "Andhra Pradesh",
    note: "V9 configuration slot 25; replace with approved locations content when available.",
    status: "ready",
    priority: 1,
    order: 25,
  },
  {
    id: "telangana-26",
    title: "Telangana — field practice",
    subtitle: "Keep claims specific and evidence-led.",
    tag: "Telangana",
    note: "V9 configuration slot 26; replace with approved locations content when available.",
    status: "ready",
    priority: 2,
    order: 26,
  },
  {
    id: "ongole-base-27",
    title: "Ongole base — project readiness",
    subtitle: "Avoid invented metrics, awards or certification statements.",
    tag: "Ongole base",
    note: "V9 configuration slot 27; replace with approved locations content when available.",
    status: "ready",
    priority: 3,
    order: 27,
  },
  {
    id: "kuppam-region-28",
    title: "Kuppam region — learning note",
    subtitle: "Accessible interaction should work without pointer input.",
    tag: "Kuppam region",
    note: "V9 configuration slot 28; replace with approved locations content when available.",
    status: "ready",
    priority: 4,
    order: 28,
  },
  {
    id: "palamaneru-region-29",
    title: "Palamaneru region — workflow",
    subtitle: "Respect reduced-motion preferences.",
    tag: "Palamaneru region",
    note: "V9 configuration slot 29; replace with approved locations content when available.",
    status: "ready",
    priority: 5,
    order: 29,
  },
  {
    id: "hyderabad-region-30",
    title: "Hyderabad region — future update",
    subtitle: "Keep layout usable on mobile.",
    tag: "Hyderabad region",
    note: "V9 configuration slot 30; replace with approved locations content when available.",
    status: "ready",
    priority: 1,
    order: 30,
  },
  {
    id: "project-travel-31",
    title: "Project travel — overview",
    subtitle: "Client-confirmed content can replace this neutral module copy.",
    tag: "Project travel",
    note: "V9 configuration slot 31; replace with approved locations content when available.",
    status: "ready",
    priority: 2,
    order: 31,
  },
  {
    id: "future-expansion-32",
    title: "Future expansion — field practice",
    subtitle: "Use approved project/media evidence before publishing factual claims.",
    tag: "Future expansion",
    note: "V9 configuration slot 32; replace with approved locations content when available.",
    status: "ready",
    priority: 3,
    order: 32,
  },
  {
    id: "andhra-pradesh-33",
    title: "Andhra Pradesh — project readiness",
    subtitle: "Designed as a reusable corporate content unit.",
    tag: "Andhra Pradesh",
    note: "V9 configuration slot 33; replace with approved locations content when available.",
    status: "ready",
    priority: 4,
    order: 33,
  },
  {
    id: "telangana-34",
    title: "Telangana — learning note",
    subtitle: "Reserved for future CMS data wiring.",
    tag: "Telangana",
    note: "V9 configuration slot 34; replace with approved locations content when available.",
    status: "ready",
    priority: 5,
    order: 34,
  },
  {
    id: "ongole-base-35",
    title: "Ongole base — workflow",
    subtitle: "Use real photographs when approved; otherwise preserve the media placeholder.",
    tag: "Ongole base",
    note: "V9 configuration slot 35; replace with approved locations content when available.",
    status: "ready",
    priority: 1,
    order: 35,
  },
  {
    id: "kuppam-region-36",
    title: "Kuppam region — future update",
    subtitle: "Keep claims specific and evidence-led.",
    tag: "Kuppam region",
    note: "V9 configuration slot 36; replace with approved locations content when available.",
    status: "ready",
    priority: 2,
    order: 36,
  },
  {
    id: "palamaneru-region-37",
    title: "Palamaneru region — overview",
    subtitle: "Avoid invented metrics, awards or certification statements.",
    tag: "Palamaneru region",
    note: "V9 configuration slot 37; replace with approved locations content when available.",
    status: "ready",
    priority: 3,
    order: 37,
  },
  {
    id: "hyderabad-region-38",
    title: "Hyderabad region — field practice",
    subtitle: "Accessible interaction should work without pointer input.",
    tag: "Hyderabad region",
    note: "V9 configuration slot 38; replace with approved locations content when available.",
    status: "ready",
    priority: 4,
    order: 38,
  },
  {
    id: "project-travel-39",
    title: "Project travel — project readiness",
    subtitle: "Respect reduced-motion preferences.",
    tag: "Project travel",
    note: "V9 configuration slot 39; replace with approved locations content when available.",
    status: "ready",
    priority: 5,
    order: 39,
  },
  {
    id: "future-expansion-40",
    title: "Future expansion — learning note",
    subtitle: "Keep layout usable on mobile.",
    tag: "Future expansion",
    note: "V9 configuration slot 40; replace with approved locations content when available.",
    status: "ready",
    priority: 1,
    order: 40,
  },
  {
    id: "andhra-pradesh-41",
    title: "Andhra Pradesh — workflow",
    subtitle: "Client-confirmed content can replace this neutral module copy.",
    tag: "Andhra Pradesh",
    note: "V9 configuration slot 41; replace with approved locations content when available.",
    status: "ready",
    priority: 2,
    order: 41,
  },
  {
    id: "telangana-42",
    title: "Telangana — future update",
    subtitle: "Use approved project/media evidence before publishing factual claims.",
    tag: "Telangana",
    note: "V9 configuration slot 42; replace with approved locations content when available.",
    status: "ready",
    priority: 3,
    order: 42,
  },
  {
    id: "ongole-base-43",
    title: "Ongole base — overview",
    subtitle: "Designed as a reusable corporate content unit.",
    tag: "Ongole base",
    note: "V9 configuration slot 43; replace with approved locations content when available.",
    status: "ready",
    priority: 4,
    order: 43,
  },
  {
    id: "kuppam-region-44",
    title: "Kuppam region — field practice",
    subtitle: "Reserved for future CMS data wiring.",
    tag: "Kuppam region",
    note: "V9 configuration slot 44; replace with approved locations content when available.",
    status: "ready",
    priority: 5,
    order: 44,
  },
  {
    id: "palamaneru-region-45",
    title: "Palamaneru region — project readiness",
    subtitle: "Use real photographs when approved; otherwise preserve the media placeholder.",
    tag: "Palamaneru region",
    note: "V9 configuration slot 45; replace with approved locations content when available.",
    status: "ready",
    priority: 1,
    order: 45,
  },
  {
    id: "hyderabad-region-46",
    title: "Hyderabad region — learning note",
    subtitle: "Keep claims specific and evidence-led.",
    tag: "Hyderabad region",
    note: "V9 configuration slot 46; replace with approved locations content when available.",
    status: "ready",
    priority: 2,
    order: 46,
  },
  {
    id: "project-travel-47",
    title: "Project travel — workflow",
    subtitle: "Avoid invented metrics, awards or certification statements.",
    tag: "Project travel",
    note: "V9 configuration slot 47; replace with approved locations content when available.",
    status: "ready",
    priority: 3,
    order: 47,
  },
  {
    id: "future-expansion-48",
    title: "Future expansion — future update",
    subtitle: "Accessible interaction should work without pointer input.",
    tag: "Future expansion",
    note: "V9 configuration slot 48; replace with approved locations content when available.",
    status: "ready",
    priority: 4,
    order: 48,
  },
  {
    id: "andhra-pradesh-49",
    title: "Andhra Pradesh — overview",
    subtitle: "Respect reduced-motion preferences.",
    tag: "Andhra Pradesh",
    note: "V9 configuration slot 49; replace with approved locations content when available.",
    status: "ready",
    priority: 5,
    order: 49,
  },
  {
    id: "telangana-50",
    title: "Telangana — field practice",
    subtitle: "Keep layout usable on mobile.",
    tag: "Telangana",
    note: "V9 configuration slot 50; replace with approved locations content when available.",
    status: "ready",
    priority: 1,
    order: 50,
  },
  {
    id: "ongole-base-51",
    title: "Ongole base — project readiness",
    subtitle: "Client-confirmed content can replace this neutral module copy.",
    tag: "Ongole base",
    note: "V9 configuration slot 51; replace with approved locations content when available.",
    status: "ready",
    priority: 2,
    order: 51,
  },
  {
    id: "kuppam-region-52",
    title: "Kuppam region — learning note",
    subtitle: "Use approved project/media evidence before publishing factual claims.",
    tag: "Kuppam region",
    note: "V9 configuration slot 52; replace with approved locations content when available.",
    status: "ready",
    priority: 3,
    order: 52,
  },
  {
    id: "palamaneru-region-53",
    title: "Palamaneru region — workflow",
    subtitle: "Designed as a reusable corporate content unit.",
    tag: "Palamaneru region",
    note: "V9 configuration slot 53; replace with approved locations content when available.",
    status: "ready",
    priority: 4,
    order: 53,
  },
  {
    id: "hyderabad-region-54",
    title: "Hyderabad region — future update",
    subtitle: "Reserved for future CMS data wiring.",
    tag: "Hyderabad region",
    note: "V9 configuration slot 54; replace with approved locations content when available.",
    status: "ready",
    priority: 5,
    order: 54,
  },
  {
    id: "project-travel-55",
    title: "Project travel — overview",
    subtitle: "Use real photographs when approved; otherwise preserve the media placeholder.",
    tag: "Project travel",
    note: "V9 configuration slot 55; replace with approved locations content when available.",
    status: "ready",
    priority: 1,
    order: 55,
  },
  {
    id: "future-expansion-56",
    title: "Future expansion — field practice",
    subtitle: "Keep claims specific and evidence-led.",
    tag: "Future expansion",
    note: "V9 configuration slot 56; replace with approved locations content when available.",
    status: "ready",
    priority: 2,
    order: 56,
  },
  {
    id: "andhra-pradesh-57",
    title: "Andhra Pradesh — project readiness",
    subtitle: "Avoid invented metrics, awards or certification statements.",
    tag: "Andhra Pradesh",
    note: "V9 configuration slot 57; replace with approved locations content when available.",
    status: "ready",
    priority: 3,
    order: 57,
  },
  {
    id: "telangana-58",
    title: "Telangana — learning note",
    subtitle: "Accessible interaction should work without pointer input.",
    tag: "Telangana",
    note: "V9 configuration slot 58; replace with approved locations content when available.",
    status: "ready",
    priority: 4,
    order: 58,
  },
  {
    id: "ongole-base-59",
    title: "Ongole base — workflow",
    subtitle: "Respect reduced-motion preferences.",
    tag: "Ongole base",
    note: "V9 configuration slot 59; replace with approved locations content when available.",
    status: "ready",
    priority: 5,
    order: 59,
  },
  {
    id: "kuppam-region-60",
    title: "Kuppam region — future update",
    subtitle: "Keep layout usable on mobile.",
    tag: "Kuppam region",
    note: "V9 configuration slot 60; replace with approved locations content when available.",
    status: "ready",
    priority: 1,
    order: 60,
  },
  {
    id: "palamaneru-region-61",
    title: "Palamaneru region — overview",
    subtitle: "Client-confirmed content can replace this neutral module copy.",
    tag: "Palamaneru region",
    note: "V9 configuration slot 61; replace with approved locations content when available.",
    status: "ready",
    priority: 2,
    order: 61,
  },
  {
    id: "hyderabad-region-62",
    title: "Hyderabad region — field practice",
    subtitle: "Use approved project/media evidence before publishing factual claims.",
    tag: "Hyderabad region",
    note: "V9 configuration slot 62; replace with approved locations content when available.",
    status: "ready",
    priority: 3,
    order: 62,
  },
  {
    id: "project-travel-63",
    title: "Project travel — project readiness",
    subtitle: "Designed as a reusable corporate content unit.",
    tag: "Project travel",
    note: "V9 configuration slot 63; replace with approved locations content when available.",
    status: "ready",
    priority: 4,
    order: 63,
  },
  {
    id: "future-expansion-64",
    title: "Future expansion — learning note",
    subtitle: "Reserved for future CMS data wiring.",
    tag: "Future expansion",
    note: "V9 configuration slot 64; replace with approved locations content when available.",
    status: "ready",
    priority: 5,
    order: 64,
  },
  {
    id: "andhra-pradesh-65",
    title: "Andhra Pradesh — workflow",
    subtitle: "Use real photographs when approved; otherwise preserve the media placeholder.",
    tag: "Andhra Pradesh",
    note: "V9 configuration slot 65; replace with approved locations content when available.",
    status: "ready",
    priority: 1,
    order: 65,
  },
  {
    id: "telangana-66",
    title: "Telangana — future update",
    subtitle: "Keep claims specific and evidence-led.",
    tag: "Telangana",
    note: "V9 configuration slot 66; replace with approved locations content when available.",
    status: "ready",
    priority: 2,
    order: 66,
  },
  {
    id: "ongole-base-67",
    title: "Ongole base — overview",
    subtitle: "Avoid invented metrics, awards or certification statements.",
    tag: "Ongole base",
    note: "V9 configuration slot 67; replace with approved locations content when available.",
    status: "ready",
    priority: 3,
    order: 67,
  },
  {
    id: "kuppam-region-68",
    title: "Kuppam region — field practice",
    subtitle: "Accessible interaction should work without pointer input.",
    tag: "Kuppam region",
    note: "V9 configuration slot 68; replace with approved locations content when available.",
    status: "ready",
    priority: 4,
    order: 68,
  },
  {
    id: "palamaneru-region-69",
    title: "Palamaneru region — project readiness",
    subtitle: "Respect reduced-motion preferences.",
    tag: "Palamaneru region",
    note: "V9 configuration slot 69; replace with approved locations content when available.",
    status: "ready",
    priority: 5,
    order: 69,
  },
  {
    id: "hyderabad-region-70",
    title: "Hyderabad region — learning note",
    subtitle: "Keep layout usable on mobile.",
    tag: "Hyderabad region",
    note: "V9 configuration slot 70; replace with approved locations content when available.",
    status: "ready",
    priority: 1,
    order: 70,
  },
  {
    id: "project-travel-71",
    title: "Project travel — workflow",
    subtitle: "Client-confirmed content can replace this neutral module copy.",
    tag: "Project travel",
    note: "V9 configuration slot 71; replace with approved locations content when available.",
    status: "ready",
    priority: 2,
    order: 71,
  },
  {
    id: "future-expansion-72",
    title: "Future expansion — future update",
    subtitle: "Use approved project/media evidence before publishing factual claims.",
    tag: "Future expansion",
    note: "V9 configuration slot 72; replace with approved locations content when available.",
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

export const MirorV9LocationsConfig = {
  number: "21",
  title: "Locations",
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