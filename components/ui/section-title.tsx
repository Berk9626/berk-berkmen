"use client";

import { motion } from "framer-motion";
import { slideInLeft, viewportOnce } from "@/lib/motion";

export function SectionTitle({
  lines,
  accentClass = "text-copper",
}: {
  lines: [string, string];
  accentClass?: string;
}) {
  return (
    <motion.h2
      variants={slideInLeft}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="font-mono text-4xl font-medium leading-tight xl:text-5xl"
      style={{ color: "var(--text-primary)" }}
    >
      {lines[0]}
      <br />
      <span className={accentClass}>{lines[1]}</span>
    </motion.h2>
  );
}
