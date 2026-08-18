import type { RiskLevel } from "@/types";
import { cn } from "@/lib/utils";

const styles: Record<RiskLevel, string> = {
  BAJO: "bg-success/15 text-success border-success/30",
  MEDIO: "bg-warning/15 text-warning border-warning/30",
  ALTO: "bg-destructive/15 text-destructive border-destructive/30",
};

export function RiskBadge({
  level,
  className,
}: {
  level: RiskLevel;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide",
        styles[level],
        className,
      )}
    >
      {level}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const late = status === "Tardía";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        late
          ? "border-destructive/30 bg-destructive/10 text-destructive"
          : "border-success/30 bg-success/10 text-success",
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
