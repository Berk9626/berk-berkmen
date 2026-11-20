export type Accent = "copper" | "green" | "ice";

export type TechCategory = "backend" | "database" | "infra" | "ai" | "frontend";

export type Metric = {
  label: string;
  value: string;
};

export type TechItem = {
  name: string;
  category: TechCategory;
};

export type Project = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  role: string;
  period: string;
  url?: string;
  metrics: Metric[];
  tech: TechItem[];
  challenges: string[];
  category: string;
  accentColor: Accent;
};

export type SkillGroup = {
  category: string;
  skills: string[];
};

export type Principle = {
  index: string;
  title: string;
  mantra: string;
  body: string;
  tags: string[];
};

export type CapabilityStatus = "production" | "experimental";

export type Capability = {
  title: string;
  status: CapabilityStatus;
  body: string;
  tags: string[];
};

export type DiagramNode = {
  id: string;
  label: string;
  x: string;
  y: string;
  tone: "input" | "process" | "store" | "model" | "output";
};

export type PipelineNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  color: string;
  type: "producer" | "exchange" | "consumer" | "store" | "dlq";
};

export type TerminalLine = {
  delay: number;
  prefix: string;
  text: string;
  color: string;
};
