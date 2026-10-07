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

const groups = [
  { title: "Company", items: [
    ["About", "/about"], ["Legacy", "/about#legacy"], ["People", "/about/people"],
    ["Leadership", "/about/leadership"], ["Locations", "/locations"],
  ]},
  { title: "Work", items: [
    ["Capabilities", "/capabilities"], ["Our Work", "/work"], ["Engineering", "/engineering"],
    ["Quality & Safety", "/quality-safety"], ["Sustainability", "/sustainability"],
  ]},
  { title: "Connect", items: [
    ["Insights", "/insights"], ["Resources", "/resources"], ["Careers", "/careers"],
    ["Why Miror", "/why-miror"], ["Contact", "/contact"],
  ]},
] as const;

function active(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
}

export function SiteHeaderV12() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <header className="v12-header">
        <Link className="v12-brand" href="/" aria-label="Miror Constructions home">MIROR<span className="miror-registered">®</span></Link>
        <nav className="v12-nav" aria-label="Primary navigation">
          {primary.map((item) => <Link key={item.href} className={active(pathname, item.href) ? "is-active" : ""} href={item.href}>{item.label}</Link>)}
        </nav>
        <div className="v12-header-actions">
          <Link className="v12-header-contact" href="/contact">Contact</Link>
          <button className="v12-menu-button" type="button" aria-expanded={open} aria-controls="miror-v12-menu" onClick={() => setOpen((value) => !value)}>
            <span aria-hidden="true"><i/><i/></span>
            <strong>{open ? "Close" : "Menu"}</strong>
          </button>
        </div>
      </header>
      {open && (
        <div id="miror-v12-menu" className="v12-overlay" role="dialog" aria-modal="true" aria-label="Miror navigation">
          <div className="v12-overlay__head"><span>Explore Miror</span><button className="v12-overlay__close" type="button" onClick={() => setOpen(false)}>Close ×</button></div>
          <div className="v12-overlay__grid">
            {groups.map((group, gi) => (
              <section className="v12-overlay__group" key={group.title}>
                <span className="v12-kicker v12-kicker-light">0{gi + 1} / {group.title}</span>
                <nav aria-label={`${group.title} navigation`}>
                  {group.items.map(([label, href], index) => <Link key={href} href={href}><span>{String(index + 1).padStart(2,"0")}</span><strong>{label}</strong><em aria-hidden="true">↗</em></Link>)}
                </nav>
              </section>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
