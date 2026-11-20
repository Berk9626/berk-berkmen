import type { TechCategory } from "@/lib/types";
import { cn } from "@/lib/cn";

const tones: Record<TechCategory, string> = {
  backend: "text-copper border-copper/20",
  database: "text-ice border-ice/20",
  infra: "text-green border-green/20",
  ai: "text-amber border-amber/20",
  frontend: "text-text/60 border-border",
};

export function TechChip({
  name,
  category,
  plain = false,
  compact = false,
}: {
  name: string;
  category?: TechCategory;
  plain?: boolean;
  compact?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border bg-surface font-mono transition-all duration-200 hover:bg-surface/80",
        compact ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]",
        !plain && category ? tones[category] : "border-border text-text/80",
      )}
    >
      {name}
    </span>
  );
}
