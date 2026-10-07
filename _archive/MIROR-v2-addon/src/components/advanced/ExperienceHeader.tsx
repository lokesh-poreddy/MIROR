"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useState } from "react";
import { FullScreenMenu } from "./FullScreenMenu";
import { ScrollProgress } from "./ScrollProgress";

export function ExperienceHeader() {
  const [open, setOpen] = useState(false);
  return <><ScrollProgress /><header className="miror-experience-header"><Link href="/" className="miror-experience-brand">MIROR<span>.</span></Link><div className="miror-experience-header__right"><span className="miror-live-dot" /> <span className="miror-header-status">Ongole · AP</span><button type="button" className="miror-menu-trigger" aria-expanded={open} onClick={() => setOpen(true)}><Menu size={20} /><span>Menu</span></button></div></header><FullScreenMenu open={open} onClose={() => setOpen(false)} /></>;
}
