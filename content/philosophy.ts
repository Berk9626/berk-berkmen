import type { Principle } from "@/lib/types";

export const principles: Principle[] = [
  {
    index: "01",
    title: "Design for Scale Before Scale Arrives",
    mantra:
      "A design that is as understandable as possible, with details serving as elements that add variety to this simplicity.",
    body: "Technical debt is a constant in architectures that scale on demand. The infrastructural backbone established during the initial design phase — how data is partitioned, how state management is decoupled from services, and asynchronous data flow patterns — directly determines whether the system will withstand peak loads or fail.",
    tags: ["service boundaries", "stateless", "queues", "data ownership"],
  },
  {
    index: "02",
    title: "Failure Is a Feature, Not an Exception",
    mantra: "Errors are inherently part of the system; those that indicate persistence, however, are a major problem.",
    body: "Every software system that is designed will inevitably encounter issues. The real question is whether these issues are simple, fixable problems, or part of an ongoing chain of failures. Concepts such as bulkheads, circuit breakers, and graceful degradation help us determine whether a situation is a full-blown disaster or something that could have been prevented.",
    tags: ["timeouts", "safe retries", "queues", "isolation"],
  },
  {
    index: "03",
    title: "You Cannot Fix What You Cannot See",
    mantra: "Traces, metrics, and logs are essential for any piece of software.",
    body: "Observability is not a plugin to be integrated after going live; it is a design constraint that must be followed from day one. Structured logs, end-to-end distributed tracing, and RED metrics transform an opaque black box into a transparent and manageable system.",
    tags: ["latency", "error rate", "queue depth", "slow queries"],
  },
  {
    index: "04",
    title: "Complexity Is a Liability",
    mantra: "The best architecture is the one you can explain and design.",
    body: "The quality of a system is measured by how explainable and manageable it is. CQRS, microservice architecture, and event-driven structures are not a destination — they are methods. Every abstraction without a sound reason adds weight. A plain monolithic design on solid ground is stronger than a service mesh that has lost control and is full of blind spots.",
    tags: ["explainability", "cqrs", "event-driven", "monolith"],
  },
];
