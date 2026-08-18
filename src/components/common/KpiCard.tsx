import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  delta?: number;
  hint?: string;
  tone?: "default" | "success" | "warning" | "danger";
}

const tones = {
  default: "text-primary bg-primary/10",
  success: "text-success bg-success/10",
  warning: "text-warning bg-warning/10",
  danger: "text-destructive bg-destructive/10",
};

export function KpiCard({
  label,
  value,
  icon: Icon,
  delta,
  hint,
  tone = "default",
}: KpiCardProps) {
  const positive = (delta ?? 0) >= 0;
  return (
    <div className="panel p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <span className={cn("rounded-lg p-2", tones[tone])}>
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
        {typeof delta === "number" ? (
          <span
            className={cn(
              "inline-flex items-center gap-1 font-medium",
              positive ? "text-success" : "text-destructive",
            )}
          >
            {positive ? (
              <TrendingUp className="size-3.5" />
            ) : (
              <TrendingDown className="size-3.5" />
            )}
            {positive ? "+" : ""}
            {delta}%
          </span>
        ) : null}
        {hint ? <span>{hint}</span> : null}
      </div>
    </div>
  );
}
