"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { sections } from "@/content/navigation";
import { useScrollTo } from "@/components/providers";
import { easeOut } from "@/lib/motion";
import { cn } from "@/lib/cn";

export function SideNav() {
  const { scrollTo } = useScrollTo();
  const frameRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState("hero");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), 1800);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { threshold: 0.4 },
    );

    for (const section of sections) {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const place = () => {
      const frame = frameRef.current;
      if (!frame) return;
      if (active !== "hero") {
        frame.style.top = "50%";
        frame.style.transform = "translateY(-50%)";
        return;
      }

      const slot = document.getElementById("hero-nav-slot");
      const first = frame.querySelector("button");
      if (!slot || !first) return;

      const slotRect = slot.getBoundingClientRect();
      const firstRect = first.getBoundingClientRect();
      const frameRect = frame.getBoundingClientRect();
      const next =
        frameRect.top +
        (slotRect.top + slotRect.height / 2) -
        (firstRect.top + firstRect.height / 2);

      frame.style.top = `${next}px`;
      frame.style.transform = "none";
    };

    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [active, visible]);

  return (
    <AnimatePresence>
      {visible ? (
        <div
          ref={frameRef}
          className="fixed left-8 z-50 hidden lg:block"
          style={{ top: "50%", transform: "translateY(-50%)" }}
        >
          <motion.nav
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: easeOut }}
            aria-label="Section navigation"
            className="flex flex-col gap-3"
          >
          {sections.map((section) => {
            const current = active === section.id;
            return (
              <button
                key={section.id}
                type="button"
                aria-label={`Navigate to ${section.label}`}
                onClick={() => scrollTo(section.id)}
                className={cn(
                  "group flex items-center gap-2 text-left transition-all duration-300",
                  current ? "opacity-100" : "opacity-30 hover:opacity-60",
                )}
              >
                <span
                  className={cn(
                    "block h-px transition-all duration-300",
                    current ? "w-6 bg-copper" : "w-2 bg-border group-hover:w-4",
                  )}
                />
                <span
                  className={cn(
                    "font-mono text-[10px] tracking-widest uppercase transition-all duration-300",
                    current ? "text-copper" : "text-text",
                  )}
                >
                  {current ? section.label : ""}
                </span>
              </button>
            );
            })}
          </motion.nav>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
