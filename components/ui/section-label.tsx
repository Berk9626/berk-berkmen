"use client";

import { motion } from "framer-motion";
import { clipReveal, viewportOnce } from "@/lib/motion";

export function SectionLabel({
  index,
  label,
  animate = true,
}: {
  index: string;
  label: string;
  animate?: boolean;
}) {
  const content = (
    <div className="flex items-center gap-3">
      <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-copper opacity-80">
        {index}
      </span>
      <span className="block h-px w-8 bg-border" />
      <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted">
        {label}
      </span>
    </div>
  );

  if (!animate) return content;

  return (
    <motion.div
      variants={clipReveal}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      {content}
    </motion.div>
  );
}
