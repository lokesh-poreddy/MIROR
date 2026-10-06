"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const primary = [
  { label: "About", href: "/about" },
  { label: "Capabilities", href: "/capabilities" },
  { label: "Our Work", href: "/work" },
  { label: "Careers", href: "/careers" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="site-header">
        <Link href="/" className="brand" aria-label="Miror home">
          MIROR<span>.</span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {primary.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          className="menu-button"
          type="button"
          aria-expanded={open}
          aria-controls="global-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="menu-lines" aria-hidden="true">
            <i />
            <i />
          </span>
          <span>{open ? "Close" : "Menu"}</span>
        </button>
      </header>

      <div id="global-menu" className={`menu-overlay ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <div className="menu-overlay-inner">
          <p className="menu-kicker">Explore Miror</p>
          <nav className="menu-nav" aria-label="Expanded navigation">
            {[
              ...primary,
              { label: "Quality & Safety", href: "/quality-safety" },
              { label: "Contact", href: "/contact" },
            ].map((item, index) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.label}</strong>
              </Link>
            ))}
          </nav>
          <div className="menu-footer">
            <span>Ongole · Andhra Pradesh</span>
            <span>Construction · Infrastructure · Execution</span>
          </div>
        </div>
      </div>
    </>
  );
}
