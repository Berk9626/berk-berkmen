"use client";

import { motion } from "framer-motion";
import { labSection } from "@/content/sections";
import { fadeUp, viewportOnce } from "@/lib/motion";
import { SectionLabel } from "@/components/ui/section-label";
import { SectionTitle } from "@/components/ui/section-title";
import { EventPipeline } from "@/components/lab/event-pipeline";
import { MetricsTerminal } from "@/components/lab/metrics-terminal";

export function Lab() {
  return (
    <section id="lab" className="section-wrap relative overflow-hidden">
      <div className="topology-grid opacity-15" />
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-8 lg:px-16 xl:px-24">
        <div className="mb-16 flex flex-col gap-6">
          <SectionLabel index={labSection.index} label={labSection.label} />
          <SectionTitle lines={labSection.title} />
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="max-w-lg text-base leading-relaxed"
            style={{ color: "var(--text-body)" }}
          >
            {labSection.intro}
          </motion.p>
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="flex flex-col gap-3"
          >
            <span className="font-mono text-[10px] tracking-widest uppercase text-muted">
              Live — Event Pipeline
            </span>
            <EventPipeline />
          </motion.div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="flex flex-col gap-3"
          >
            <span className="font-mono text-[10px] tracking-widest uppercase text-muted">
              Runtime — Queue Metrics
            </span>
            <MetricsTerminal />
          </motion.div>
        </div>
      </div>
      <div className="absolute right-8 bottom-0 left-8 h-px bg-border" />
    </section>
  );
}
