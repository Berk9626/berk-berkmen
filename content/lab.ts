import type { PipelineNode, TerminalLine } from "@/lib/types";

export const pipelineNodes: PipelineNode[] = [
  { id: "order-api", label: "Order API", x: 0.08, y: 0.42, color: "#E8702A", type: "producer" },
  { id: "exchange", label: "Exchange", x: 0.33, y: 0.42, color: "#E6EDF3", type: "exchange" },
  { id: "stock-svc", label: "Stock Svc", x: 0.62, y: 0.14, color: "#39D353", type: "consumer" },
  { id: "payment-svc", label: "Payment", x: 0.62, y: 0.42, color: "#39D353", type: "consumer" },
  { id: "sap-conn", label: "SAP Conn", x: 0.62, y: 0.7, color: "#39D353", type: "consumer" },
  { id: "mssql-a", label: "MSSQL", x: 0.87, y: 0.14, color: "#8AB4D4", type: "store" },
  { id: "mssql-b", label: "MSSQL", x: 0.87, y: 0.42, color: "#8AB4D4", type: "store" },
  { id: "sap", label: "SAP", x: 0.87, y: 0.7, color: "#8AB4D4", type: "store" },
  { id: "dlq", label: "Dead-letter", x: 0.33, y: 0.82, color: "#F0A500", type: "dlq" },
];

export const pipelineRoutes = [
  { consumer: "stock-svc", store: "mssql-a" },
  { consumer: "payment-svc", store: "mssql-b" },
  { consumer: "sap-conn", store: "sap" },
] as const;

export const pipelineEdges = [
  ["order-api", "exchange"],
  ["exchange", "stock-svc"],
  ["exchange", "payment-svc"],
  ["exchange", "sap-conn"],
  ["stock-svc", "mssql-a"],
  ["payment-svc", "mssql-b"],
  ["sap-conn", "sap"],
  ["exchange", "dlq"],
] as const;

export const metricLines: TerminalLine[] = [
  { delay: 0, prefix: "$ ", text: "rabbitmqctl list_queues name messages consumers", color: "text-text/70" },
  { delay: 700, prefix: "", text: "  order.stock.reserve     0    2", color: "text-green" },
  { delay: 850, prefix: "", text: "  order.payment.process   1    1", color: "text-green" },
  { delay: 1000, prefix: "", text: "  order.sap.sync          0    1", color: "text-green" },
  { delay: 1150, prefix: "", text: "  order.deadletter        0    0", color: "text-muted" },
  { delay: 1400, prefix: "$ ", text: "dotnet-counters monitor --counters commerce.order", color: "text-text/70" },
  { delay: 2000, prefix: "", text: "  Orders Processed/sec    127", color: "text-copper" },
  { delay: 2150, prefix: "", text: "  Retry Rate (%)          0.3", color: "text-green" },
  { delay: 2300, prefix: "", text: "  Dead-letter Queue         0", color: "text-green" },
  { delay: 2450, prefix: "", text: "  Avg Processing (ms)      43", color: "text-ice" },
  { delay: 2800, prefix: "$ ", text: "rabbitmqctl list_consumers --formatter=compact", color: "text-text/70" },
  { delay: 3400, prefix: "", text: "  order.stock.reserve   stock-api     active", color: "text-green" },
  { delay: 3550, prefix: "", text: "  order.payment.process payment-api   active", color: "text-green" },
  { delay: 3700, prefix: "", text: "  order.sap.sync        sap-conn      active", color: "text-green" },
];
