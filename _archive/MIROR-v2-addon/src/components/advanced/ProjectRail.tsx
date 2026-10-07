"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import type { Project } from "@/data/projects";

export function ProjectRail({ projects }: { projects: Project[] }) {
  const reduce = useReducedMotion();
  return (
    <div className="miror-rail" data-cursor-zone="rail">
      {projects.map((project, index) => (
        <motion.article key={project.slug} className="miror-rail-card" initial={reduce ? false : { opacity: 0, y: 30 }} whileInView={reduce ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ delay: index * .07, duration: .65 }}>
          <Link href={`/work/${project.slug}`} className="miror-rail-card__image">
            <Image src={project.media ?? "/placeholder.svg"} alt="" fill sizes="(max-width: 700px) 86vw, 42vw" />
            <span className="miror-rail-card__index">{String(index + 1).padStart(2, "0")}</span>
            <span className="miror-rail-card__open">View case study ↗</span>
          </Link>
          <div className="miror-rail-card__meta"><p>{project.category}</p><h3>{project.title}</h3>{project.location && <span>{project.location}</span>}</div>
        </motion.article>
      ))}
    </div>
  );
}
