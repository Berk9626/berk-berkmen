"use client";

import { useEffect, useRef, useState } from "react";
import {
  pipelineEdges,
  pipelineNodes,
  pipelineRoutes,
} from "@/content/lab";
import type { PipelineNode } from "@/lib/types";
import { lerp } from "@/lib/math";

type Packet = {
  id: number;
  fromId: string;
  toId: string;
  t: number;
  speed: number;
  color: string;
  failed: boolean;
  triggered: boolean;
};

let packetId = 0;

export function EventPipeline() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = frameRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const nodes = new Map<string, PipelineNode>(pipelineNodes.map((node) => [node.id, node]));
    const packets: Packet[] = [];
    const timers: number[] = [];
    let frame = 0;
    let failedAt = 0;

    const pointOf = (id: string) => {
      const node = nodes.get(id);
      if (!node) return { x: 0, y: 0 };
      return { x: node.x * canvas.offsetWidth, y: node.y * canvas.offsetHeight };
    };

    const spawn = (
      fromId: string,
      toId: string,
      color: string,
      failed = false,
      speed = 0.38 + Math.random() * 0.18,
    ) => {
      packets.push({
        id: packetId,
        fromId,
        toId,
        t: 0,
        speed,
        color,
        failed,
        triggered: false,
      });
      packetId += 1;
    };

    const resize = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const interval = window.setInterval(() => {
      spawn("order-api", "exchange", "#E8702A", false, 0.42 + Math.random() * 0.14);
    }, 1000);

    const draw = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      context.clearRect(0, 0, width, height);
      const now = performance.now();
      const alerting = failedAt > 0 && now - failedAt < 1800;

      for (const [fromId, toId] of pipelineEdges) {
        const from = pointOf(fromId);
        const to = pointOf(toId);
        const dead = toId === "dlq";
        context.beginPath();
        context.moveTo(from.x, from.y);
        context.lineTo(to.x, to.y);
        if (dead) {
          context.setLineDash([4, 5]);
          context.strokeStyle = alerting ? "rgba(240,165,0,0.5)" : "rgba(240,165,0,0.18)";
          context.lineWidth = alerting ? 1.5 : 0.8;
        } else {
          context.setLineDash([]);
          context.strokeStyle = "rgba(48,54,61,0.75)";
          context.lineWidth = 1;
        }
        context.stroke();
        context.setLineDash([]);
      }

      const born: Packet[] = [];
      for (const packet of packets) {
        packet.t += 0.016 * packet.speed;
        if (!packet.triggered && packet.t >= 0.92) {
          packet.triggered = true;
          if (packet.toId === "exchange") {
            const count = Math.random() < 0.35 ? 2 : 1;
            const routes = [...pipelineRoutes].sort(() => Math.random() - 0.5).slice(0, count);
            for (const route of routes) {
              if (Math.random() < 0.08) {
                born.push({
                  id: packetId,
                  fromId: "exchange",
                  toId: "dlq",
                  t: 0,
                  speed: 0.38,
                  color: "#F0A500",
                  failed: true,
                  triggered: false,
                });
                packetId += 1;
              } else {
                born.push({
                  id: packetId,
                  fromId: "exchange",
                  toId: route.consumer,
                  t: 0,
                  speed: 0.36 + Math.random() * 0.16,
                  color: "#39D353",
                  failed: false,
                  triggered: false,
                });
                packetId += 1;
                const timer = window.setTimeout(() => {
                  spawn(route.consumer, route.store, "#8AB4D4", false, 0.48);
                }, 1100 + Math.random() * 500);
                timers.push(timer);
              }
            }
          } else if (packet.toId === "dlq" && packet.failed) {
            failedAt = now;
            const route = pipelineRoutes[Math.floor(Math.random() * pipelineRoutes.length)];
            const timer = window.setTimeout(() => {
              spawn("exchange", route.consumer, "#39D353", false, 0.38);
            }, 1600);
            timers.push(timer);
          }
        }

        const from = pointOf(packet.fromId);
        const to = pointOf(packet.toId);
        const progress = Math.min(packet.t, 1);
        const x = lerp(from.x, to.x, progress);
        const y = lerp(from.y, to.y, progress);
        context.beginPath();
        context.arc(x, y, 3, 0, Math.PI * 2);
        context.fillStyle = packet.color;
        context.fill();
        context.beginPath();
        context.arc(x, y, 6, 0, Math.PI * 2);
        context.fillStyle = `${packet.color}44`;
        context.fill();
      }

      const moving = packets.filter((packet) => packet.t < 1);
      moving.push(...born);

      for (const node of pipelineNodes) {
        const x = node.x * width;
        const y = node.y * height;
        const hot = node.type === "dlq" && alerting;
        const radius = node.type === "exchange" ? 10 : 8;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fillStyle = hot ? `${node.color}55` : `${node.color}22`;
        context.fill();
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.strokeStyle = hot ? node.color : `${node.color}CC`;
        context.lineWidth = hot ? 2 : 1.5;
        context.stroke();
        if (node.type === "exchange") {
          context.beginPath();
          context.arc(x, y, 15, 0, Math.PI * 2);
          context.strokeStyle = `${node.color}18`;
          context.lineWidth = 1;
          context.stroke();
        }
        context.fillStyle = "rgba(230,237,243,0.6)";
        context.font = "9px 'JetBrains Mono', monospace";
        context.textAlign = "center";
        context.fillText(node.label, x, y + radius + 12);
      }

      packets.length = 0;
      packets.push(...moving);
      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.clearInterval(interval);
      observer.disconnect();
      for (const timer of timers) window.clearTimeout(timer);
      packets.length = 0;
    };
  }, [active]);

  return (
    <div ref={frameRef} className="w-full overflow-hidden border border-border bg-deep">
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-green" />
        </span>
        <span className="font-mono text-[10px] tracking-widest uppercase text-muted">
          Event Pipeline — Live Simulation
        </span>
      </div>
      <canvas ref={canvasRef} className="block h-72 w-full" />
    </div>
  );
}
