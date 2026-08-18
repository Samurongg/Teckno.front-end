import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Package,
  Percent,
  ShieldAlert,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppLayout } from "@/layouts/AppLayout";
import { KpiCard } from "@/components/common/KpiCard";
import { LoadingState } from "@/components/common/States";
import { RiskBadge } from "@/components/common/RiskBadge";
import {
  CHART_COLORS,
  ChartCard,
  axisProps,
  tooltipStyle,
} from "@/components/charts/ChartCard";
import { getDashboard } from "@/services/api";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard logístico — TecnoMarket Analytics" },
      {
        name: "description",
        content:
          "KPIs de entregas, retrasos y predicciones de riesgo logístico de TecnoMarket.",
      },
      { property: "og:title", content: "Dashboard — TecnoMarket Analytics" },
      {
        property: "og:description",
        content:
          "Indicadores logísticos y predicción de retrasos con Machine Learning.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
  });

  return (
    <AppLayout
      title="Dashboard"
      subtitle="Visión general de la operación logística y del riesgo de retrasos"
    >
      {isLoading || !data ? (
        <LoadingState />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <KpiCard
              label="Pedidos analizados"
              value={data.totalOrders.toLocaleString("es-PE")}
              icon={Package}
              delta={4.2}
              hint="vs. periodo anterior"
            />
            <KpiCard
              label="Entregas a tiempo"
              value={data.onTime.toLocaleString("es-PE")}
              icon={CheckCircle2}
              tone="success"
              delta={2.1}
            />
            <KpiCard
              label="Entregas tardías"
              value={data.late.toLocaleString("es-PE")}
              icon={AlertTriangle}
              tone="danger"
              delta={-3.4}
            />
            <KpiCard
              label="Tasa de retrasos"
              value={`${data.lateRate}%`}
              icon={Percent}
              tone="warning"
              hint="objetivo: < 12%"
            />
            <KpiCard
              label="Predicciones realizadas"
              value={data.predictions.toLocaleString("es-PE")}
              icon={Activity}
              hint="últimos 30 días"
            />
            <div className="panel flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Nivel de riesgo general
                </p>
                <div className="mt-3">
                  <RiskBadge level={data.globalRisk} className="text-sm" />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Score compuesto del modelo v2.4.1
                </p>
              </div>
              <span className="rounded-lg bg-warning/10 p-2 text-warning">
                <ShieldAlert className="size-4" />
              </span>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <ChartCard
              title="Evolución de entregas tardías"
              description="Pedidos tardíos por mes"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.lateTrend}>
                  <defs>
                    <linearGradient id="lateGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="var(--chart-4)"
                        stopOpacity={0.55}
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--chart-4)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" {...axisProps} />
                  <YAxis {...axisProps} />
                  <Tooltip {...tooltipStyle} />
                  <Area
                    type="monotone"
                    dataKey="late"
                    name="Tardías"
                    stroke="var(--chart-4)"
                    fill="url(#lateGrad)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Pedidos por región"
              description="Volumen total y pedidos tardíos"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.byRegion}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="region" {...axisProps} />
                  <YAxis {...axisProps} />
                  <Tooltip {...tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar
                    dataKey="orders"
                    name="Pedidos"
                    fill="var(--chart-1)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="late"
                    name="Tardíos"
                    fill="var(--chart-4)"
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
                <BarChart data={data.byShipping} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis type="number" {...axisProps} />
                  <YAxis
                    type="category"
                    dataKey="type"
                    width={90}
                    {...axisProps}
                  />
                  <Tooltip {...tooltipStyle} />
                  <Bar
                    dataKey="lateRate"
                    name="Tasa de retraso"
                    fill="var(--chart-3)"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Distribución de entregas"
              description="A tiempo vs. tardías"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.distribution}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={3}
                  >
                    {data.distribution.map((_, i) => (
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

          <ChartCard
            title="Tendencia mensual"
            description="Entregas a tiempo vs. tardías"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.lateTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" {...axisProps} />
                <YAxis {...axisProps} />
                <Tooltip {...tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line
                  type="monotone"
                  dataKey="onTime"
                  name="A tiempo"
                  stroke={CHART_COLORS[1]}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="late"
                  name="Tardías"
                  stroke={CHART_COLORS[3]}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </>
      )}
    </AppLayout>
  );
}
