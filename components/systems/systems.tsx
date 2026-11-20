"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { projects } from "@/content/projects";
import { systemsSection } from "@/content/sections";
import type { Accent, Project } from "@/lib/types";
import { easeOut, fadeUp, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { SectionLabel } from "@/components/ui/section-label";
import { SectionTitle } from "@/components/ui/section-title";
import { TechChip } from "@/components/ui/tech-chip";

const accents: Record<Accent, { border: string; text: string; line: string }> = {
  copper: {
    border: "border-copper/20 hover:border-copper/50",
    text: "text-copper",
    line: "#E8702A",
  },
  green: {
    border: "border-green/20 hover:border-green/50",
    text: "text-green",
    line: "#39D353",
  },
  ice: {
    border: "border-ice/20 hover:border-ice/50",
    text: "text-ice",
    line: "#8AB4D4",
  },
};

function hostOf(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

function ProjectCard({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: (project: Project) => void;
}) {
  const accent = accents[project.accentColor];

  return (
    <motion.article
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      transition={{ duration: 0.7, ease: easeOut, delay: 0.1 * (index % 2) }}
      whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
      onClick={() => onOpen(project)}
      className={cn(
        "group relative flex cursor-pointer flex-col gap-5 border bg-surface p-7 transition-all duration-500 hover:bg-surface/80 hover:shadow-xl",
        accent.border,
      )}
    >
      <div className="flex items-center justify-between">
        <span className={cn("font-mono text-[10px] tracking-widest uppercase", accent.text)}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="font-mono text-[10px] tracking-widest uppercase text-muted">
          {project.category}
        </span>
      </div>
      <div>
        <h3
          className="font-mono text-xl font-medium transition-colors duration-300"
          style={{ color: "var(--text-secondary)" }}
        >
          {project.title}
        </h3>
        {project.url ? (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => event.stopPropagation()}
            className={cn(
              "font-mono text-[11px] opacity-70 transition-colors duration-200 hover:opacity-100",
              accent.text,
            )}
          >
            ({hostOf(project.url)})
          </a>
        ) : null}
        <p className="mt-1 font-mono text-sm" style={{ color: "var(--text-muted)" }}>
          {project.subtitle}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {project.metrics.slice(0, 2).map((metric, metricIndex) => (
          <div key={`${project.id}-${metricIndex}`}>
            <span className={cn("font-mono text-xl font-medium tabular-nums", accent.text)}>
              {metric.value}
            </span>
            <p className="mt-0.5 font-mono text-[10px] tracking-widest uppercase text-muted">
              {metric.label}
            </p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {project.tech.slice(0, 4).map((item) => (
          <TechChip key={item.name} name={item.name} category={item.category} />
        ))}
        {project.tech.length > 4 ? (
          <span className="self-center font-mono text-[10px] text-muted">
            +{project.tech.length - 4}
          </span>
        ) : null}
      </div>
      <div className="mt-auto flex items-center gap-2 border-t border-border/50 pt-2">
        <span className="font-mono text-[10px] tracking-widest uppercase text-muted">
          {project.period}
        </span>
        <div className="ml-auto font-mono text-[10px] tracking-widest uppercase text-muted opacity-0 transition-opacity group-hover:opacity-100">
          View details →
        </div>
      </div>
      <div
        className="absolute bottom-0 left-0 h-px w-0 transition-all duration-500 group-hover:w-full"
        style={{ background: accent.line }}
      />
    </motion.article>
  );
}

function ProjectPanel({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!project) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, project]);

  return (
    <AnimatePresence>
      {project ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
            style={{ background: "rgba(10, 13, 18, 0.7)" }}
          />
          <motion.div
            initial={{ opacity: 0, x: 48 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 48 }}
            transition={{ duration: 0.45, ease: easeOut }}
            className="glass-panel fixed inset-y-0 right-0 z-50 flex h-dvh w-[min(36rem,100vw)] flex-col gap-6 overflow-y-auto p-8"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 font-mono text-xs text-muted transition-colors hover:text-copper"
            >
              [ ESC ]
            </button>
            <div className="flex flex-col gap-3 pr-12">
              <span className="font-mono text-[10px] tracking-widest uppercase text-copper/60">
                {String(projects.indexOf(project) + 1).padStart(2, "0")} / {project.category}
              </span>
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="font-mono text-2xl font-medium" style={{ color: "var(--text-primary)" }}>
                    {project.title}
                  </h3>
                  {project.url ? (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[11px] text-copper/70 transition-colors hover:text-copper"
                    >
                      ({hostOf(project.url)})
                    </a>
                  ) : null}
                </div>
                <p className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                  {project.subtitle}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {project.metrics.map((metric, metricIndex) => (
                  <div key={`${project.id}-detail-${metricIndex}`} className="flex flex-col gap-1">
                    <span className="font-mono text-xl font-medium text-copper tabular-nums">
                      {metric.value}
                    </span>
                    <span className="font-mono text-[10px] tracking-widest uppercase text-muted">
                      {metric.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {project.description && project.description !== project.subtitle ? (
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-body)" }}>
                {project.description}
              </p>
            ) : null}
            {project.challenges.length > 0 ? (
              <ul className="flex flex-col gap-2">
                {project.challenges.map((challenge) => (
                  <li
                    key={challenge}
                    className="flex items-start gap-2 text-sm leading-snug"
                    style={{ color: "var(--text-body)" }}
                  >
                    <span className="mt-0.5 shrink-0 text-copper">→</span>
                    {challenge}
                  </li>
                ))}
              </ul>
            ) : null}
            {project.tech.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((item) => (
                  <TechChip
                    key={`${item.category}-${item.name}`}
                    name={item.name}
                    category={item.category}
                  />
                ))}
              </div>
            ) : null}
            {project.role || project.period ? (
              <div className="flex items-center gap-3 border-t border-border pt-2">
                {project.role ? (
                  <span className="font-mono text-[10px] tracking-widest uppercase text-muted">
                    {project.role}
                  </span>
                ) : null}
                {project.role && project.period ? (
                  <span className="block h-1 w-1 rounded-full bg-border" />
                ) : null}
                {project.period ? (
                  <span className="font-mono text-[10px] tracking-widest uppercase text-muted">
                    {project.period}
                  </span>
                ) : null}
              </div>
            ) : null}
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

export function Systems() {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <section id="systems" className="section-wrap relative overflow-hidden">
      <div className="topology-grid opacity-15" />
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-8 lg:px-16 xl:px-24">
        <div className="mb-16 flex flex-col gap-6">
          <SectionLabel index={systemsSection.index} label={systemsSection.label} />
          <SectionTitle lines={systemsSection.title} />
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="max-w-lg text-base leading-relaxed"
            style={{ color: "var(--text-body)" }}
          >
            {systemsSection.intro}
          </motion.p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} onOpen={setSelected} />
          ))}
        </div>
      </div>
      <ProjectPanel project={selected} onClose={() => setSelected(null)} />
      <div className="absolute right-8 bottom-0 left-8 h-px bg-border" />
    </section>
  );
}
