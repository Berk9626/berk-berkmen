"use client";

import { motion } from "framer-motion";
import {
  capabilities,
  diagramLegend,
  ragEdges,
  ragNodes,
} from "@/content/intelligence";
import { intelligenceSection } from "@/content/sections";
import { fadeUp, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { SectionLabel } from "@/components/ui/section-label";
import { SectionTitle } from "@/components/ui/section-title";

const nodeTones = {
  input: "border-green/50 text-green",
  process: "border-copper/50 text-copper",
  store: "border-border text-muted",
  model: "border-amber/60 text-amber",
  output: "border-ice/50 text-ice",
};

function RagDiagram() {
  return (
    <div className="border border-border bg-surface p-6">
      <div className="relative w-full overflow-x-auto">
        <div className="relative h-48 min-w-[640px]">
          <svg className="pointer-events-none absolute inset-0 h-full w-full">
            {ragEdges.map((edge, index) => (
              <g key={edge.join("-")}>
                <motion.line
                  x1={edge[0]}
                  y1={edge[1]}
                  x2={edge[2]}
                  y2={edge[3]}
                  stroke="#30363D"
                  strokeWidth={1}
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.15 * index }}
                />
                {index !== 1 ? (
                  <motion.circle
                    r={3}
                    fill="#E8702A"
                    initial={{ opacity: 0, cx: edge[0], cy: edge[1] }}
                    whileInView={{
                      opacity: [0, 1, 1, 0],
                      cx: [edge[0], edge[2]],
                      cy: [edge[1], edge[3]],
                    }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      delay: 0.2 * index + 1,
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 2,
                    }}
                  />
                ) : null}
              </g>
            ))}
          </svg>
          {ragNodes.map((node, index) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.12 * index }}
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 border bg-surface px-2.5 py-1.5 font-mono text-[10px] tracking-wider uppercase whitespace-nowrap",
                nodeTones[node.tone],
              )}
              style={{ left: node.x, top: node.y }}
            >
              {node.label}
            </motion.div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-4">
          {diagramLegend.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div className={cn("h-2 w-2 border", item.tone)} />
              <span className="font-mono text-[10px] tracking-wider uppercase text-muted">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Intelligence() {
  return (
    <section id="ai" className="section-wrap relative overflow-hidden bg-deep">
      <div className="topology-grid opacity-15" />
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-8 lg:px-16 xl:px-24">
        <div className="mb-16 flex flex-col gap-6">
          <SectionLabel index={intelligenceSection.index} label={intelligenceSection.label} />
          <SectionTitle lines={intelligenceSection.title} accentClass="text-amber" />
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="max-w-lg text-base leading-relaxed"
            style={{ color: "var(--text-body)" }}
          >
            {intelligenceSection.intro}
          </motion.p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {capabilities.map((capability, index) => (
            <motion.div
              key={capability.title + index}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              transition={{ delay: index * 0.08 }}
              className="group flex flex-col gap-4 border border-border bg-surface p-7 transition-all duration-500 hover:border-amber/30"
            >
              <div className="flex items-start justify-between gap-3">
                <h3
                  className="font-mono text-base font-medium transition-colors group-hover:text-amber"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {capability.title}
                </h3>
                <span
                  className={cn(
                    "inline-flex items-center rounded-sm border px-2 py-0.5 font-mono text-[10px] tracking-widest uppercase",
                    capability.status === "production"
                      ? "border-green/30 bg-green/5 text-green"
                      : "border-amber/30 bg-amber/5 text-amber",
                  )}
                >
                  {capability.status}
                </span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-body)" }}>
                {capability.body}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {capability.tags.map((tag, tagIndex) => (
                  <span
                    key={`${index}-${tagIndex}`}
                    className="border border-border/60 px-2 py-0.5 font-mono text-[10px] tracking-wider uppercase text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-20 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-copper/60">
              {intelligenceSection.diagramLabel}
            </span>
            <h3 className="font-mono text-xl font-medium" style={{ color: "var(--text-secondary)" }}>
              {intelligenceSection.diagramTitle}
            </h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {intelligenceSection.diagramBody}
            </p>
          </div>
          <RagDiagram />
        </div>
      </div>
      <div className="absolute right-8 bottom-0 left-8 h-px bg-border" />
    </section>
  );
}
