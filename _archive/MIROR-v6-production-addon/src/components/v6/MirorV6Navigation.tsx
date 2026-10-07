"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { ChevronRight, Command, Menu, Search, X } from "lucide-react";
import { NAVIGATION, ROUTES, prefersReducedMotion, type SiteNavItem } from "@/lib/v6/miror-v6-contracts";

export interface MirorV6NavigationProps {
  announcement?: string;
  rightCtaLabel?: string;
  rightCtaHref?: string;
  initialMenuOpen?: boolean;
  children?: ReactNode;
}

type MenuState = { open: boolean; searchOpen: boolean; query: string };
type FocusTarget = HTMLElement | null;

const secondaryLinks = [
  { label: "Company", href: "/about", description: "Legacy, leadership and the people behind the work." },
  { label: "Capabilities", href: "/capabilities", description: "Execution disciplines and construction capabilities." },
  { label: "Our Work", href: "/work", description: "Projects presented as detailed case studies." },
  { label: "Quality & Safety", href: "/quality-safety", description: "Site discipline, quality and responsible delivery." },
  { label: "Careers", href: "/careers", description: "Opportunities for engineers, site teams and specialists." },
  { label: "Contact", href: "/contact", description: "Talk with the team about a project or requirement." },
];

const quickSearch = [
  { title: "HNSS Kuppam Branch Canal — Phase II", href: "/work/hnss-kuppam-branch-canal-phase-ii", type: "Project" },
  { title: "Revasa Là Valora", href: "/work/revasa-la-valora", type: "Project" },
  { title: "Civil Construction", href: "/capabilities#civil-construction", type: "Capability" },
  { title: "Infrastructure Execution", href: "/capabilities#infrastructure-execution", type: "Capability" },
  { title: "Careers", href: "/careers", type: "Corporate" },
  { title: "Start a Conversation", href: "/contact", type: "Contact" },
];

function useLockBody(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = original; };
  }, [locked]);
}

function useFocusTrap(active: boolean, containerRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!active) return;
    const node = containerRef.current;
    if (!node) return;
    const selector = [
      "a[href]", "button:not([disabled])", "textarea", "input", "select", "[tabindex]:not([tabindex=\"-1\"])"
    ].join(",");
    const getFocusable = () => Array.from(node.querySelectorAll<HTMLElement>(selector)).filter((item) => !item.hasAttribute("hidden"));
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const focusable = getFocusable();
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    node.addEventListener("keydown", onKey as unknown as EventListener);
    return () => node.removeEventListener("keydown", onKey as unknown as EventListener);
  }, [active, containerRef]);
}

function matchSearch(item: { title: string; description?: string; type?: string }, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return `${item.title} ${item.description ?? ""} ${item.type ?? ""}`.toLowerCase().includes(q);
}

function MenuLink({ item, index, onNavigate }: { item: SiteNavItem; index: number; onNavigate: () => void }) {
  return <a className="miror-nav-v6__menu-link" href={item.href} onClick={onNavigate} data-index={index}>
    <span className="miror-nav-v6__menu-number">{String(index + 1).padStart(2, "0")}</span>
    <span className="miror-nav-v6__menu-text"><strong>{item.label}</strong><small>{item.description}</small></span>
    <ChevronRight aria-hidden="true" size={22} />
  </a>;
}

export function MirorV6Navigation({ announcement = "Civil construction · infrastructure · execution", rightCtaLabel = "Start a project", rightCtaHref = ROUTES.contact, initialMenuOpen = false }: MirorV6NavigationProps) {
  const [state, setState] = useState<MenuState>({ open: initialMenuOpen, searchOpen: false, query: "" });
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const previousFocus = useRef<FocusTarget>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const prefersReduced = typeof window !== "undefined" ? prefersReducedMotion() : false;
  useLockBody(state.open);
  useFocusTrap(state.open, panelRef);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 30);
      if (!prefersReduced && y > lastScrollY && y > 160) setHidden(true);
      if (y < lastScrollY - 5 || y < 80) setHidden(false);
      setLastScrollY(y);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScrollY, prefersReduced]);

  useEffect(() => {
    if (state.open) {
      previousFocus.current = document.activeElement as FocusTarget;
      requestAnimationFrame(() => panelRef.current?.querySelector<HTMLElement>("button, a")?.focus());
    } else if (previousFocus.current) {
      previousFocus.current.focus();
      previousFocus.current = null;
    }
  }, [state.open]);

  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setState((current) => ({ ...current, open: false, searchOpen: false }));
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setState((current) => ({ ...current, open: true, searchOpen: true }));
        requestAnimationFrame(() => searchRef.current?.focus());
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const searchResults = useMemo(() => quickSearch.filter((item) => matchSearch(item, state.query)), [state.query]);
  const visibleLinks = useMemo(() => secondaryLinks.filter((item) => matchSearch(item, state.query)), [state.query]);

  function openMenu() { setState({ open: true, searchOpen: false, query: "" }); }
  function closeMenu() { setState({ open: false, searchOpen: false, query: "" }); }
  function toggleSearch() { setState((current) => ({ ...current, searchOpen: !current.searchOpen })); requestAnimationFrame(() => searchRef.current?.focus()); }
  function onMenuKey(event: React.KeyboardEvent<HTMLButtonElement>) { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openMenu(); } }
  function navigate() { closeMenu(); }

  return <>
    <header className={`miror-nav-v6 ${scrolled ? "is-scrolled" : ""} ${hidden ? "is-hidden" : ""}`}>
      <div className="miror-nav-v6__inner">
        <a className="miror-nav-v6__brand" href={ROUTES.home} aria-label="Miror Constructions home">
          <span className="miror-nav-v6__brand-mark">M</span><span className="miror-nav-v6__brand-word">MIROR</span>
        </a>
        <div className="miror-nav-v6__announcement" aria-label="Company discipline">{announcement}</div>
        <div className="miror-nav-v6__actions">
          <a href={rightCtaHref} className="miror-nav-v6__cta">{rightCtaLabel}<span>↗</span></a>
          <button className="miror-nav-v6__menu-button" aria-label="Open main menu" aria-expanded={state.open} onClick={openMenu} onKeyDown={onMenuKey}>
            <Menu size={22} strokeWidth={1.7} aria-hidden="true" /><span>Menu</span>
          </button>
        </div>
      </div>
    </header>

    <div className={`miror-nav-v6__overlay ${state.open ? "is-open" : ""}`} aria-hidden={!state.open}>
      <div className="miror-nav-v6__panel" ref={panelRef} role="dialog" aria-modal="true" aria-label="MIROR site menu">
        <div className="miror-nav-v6__panel-top">
          <a className="miror-nav-v6__panel-brand" href={ROUTES.home} onClick={navigate}>MIROR<span>.</span></a>
          <button className="miror-nav-v6__close" aria-label="Close main menu" onClick={closeMenu}><X size={25} aria-hidden="true" /><span>Close</span></button>
        </div>
        <div className="miror-nav-v6__panel-grid">
          <section className="miror-nav-v6__menu-column" aria-label="Main navigation">
            <p className="miror-nav-v6__eyebrow">Navigate</p>
            <nav>{NAVIGATION.map((item, index) => <MenuLink key={item.id} item={item} index={index} onNavigate={navigate} />)}</nav>
          </section>
          <aside className="miror-nav-v6__utility-column">
            <div className="miror-nav-v6__search-block">
              <div className="miror-nav-v6__search-heading"><span>Find</span><button aria-label="Toggle site search" onClick={toggleSearch}><Search size={18} /></button></div>
              {state.searchOpen && <div className="miror-nav-v6__search-input-wrap"><Command size={17} /><input ref={searchRef} value={state.query} onChange={(event) => setState((current) => ({ ...current, query: event.target.value }))} placeholder="Search projects, capabilities…" aria-label="Search site" /><kbd>⌘K</kbd></div>}
              {state.searchOpen && <div className="miror-nav-v6__results" role="listbox" aria-label="Search results">
                {searchResults.length === 0 && <p className="miror-nav-v6__no-results">No matching records.</p>}
                {searchResults.map((item) => <a key={item.href} href={item.href} onClick={navigate}><span>{item.type}</span><strong>{item.title}</strong></a>)}
              </div>}
            </div>
            <div className="miror-nav-v6__quick-links"><p className="miror-nav-v6__eyebrow">Quick links</p>{visibleLinks.map((item) => <a key={item.href} href={item.href} onClick={navigate}><span>{item.label}</span><small>{item.description}</small></a>)}</div>
            <div className="miror-nav-v6__panel-footer"><div><small>Registered Office</small><span>Ongole · Andhra Pradesh</span></div><div><small>Direct contact</small><a href={ROUTES.contact} onClick={navigate}>Send an enquiry ↗</a></div></div>
          </aside>
        </div>
      </div>
    </div>
  </>;
}

// Keyboard interaction helpers
export const NAV_KEYS = ["Escape", "Enter", " ", "Tab", "ArrowDown", "ArrowUp", "Home", "End"] as const;
export function navigationKeyIntent(key: string): "close" | "activate" | "next" | "previous" | "first" | "last" | "none" { 
  if (key === "Escape") return "close";
  if (key === "Enter" || key === " ") return "activate";
  if (key === "ArrowDown") return "next";
  if (key === "ArrowUp") return "previous";
  if (key === "Home") return "first";
  if (key === "End") return "last";
  return "none";
}

export function navigationItemsForSearch(query: string): SiteNavItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return NAVIGATION;
  return NAVIGATION.filter((item) => `${item.label} ${item.description}`.toLowerCase().includes(q));
}

export function navigationAnnouncement(scrolled: boolean): string { return scrolled ? "MIROR · Built with precision" : "Civil construction · infrastructure · execution"; }
export function navigationClass(scrolled: boolean, hidden: boolean): string { return ["miror-nav-v6", scrolled ? "is-scrolled" : "", hidden ? "is-hidden" : ""].filter(Boolean).join(" "); }
export function shouldHideNavigation(currentY: number, previousY: number, threshold = 160): boolean { return currentY > previousY && currentY > threshold; }
export function shouldShowNavigation(currentY: number, previousY: number): boolean { return currentY < previousY || currentY < 80; }


export function navPolicy001(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "about";
}

export function navPolicy002(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "capabilities";
}

export function navPolicy003(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "work";
}

export function navPolicy004(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "careers";
}

export function navPolicy005(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "quality";
}

export function navPolicy006(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "contact";
}

export function navPolicy007(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "about";
}

export function navPolicy008(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "capabilities";
}

export function navPolicy009(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "work";
}

export function navPolicy010(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "careers";
}

export function navPolicy011(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "quality";
}

export function navPolicy012(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "contact";
}

export function navPolicy013(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "about";
}

export function navPolicy014(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "capabilities";
}

export function navPolicy015(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "work";
}

export function navPolicy016(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "careers";
}

export function navPolicy017(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "quality";
}

export function navPolicy018(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "contact";
}

export function navPolicy019(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "about";
}

export function navPolicy020(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "capabilities";
}

export function navPolicy021(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "work";
}

export function navPolicy022(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "careers";
}

export function navPolicy023(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "quality";
}

export function navPolicy024(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "contact";
}

export function navPolicy025(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "about";
}

export function navPolicy026(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "capabilities";
}

export function navPolicy027(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "work";
}

export function navPolicy028(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "careers";
}

export function navPolicy029(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "quality";
}

export function navPolicy030(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "contact";
}

export function navPolicy031(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "about";
}

export function navPolicy032(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "capabilities";
}

export function navPolicy033(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "work";
}

export function navPolicy034(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "careers";
}

export function navPolicy035(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "quality";
}

export function navPolicy036(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "contact";
}

export function navPolicy037(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "about";
}

export function navPolicy038(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "capabilities";
}

export function navPolicy039(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "work";
}

export function navPolicy040(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "careers";
}

export function navPolicy041(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "quality";
}

export function navPolicy042(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "contact";
}

export function navPolicy043(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "about";
}

export function navPolicy044(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "capabilities";
}

export function navPolicy045(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "work";
}

export function navPolicy046(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "careers";
}

export function navPolicy047(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "quality";
}

export function navPolicy048(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "contact";
}

export function navPolicy049(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "about";
}

export function navPolicy050(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "capabilities";
}

export function navPolicy051(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "work";
}

export function navPolicy052(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "careers";
}

export function navPolicy053(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "quality";
}

export function navPolicy054(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "contact";
}

export function navPolicy055(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "about";
}

export function navPolicy056(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "capabilities";
}

export function navPolicy057(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "work";
}

export function navPolicy058(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "careers";
}

export function navPolicy059(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "quality";
}

export function navPolicy060(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "contact";
}

export function navPolicy061(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "about";
}

export function navPolicy062(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "capabilities";
}

export function navPolicy063(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "work";
}

export function navPolicy064(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "careers";
}

export function navPolicy065(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "quality";
}

export function navPolicy066(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "contact";
}

export function navPolicy067(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "about";
}

export function navPolicy068(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "capabilities";
}

export function navPolicy069(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "work";
}

export function navPolicy070(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "careers";
}

export function navPolicy071(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "quality";
}

export function navPolicy072(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "contact";
}

export function navPolicy073(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "about";
}

export function navPolicy074(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "capabilities";
}

export function navPolicy075(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "work";
}

export function navPolicy076(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "careers";
}

export function navPolicy077(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "quality";
}

export function navPolicy078(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "contact";
}

export function navPolicy079(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "about";
}

export function navPolicy080(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "capabilities";
}

export function navPolicy081(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "work";
}

export function navPolicy082(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "careers";
}

export function navPolicy083(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "quality";
}

export function navPolicy084(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "contact";
}

export function navPolicy085(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "about";
}

export function navPolicy086(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "capabilities";
}

export function navPolicy087(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "work";
}

export function navPolicy088(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "careers";
}

export function navPolicy089(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "quality";
}

export function navPolicy090(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "contact";
}

export function navPolicy091(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "about";
}

export function navPolicy092(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "capabilities";
}

export function navPolicy093(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "work";
}

export function navPolicy094(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "careers";
}

export function navPolicy095(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "quality";
}

export function navPolicy096(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "contact";
}

export function navPolicy097(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "about";
}

export function navPolicy098(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "capabilities";
}

export function navPolicy099(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "work";
}

export function navPolicy100(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "careers";
}

export function navPolicy101(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "quality";
}

export function navPolicy102(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "contact";
}

export function navPolicy103(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "about";
}

export function navPolicy104(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "capabilities";
}

export function navPolicy105(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "work";
}

export function navPolicy106(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "careers";
}

export function navPolicy107(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "quality";
}

export function navPolicy108(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "contact";
}

export function navPolicy109(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "about";
}

export function navPolicy110(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "capabilities";
}

export function navPolicy111(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "work";
}

export function navPolicy112(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "careers";
}

export function navPolicy113(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "quality";
}

export function navPolicy114(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "contact";
}

export function navPolicy115(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "about";
}

export function navPolicy116(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "capabilities";
}

export function navPolicy117(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "work";
}

export function navPolicy118(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "careers";
}

export function navPolicy119(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "quality";
}

export function navPolicy120(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "contact";
}

export function navPolicy121(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "about";
}

export function navPolicy122(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "capabilities";
}

export function navPolicy123(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "work";
}

export function navPolicy124(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "careers";
}

export function navPolicy125(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "quality";
}

export function navPolicy126(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "contact";
}

export function navPolicy127(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "about";
}

export function navPolicy128(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "capabilities";
}

export function navPolicy129(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "work";
}

export function navPolicy130(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "careers";
}

export function navPolicy131(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "quality";
}

export function navPolicy132(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "contact";
}

export function navPolicy133(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "about";
}

export function navPolicy134(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "capabilities";
}

export function navPolicy135(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "work";
}

export function navPolicy136(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "careers";
}

export function navPolicy137(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "quality";
}

export function navPolicy138(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "contact";
}

export function navPolicy139(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "about";
}

export function navPolicy140(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "capabilities";
}

export function navPolicy141(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "work";
}

export function navPolicy142(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "careers";
}

export function navPolicy143(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "quality";
}

export function navPolicy144(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "contact";
}

export function navPolicy145(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "about";
}

export function navPolicy146(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "capabilities";
}

export function navPolicy147(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "work";
}

export function navPolicy148(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "careers";
}

export function navPolicy149(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "quality";
}

export function navPolicy150(item: SiteNavItem, query = ""): boolean {
  const text = `${item.label} ${item.description} ${item.href}`.toLowerCase();
  const q = query.trim().toLowerCase();
  return !q || text.includes(q) || item.id === "contact";
}
