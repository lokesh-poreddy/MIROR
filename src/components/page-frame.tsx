import React, { ReactNode, useMemo } from "react";
import Link from "next/link";
import V9Menu from "./global-menu";
import type { V9MenuItem } from "@/data/v9-shared";

export type MirorPageSection = {
  id: string;
  label: string;
  eyebrow?: string;
  href?: string;
  status?: "live" | "update-soon" | "approval";
};

export type MirorRouteConfig = {
  path: string;
  title: string;
  shortTitle: string;
  number: string;
  description: string;
  eyebrow: string;
  category: string;
  parent?: string;
  heroMode: "editorial" | "technical" | "contact" | "archive";
  align: "left" | "center" | "split";
  tone: "paper" | "dark" | "technical";
  menuGroup: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  sections: MirorPageSection[];
};

type MirorPageFrameProps = {
  route: MirorRouteConfig;
  children: ReactNode;
  aside?: ReactNode;
};

const PAGE_STYLE = {
  shell: "miror-v9-page",
  hero: "miror-v9-page-hero",
  heroInner: "miror-v9-page-hero-inner",
  eyebrow: "miror-v9-page-eyebrow",
  title: "miror-v9-page-title",
  lead: "miror-v9-page-lead",
  actions: "miror-v9-page-actions",
  content: "miror-v9-page-content",
  container: "miror-v9-page-container",
  breadcrumb: "miror-v9-breadcrumb",
  index: "miror-v9-page-index",
  indexItem: "miror-v9-page-index-item",
  footer: "miror-v9-page-footer",
  footerGrid: "miror-v9-page-footer-grid",
  technical: "miror-v9-page-technical",
} as const;

function Breadcrumbs({ route }: { route: MirorRouteConfig }) {
  const items = useMemo(() => {
    const root = [{ label: "Home", href: "/" }];
    if (route.parent) root.push({ label: route.parent, href: route.parent.toLowerCase() === "about" ? "/about" : `/${route.parent.toLowerCase().replaceAll(" ", "-")}` });
    root.push({ label: route.shortTitle, href: route.path });
    return root;
  }, [route]);
  return (
    <nav className={PAGE_STYLE.breadcrumb} aria-label="Breadcrumb">
      {items.map((item, index) => (
        <React.Fragment key={`${item.href}-${item.label}`}>
          <Link href={item.href} aria-current={index === items.length - 1 ? "page" : undefined}>{item.label}</Link>
          {index < items.length - 1 ? <span aria-hidden="true">/</span> : null}
        </React.Fragment>
      ))}
    </nav>
  );
}

function HeroActions({ route }: { route: MirorRouteConfig }) {
  return (
    <div className={PAGE_STYLE.actions}>
      <Link className="miror-v9-button miror-v9-button-primary" href={route.primaryCta.href}>
        {route.primaryCta.label} <span aria-hidden="true">↗</span>
      </Link>
      {route.secondaryCta ? (
        <Link className="miror-v9-button" href={route.secondaryCta.href}>
          {route.secondaryCta.label}
        </Link>
      ) : null}
    </div>
  );
}

function SectionIndex({ route }: { route: MirorRouteConfig }) {
  return (
    <aside className={PAGE_STYLE.index} aria-label={`${route.shortTitle} section index`}>
      <div className="miror-v9-index-head">INDEX / {route.number}</div>
      <div className="miror-v9-index-list">
        {route.sections.map((section, index) => (
          <a key={section.id} className={PAGE_STYLE.indexItem} href={section.href ?? `#${section.id}`}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <span>{section.label}</span>
            <span className="miror-v9-index-status">{section.status === "update-soon" ? "Soon" : section.status === "approval" ? "Review" : "Open"}</span>
          </a>
        ))}
      </div>
    </aside>
  );
}

function TechnicalMeta({ route }: { route: MirorRouteConfig }) {
  return (
    <div className={PAGE_STYLE.technical} aria-label="Page technical metadata">
      <span>ROUTE {route.path}</span>
      <span>TYPE {route.heroMode.toUpperCase()}</span>
      <span>ALIGN {route.align.toUpperCase()}</span>
      <span>TONE {route.tone.toUpperCase()}</span>
    </div>
  );
}

function PageFooter() {
  const links = [
    { label: "About", href: "/about" },
    { label: "Capabilities", href: "/capabilities" },
    { label: "Our Work", href: "/work" },
    { label: "Engineering", href: "/engineering" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy", href: "/privacy" },
  ];
  return (
    <footer className={PAGE_STYLE.footer}>
      <div className={PAGE_STYLE.footerGrid}>
        <div>
          <div className="miror-v9-footer-brand">MIROR<span className="miror-registered">®</span></div>
          <p>Construction, infrastructure and engineering execution.</p>
        </div>
        <nav aria-label="Footer navigation">
          {links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
        </nav>
        <div>
          <span>Ongole · Andhra Pradesh</span>
          <a href="mailto:p.lokeshreddy2005@gmail.com">p.lokeshreddy2005@gmail.com</a>
        </div>
      </div>
      <div className="miror-v9-footer-rule">
        <span>© 2026 Miror Constructions & Consultancy</span>
        <span>Site architecture / V9.1</span>
      </div>
    </footer>
  );
}

export function MirorV9PageFrame({ route, children, aside }: MirorPageFrameProps) {
  return (
    <div className={`${PAGE_STYLE.shell} miror-v9-tone-${route.tone} miror-v9-align-${route.align}`}>
      <V9Menu />
      <header className={PAGE_STYLE.hero}>
        <div className={PAGE_STYLE.heroInner}>
          <Breadcrumbs route={route} />
          <div className={PAGE_STYLE.eyebrow}>{route.number} / {route.category}</div>
          <h1 className={PAGE_STYLE.title}>{route.title}</h1>
          <p className={PAGE_STYLE.lead}>{route.description}</p>
          <HeroActions route={route} />
          <TechnicalMeta route={route} />
        </div>
      </header>
      <div className={PAGE_STYLE.content}>
        <div className={PAGE_STYLE.container}>
          <SectionIndex route={route} />
          <div className="miror-v9-page-main">
            {children}
          </div>
          {aside}
        </div>
      </div>
      <PageFooter />
    </div>
  );
}

/**
 * Alignment contract:
 * - left: editorial/corporate pages use a wide text block with technical side rail.
 * - center: FAQ/resources/news hubs can use balanced content width.
 * - split: contact, careers and portfolio-adjacent pages combine text and action.
 *
 * The route configuration stays in data rather than scattering magic values
 * across page files. This makes global redesigns possible without editing
 * every route mount.
 */

export function routeToMenuItems(routes: MirorRouteConfig[]): V9MenuItem[] {
  return routes.map((route, index) => ({
    id: `v9-route-${index + 1}`,
    title: route.shortTitle,
    href: route.path,
    description: route.description,
    section: "insights",
    priority: index + 1,
  }));
}
