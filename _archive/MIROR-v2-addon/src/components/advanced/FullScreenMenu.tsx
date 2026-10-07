"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { navItems } from "@/data/navigation";

export function FullScreenMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const reduce = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { onClose(); return; }
      if (event.key !== "Tab") return;
      const root = document.getElementById("miror-full-menu-dialog");
      if (!root) return;
      const focusables = Array.from(root.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, onClose]);

  return <AnimatePresence>{open && <motion.aside id="miror-full-menu-dialog" className="miror-full-menu" initial={reduce ? false : { clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} exit={reduce ? undefined : { clipPath: "inset(0 0 100% 0)" }} transition={{ duration: reduce ? 0 : .65, ease: [0.77, 0, 0.175, 1] }} aria-modal="true" role="dialog" aria-label="Miror site navigation">
    <div className="miror-full-menu__top"><span>MIROR / NAVIGATION</span><button ref={closeRef} type="button" onClick={onClose} aria-label="Close menu">Close <i aria-hidden="true" /></button></div>
    <div className="miror-full-menu__body">
      <div className="miror-full-menu__nav">{navItems.map((item, index) => <motion.div key={item.href} initial={reduce ? false : { y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: reduce ? 0 : .08 + index * .045 }}><Link href={item.href} onClick={onClose}><span>{item.eyebrow}</span><strong>{item.label}</strong><em>{item.description}</em></Link></motion.div>)}</div>
      <div className="miror-full-menu__aside"><p>Ongole · Andhra Pradesh</p><p>Construction / infrastructure / execution</p><div className="miror-menu-grid" /></div>
    </div>
  </motion.aside>}</AnimatePresence>;
}
