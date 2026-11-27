import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Loader2, Play, AlertCircle } from "lucide-react";
import { request } from "@/services/api";
import { Button } from "@/components/ui/button";

interface Metrics {
  roc_auc: number;
  f1_score: number;
  recall: number;
  precision: number;
}

interface TrainingState {
  status: "idle" | "running" | "completed" | "failed";
  progress: number;
  events: { message: string; time: string }[];
  error?: string | null;
  result: {
    model_name: string;
    metrics: Metrics;
    comparison: Record<string, Metrics>;
    approved: boolean;
    activated: boolean;
  } | null;
}

export function TrainingPanel() {
  const client = useQueryClient();
  const state = useQuery({
    queryKey: ["training"],
    queryFn: () => request<TrainingState>("/model/training"),
    refetchInterval: (query) => (query.state.data?.status === "running" ? 1000 : 5000),
    retry: false,
  });
  const start = useMutation({
    mutationFn: () => request<TrainingState>("/model/training", { method: "POST" }),
    onSuccess: (data) => client.setQueryData(["training"], data),
    onError: () => {
      void client.invalidateQueries({ queryKey: ["training"] });
    },
  });
  const data = state.data;
  const running = data?.status === "running" || start.isPending;
  const result = data?.result;

  return (
    <section className="panel space-y-4 p-5" aria-label="Entrenamiento del modelo">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">Entrenamiento y evaluación</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Compara cuatro modelos con los datos actuales. El resultado no reemplaza automáticamente
            al modelo activo.
          </p>
        </div>
        <Button
          onClick={() => start.mutate()}
          disabled={running || state.isPending || state.isError}
        >
          {running ? (
            <Loader2 className="size-4 animate-spin motion-reduce:animate-none" />
          ) : (
            <Play className="size-4" />
          )}
          {running ? "Entrenando…" : "Entrenar modelo"}
        </Button>
      </div>

      {(state.error || start.error) && (
        <div role="alert" className="text-sm text-destructive">
          {start.error?.message ?? state.error?.message}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              start.reset();
              void state.refetch();
            }}
          >
            Reintentar conexión
          </Button>
        </div>
      )}

      {data && data.status !== "idle" && (
        <>
          <div className="flex items-center gap-2 text-sm" role="status" aria-live="polite">
            {data.status === "running" ? (
              <Loader2 className="size-4 animate-spin motion-reduce:animate-none text-primary" />
            ) : data.status === "completed" ? (
              <CheckCircle2 className="size-4 text-success" />
            ) : (
              <AlertCircle className="size-4 text-destructive" />
            )}
            {data.status === "running"
              ? "Entrenamiento en curso"
              : data.status === "completed"
                ? "Evaluación completada"
                : "El entrenamiento no se completó"}
            <span className="ml-auto font-mono">{data.progress}%</span>
          </div>
          <div
            role="progressbar"
            aria-label="Progreso del entrenamiento"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={data.progress}
            className="h-2 overflow-hidden rounded-full bg-muted"
          >
            <div
              className="h-full bg-primary transition-all duration-500 motion-reduce:transition-none"
              style={{ width: `${data.progress}%` }}
            />
          </div>
          <ol className="max-h-64 space-y-2 overflow-y-auto rounded-lg bg-muted/50 p-3 text-xs">
            {data.events.map((event, index) => (
              <li key={index} className="flex gap-3">
                <span className="font-mono text-muted-foreground">{index + 1}.</span>
                <span>{event.message}</span>
              </li>
            ))}
          </ol>
          {data.error && (
            <p role="alert" className="text-sm text-destructive">
              {data.error}
            </p>
          )}
        </>
      )}

      {result && (
        <div className="space-y-3 border-t border-border pt-4">
          <p className="text-sm font-semibold">Candidato seleccionado: {result.model_name}</p>
          <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            {Object.entries(result.metrics)
              .filter(([key]) => ["roc_auc", "f1_score", "recall", "precision"].includes(key))
              .map(([key, value]) => (
                <div key={key} className="rounded-lg bg-muted p-3">
                  <p className="text-xs text-muted-foreground">
                    {
                      {
                        roc_auc: "ROC-AUC",
                        f1_score: "F1",
                        recall: "Recall",
                        precision: "Precisión",
                      }[key]
                    }
                  </p>
                  <p className="mt-1 font-mono">{value.toFixed(4)}</p>
                </div>
              ))}
          </div>
          <p className="text-xs text-muted-foreground">
            {result.approved
              ? "El candidato superó los controles de calidad."
              : "El candidato no superó los controles de calidad o no mejoró al modelo activo."}{" "}
            El modelo activo se conserva. Las métricas superiores de esta página corresponden al
            modelo activo; estas corresponden a la nueva evaluación.
          </p>
        </div>
      )}
    </section>
  );
}
