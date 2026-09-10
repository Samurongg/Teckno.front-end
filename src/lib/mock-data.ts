import type {
  AnalyticsData,
  DashboardSummary,
  Department,
  ModelInfo,
  Order,
  Priority,
  RiskLevel,
  ShippingType,
} from "@/types";
import { DEPARTMENTS, DEPARTMENT_LOGISTICS } from "@/lib/peru-logistics";

const shippings: ShippingType[] = ["Estándar", "Express", "Mismo Día"];
const priorities: Priority[] = ["Baja", "Media", "Alta"];

/** Deterministic pseudo-random so SSR and client render identical data. */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function riskFromScore(score: number): RiskLevel {
  if (score >= 0.66) return "ALTO";
  if (score >= 0.35) return "MEDIO";
  return "BAJO";
}

export const MOCK_ORDERS: Order[] = (() => {
  const rand = rng(20260818);
  const orders: Order[] = [];
  for (let i = 0; i < 320; i++) {
    const department = DEPARTMENTS[Math.floor(rand() * DEPARTMENTS.length)]! as Department;
    const logistics = DEPARTMENT_LOGISTICS[department];
    const shippingType = shippings[Math.floor(rand() * shippings.length)]!;
    const distanceKm = Math.round(
      logistics.minDistanceKm + rand() * (logistics.maxDistanceKm - logistics.minDistanceKm),
    );
    const transportMode =
      logistics.transportModes[Math.floor(rand() * logistics.transportModes.length)]!;
    const prepTimeH = Math.round((0.5 + rand() * 11) * 10) / 10;
    const items = 1 + Math.floor(rand() * 14);
    const weightKg = Math.round((0.3 + rand() * 24) * 10) / 10;
    const logisticLoad = Math.round(20 + rand() * 78);
    const priority = priorities[Math.floor(rand() * priorities.length)]!;

    const score = Math.min(
      0.98,
      distanceKm / 1600 +
        prepTimeH / 26 +
        logisticLoad / 320 +
        (shippingType === "Estándar" ? 0.12 : 0) +
        (shippingType === "Same Day" ? 0.08 : 0) -
        (priority === "Alta" ? 0.08 : 0) +
        rand() * 0.12,
    );

    const day = new Date(Date.UTC(2026, 1, 1));
    day.setUTCDate(day.getUTCDate() + Math.floor(rand() * 195));

    orders.push({
      id: `TM-${(10234 + i).toString()}`,
      date: day.toISOString().slice(0, 10),
      department,
      logisticZone: logistics.zone,
      transportMode,
      shippingType,
      distanceKm,
      prepTimeH,
      items,
      weightKg,
      status: score > 0.62 ? "Tardía" : "A tiempo",
      risk: riskFromScore(score),
      riskScore: Math.round(score * 100),
      logisticLoad,
      priority,
    });
  }
  return orders.sort((a, b) => (a.date < b.date ? 1 : -1));
})();

export const MOCK_DASHBOARD: DashboardSummary = {
  totalOrders: 5000,
  onTime: 4125,
  late: 875,
  lateRate: 17.5,
  predictions: 1248,
  globalRisk: "MEDIO",
  lateTrend: [
    { month: "Ene", late: 74, onTime: 358 },
    { month: "Feb", late: 81, onTime: 372 },
    { month: "Mar", late: 96, onTime: 351 },
    { month: "Abr", late: 88, onTime: 389 },
    { month: "May", late: 103, onTime: 402 },
    { month: "Jun", late: 92, onTime: 421 },
    { month: "Jul", late: 79, onTime: 448 },
    { month: "Ago", late: 71, onTime: 462 },
  ],
  byDepartment: [
    { department: "Lima", orders: 1840, late: 236 },
    { department: "Arequipa", orders: 890, late: 178 },
    { department: "La Libertad", orders: 720, late: 141 },
    { department: "Cusco", orders: 610, late: 152 },
    { department: "Piura", orders: 520, late: 96 },
  ],
  byZone: [
    { zone: "Lima y Callao", orders: 1900, late: 260 },
    { zone: "Costa Norte", orders: 1100, late: 210 },
    { zone: "Sierra Sur", orders: 850, late: 205 },
  ],
  byShipping: [
    { type: "Estándar", lateRate: 24.1 },
    { type: "Express", lateRate: 9.4 },
    { type: "Same Day", lateRate: 15.8 },
    { type: "Programado", lateRate: 12.3 },
  ],
  distribution: [
    { name: "A tiempo", value: 4125 },
    { name: "Tardías", value: 875 },
  ],
};

export const MOCK_ANALYTICS: AnalyticsData = {
  lateByDepartment: [
    { department: "Loreto", lateRate: 31.9 },
    { department: "Cusco", lateRate: 24.9 },
    { department: "Arequipa", lateRate: 20.0 },
    { department: "Piura", lateRate: 18.5 },
    { department: "Lima", lateRate: 12.8 },
  ],
  lateByZone: [
    { zone: "Selva Norte", lateRate: 31.2 },
    { zone: "Sierra Sur", lateRate: 24.1 },
    { zone: "Costa Norte", lateRate: 18.7 },
    { zone: "Lima y Callao", lateRate: 9.2 },
  ],
  lateByShipping: [
    { type: "Estándar", lateRate: 24.1 },
    { type: "Same Day", lateRate: 15.8 },
    { type: "Programado", lateRate: 12.3 },
    { type: "Express", lateRate: 9.4 },
  ],
  lateByDistance: [
    { bucket: "0-100 km", lateRate: 6.2 },
    { bucket: "100-300 km", lateRate: 11.7 },
    { bucket: "300-600 km", lateRate: 19.4 },
    { bucket: "600-900 km", lateRate: 28.1 },
    { bucket: "900+ km", lateRate: 36.7 },
  ],
  lateByPrepTime: [
    { bucket: "<2 h", lateRate: 7.4 },
    { bucket: "2-4 h", lateRate: 12.1 },
    { bucket: "4-6 h", lateRate: 18.9 },
    { bucket: "6-9 h", lateRate: 27.6 },
    { bucket: "9+ h", lateRate: 39.2 },
  ],
  ordersDistribution: [
    { name: "Estándar", value: 2140 },
    { name: "Express", value: 1180 },
    { name: "Same Day", value: 860 },
    { name: "Programado", value: 820 },
  ],
  temporalTrend: [
    { month: "Ene", orders: 432, lateRate: 17.1 },
    { month: "Feb", orders: 453, lateRate: 17.9 },
    { month: "Mar", orders: 447, lateRate: 21.5 },
    { month: "Abr", orders: 477, lateRate: 18.4 },
    { month: "May", orders: 505, lateRate: 20.4 },
    { month: "Jun", orders: 513, lateRate: 17.9 },
    { month: "Jul", orders: 527, lateRate: 15.0 },
    { month: "Ago", orders: 533, lateRate: 13.3 },
  ],
  riskDrivers: [
    { variable: "Tiempo de preparación", impact: 32 },
    { variable: "Distancia", impact: 25 },
    { variable: "Tipo de envío", impact: 18 },
    { variable: "Carga logística", impact: 13 },
    { variable: "Peso", impact: 7 },
    { variable: "Otros", impact: 5 },
  ],
};

export const MOCK_MODEL: ModelInfo = {
  name: "Gradient Boosting Classifier",
  version: "v2.4.1",
  accuracy: 0.912,
  precision: 0.884,
  recall: 0.861,
  f1: 0.872,
  rocAuc: 0.947,
  trainedAt: "2026-08-12 04:30 UTC",
  records: 48250,
  classDistribution: [
    { name: "A tiempo", value: 39806 },
    { name: "Tardía", value: 8444 },
  ],
  featureImportance: [
    { feature: "Tiempo de preparación", importance: 32 },
    { feature: "Distancia", importance: 25 },
    { feature: "Tipo de envío", importance: 18 },
    { feature: "Carga logística", importance: 13 },
    { feature: "Peso", importance: 7 },
    { feature: "Otros", importance: 5 },
  ],
};

export const SHIPPING_TYPES = shippings;
export const PRIORITIES = priorities;
export const WEEKDAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
