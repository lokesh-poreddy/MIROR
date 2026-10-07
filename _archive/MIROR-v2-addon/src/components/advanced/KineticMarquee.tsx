"use client";

import { motion, useReducedMotion } from "motion/react";

export function KineticMarquee({ items }: { items: string[] }) {
  const reduce = useReducedMotion();
  const loop = [...items, ...items];
  return (
    <div className="miror-marquee" aria-label={items.join(", ")}>
      <motion.div className="miror-marquee__track" animate={reduce ? undefined : { x: ["0%", "-50%"] }} transition={reduce ? undefined : { duration: 24, repeat: Infinity, ease: "linear" }}>
        {loop.map((item, index) => <span key={`${item}-${index}`}>{item}<b aria-hidden="true">✦</b></span>)}
      </motion.div>
    </div>
  );
}
