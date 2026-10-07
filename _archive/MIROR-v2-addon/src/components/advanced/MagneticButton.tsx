"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { type MouseEvent, type ReactNode, useRef } from "react";

const spring = { stiffness: 260, damping: 18, mass: 0.2 };

type Props = { href: string; children: ReactNode; className?: string; strength?: number };

export function MagneticButton({ children, className = "", strength = 0.25, href }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, spring);
  const springY = useSpring(y, spring);

  function move(event: MouseEvent<HTMLAnchorElement>) {
    const element = ref.current;
    if (!element || window.matchMedia("(pointer: coarse)").matches) return;
    const rect = element.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  }

  function reset() { x.set(0); y.set(0); }

  return (
    <motion.a ref={ref} href={href} className={`miror-magnetic ${className}`} style={{ x: springX, y: springY }} onMouseMove={move} onMouseLeave={reset}>
      {children}
    </motion.a>
  );
}
