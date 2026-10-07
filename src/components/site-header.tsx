"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const primary = [
  { label: "About", href: "/about" },
  { label: "Capabilities", href: "/capabilities" },
  { label: "Work", href: "/work" },
  { label: "Engineering", href: "/engineering" },
  { label: "Quality & Safety", href: "/quality-safety" },
];

const menuGroups = [
  {
    title: "Company",
    items: [
      { label: "About", href: "/about" },
      { label: "Legacy", href: "/about#legacy" },
      { label: "People", href: "/about/people" },
      { label: "Leadership", href: "/about/leadership" },
      { label: "Locations", href: "/locations" },
    ],
  },
  {
    title: "Work",
    items: [
      { label: "Capabilities", href: "/capabilities" },
      { label: "Our Work", href: "/work" },
      { label: "Engineering", href: "/engineering" },
      { label: "Quality & Safety", href: "/quality-safety" },
      { label: "Sustainability", href: "/sustainability" },
    ],
  },
  {
    title: "Connect",
    items: [
      { label: "Insights", href: "/insights" },
      { label: "Resources", href: "/resources" },
      { label: "Careers", href: "/careers" },
      { label: "Why Miror", href: "/why-miror" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

function activeFor(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <header className="miror-upgrade-header">
        <Link href="/" className="miror-upgrade-header__brand" aria-label="Miror home">
          MIROR<span>®</span>
        </Link>
        <nav className="miror-upgrade-header__nav" aria-label="Primary navigation">
          {primary.map((item) => (
            <Link key={item.href} href={item.href} className={activeFor(pathname, item.href) ? "is-active" : ""} aria-current={activeFor(pathname, item.href) ? "page" : undefined}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="miror-upgrade-header__actions">
          <Link className="miror-upgrade-header__contact" href="/contact">Contact</Link>
          <button className="miror-upgrade-header__menu" type="button" aria-expanded={open} aria-controls="miror-corporate-menu" onClick={() => setOpen((value) => !value)}>
            <span aria-hidden="true"><i /><i /></span>
            <strong>{open ? "Close" : "Menu"}</strong>
          </button>
        </div>
      </header>

      {open ? (
        <div id="miror-corporate-menu" className="miror-upgrade-menu" role="dialog" aria-modal="true" aria-label="Miror corporate navigation">
          <div className="miror-upgrade-menu__head">
            <span>Explore Miror</span>
            <button type="button" onClick={() => setOpen(false)}>Close ×</button>
          </div>
          <div className="miror-upgrade-menu__grid">
            {menuGroups.map((group, groupIndex) => (
              <section key={group.title} className="miror-upgrade-menu__group">
                <span className="miror-upgrade-kicker">0{groupIndex + 1} / {group.title}</span>
                <nav aria-label={`${group.title} navigation`}>
                  {group.items.map((item, index) => (
                    <Link key={item.href} href={item.href}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <strong>{item.label}</strong>
                      <em aria-hidden="true">↗</em>
                    </Link>
                  ))}
                </nav>
              </section>
            ))}
          </div>
          <div className="miror-upgrade-menu__footer">
            <span>Ongole · Andhra Pradesh</span>
            <span>Andhra Pradesh ↔ Telangana</span>
            <a href="mailto:p.lokeshreddy2005@gmail.com">p.lokeshreddy2005@gmail.com</a>
          </div>
        </div>
      ) : null}
    </>
  );
}
