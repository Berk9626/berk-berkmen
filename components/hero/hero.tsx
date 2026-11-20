"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { profile } from "@/content/profile";
import { useScrollTo } from "@/components/providers";
import { fadeUp, slideInLeft, staggerContainer } from "@/lib/motion";

const NetworkScene = dynamic(() => import("@/components/hero/network-scene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-12 w-12 animate-pulse rounded-full border border-copper/20" />
    </div>
  ),
});

function Stat({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(() => (/^[\d.]+/.test(value) ? "0" : value));

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const match = value.match(/^([\d.]+)(.*)$/);
        if (!match) {
          setDisplay(value);
          return;
        }
        const target = Number.parseFloat(match[1]);
        const suffix = match[2];
        const decimals = match[1].includes(".") ? (match[1].split(".")[1]?.length ?? 0) : 0;
        const started = performance.now();
        const tick = (now: number) => {
          const progress = Math.min(1, (now - started) / 1200);
          const eased = 1 - (1 - progress) ** 3;
          setDisplay((target * eased).toFixed(decimals) + suffix);
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.15 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <div ref={ref} className="flex flex-col gap-1">
      <span className="font-mono text-2xl font-medium text-copper tabular-nums sm:text-3xl">{display}</span>
      <span className="font-mono text-[11px] tracking-widest uppercase text-muted">{label}</span>
    </div>
  );
}

export function Hero() {
  const { scrollTo } = useScrollTo();

  return (
    <section id="hero" className="relative w-full overflow-hidden">
      <div className="absolute inset-0 z-0 h-full w-full">
        <NetworkScene />
      </div>
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: "rgba(13, 17, 23, 0.78)" }}
      />
      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-[1440px] flex-col px-8 pt-[clamp(2.5rem,6vh,4.5rem)] lg:px-16 xl:px-24">
        <div className="flex w-full flex-1 flex-col justify-center lg:max-w-[52%]">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="flex flex-col"
            >
              <motion.div variants={fadeUp} className="mb-5 flex items-center gap-2 xl:mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green" />
                </span>
                <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-green/80">
                  {profile.availability}
                </span>
              </motion.div>
              <div className="mb-2 overflow-hidden">
                <motion.h1
                  variants={slideInLeft}
                  className="font-mono text-4xl leading-none font-medium sm:text-5xl [@media(min-height:900px)]:text-6xl"
                  style={{ color: "var(--text-primary)" }}
                >
                  {profile.nameLines[0]}
                </motion.h1>
              </div>
              <div className="mb-4 overflow-hidden xl:mb-5">
                <motion.h1
                  variants={slideInLeft}
                  transition={{ delay: 0.08 }}
                  className="font-mono text-4xl leading-none font-medium sm:text-5xl [@media(min-height:900px)]:text-6xl"
                  style={{ color: "var(--text-primary)" }}
                >
                  {profile.nameLines[1]}
                </motion.h1>
              </div>
              <motion.div variants={fadeUp} className="mb-2 flex items-center gap-3">
                <span className="block h-px w-8 bg-copper" />
                <span className="font-mono text-[11px] tracking-widest uppercase whitespace-nowrap text-copper sm:text-sm">
                  {profile.title}
                </span>
              </motion.div>
              <motion.p
                variants={fadeUp}
                className="font-mono text-[11px] tracking-[0.15em] uppercase whitespace-nowrap sm:text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                {profile.subtitle}
              </motion.p>
              <div id="hero-nav-slot" aria-hidden className="h-8" />
              <motion.p
                variants={fadeUp}
                className="max-w-md text-base leading-snug xl:text-lg xl:leading-relaxed"
                style={{ color: "var(--text-body)" }}
              >
                {profile.taglineLong}
              </motion.p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 1 }}
              className="mt-6 flex items-center gap-4 xl:mt-8"
            >
              <button
                type="button"
                onClick={() => scrollTo("contact")}
                className="group relative overflow-hidden border border-copper px-6 py-3 font-mono text-sm tracking-wider uppercase text-copper hover:text-deep"
                style={{ transition: "color 0.3s var(--ease-out)" }}
              >
                <span className="relative z-10">Contact</span>
                <span
                  className="absolute inset-0 translate-y-full bg-copper transition-transform duration-300 group-hover:translate-y-0"
                  style={{ transitionTimingFunction: "var(--ease-out)" }}
                />
              </button>
              <button
                type="button"
                onClick={() => scrollTo("systems")}
                className="border border-border px-6 py-3 font-mono text-sm tracking-wider uppercase text-text/60 transition-all duration-300 hover:border-text/30 hover:text-text/80"
              >
                View Systems
              </button>
            </motion.div>

          </div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="mt-6 grid w-full grid-cols-2 gap-x-8 pb-16 lg:mt-8 lg:max-w-[52%] lg:pb-6"
          >
            {profile.stats.slice(0, 2).map((stat) => (
              <motion.div key={stat.label} variants={fadeUp}>
                <Stat value={stat.value} label={stat.label} />
              </motion.div>
            ))}
          </motion.div>
      </div>
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-8 pt-4 pb-24 lg:px-16 lg:pt-6 xl:px-24">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid w-full grid-cols-2 gap-x-8 lg:max-w-[52%]"
        >
          {profile.stats.slice(2).map((stat) => (
            <motion.div key={stat.label} variants={fadeUp}>
              <Stat value={stat.value} label={stat.label} />
            </motion.div>
          ))}
        </motion.div>
      </div>
      <div
        className="pointer-events-none absolute right-0 bottom-0 left-0 z-10 h-16"
        style={{ background: "linear-gradient(to bottom, transparent, #0D1117)" }}
      />
      <div className="absolute top-[calc(100dvh-5rem)] right-[12%] z-10 flex flex-col items-center gap-2 opacity-40">
        <span className="font-mono text-[10px] tracking-widest uppercase text-text">scroll</span>
        <div className="h-12 w-px animate-pulse bg-gradient-to-b from-border to-transparent" />
      </div>
    </section>
  );
}
