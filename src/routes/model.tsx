import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BrainCircuit, CalendarClock, Database, GitBranch } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { AppLayout } from "@/layouts/AppLayout";
import { LoadingState } from "@/components/common/States";
import { ChartCard, axisProps, tooltipStyle } from "@/components/charts/ChartCard";
import { getModelInfo } from "@/services/api";

export const Route = createFileRoute("/model")({
  head: () => ({
    meta: [
      { title: "Modelo de Machine Learning — TecnoMarket Analytics" },
      {
        name: "description",
        content:
          "Métricas, entrenamiento e importancia de variables del modelo de predicción de retrasos.",
      },
      { property: "og:title", content: "Modelo ML — TecnoMarket Analytics" },
      {
        property: "og:description",
        content: "Accuracy, precision, recall, F1 y ROC-AUC del modelo en producción.",
      },
    ],
  }),
  component: ModelPage,
});

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="panel p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function ModelPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["model"],
    queryFn: getModelInfo,
  });

  return (
    <AppLayout
      title="Modelo ML"
      subtitle="Rendimiento y explicabilidad del modelo de predicción de retrasos"
    >
      {isLoading || !data ? (
        <LoadingState label="Cargando información del modelo…" />
      ) : (
        <>
          <div className="panel flex flex-wrap items-center gap-6 p-5">
            <span className="rounded-xl bg-primary/10 p-3 text-primary">
              <BrainCircuit className="size-6" />
            </span>
            <div>
              <p className="text-base font-semibold">{data.name}</p>
              <p className="text-xs text-muted-foreground">
                Modelo seleccionado en producción
              </p>
            </div>
            <div className="flex flex-wrap gap-6 text-xs">
              <span className="inline-flex items-center gap-2">
                <GitBranch className="size-4 text-primary" /> {data.version}
              </span>
              <span className="inline-flex items-center gap-2">
                <CalendarClock className="size-4 text-primary" />
                {data.trainedAt}
              </span>
              <span className="inline-flex items-center gap-2">
                <Database className="size-4 text-primary" />
                {data.records.toLocaleString("es-PE")} registros
              </span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <Metric label="Accuracy" value={data.accuracy.toFixed(3)} />
            <Metric label="Precision" value={data.precision.toFixed(3)} />
            <Metric label="Recall" value={data.recall.toFixed(3)} />
            <Metric label="F1-score" value={data.f1.toFixed(3)} />
            <Metric label="ROC-AUC" value={data.rocAuc.toFixed(3)} />
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <ChartCard
              title="Importancia de variables"
              description="Contribución de cada feature al modelo (%)"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.featureImportance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis type="number" {...axisProps} />
                  <YAxis
                    type="category"
                    dataKey="feature"
                    width={150}
                    {...axisProps}
                  />
                  <Tooltip {...tooltipStyle} />
                  <Bar
                    dataKey="importance"
                    name="Importancia"
                    fill="var(--chart-1)"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Distribución de clases"
              description="Dataset de entrenamiento"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.classDistribution}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={3}
                  >
                    {data.classDistribution.map((_, i) => (
                      <Cell
                        key={i}
                        fill={i === 0 ? "var(--chart-2)" : "var(--chart-4)"}
                      />
                    ))}
                  </Pie>
                  <Tooltip {...tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </>
      )}
    </AppLayout>
  );
}
