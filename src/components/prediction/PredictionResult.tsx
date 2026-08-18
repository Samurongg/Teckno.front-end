import { AlertTriangle, CheckCircle2 } from "lucide-react";
import type { PredictionResultData } from "@/types";
import { RiskBadge } from "@/components/common/RiskBadge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function PredictionResult({ data }: { data: PredictionResultData }) {
  const late = data.label === "ENTREGA TARDÍA";
  return (
    <div className="panel space-y-5 p-5">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "rounded-xl p-2.5",
            late
              ? "bg-destructive/10 text-destructive"
              : "bg-success/10 text-success",
          )}
        >
          {late ? (
            <AlertTriangle className="size-5" />
          ) : (
            <CheckCircle2 className="size-5" />
          )}
        </span>
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Predicción
          </p>
          <p
            className={cn(
              "text-xl font-semibold tracking-tight",
              late ? "text-destructive" : "text-success",
            )}
          >
            {data.label}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Probabilidad
          </p>
          <p className="mt-1 text-3xl font-semibold">{data.probability}%</p>
          <Progress value={data.probability} className="mt-3" />
        </div>
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Nivel de riesgo
          </p>
          <div className="mt-3">
            <RiskBadge level={data.risk} className="text-sm" />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Umbral de decisión del modelo: 50%
          </p>
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold">
          Factores que más contribuyen al riesgo
        </p>
        <div className="space-y-3">
          {data.factors.map((f) => (
            <div key={f.feature}>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{f.feature}</span>
                <span className="font-medium">{f.contribution}%</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${f.contribution}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
