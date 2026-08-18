/**
 * Capa de servicios.
 *
 * Hoy devuelve datos mock. Para conectar el backend FastAPI, basta con
 * reemplazar el cuerpo de cada función por una llamada a `request()`
 * (p. ej. `request<Order[]>("/api/orders")`).
 */
import {
  MOCK_ANALYTICS,
  MOCK_DASHBOARD,
  MOCK_MODEL,
  MOCK_ORDERS,
} from "@/lib/mock-data";
import type {
  AnalyticsData,
  DashboardSummary,
  ModelInfo,
  Order,
  PredictionInput,
  PredictionResultData,
} from "@/types";

export const API_BASE_URL =
  (import.meta.env["VITE_API_BASE_URL"] as string | undefined) ?? "";

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  return (await res.json()) as T;
}

const delay = (ms = 420) => new Promise((r) => setTimeout(r, ms));

/** GET /api/dashboard */
export async function getDashboard(): Promise<DashboardSummary> {
  await delay();
  return MOCK_DASHBOARD;
}

/** GET /api/orders */
export async function getOrders(): Promise<Order[]> {
  await delay();
  return MOCK_ORDERS;
}

/** GET /api/analytics */
export async function getAnalytics(): Promise<AnalyticsData> {
  await delay();
  return MOCK_ANALYTICS;
}

/** GET /api/model */
export async function getModelInfo(): Promise<ModelInfo> {
  await delay();
  return MOCK_MODEL;
}

/** POST /api/predict */
export async function predictDelivery(
  input: PredictionInput,
): Promise<PredictionResultData> {
  await delay(900);

  const shippingPenalty: Record<string, number> = {
    "Estándar": 0.14,
    "Same Day": 0.09,
    Programado: 0.04,
    Express: 0,
  };

  const distanceC = Math.min(0.34, input.distanceKm / 1500);
  const prepC = Math.min(0.3, input.prepTimeH / 24);
  const loadC = Math.min(0.18, input.logisticLoad / 400);
  const shippingC = shippingPenalty[input.shippingType] ?? 0.05;
  const weightC = Math.min(0.08, input.weightKg / 300);
  const priorityC = input.priority === "Alta" ? -0.06 : 0.02;

  const raw =
    distanceC + prepC + loadC + shippingC + weightC + priorityC + 0.05;
  const probability = Math.max(0.03, Math.min(0.97, raw));

  const factors = [
    { feature: "Tiempo de preparación", contribution: prepC },
    { feature: "Distancia", contribution: distanceC },
    { feature: "Tipo de envío", contribution: shippingC },
    { feature: "Carga logística", contribution: loadC },
    { feature: "Peso del pedido", contribution: weightC },
  ].sort((a, b) => b.contribution - a.contribution);

  const total = factors.reduce((s, f) => s + Math.max(f.contribution, 0), 0) || 1;

  return {
    label: probability >= 0.5 ? "ENTREGA TARDÍA" : "ENTREGA A TIEMPO",
    probability: Math.round(probability * 100),
    risk: probability >= 0.66 ? "ALTO" : probability >= 0.35 ? "MEDIO" : "BAJO",
    factors: factors.map((f) => ({
      feature: f.feature,
      contribution: Math.round((Math.max(f.contribution, 0) / total) * 100),
    })),
  };
}
