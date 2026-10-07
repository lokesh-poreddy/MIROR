"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function TextReveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <span className={`miror-text-reveal ${className}`}>
      <motion.span
        className="miror-text-reveal__inner"
        initial={reduce ? false : { y: "110%" }}
        whileInView={reduce ? undefined : { y: 0 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}
