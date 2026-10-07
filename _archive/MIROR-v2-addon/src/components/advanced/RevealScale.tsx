"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function RevealScale({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  return <motion.div initial={reduce ? false : { opacity: 0, scale: .97, clipPath: "inset(0 0 12% 0)" }} whileInView={reduce ? undefined : { opacity: 1, scale: 1, clipPath: "inset(0 0 0% 0)" }} viewport={{ once: true, amount: .18 }} transition={{ duration: .9, ease: [0.22,1,0.36,1] }}>{children}</motion.div>;
}
