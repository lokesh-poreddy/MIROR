"use client";

import { motion, useReducedMotion } from "motion/react";

export function BlueprintField() {
  const reduce = useReducedMotion();
  return (
    <div className="miror-blueprint" aria-hidden="true">
      <svg viewBox="0 0 900 520" role="presentation">
        <defs>
          <pattern id="grid" width="36" height="36" patternUnits="userSpaceOnUse"><path d="M36 0H0V36" fill="none" stroke="currentColor" strokeOpacity=".13"/></pattern>
        </defs>
        <rect width="900" height="520" fill="url(#grid)" />
        <motion.path d="M60 410 L230 280 L385 330 L520 180 L710 250 L830 120" fill="none" stroke="currentColor" strokeWidth="2" initial={reduce ? false : { pathLength: 0, opacity: 0.2 }} whileInView={reduce ? undefined : { pathLength: 1, opacity: 0.72 }} viewport={{ once: true }} transition={{ duration: 2.2, ease: "easeInOut" }} />
        <motion.circle cx="520" cy="180" r="8" fill="currentColor" initial={reduce ? false : { scale: 0 }} whileInView={reduce ? undefined : { scale: 1 }} viewport={{ once: true }} transition={{ delay: .9, type: "spring", stiffness: 180 }} />
        <text x="60" y="70" fill="currentColor" fillOpacity=".55" fontSize="13" letterSpacing="4">STRUCTURE / SEQUENCE / PRECISION</text>
      </svg>
    </div>
  );
}
