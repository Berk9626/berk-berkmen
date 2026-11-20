"use client";

import { motion } from "framer-motion";
import { principles } from "@/content/philosophy";
import { philosophySection } from "@/content/sections";
import { fadeUp, viewportOnce } from "@/lib/motion";
import { SectionLabel } from "@/components/ui/section-label";
import { SectionTitle } from "@/components/ui/section-title";

export function Philosophy() {
  return (
    <section id="philosophy" className="section-wrap relative overflow-hidden">
      <div className="topology-grid opacity-10" />
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-8 lg:px-16 xl:px-24">
        <div className="mb-16 flex flex-col gap-6">
          <SectionLabel index={philosophySection.index} label={philosophySection.label} />
          <SectionTitle lines={philosophySection.title} />
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="max-w-lg text-base leading-relaxed"
            style={{ color: "var(--text-body)" }}
          >
            {philosophySection.intro}
          </motion.p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {principles.map((principle, index) => (
            <motion.div
              key={principle.index}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              transition={{ delay: index * 0.08 }}
              className="group relative flex flex-col gap-4 border border-border p-8 transition-all duration-500 hover:border-copper/30"
              style={{ background: "linear-gradient(135deg, #161B22 0%, #0D1117 100%)" }}
            >
              <span className="font-mono text-[11px] tracking-widest text-copper/60">
                {principle.index}
              </span>
              <h3
                className="font-mono text-xl leading-snug font-medium transition-colors duration-300 group-hover:text-copper"
                style={{ color: "var(--text-secondary)" }}
              >
                {principle.title}
              </h3>
              <p className="font-mono text-sm italic" style={{ color: "var(--text-muted)" }}>
                {principle.mantra}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-body)" }}>
                {principle.body}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {principle.tags.map((tag, tagIndex) => (
                  <span
                    key={`${principle.index}-${tagIndex}`}
                    className="border border-border px-2 py-0.5 font-mono text-[10px] tracking-wider uppercase text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="absolute bottom-0 left-0 h-px w-0 bg-copper transition-all duration-500 group-hover:w-full" />
            </motion.div>
          ))}
        </div>
      </div>
      <div className="absolute right-8 bottom-0 left-8 h-px bg-border" />
    </section>
  );
}
