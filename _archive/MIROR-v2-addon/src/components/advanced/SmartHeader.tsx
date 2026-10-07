"use client";

import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";

export function SmartHeader({ children }: { children: React.ReactNode }) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() ?? current;
    if (Math.abs(current - previous) < 6) return;
    setHidden(current > previous && current > 100);
  });
  return <motion.div animate={{ y: hidden ? "-110%" : "0%" }} transition={{ duration: .34, ease: [0.22,1,0.36,1] }}>{children}</motion.div>;
}
