"use client";

import { motion } from "framer-motion";
import { profile } from "@/content/profile";
import { contactSection } from "@/content/sections";
import { fadeUp, slideInLeft, staggerContainer, viewportOnce } from "@/lib/motion";
import { SectionLabel } from "@/components/ui/section-label";
import { CommandTerminal } from "@/components/contact/command-terminal";

export function Contact() {
  return (
    <section id="contact" className="section-wrap relative overflow-hidden bg-deep">
      <div className="topology-grid opacity-20" />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(232,112,42,0.04) 0%, transparent 70%)",
        }}
      />
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-8 lg:px-16 xl:px-24">
        <div className="grid grid-cols-1 items-start gap-20 lg:grid-cols-2">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="flex flex-col gap-8"
          >
            <SectionLabel index={contactSection.index} label={contactSection.label} animate={false} />
            <motion.h2
              variants={slideInLeft}
              className="font-mono text-4xl leading-tight font-medium xl:text-5xl"
              style={{ color: "var(--text-primary)" }}
            >
              {contactSection.title[0]}
              <br />
              <span className="text-copper">{contactSection.title[1]}</span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="max-w-md text-base leading-relaxed"
              style={{ color: "var(--text-body)" }}
            >
              {contactSection.intro}
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col gap-4">
              {profile.email ? (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-3 font-mono text-sm transition-colors duration-200 hover:text-copper"
                  style={{ color: "var(--text-body)" }}
                >
                  <span className="text-copper">→</span>
                  {profile.email}
                </a>
              ) : (
                <span
                  className="flex items-center gap-3 font-mono text-sm text-muted"
                >
                  <span className="text-copper">→</span>
                  email pending
                </span>
              )}
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 font-mono text-sm transition-colors duration-200 hover:text-ice"
                style={{ color: "var(--text-body)" }}
              >
                <span className="text-ice">→</span>
                {profile.github}
              </a>
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 font-mono text-sm transition-colors duration-200 hover:text-ice"
                style={{ color: "var(--text-body)" }}
              >
                <span className="text-ice">→</span>
                {profile.linkedin}
              </a>
            </motion.div>
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce}>
            <CommandTerminal />
          </motion.div>
        </div>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-24 flex items-center justify-between border-t border-border pt-8"
        >
          <span className="font-mono text-[11px] tracking-widest uppercase text-muted">
            {profile.nameShort}
          </span>
          <span className="font-mono text-[11px] tracking-widest uppercase text-muted">
            {profile.year} — Built with Next.js
          </span>
        </motion.div>
      </div>
    </section>
  );
}
