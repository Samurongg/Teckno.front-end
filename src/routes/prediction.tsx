import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import type { PredictionResultData } from "@/types";
import { AppLayout } from "@/layouts/AppLayout";
import { LoadingState } from "@/components/common/States";
import { PredictionForm } from "@/components/prediction/PredictionForm";
import { PredictionResult } from "@/components/prediction/PredictionResult";
import { predictDelivery } from "@/services/api";

export const Route = createFileRoute("/prediction")({
  head: () => ({
    meta: [
      { title: "Predicción de entrega — TecnoMarket Analytics" },
      {
        name: "description",
        content:
          "Estima la probabilidad de retraso de una entrega con el modelo de Machine Learning de TecnoMarket.",
      },
      { property: "og:title", content: "Predicción de entrega — TecnoMarket Analytics" },
      {
        property: "og:description",
        content: "Simula un pedido y obtén su riesgo de retraso en tiempo real.",
      },
    ],
  }),
  component: PredictionPage,
});

function PredictionPage() {
  const [result, setResult] = useState<PredictionResultData | null>(null);
  const mutation = useMutation({
    mutationFn: predictDelivery,
    onSuccess: setResult,
  });

  return (
    <AppLayout
      title="Predicción de entrega"
      subtitle="Simula un pedido y obtén su probabilidad de retraso"
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <PredictionForm
          onSubmit={(input) => mutation.mutate(input)}
          loading={mutation.isPending}
        />

        {mutation.isPending ? (
          <div className="panel">
            <LoadingState label="Ejecutando inferencia del modelo…" />
          </div>
        ) : result ? (
          <PredictionResult data={result} />
        ) : (
          <div className="panel flex min-h-[320px] flex-col items-center justify-center gap-3 p-8 text-center">
            <span className="rounded-xl bg-primary/10 p-3 text-primary">
              <Sparkles className="size-6" />
            </span>
            <p className="text-sm font-medium">Sin predicción todavía</p>
            <p className="max-w-sm text-xs text-muted-foreground">
              Completa las características del pedido y pulsa “Realizar
              predicción” para obtener la probabilidad de entrega tardía y los
              factores de riesgo asociados.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
