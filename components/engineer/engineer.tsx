"use client";

import { motion } from "framer-motion";
import { engineerSection } from "@/content/sections";
import { skillGroups } from "@/content/skills";
import { profile } from "@/content/profile";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";
import { SectionLabel } from "@/components/ui/section-label";
import { SectionTitle } from "@/components/ui/section-title";
import { TechChip } from "@/components/ui/tech-chip";

export function Engineer() {
  return (
    <section id="engineer" className="section-wrap relative overflow-hidden bg-deep">
      <div className="topology-grid absolute inset-0 z-0 opacity-20" />
      <div
        className="pointer-events-none absolute top-0 right-0 left-0 z-10 h-24"
        style={{ background: "linear-gradient(to bottom, #0D1117, transparent)" }}
      />
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-8 py-32 lg:px-16 xl:px-24">
        <div className="grid grid-cols-1 items-start gap-20 lg:grid-cols-2">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="flex flex-col gap-8"
          >
            <SectionLabel index={engineerSection.index} label={engineerSection.label} />
            <SectionTitle lines={engineerSection.title} />
            <div className="flex flex-col gap-5">
              {engineerSection.paragraphs.map((paragraph) => (
                <motion.p
                  key={paragraph}
                  variants={fadeUp}
                  className="max-w-prose text-base leading-relaxed"
                  style={{ color: "var(--text-body)" }}
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>
            <motion.div variants={fadeUp} className="flex items-center gap-3 pt-2">
              <span className="block h-px w-4 bg-green" />
              <span className="font-mono text-xs tracking-widest uppercase text-green/80">
                {profile.openToWork}
              </span>
            </motion.div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="flex flex-col gap-8 lg:pt-12"
          >
            {skillGroups.map((group) => (
              <motion.div key={group.category} variants={fadeUp} className="flex flex-col gap-3">
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted">
                  {group.category}
                </span>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <TechChip key={skill} name={skill} plain />
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      <div className="absolute right-8 bottom-0 left-8 z-10 h-px bg-border" />
    </section>
  );
}
