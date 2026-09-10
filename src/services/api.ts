/* The API adapter progressively normalizes external JSON while the backend contract is migrated. */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { PredictionResultData } from "@/types";

export const API_BASE_URL =
  (import.meta.env["VITE_API_BASE_URL"] as string | undefined) ?? "http://127.0.0.1:8000/api";

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    ...(init?.headers as Record<string, string> | undefined),
  };

  if (init?.body) {
    headers["Content-Type"] = "application/json";
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers,
    });
  } catch {
    throw new Error(
      "No se pudo conectar con la API. Verifica que el backend esté activo en http://127.0.0.1:8000.",
    );
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `API ${res.status}: ${res.statusText}`);
  }

  return (await res.json()) as T;
}

function normalizarTipoEnvio(tipo: string): "Estándar" | "Express" | "Mismo Día" {
  const t = (tipo || "").toLowerCase();
  if (t.includes("same") || t.includes("mismo") || t.includes("dia")) return "Mismo Día";
  if (t.includes("express") || t.includes("rapido")) return "Express";
  return "Estándar";
}

function normalizarCargaLogistica(carga: any): "Baja" | "Media" | "Alta" {
  if (typeof carga === "number") {
    if (carga >= 70) return "Alta";
    if (carga >= 35) return "Media";
    return "Baja";
  }
  const c = String(carga || "").toLowerCase();
  if (c.includes("alta")) return "Alta";
  if (c.includes("baja")) return "Baja";
  return "Media";
}

function normalizarDiaSemana(
  dia: string,
): "Lunes" | "Martes" | "Miércoles" | "Jueves" | "Viernes" | "Sábado" | "Domingo" {
  const d = (dia || "").toLowerCase();
  if (d.includes("lun")) return "Lunes";
  if (d.includes("mar")) return "Martes";
  if (d.includes("mie") || d.includes("mié")) return "Miércoles";
  if (d.includes("jue")) return "Jueves";
  if (d.includes("vie")) return "Viernes";
  if (d.includes("sab") || d.includes("sáb")) return "Sábado";
  if (d.includes("dom")) return "Domingo";
  return "Miércoles";
}

// -------------------------------------------------------------
// ENDPOINTS ADAPTADOS A LOS COMPONENTES DE REACT
// -------------------------------------------------------------

/** GET /api/dashboard */
export async function getDashboard(): Promise<any> {
  const raw = await request<any>("/dashboard");
  const kpis = raw.kpis || {};

  const onTime = kpis.entregas_a_tiempo ?? 0;
  const late = kpis.entregas_tardias ?? 0;
  const totalOrders = kpis.total_pedidos ?? 0;
  const lateRate = kpis.tasa_retrasos ?? 0;
  const predictions = kpis.predicciones_realizadas ?? 0;
  const globalRisk = (kpis.nivel_riesgo_general || "BAJO").toUpperCase();

  const lateTrend = (raw.evolucion_mensual || []).map((item: any) => ({
    month: item.mes,
    late: item.tardios,
    onTime: item.total - item.tardios,
    total: item.total,
  }));

  const byDepartment = (raw.pedidos_por_departamento || []).map((item: any) => ({
    department: item.departamento,
    orders: item.total,
    late: item.tardios,
    lateRate: item.tasa_retraso,
  }));

  const byZone = (raw.pedidos_por_zona || []).map((item: any) => ({
    zone: item.zona,
    orders: item.total,
    late: item.tardios,
    lateRate: item.tasa_retraso,
  }));

  const distribution = [
    { name: "A tiempo", value: onTime },
    { name: "Tardías", value: late },
  ];

  const byShipping = (raw.pedidos_por_tipo_envio || []).map((item: any) => ({
    type: item.tipo,
    lateRate: item.tasa_retraso,
  }));

  return {
    totalOrders,
    onTime,
    late,
    lateRate,
    predictions,
    globalRisk,
    lateTrend,
    byDepartment,
    byZone,
    byShipping,
    distribution,
  };
}

/** GET /api/orders */
export async function getOrders(): Promise<any[]> {
  const response = await request<{ data: any[] }>("/orders?page_size=5000");
  return (response.data || []).map((o) => {
    const isDelayed = o.entrega_tardia === 1;
    const load = normalizarCargaLogistica(o.carga_logistica);
    return {
      id: o.order_id,
      date: o.fecha_pedido,
      department: o.departamento_destino,
      logisticZone: o.zona_logistica,
      transportMode: o.modo_transporte,
      shippingType: o.tipo_envio,
      distanceKm: o.distancia_km,
      prepTimeH: o.tiempo_preparacion_horas,
      items: o.cantidad_productos,
      weightKg: o.peso_kg,
      logisticLoad: load === "Alta" ? 85 : load === "Media" ? 55 : 25,
      priority: o.prioridad,
      status: isDelayed ? "Tardía" : "A tiempo",
      risk: isDelayed ? "ALTO" : "BAJO",
      riskScore: isDelayed ? 75 : 20,
    };
  });
}

/** POST /api/predict */
export async function predictDelivery(input: any): Promise<PredictionResultData> {
  const horasEstimadas = Number(input.estimatedTimeH ?? input.tiempo_estimado_horas ?? 48);
  const diasEstimados = Math.max(1, Math.round(horasEstimadas / 24));

  const payload = {
    departamento_destino: input.department,
    modo_transporte: input.transportMode,
    tipo_envio: normalizarTipoEnvio(input.shippingType || input.tipo_envio),
    distancia_km: Number(input.distanceKm ?? input.distancia_km ?? 100),
    tiempo_estimado_dias: diasEstimados,
    tiempo_preparacion_horas: Number(input.prepTimeH ?? input.tiempo_preparacion_horas ?? 4),
    cantidad_productos: Number(input.items ?? input.cantidad_productos ?? 1),
    peso_kg: Number(input.weightKg ?? input.peso_kg ?? 2),
    prioridad: (input.priority ?? input.prioridad ?? "Media") as "Baja" | "Media" | "Alta",
    dia_semana: normalizarDiaSemana(input.weekday ?? input.dia_semana),
    carga_logistica: normalizarCargaLogistica(input.logisticLoad ?? input.carga_logistica),
  };

  const res = await request<any>("/predict", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return {
    label: res.resultado.toUpperCase(),
    probability: Math.round(res.probabilidad_retraso),
    risk: res.nivel_riesgo.toUpperCase() as "BAJO" | "MEDIO" | "ALTO",
  };
}

/** GET /api/analytics - Estructura exacta requerida por analytics.tsx */
export async function getAnalytics(): Promise<any> {
  const raw = await request<any>("/analytics");

  const lateByDepartment = (raw.por_departamento || []).map((item: any) => ({
    department: item.categoria,
    lateRate: item.tasa_retraso,
  }));

  const lateByZone = (raw.por_zona_logistica || []).map((item: any) => ({
    zone: item.categoria,
    lateRate: item.tasa_retraso,
  }));

  // 2. lateByShipping -> [{ type: string, lateRate: number }]
  const lateByShipping = (raw.por_tipo_envio || []).map((item: any) => ({
    type: item.categoria,
    lateRate: item.tasa_retraso,
  }));

  // 3. lateByDistance -> [{ bucket: string, lateRate: number }]
  const lateByDistance = (raw.distribucion_distancias || []).map((item: any) => ({
    bucket: item.rango,
    lateRate: item.total > 0 ? Number(((item.tardios / item.total) * 100).toFixed(1)) : 0,
  }));

  // 4. lateByPrepTime -> [{ bucket: string, lateRate: number }]
  const lateByPrepTime = (raw.distribucion_tiempo_preparacion || []).map((item: any) => ({
    bucket: item.rango,
    lateRate: item.total > 0 ? Number(((item.tardios / item.total) * 100).toFixed(1)) : 0,
  }));

  // 5. ordersDistribution -> [{ name: string, value: number }]
  const ordersDistribution = (raw.por_tipo_envio || []).map((item: any) => ({
    name: item.categoria,
    value: item.total_pedidos,
  }));

  // 6. temporalTrend -> [{ month: string, orders: number, lateRate: number }]
  const temporalTrend = (raw.tendencia_mensual || []).map((item: any) => ({
    month: item.mes,
    orders: item.total,
    lateRate: item.tasa_retraso,
  }));

  // 7. riskDrivers -> [{ variable: string, impact: number }] (para evitar el error de .map)
  const riskDrivers: Array<{ variable: string; impact: number }> = [];

  return {
    lateByDepartment,
    lateByZone,
    lateByShipping,
    lateByDistance,
    lateByPrepTime,
    ordersDistribution,
    temporalTrend,
    riskDrivers,
  };
}

/** GET /api/model/info - Estructura exacta requerida por model.tsx */
export async function getModelInfo(): Promise<any> {
  const raw = await request<any>("/model/info");
  const metrics = raw.best_model_metrics || {};

  const totalRecords = raw.total_samples ?? 0;
  const targetDistribution = raw.target_distribution || {};

  return {
    name: raw.model_name || "No disponible",
    version: raw.model_version || "—",
    trainedAt: raw.trained_at || "—",
    records: totalRecords, // Usado en data.records.toLocaleString("es-PE")

    // Métricas en escala 0 a 1 para que toFixed(3) funcione correctamente
    accuracy: metrics.accuracy ?? 0,
    precision: metrics.precision ?? 0,
    recall: metrics.recall ?? 0,
    f1: metrics.f1_score ?? 0,
    rocAuc: metrics.roc_auc ?? 0,

    // Feature importance para el BarChart vertical
    featureImportance: raw.feature_importance || [],

    // Distribución de clases para el PieChart
    classDistribution: [
      { name: "A tiempo (0)", value: targetDistribution.ontime_0 ?? 0 },
      { name: "Tardías (1)", value: targetDistribution.delayed_1 ?? 0 },
    ],
  };
}
