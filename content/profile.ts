import type { Metric } from "@/lib/types";

export const profile = {
  name: "Muzaffer Berk Berkmen",
  nameLines: ["Muzaffer Berk", "Berkmen"] as [string, string],
  nameShort: "M. Berk Berkmen",
  title: "Fullstack Software Engineer",
  subtitle: "Distributed Systems Architect",
  email: "berkberkmen12@gmail.com",
  github: "github.com/Berk9626",
  githubUrl: "https://github.com/Berk9626",
  linkedin: "linkedin.com/in/berkberkmen",
  linkedinUrl: "https://www.linkedin.com/in/berkberkmen/",
  availability: "Available for new roles",
  tagline: "Engineering software that holds up in production.",
  taglineLong:
    "I build software that stays reliable once it ships — clear boundaries, observable behavior, and systems made to last.",
  openToWork: "Open to Work",
  statusMessage: "Open to new roles. Happy to talk through the work.",
  terminalHost: "contact — berk@systems",
  year: "2026",
  stats: [
    { value: "2+", label: "Years Building" },
    { value: "2", label: "High-Traffic Platforms" },
    { value: "99.9%+", label: "Uptime SLA" },
    { value: "7+", label: "Production Projects" },
  ] satisfies Metric[],
};
