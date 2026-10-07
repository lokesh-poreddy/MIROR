"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export function ParallaxMedia({ src, alt, priority = false }: { src: string; alt: string; priority?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-7%", "7%"]);
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.05, 1.05]);

  return (
    <div ref={ref} className="miror-parallax-frame">
      <motion.div className="miror-parallax-media" style={{ y, scale }}>
        <Image src={src} alt={alt} fill sizes="(max-width: 900px) 100vw, 60vw" priority={priority} />
      </motion.div>
    </div>
  );
}
