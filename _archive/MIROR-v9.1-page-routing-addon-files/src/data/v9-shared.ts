/**
 * MIROR V9 shared contract layer.
 * This file is intentionally framework-light so the components can merge into
 * the V8/V6 foundation without imposing a second state-management system.
 */
export type MirorV9SectionKey =
  | "sustainability"
  | "people"
  | "leadership"
  | "careers"
  | "clients"
  | "locations"
  | "insights"
  | "resources"
  | "why"
  | "faq"
  | "contact"
  | "smart-contact"
  | "menu";

export type V9Approval = "pending" | "approved" | "restricted";
export type V9MediaKind = "image" | "video" | "cad" | "svg" | "document";
export type V9DeviceTier = "premium" | "balanced" | "fallback";
export type V9QueryKind = "general" | "project" | "career" | "document" | "partner";

export type V9Media = {
  id: string;
  kind: V9MediaKind;
  src?: string;
  alt: string;
  approval: V9Approval;
  placeholder: boolean;
};

export type V9MenuItem = {
  id: string;
  title: string;
  href: string;
  description: string;
  section: MirorV9SectionKey;
  priority: number;
};

export type V9Faq = {
  id: string;
  question: string;
  answer: string;
  mailSubject: string;
  tags: string[];
};

export const V9_MENU: V9MenuItem[] = [
  { id: "about", title: "About", href: "/about", description: "Legacy, company story and people.", section: "people", priority: 1 },
  { id: "capabilities", title: "Capabilities", href: "/capabilities", description: "Civil, infrastructure, structural and execution capabilities.", section: "sustainability", priority: 2 },
  { id: "work", title: "Our Work", href: "/work", description: "Selected construction and infrastructure projects.", section: "locations", priority: 3 },
  { id: "engineering", title: "Engineering", href: "/engineering", description: "CAD, 3D and technical visualization.", section: "insights", priority: 4 },
  { id: "quality", title: "Quality & Safety", href: "/quality-safety", description: "Execution discipline and site responsibility.", section: "sustainability", priority: 5 },
  { id: "people", title: "People", href: "/about/people", description: "Teams and future company updates.", section: "people", priority: 6 },
  { id: "careers", title: "Careers", href: "/careers", description: "Future opportunities with Miror.", section: "careers", priority: 7 },
  { id: "insights", title: "Insights", href: "/insights", description: "Learning, techniques and construction thinking.", section: "insights", priority: 8 },
  { id: "resources", title: "Resources", href: "/resources", description: "Company and project documents.", section: "resources", priority: 9 },
  { id: "contact", title: "Contact", href: "/contact", description: "Start a conversation about a project.", section: "contact", priority: 10 },
];

export const V9_FAQS: V9Faq[] = [
  { id: "work", question: "What kind of work does Miror undertake?", answer: "Miror's public-facing website is being structured around civil, infrastructure, structural, formwork and related construction execution. Final service wording should be approved by the company.", mailSubject: "Miror - Service Query", tags: ["services", "capabilities"] },
  { id: "locations", question: "Where does Miror operate?", answer: "The current website plan presents Andhra Pradesh and Telangana as the active geographic footprint, with expansion language kept future-facing.", mailSubject: "Miror - Location Query", tags: ["locations", "regions"] },
  { id: "project", question: "Can we discuss a new project?", answer: "Yes. Use the project enquiry flow or email the supplied company query mailbox so the team can review the request.", mailSubject: "Miror - New Project Query", tags: ["project", "contact"] },
  { id: "drawings", question: "Can technical drawings or project briefs be shared?", answer: "The contact architecture supports future document upload. The production implementation should add approved file limits, malware scanning and storage controls before launch.", mailSubject: "Miror - Technical Brief", tags: ["cad", "documents"] },
  { id: "partner", question: "Does Miror work with principal contractors and project partners?", answer: "Public project evidence shows contractor involvement in identified works. New relationship claims should be confirmed project by project.", mailSubject: "Miror - Partnership Query", tags: ["partners", "contracts"] },
  { id: "careers", question: "Are careers currently open?", answer: "The careers page is intentionally prepared as a future-update surface. Current vacancies should only be published after client confirmation.", mailSubject: "Miror - Career Query", tags: ["careers"] },
];

export const V9_QUERY_TYPES: Array<{ id: V9QueryKind; label: string; description: string; fields: string[] }> = [
  { id: "general", label: "General enquiry", description: "Company information or general contact.", fields: ["name","email","phone","message"] },
  { id: "project", label: "Project enquiry", description: "A new construction or infrastructure discussion.", fields: ["name","company","email","phone","location","projectType","message"] },
  { id: "career", label: "Career enquiry", description: "Future employment or talent-network interest.", fields: ["name","email","phone","discipline","message"] },
  { id: "document", label: "Document request", description: "Approved company or project information.", fields: ["name","email","document","message"] },
  { id: "partner", label: "Partnership enquiry", description: "Partner, supplier or contractor relationship.", fields: ["name","company","email","phone","partnershipType","message"] },
];

export function v9SafeMailto(subject: string, body: string) {
  const params = new URLSearchParams({ subject, body });
  return `mailto:p.lokeshreddy2005@gmail.com?${params.toString()}`;
}

export function v9Normalize(value: unknown) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}

export function v9ContainsRiskyClaim(text: string) {
  const riskyPatterns = [
    /best\s+in\s+class/i,
    /number\s*1/i,
    /market\s+leader/i,
    /100\+?\s*projects/i,
    /500\+?\s*projects/i,
    /iso\s*\d*/i,
    /certified\s+by/i,
    /award[-\s]?winning/i,
    /zero\s+accidents/i,
    /100%\s+safe/i,
    /carbon\s*neutral/i,
    /net[-\s]?zero/i,
  ];
  return riskyPatterns.some(pattern => pattern.test(text));
}

export function v9CanPublish(text: string, approval: V9Approval) {
  if (approval !== "approved") return false;
  if (!text.trim()) return false;
  if (v9ContainsRiskyClaim(text)) return false;
  return true;
}
export const V9_DEVICE_POLICY_01 = { width: 100, dpr: 2, webgl: false, video: true };
export const V9_DEVICE_POLICY_02 = { width: 200, dpr: 3, webgl: true, video: true };
export const V9_DEVICE_POLICY_03 = { width: 300, dpr: 1, webgl: false, video: false };
export const V9_DEVICE_POLICY_04 = { width: 400, dpr: 2, webgl: true, video: true };
export const V9_DEVICE_POLICY_05 = { width: 500, dpr: 3, webgl: false, video: true };
export const V9_DEVICE_POLICY_06 = { width: 600, dpr: 1, webgl: true, video: false };
export const V9_DEVICE_POLICY_07 = { width: 700, dpr: 2, webgl: false, video: true };
export const V9_DEVICE_POLICY_08 = { width: 800, dpr: 3, webgl: true, video: true };
export const V9_DEVICE_POLICY_09 = { width: 900, dpr: 1, webgl: false, video: false };
export const V9_DEVICE_POLICY_10 = { width: 1000, dpr: 2, webgl: true, video: true };
export const V9_DEVICE_POLICY_11 = { width: 1100, dpr: 3, webgl: false, video: true };
export const V9_DEVICE_POLICY_12 = { width: 1200, dpr: 1, webgl: true, video: false };
export const V9_DEVICE_POLICY_13 = { width: 1300, dpr: 2, webgl: false, video: true };
export const V9_DEVICE_POLICY_14 = { width: 1400, dpr: 3, webgl: true, video: true };
export const V9_DEVICE_POLICY_15 = { width: 1500, dpr: 1, webgl: false, video: false };
export const V9_DEVICE_POLICY_16 = { width: 1600, dpr: 2, webgl: true, video: true };
export const V9_DEVICE_POLICY_17 = { width: 1700, dpr: 3, webgl: false, video: true };
export const V9_DEVICE_POLICY_18 = { width: 1800, dpr: 1, webgl: true, video: false };
export const V9_DEVICE_POLICY_19 = { width: 1900, dpr: 2, webgl: false, video: true };
export const V9_DEVICE_POLICY_20 = { width: 2000, dpr: 3, webgl: true, video: true };
export const V9_DEVICE_POLICY_21 = { width: 2100, dpr: 1, webgl: false, video: false };
export const V9_DEVICE_POLICY_22 = { width: 2200, dpr: 2, webgl: true, video: true };
export const V9_DEVICE_POLICY_23 = { width: 2300, dpr: 3, webgl: false, video: true };
export const V9_DEVICE_POLICY_24 = { width: 2400, dpr: 1, webgl: true, video: false };
export const V9_DEVICE_POLICY_25 = { width: 2500, dpr: 2, webgl: false, video: true };
export const V9_DEVICE_POLICY_26 = { width: 2600, dpr: 3, webgl: true, video: true };
export const V9_DEVICE_POLICY_27 = { width: 2700, dpr: 1, webgl: false, video: false };
export const V9_DEVICE_POLICY_28 = { width: 2800, dpr: 2, webgl: true, video: true };
export const V9_DEVICE_POLICY_29 = { width: 2900, dpr: 3, webgl: false, video: true };
export const V9_DEVICE_POLICY_30 = { width: 3000, dpr: 1, webgl: true, video: false };
export const V9_DEVICE_POLICY_31 = { width: 3100, dpr: 2, webgl: false, video: true };
export const V9_DEVICE_POLICY_32 = { width: 3200, dpr: 3, webgl: true, video: true };
export const V9_DEVICE_POLICY_33 = { width: 3300, dpr: 1, webgl: false, video: false };
export const V9_DEVICE_POLICY_34 = { width: 3400, dpr: 2, webgl: true, video: true };
export const V9_DEVICE_POLICY_35 = { width: 3500, dpr: 3, webgl: false, video: true };
export const V9_DEVICE_POLICY_36 = { width: 3600, dpr: 1, webgl: true, video: false };
export const V9_DEVICE_POLICY_37 = { width: 3700, dpr: 2, webgl: false, video: true };
export const V9_DEVICE_POLICY_38 = { width: 3800, dpr: 3, webgl: true, video: true };
export const V9_DEVICE_POLICY_39 = { width: 3900, dpr: 1, webgl: false, video: false };
export const V9_DEVICE_POLICY_40 = { width: 4000, dpr: 2, webgl: true, video: true };
export const V9_DEVICE_POLICY_41 = { width: 4100, dpr: 3, webgl: false, video: true };
export const V9_DEVICE_POLICY_42 = { width: 4200, dpr: 1, webgl: true, video: false };
export const V9_DEVICE_POLICY_43 = { width: 4300, dpr: 2, webgl: false, video: true };
export const V9_DEVICE_POLICY_44 = { width: 4400, dpr: 3, webgl: true, video: true };
export const V9_DEVICE_POLICY_45 = { width: 4500, dpr: 1, webgl: false, video: false };
export const V9_DEVICE_POLICY_46 = { width: 4600, dpr: 2, webgl: true, video: true };
export const V9_DEVICE_POLICY_47 = { width: 4700, dpr: 3, webgl: false, video: true };
export const V9_DEVICE_POLICY_48 = { width: 4800, dpr: 1, webgl: true, video: false };
export const V9_DEVICE_POLICY_49 = { width: 4900, dpr: 2, webgl: false, video: true };
export const V9_DEVICE_POLICY_50 = { width: 5000, dpr: 3, webgl: true, video: true };
export const V9_DEVICE_POLICY_51 = { width: 5100, dpr: 1, webgl: false, video: false };
export const V9_DEVICE_POLICY_52 = { width: 5200, dpr: 2, webgl: true, video: true };
export const V9_DEVICE_POLICY_53 = { width: 5300, dpr: 3, webgl: false, video: true };
export const V9_DEVICE_POLICY_54 = { width: 5400, dpr: 1, webgl: true, video: false };
export const V9_DEVICE_POLICY_55 = { width: 5500, dpr: 2, webgl: false, video: true };
export const V9_DEVICE_POLICY_56 = { width: 5600, dpr: 3, webgl: true, video: true };
export const V9_DEVICE_POLICY_57 = { width: 5700, dpr: 1, webgl: false, video: false };
export const V9_DEVICE_POLICY_58 = { width: 5800, dpr: 2, webgl: true, video: true };
export const V9_DEVICE_POLICY_59 = { width: 5900, dpr: 3, webgl: false, video: true };
export const V9_DEVICE_POLICY_60 = { width: 6000, dpr: 1, webgl: true, video: false };
export const V9_DEVICE_POLICY_61 = { width: 6100, dpr: 2, webgl: false, video: true };
export const V9_DEVICE_POLICY_62 = { width: 6200, dpr: 3, webgl: true, video: true };
export const V9_DEVICE_POLICY_63 = { width: 6300, dpr: 1, webgl: false, video: false };
export const V9_DEVICE_POLICY_64 = { width: 6400, dpr: 2, webgl: true, video: true };
export const V9_DEVICE_POLICY_65 = { width: 6500, dpr: 3, webgl: false, video: true };
export const V9_DEVICE_POLICY_66 = { width: 6600, dpr: 1, webgl: true, video: false };
export const V9_DEVICE_POLICY_67 = { width: 6700, dpr: 2, webgl: false, video: true };
export const V9_DEVICE_POLICY_68 = { width: 6800, dpr: 3, webgl: true, video: true };
export const V9_DEVICE_POLICY_69 = { width: 6900, dpr: 1, webgl: false, video: false };
export const V9_DEVICE_POLICY_70 = { width: 7000, dpr: 2, webgl: true, video: true };
export const V9_DEVICE_POLICY_71 = { width: 7100, dpr: 3, webgl: false, video: true };
export const V9_DEVICE_POLICY_72 = { width: 7200, dpr: 1, webgl: true, video: false };
export const V9_DEVICE_POLICY_73 = { width: 7300, dpr: 2, webgl: false, video: true };
export const V9_DEVICE_POLICY_74 = { width: 7400, dpr: 3, webgl: true, video: true };
export const V9_DEVICE_POLICY_75 = { width: 7500, dpr: 1, webgl: false, video: false };
export const V9_DEVICE_POLICY_76 = { width: 7600, dpr: 2, webgl: true, video: true };
export const V9_DEVICE_POLICY_77 = { width: 7700, dpr: 3, webgl: false, video: true };
export const V9_DEVICE_POLICY_78 = { width: 7800, dpr: 1, webgl: true, video: false };
export const V9_DEVICE_POLICY_79 = { width: 7900, dpr: 2, webgl: false, video: true };
export const V9_DEVICE_POLICY_80 = { width: 8000, dpr: 3, webgl: true, video: true };
