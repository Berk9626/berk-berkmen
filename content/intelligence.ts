import type { Capability, DiagramNode } from "@/lib/types";

/**
 * EXPERIENCE — replace these cards with intelligent systems Berk has built.
 * Remove the section later if this work is not part of the profile.
 */
export const capabilities: Capability[] = [
  {
    title: "RAG Pipeline Architecture",
    status: "production",
    body: "Retrieval-Augmented Generation systems connecting LLMs to proprietary knowledge bases. Embedding pipelines, vector store integrations, and context-window management for domain-specific applications.",
    tags: ["OpenAI API", "pgvector", "semantic search", "embeddings"],
  },
  {
    title: "Agent Orchestration",
    status: "production",
    body: "Multi-agent systems where specialized agents handle distinct tasks coordinated by an orchestrator. Built for customer support automation and internal tooling with function calling and tool use.",
    tags: ["OpenAI Assistants", "function calling", "tool use", "state machines"],
  },
  {
    title: "Local Model Inference",
    status: "experimental",
    body: "On-premise LLM deployment using Ollama for air-gapped environments. Evaluated Mistral, LLaMA, and Phi families for domain-specific tasks with GGUF quantization strategies.",
    tags: ["Ollama", "Mistral", "LLaMA 3", "GGUF", "quantization"],
  },
  {
    title: "AI-Integrated Backends",
    status: "production",
    body: "Designing .NET backend services that orchestrate AI workflows as first-class infrastructure. Streaming responses, async queuing for inference, and cost-aware routing between providers.",
    tags: ["Claude API", "OpenAI API", "async queuing", "streaming", "cost routing"],
  },
];

export const ragNodes: DiagramNode[] = [
  { id: "query", label: "User Query", x: "5%", y: "50%", tone: "input" },
  { id: "embed", label: "Embed Query", x: "25%", y: "50%", tone: "process" },
  { id: "store", label: "Vector Store", x: "45%", y: "20%", tone: "store" },
  { id: "retrieve", label: "Retrieve Docs", x: "45%", y: "50%", tone: "process" },
  { id: "context", label: "Build Context", x: "65%", y: "50%", tone: "process" },
  { id: "llm", label: "LLM", x: "80%", y: "50%", tone: "model" },
  { id: "response", label: "Response", x: "95%", y: "50%", tone: "output" },
];

export const ragEdges = [
  ["5%", "50%", "25%", "50%"],
  ["25%", "50%", "45%", "20%"],
  ["25%", "50%", "45%", "50%"],
  ["45%", "20%", "45%", "50%"],
  ["45%", "50%", "65%", "50%"],
  ["65%", "50%", "80%", "50%"],
  ["80%", "50%", "95%", "50%"],
] as const;

export const diagramLegend = [
  { tone: "border-green/50", label: "Input/Output" },
  { tone: "border-copper/50", label: "Processing" },
  { tone: "border-amber/60", label: "LLM" },
  { tone: "border-border", label: "Vector Store" },
] as const;
