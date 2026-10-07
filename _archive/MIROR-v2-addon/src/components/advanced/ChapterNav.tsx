"use client";

import { useEffect, useState } from "react";

export function ChapterNav({ chapters }: { chapters: { id: string; label: string }[] }) {
  const [active, setActive] = useState(chapters[0]?.id ?? "");

  useEffect(() => {
    const nodes = chapters.map((chapter) => document.getElementById(chapter.id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver((entries) => {
      const current = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (current) setActive(current.target.id);
    }, { threshold: [0.2, 0.5, 0.8], rootMargin: "-20% 0px -55% 0px" });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [chapters]);

  return <nav className="miror-chapter-nav" aria-label="On this page">{chapters.map((chapter, index) => <a key={chapter.id} className={active === chapter.id ? "is-active" : ""} href={`#${chapter.id}`}><span>{String(index + 1).padStart(2, "0")}</span>{chapter.label}</a>)}</nav>;
}
