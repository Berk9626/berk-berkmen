"use client";

import { useEffect, useRef, useState } from "react";
import { metricLines } from "@/content/lab";
import { cn } from "@/lib/cn";

export function MetricsTerminal() {
  const root = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    let timers: number[] = [];
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || timers.length > 0) return;
        timers = metricLines.map((line, index) =>
          window.setTimeout(() => setVisible(index + 1), line.delay),
        );
        observer.disconnect();
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      for (const timer of timers) window.clearTimeout(timer);
    };
  }, []);

  return (
    <div ref={root} className="w-full overflow-hidden border border-border bg-deep font-code text-sm">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-border" />
          <div className="h-3 w-3 rounded-full bg-border" />
          <div className="h-3 w-3 rounded-full bg-border" />
        </div>
        <span className="ml-2 font-mono text-[10px] tracking-widest uppercase text-muted">
          rabbitmq@commerce-node
        </span>
      </div>
      <div className="flex min-h-72 flex-col gap-1.5 p-5">
        {metricLines.slice(0, visible).map((line) => (
          <div key={`${line.delay}-${line.text}`} className="flex items-center">
            {line.prefix ? <span className="mr-1 text-copper">{line.prefix}</span> : null}
            <span className={cn("whitespace-pre", line.color)}>{line.text}</span>
          </div>
        ))}
        <div className="flex items-center">
          <span className="mr-1 text-copper">$ </span>
          <span className="inline-block h-4 w-2 animate-pulse bg-copper align-middle" />
        </div>
      </div>
    </div>
  );
}
