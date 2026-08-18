import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppLayout } from "@/layouts/AppLayout";
import { LoadingState } from "@/components/common/States";
import {
  CHART_COLORS,
  ChartCard,
  axisProps,
  tooltipStyle,
} from "@/components/charts/ChartCard";
import { getAnalytics } from "@/services/api";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analítica logística — TecnoMarket Analytics" },
      {
        name: "description",
        content:
          "Análisis de retrasos por región, tipo de envío, distancia y tiempo de preparación.",
      },
      { property: "og:title", content: "Analítica — TecnoMarket Analytics" },
      {
        property: "og:description",
        content: "Business Intelligence sobre patrones de retraso en entregas.",
      },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: getAnalytics,
  });

  return (
    <AppLayout
      title="Analítica"
      subtitle="Patrones de retraso y variables asociadas al riesgo"
    >
      {isLoading || !data ? (
        <LoadingState />
      ) : (
        <>
          <div className="grid gap-4 xl:grid-cols-2">
            <ChartCard title="Retrasos por región" description="Tasa de retraso (%)">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.lateByRegion}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="region" {...axisProps} />
                  <YAxis {...axisProps} />
                  <Tooltip {...tooltipStyle} />
                  <Bar
                    dataKey="lateRate"
                    name="% tardías"
                    fill="var(--chart-1)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Retrasos por tipo de envío"
              description="Tasa de retraso (%)"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.lateByShipping} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis type="number" {...axisProps} />
                  <YAxis type="category" dataKey="type" width={90} {...axisProps} />
                  <Tooltip {...tooltipStyle} />
                  <Bar
                    dataKey="lateRate"
                    name="% tardías"
                    fill="var(--chart-3)"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Retrasos según distancia"
              description="Rangos de distancia recorrida"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.lateByDistance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="bucket" {...axisProps} />
                  <YAxis {...axisProps} />
                  <Tooltip {...tooltipStyle} />
                  <Bar
                    dataKey="lateRate"
                    name="% tardías"
                    fill="var(--chart-4)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Retrasos según tiempo de preparación"
              description="Horas de preparación en almacén"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.lateByPrepTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="bucket" {...axisProps} />
                  <YAxis {...axisProps} />
                  <Tooltip {...tooltipStyle} />
                  <Bar
                    dataKey="lateRate"
                    name="% tardías"
                    fill="var(--chart-5)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Distribución de pedidos"
              description="Participación por tipo de envío"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.ordersDistribution}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={95}
                    paddingAngle={3}
                  >
                    {data.ordersDistribution.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip {...tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Tendencias temporales"
              description="Volumen de pedidos y tasa de retraso"
            >
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data.temporalTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" {...axisProps} />
                  <YAxis yAxisId="left" {...axisProps} />
                  <YAxis yAxisId="right" orientation="right" {...axisProps} />
                  <Tooltip {...tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar
                    yAxisId="left"
                    dataKey="orders"
                    name="Pedidos"
                    fill="var(--chart-1)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="lateRate"
                    name="% tardías"
                    stroke="var(--chart-4)"
                    strokeWidth={2}
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <div className="panel p-5">
            <h3 className="text-sm font-semibold">
              Variables asociadas a mayor riesgo
            </h3>
            <p className="text-xs text-muted-foreground">
              Contribución relativa al riesgo de retraso según el modelo
            </p>
            <div className="mt-4 space-y-3">
              {data.riskDrivers.map((d) => (
                <div key={d.variable}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{d.variable}</span>
                    <span className="font-medium">{d.impact}%</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${d.impact * 3}%`, maxWidth: "100%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </AppLayout>
  );
}
