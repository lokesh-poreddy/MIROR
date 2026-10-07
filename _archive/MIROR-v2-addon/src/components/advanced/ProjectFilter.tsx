"use client";

import { AnimatePresence, motion } from "motion/react";
import type { Project } from "@/data/projects";
import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/project-card";

export function ProjectFilter({ projects }: { projects: Project[] }) {
  const categories = ["All", ...Array.from(new Set(projects.map((item) => item.category)))];
  const [active, setActive] = useState("All");
  const visible = useMemo(() => active === "All" ? projects : projects.filter((item) => item.category === active), [active, projects]);

  return (
    <div className="miror-project-filter">
      <div className="miror-filter-pills" role="tablist" aria-label="Filter projects">
        {categories.map((category) => (
          <button key={category} type="button" role="tab" aria-selected={active === category} className={active === category ? "is-active" : ""} onClick={() => setActive(category)}>{category}</button>
        ))}
      </div>
      <motion.div className="miror-filter-grid" layout>
        <AnimatePresence mode="popLayout">
          {visible.map((project) => (
            <motion.div key={project.slug} layout initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: .35 }}>
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
