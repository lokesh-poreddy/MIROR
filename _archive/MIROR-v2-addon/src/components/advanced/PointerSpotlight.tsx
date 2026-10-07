"use client";

import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { useEffect } from "react";

export function PointerSpotlight() {
  const x = useSpring(useMotionValue(-200), { stiffness: 180, damping: 24 });
  const y = useSpring(useMotionValue(-200), { stiffness: 180, damping: 24 });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || window.matchMedia("(pointer: coarse)").matches) return;
    const move = (event: PointerEvent) => { x.set(event.clientX); y.set(event.clientY); };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [reduce, x, y]);

  if (reduce) return null;
  return <motion.div aria-hidden="true" className="miror-pointer-spotlight" style={{ left: x, top: y }} />;
}
