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

export const V9_SECTION_NUMBER = "25";
export const V9_SECTION_TITLE = "FAQs";
export const V9_SECTION_DESCRIPTION = "A searchable, accessible FAQ surface with business questions routed to the supplied contact mailbox.";

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
    id: "what-work-does-miror-undertake?-01",
    title: "What work does Miror undertake? — overview",
    subtitle: "Client-confirmed content can replace this neutral module copy.",
    tag: "What work does Miror undertake?",
    note: "V9 configuration slot 01; replace with approved faqs content when available.",
    status: "ready",
    priority: 2,
    order: 1,
  },
  {
    id: "where-does-miror-operate?-02",
    title: "Where does Miror operate? — field practice",
    subtitle: "Use approved project/media evidence before publishing factual claims.",
    tag: "Where does Miror operate?",
    note: "V9 configuration slot 02; replace with approved faqs content when available.",
    status: "ready",
    priority: 3,
    order: 2,
  },
  {
    id: "can-we-discuss-a-new-project?-03",
    title: "Can we discuss a new project? — project readiness",
    subtitle: "Designed as a reusable corporate content unit.",
    tag: "Can we discuss a new project?",
    note: "V9 configuration slot 03; replace with approved faqs content when available.",
    status: "ready",
    priority: 4,
    order: 3,
  },
  {
    id: "can-drawings-or-project-briefs-be-shared?-04",
    title: "Can drawings or project briefs be shared? — learning note",
    subtitle: "Reserved for future CMS data wiring.",
    tag: "Can drawings or project briefs be shared?",
    note: "V9 configuration slot 04; replace with approved faqs content when available.",
    status: "ready",
    priority: 5,
    order: 4,
  },
  {
    id: "does-miror-work-with-principal-contractors?-05",
    title: "Does Miror work with principal contractors? — workflow",
    subtitle: "Use real photographs when approved; otherwise preserve the media placeholder.",
    tag: "Does Miror work with principal contractors?",
    note: "V9 configuration slot 05; replace with approved faqs content when available.",
    status: "ready",
    priority: 1,
    order: 5,
  },
  {
    id: "can-project-information-be-requested?-06",
    title: "Can project information be requested? — future update",
    subtitle: "Keep claims specific and evidence-led.",
    tag: "Can project information be requested?",
    note: "V9 configuration slot 06; replace with approved faqs content when available.",
    status: "ready",
    priority: 2,
    order: 6,
  },
  {
    id: "are-careers-open-now?-07",
    title: "Are careers open now? — overview",
    subtitle: "Avoid invented metrics, awards or certification statements.",
    tag: "Are careers open now?",
    note: "V9 configuration slot 07; replace with approved faqs content when available.",
    status: "ready",
    priority: 3,
    order: 7,
  },
  {
    id: "how-can-a-project-be-submitted?-08",
    title: "How can a project be submitted? — field practice",
    subtitle: "Accessible interaction should work without pointer input.",
    tag: "How can a project be submitted?",
    note: "V9 configuration slot 08; replace with approved faqs content when available.",
    status: "ready",
    priority: 4,
    order: 8,
  },
  {
    id: "what-work-does-miror-undertake?-09",
    title: "What work does Miror undertake? — project readiness",
    subtitle: "Respect reduced-motion preferences.",
    tag: "What work does Miror undertake?",
    note: "V9 configuration slot 09; replace with approved faqs content when available.",
    status: "ready",
    priority: 5,
    order: 9,
  },
  {
    id: "where-does-miror-operate?-10",
    title: "Where does Miror operate? — learning note",
    subtitle: "Keep layout usable on mobile.",
    tag: "Where does Miror operate?",
    note: "V9 configuration slot 10; replace with approved faqs content when available.",
    status: "ready",
    priority: 1,
    order: 10,
  },
  {
    id: "can-we-discuss-a-new-project?-11",
    title: "Can we discuss a new project? — workflow",
    subtitle: "Client-confirmed content can replace this neutral module copy.",
    tag: "Can we discuss a new project?",
    note: "V9 configuration slot 11; replace with approved faqs content when available.",
    status: "ready",
    priority: 2,
    order: 11,
  },
  {
    id: "can-drawings-or-project-briefs-be-shared?-12",
    title: "Can drawings or project briefs be shared? — future update",
    subtitle: "Use approved project/media evidence before publishing factual claims.",
    tag: "Can drawings or project briefs be shared?",
    note: "V9 configuration slot 12; replace with approved faqs content when available.",
    status: "ready",
    priority: 3,
    order: 12,
  },
  {
    id: "does-miror-work-with-principal-contractors?-13",
    title: "Does Miror work with principal contractors? — overview",
    subtitle: "Designed as a reusable corporate content unit.",
    tag: "Does Miror work with principal contractors?",
    note: "V9 configuration slot 13; replace with approved faqs content when available.",
    status: "ready",
    priority: 4,
    order: 13,
  },
  {
    id: "can-project-information-be-requested?-14",
    title: "Can project information be requested? — field practice",
    subtitle: "Reserved for future CMS data wiring.",
    tag: "Can project information be requested?",
    note: "V9 configuration slot 14; replace with approved faqs content when available.",
    status: "ready",
    priority: 5,
    order: 14,
  },
  {
    id: "are-careers-open-now?-15",
    title: "Are careers open now? — project readiness",
    subtitle: "Use real photographs when approved; otherwise preserve the media placeholder.",
    tag: "Are careers open now?",
    note: "V9 configuration slot 15; replace with approved faqs content when available.",
    status: "ready",
    priority: 1,
    order: 15,
  },
  {
    id: "how-can-a-project-be-submitted?-16",
    title: "How can a project be submitted? — learning note",
    subtitle: "Keep claims specific and evidence-led.",
    tag: "How can a project be submitted?",
    note: "V9 configuration slot 16; replace with approved faqs content when available.",
    status: "ready",
    priority: 2,
    order: 16,
  },
  {
    id: "what-work-does-miror-undertake?-17",
    title: "What work does Miror undertake? — workflow",
    subtitle: "Avoid invented metrics, awards or certification statements.",
    tag: "What work does Miror undertake?",
    note: "V9 configuration slot 17; replace with approved faqs content when available.",
    status: "ready",
    priority: 3,
    order: 17,
  },
  {
    id: "where-does-miror-operate?-18",
    title: "Where does Miror operate? — future update",
    subtitle: "Accessible interaction should work without pointer input.",
    tag: "Where does Miror operate?",
    note: "V9 configuration slot 18; replace with approved faqs content when available.",
    status: "ready",
    priority: 4,
    order: 18,
  },
  {
    id: "can-we-discuss-a-new-project?-19",
    title: "Can we discuss a new project? — overview",
    subtitle: "Respect reduced-motion preferences.",
    tag: "Can we discuss a new project?",
    note: "V9 configuration slot 19; replace with approved faqs content when available.",
    status: "ready",
    priority: 5,
    order: 19,
  },
  {
    id: "can-drawings-or-project-briefs-be-shared?-20",
    title: "Can drawings or project briefs be shared? — field practice",
    subtitle: "Keep layout usable on mobile.",
    tag: "Can drawings or project briefs be shared?",
    note: "V9 configuration slot 20; replace with approved faqs content when available.",
    status: "ready",
    priority: 1,
    order: 20,
  },
  {
    id: "does-miror-work-with-principal-contractors?-21",
    title: "Does Miror work with principal contractors? — project readiness",
    subtitle: "Client-confirmed content can replace this neutral module copy.",
    tag: "Does Miror work with principal contractors?",
    note: "V9 configuration slot 21; replace with approved faqs content when available.",
    status: "ready",
    priority: 2,
    order: 21,
  },
  {
    id: "can-project-information-be-requested?-22",
    title: "Can project information be requested? — learning note",
    subtitle: "Use approved project/media evidence before publishing factual claims.",
    tag: "Can project information be requested?",
    note: "V9 configuration slot 22; replace with approved faqs content when available.",
    status: "ready",
    priority: 3,
    order: 22,
  },
  {
    id: "are-careers-open-now?-23",
    title: "Are careers open now? — workflow",
    subtitle: "Designed as a reusable corporate content unit.",
    tag: "Are careers open now?",
    note: "V9 configuration slot 23; replace with approved faqs content when available.",
    status: "ready",
    priority: 4,
    order: 23,
  },
  {
    id: "how-can-a-project-be-submitted?-24",
    title: "How can a project be submitted? — future update",
    subtitle: "Reserved for future CMS data wiring.",
    tag: "How can a project be submitted?",
    note: "V9 configuration slot 24; replace with approved faqs content when available.",
    status: "ready",
    priority: 5,
    order: 24,
  },
  {
    id: "what-work-does-miror-undertake?-25",
    title: "What work does Miror undertake? — overview",
    subtitle: "Use real photographs when approved; otherwise preserve the media placeholder.",
    tag: "What work does Miror undertake?",
    note: "V9 configuration slot 25; replace with approved faqs content when available.",
    status: "ready",
    priority: 1,
    order: 25,
  },
  {
    id: "where-does-miror-operate?-26",
    title: "Where does Miror operate? — field practice",
    subtitle: "Keep claims specific and evidence-led.",
    tag: "Where does Miror operate?",
    note: "V9 configuration slot 26; replace with approved faqs content when available.",
    status: "ready",
    priority: 2,
    order: 26,
  },
  {
    id: "can-we-discuss-a-new-project?-27",
    title: "Can we discuss a new project? — project readiness",
    subtitle: "Avoid invented metrics, awards or certification statements.",
    tag: "Can we discuss a new project?",
    note: "V9 configuration slot 27; replace with approved faqs content when available.",
    status: "ready",
    priority: 3,
    order: 27,
  },
  {
    id: "can-drawings-or-project-briefs-be-shared?-28",
    title: "Can drawings or project briefs be shared? — learning note",
    subtitle: "Accessible interaction should work without pointer input.",
    tag: "Can drawings or project briefs be shared?",
    note: "V9 configuration slot 28; replace with approved faqs content when available.",
    status: "ready",
    priority: 4,
    order: 28,
  },
  {
    id: "does-miror-work-with-principal-contractors?-29",
    title: "Does Miror work with principal contractors? — workflow",
    subtitle: "Respect reduced-motion preferences.",
    tag: "Does Miror work with principal contractors?",
    note: "V9 configuration slot 29; replace with approved faqs content when available.",
    status: "ready",
    priority: 5,
    order: 29,
  },
  {
    id: "can-project-information-be-requested?-30",
    title: "Can project information be requested? — future update",
    subtitle: "Keep layout usable on mobile.",
    tag: "Can project information be requested?",
    note: "V9 configuration slot 30; replace with approved faqs content when available.",
    status: "ready",
    priority: 1,
    order: 30,
  },
  {
    id: "are-careers-open-now?-31",
    title: "Are careers open now? — overview",
    subtitle: "Client-confirmed content can replace this neutral module copy.",
    tag: "Are careers open now?",
    note: "V9 configuration slot 31; replace with approved faqs content when available.",
    status: "ready",
    priority: 2,
    order: 31,
  },
  {
    id: "how-can-a-project-be-submitted?-32",
    title: "How can a project be submitted? — field practice",
    subtitle: "Use approved project/media evidence before publishing factual claims.",
    tag: "How can a project be submitted?",
    note: "V9 configuration slot 32; replace with approved faqs content when available.",
    status: "ready",
    priority: 3,
    order: 32,
  },
  {
    id: "what-work-does-miror-undertake?-33",
    title: "What work does Miror undertake? — project readiness",
    subtitle: "Designed as a reusable corporate content unit.",
    tag: "What work does Miror undertake?",
    note: "V9 configuration slot 33; replace with approved faqs content when available.",
    status: "ready",
    priority: 4,
    order: 33,
  },
  {
    id: "where-does-miror-operate?-34",
    title: "Where does Miror operate? — learning note",
    subtitle: "Reserved for future CMS data wiring.",
    tag: "Where does Miror operate?",
    note: "V9 configuration slot 34; replace with approved faqs content when available.",
    status: "ready",
    priority: 5,
    order: 34,
  },
  {
    id: "can-we-discuss-a-new-project?-35",
    title: "Can we discuss a new project? — workflow",
    subtitle: "Use real photographs when approved; otherwise preserve the media placeholder.",
    tag: "Can we discuss a new project?",
    note: "V9 configuration slot 35; replace with approved faqs content when available.",
    status: "ready",
    priority: 1,
    order: 35,
  },
  {
    id: "can-drawings-or-project-briefs-be-shared?-36",
    title: "Can drawings or project briefs be shared? — future update",
    subtitle: "Keep claims specific and evidence-led.",
    tag: "Can drawings or project briefs be shared?",
    note: "V9 configuration slot 36; replace with approved faqs content when available.",
    status: "ready",
    priority: 2,
    order: 36,
  },
  {
    id: "does-miror-work-with-principal-contractors?-37",
    title: "Does Miror work with principal contractors? — overview",
    subtitle: "Avoid invented metrics, awards or certification statements.",
    tag: "Does Miror work with principal contractors?",
    note: "V9 configuration slot 37; replace with approved faqs content when available.",
    status: "ready",
    priority: 3,
    order: 37,
  },
  {
    id: "can-project-information-be-requested?-38",
    title: "Can project information be requested? — field practice",
    subtitle: "Accessible interaction should work without pointer input.",
    tag: "Can project information be requested?",
    note: "V9 configuration slot 38; replace with approved faqs content when available.",
    status: "ready",
    priority: 4,
    order: 38,
  },
  {
    id: "are-careers-open-now?-39",
    title: "Are careers open now? — project readiness",
    subtitle: "Respect reduced-motion preferences.",
    tag: "Are careers open now?",
    note: "V9 configuration slot 39; replace with approved faqs content when available.",
    status: "ready",
    priority: 5,
    order: 39,
  },
  {
    id: "how-can-a-project-be-submitted?-40",
    title: "How can a project be submitted? — learning note",
    subtitle: "Keep layout usable on mobile.",
    tag: "How can a project be submitted?",
    note: "V9 configuration slot 40; replace with approved faqs content when available.",
    status: "ready",
    priority: 1,
    order: 40,
  },
  {
    id: "what-work-does-miror-undertake?-41",
    title: "What work does Miror undertake? — workflow",
    subtitle: "Client-confirmed content can replace this neutral module copy.",
    tag: "What work does Miror undertake?",
    note: "V9 configuration slot 41; replace with approved faqs content when available.",
    status: "ready",
    priority: 2,
    order: 41,
  },
  {
    id: "where-does-miror-operate?-42",
    title: "Where does Miror operate? — future update",
    subtitle: "Use approved project/media evidence before publishing factual claims.",
    tag: "Where does Miror operate?",
    note: "V9 configuration slot 42; replace with approved faqs content when available.",
    status: "ready",
    priority: 3,
    order: 42,
  },
  {
    id: "can-we-discuss-a-new-project?-43",
    title: "Can we discuss a new project? — overview",
    subtitle: "Designed as a reusable corporate content unit.",
    tag: "Can we discuss a new project?",
    note: "V9 configuration slot 43; replace with approved faqs content when available.",
    status: "ready",
    priority: 4,
    order: 43,
  },
  {
    id: "can-drawings-or-project-briefs-be-shared?-44",
    title: "Can drawings or project briefs be shared? — field practice",
    subtitle: "Reserved for future CMS data wiring.",
    tag: "Can drawings or project briefs be shared?",
    note: "V9 configuration slot 44; replace with approved faqs content when available.",
    status: "ready",
    priority: 5,
    order: 44,
  },
  {
    id: "does-miror-work-with-principal-contractors?-45",
    title: "Does Miror work with principal contractors? — project readiness",
    subtitle: "Use real photographs when approved; otherwise preserve the media placeholder.",
    tag: "Does Miror work with principal contractors?",
    note: "V9 configuration slot 45; replace with approved faqs content when available.",
    status: "ready",
    priority: 1,
    order: 45,
  },
  {
    id: "can-project-information-be-requested?-46",
    title: "Can project information be requested? — learning note",
    subtitle: "Keep claims specific and evidence-led.",
    tag: "Can project information be requested?",
    note: "V9 configuration slot 46; replace with approved faqs content when available.",
    status: "ready",
    priority: 2,
    order: 46,
  },
  {
    id: "are-careers-open-now?-47",
    title: "Are careers open now? — workflow",
    subtitle: "Avoid invented metrics, awards or certification statements.",
    tag: "Are careers open now?",
    note: "V9 configuration slot 47; replace with approved faqs content when available.",
    status: "ready",
    priority: 3,
    order: 47,
  },
  {
    id: "how-can-a-project-be-submitted?-48",
    title: "How can a project be submitted? — future update",
    subtitle: "Accessible interaction should work without pointer input.",
    tag: "How can a project be submitted?",
    note: "V9 configuration slot 48; replace with approved faqs content when available.",
    status: "ready",
    priority: 4,
    order: 48,
  },
  {
    id: "what-work-does-miror-undertake?-49",
    title: "What work does Miror undertake? — overview",
    subtitle: "Respect reduced-motion preferences.",
    tag: "What work does Miror undertake?",
    note: "V9 configuration slot 49; replace with approved faqs content when available.",
    status: "ready",
    priority: 5,
    order: 49,
  },
  {
    id: "where-does-miror-operate?-50",
    title: "Where does Miror operate? — field practice",
    subtitle: "Keep layout usable on mobile.",
    tag: "Where does Miror operate?",
    note: "V9 configuration slot 50; replace with approved faqs content when available.",
    status: "ready",
    priority: 1,
    order: 50,
  },
  {
    id: "can-we-discuss-a-new-project?-51",
    title: "Can we discuss a new project? — project readiness",
    subtitle: "Client-confirmed content can replace this neutral module copy.",
    tag: "Can we discuss a new project?",
    note: "V9 configuration slot 51; replace with approved faqs content when available.",
    status: "ready",
    priority: 2,
    order: 51,
  },
  {
    id: "can-drawings-or-project-briefs-be-shared?-52",
    title: "Can drawings or project briefs be shared? — learning note",
    subtitle: "Use approved project/media evidence before publishing factual claims.",
    tag: "Can drawings or project briefs be shared?",
    note: "V9 configuration slot 52; replace with approved faqs content when available.",
    status: "ready",
    priority: 3,
    order: 52,
  },
  {
    id: "does-miror-work-with-principal-contractors?-53",
    title: "Does Miror work with principal contractors? — workflow",
    subtitle: "Designed as a reusable corporate content unit.",
    tag: "Does Miror work with principal contractors?",
    note: "V9 configuration slot 53; replace with approved faqs content when available.",
    status: "ready",
    priority: 4,
    order: 53,
  },
  {
    id: "can-project-information-be-requested?-54",
    title: "Can project information be requested? — future update",
    subtitle: "Reserved for future CMS data wiring.",
    tag: "Can project information be requested?",
    note: "V9 configuration slot 54; replace with approved faqs content when available.",
    status: "ready",
    priority: 5,
    order: 54,
  },
  {
    id: "are-careers-open-now?-55",
    title: "Are careers open now? — overview",
    subtitle: "Use real photographs when approved; otherwise preserve the media placeholder.",
    tag: "Are careers open now?",
    note: "V9 configuration slot 55; replace with approved faqs content when available.",
    status: "ready",
    priority: 1,
    order: 55,
  },
  {
    id: "how-can-a-project-be-submitted?-56",
    title: "How can a project be submitted? — field practice",
    subtitle: "Keep claims specific and evidence-led.",
    tag: "How can a project be submitted?",
    note: "V9 configuration slot 56; replace with approved faqs content when available.",
    status: "ready",
    priority: 2,
    order: 56,
  },
  {
    id: "what-work-does-miror-undertake?-57",
    title: "What work does Miror undertake? — project readiness",
    subtitle: "Avoid invented metrics, awards or certification statements.",
    tag: "What work does Miror undertake?",
    note: "V9 configuration slot 57; replace with approved faqs content when available.",
    status: "ready",
    priority: 3,
    order: 57,
  },
  {
    id: "where-does-miror-operate?-58",
    title: "Where does Miror operate? — learning note",
    subtitle: "Accessible interaction should work without pointer input.",
    tag: "Where does Miror operate?",
    note: "V9 configuration slot 58; replace with approved faqs content when available.",
    status: "ready",
    priority: 4,
    order: 58,
  },
  {
    id: "can-we-discuss-a-new-project?-59",
    title: "Can we discuss a new project? — workflow",
    subtitle: "Respect reduced-motion preferences.",
    tag: "Can we discuss a new project?",
    note: "V9 configuration slot 59; replace with approved faqs content when available.",
    status: "ready",
    priority: 5,
    order: 59,
  },
  {
    id: "can-drawings-or-project-briefs-be-shared?-60",
    title: "Can drawings or project briefs be shared? — future update",
    subtitle: "Keep layout usable on mobile.",
    tag: "Can drawings or project briefs be shared?",
    note: "V9 configuration slot 60; replace with approved faqs content when available.",
    status: "ready",
    priority: 1,
    order: 60,
  },
  {
    id: "does-miror-work-with-principal-contractors?-61",
    title: "Does Miror work with principal contractors? — overview",
    subtitle: "Client-confirmed content can replace this neutral module copy.",
    tag: "Does Miror work with principal contractors?",
    note: "V9 configuration slot 61; replace with approved faqs content when available.",
    status: "ready",
    priority: 2,
    order: 61,
  },
  {
    id: "can-project-information-be-requested?-62",
    title: "Can project information be requested? — field practice",
    subtitle: "Use approved project/media evidence before publishing factual claims.",
    tag: "Can project information be requested?",
    note: "V9 configuration slot 62; replace with approved faqs content when available.",
    status: "ready",
    priority: 3,
    order: 62,
  },
  {
    id: "are-careers-open-now?-63",
    title: "Are careers open now? — project readiness",
    subtitle: "Designed as a reusable corporate content unit.",
    tag: "Are careers open now?",
    note: "V9 configuration slot 63; replace with approved faqs content when available.",
    status: "ready",
    priority: 4,
    order: 63,
  },
  {
    id: "how-can-a-project-be-submitted?-64",
    title: "How can a project be submitted? — learning note",
    subtitle: "Reserved for future CMS data wiring.",
    tag: "How can a project be submitted?",
    note: "V9 configuration slot 64; replace with approved faqs content when available.",
    status: "ready",
    priority: 5,
    order: 64,
  },
  {
    id: "what-work-does-miror-undertake?-65",
    title: "What work does Miror undertake? — workflow",
    subtitle: "Use real photographs when approved; otherwise preserve the media placeholder.",
    tag: "What work does Miror undertake?",
    note: "V9 configuration slot 65; replace with approved faqs content when available.",
    status: "ready",
    priority: 1,
    order: 65,
  },
  {
    id: "where-does-miror-operate?-66",
    title: "Where does Miror operate? — future update",
    subtitle: "Keep claims specific and evidence-led.",
    tag: "Where does Miror operate?",
    note: "V9 configuration slot 66; replace with approved faqs content when available.",
    status: "ready",
    priority: 2,
    order: 66,
  },
  {
    id: "can-we-discuss-a-new-project?-67",
    title: "Can we discuss a new project? — overview",
    subtitle: "Avoid invented metrics, awards or certification statements.",
    tag: "Can we discuss a new project?",
    note: "V9 configuration slot 67; replace with approved faqs content when available.",
    status: "ready",
    priority: 3,
    order: 67,
  },
  {
    id: "can-drawings-or-project-briefs-be-shared?-68",
    title: "Can drawings or project briefs be shared? — field practice",
    subtitle: "Accessible interaction should work without pointer input.",
    tag: "Can drawings or project briefs be shared?",
    note: "V9 configuration slot 68; replace with approved faqs content when available.",
    status: "ready",
    priority: 4,
    order: 68,
  },
  {
    id: "does-miror-work-with-principal-contractors?-69",
    title: "Does Miror work with principal contractors? — project readiness",
    subtitle: "Respect reduced-motion preferences.",
    tag: "Does Miror work with principal contractors?",
    note: "V9 configuration slot 69; replace with approved faqs content when available.",
    status: "ready",
    priority: 5,
    order: 69,
  },
  {
    id: "can-project-information-be-requested?-70",
    title: "Can project information be requested? — learning note",
    subtitle: "Keep layout usable on mobile.",
    tag: "Can project information be requested?",
    note: "V9 configuration slot 70; replace with approved faqs content when available.",
    status: "ready",
    priority: 1,
    order: 70,
  },
  {
    id: "are-careers-open-now?-71",
    title: "Are careers open now? — workflow",
    subtitle: "Client-confirmed content can replace this neutral module copy.",
    tag: "Are careers open now?",
    note: "V9 configuration slot 71; replace with approved faqs content when available.",
    status: "ready",
    priority: 2,
    order: 71,
  },
  {
    id: "how-can-a-project-be-submitted?-72",
    title: "How can a project be submitted? — future update",
    subtitle: "Use approved project/media evidence before publishing factual claims.",
    tag: "How can a project be submitted?",
    note: "V9 configuration slot 72; replace with approved faqs content when available.",
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

export const MirorV9FaqConfig = {
  number: "25",
  title: "FAQs",
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