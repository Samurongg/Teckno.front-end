export type Region =
  | "Lima"
  | "Arequipa"
  | "Trujillo"
  | "Cusco"
  | "Piura"
  | "Chiclayo";

export type ShippingType = "Estándar" | "Express" | "Same Day" | "Programado";

export type DeliveryStatus = "A tiempo" | "Tardía";

export type RiskLevel = "BAJO" | "MEDIO" | "ALTO";

export type Priority = "Baja" | "Media" | "Alta";

export interface Order {
  id: string;
  date: string;
  region: Region;
  shippingType: ShippingType;
  distanceKm: number;
  prepTimeH: number;
  items: number;
  weightKg: number;
  status: DeliveryStatus;
  risk: RiskLevel;
  riskScore: number;
  logisticLoad: number;
  priority: Priority;
}

export interface DashboardSummary {
  totalOrders: number;
  onTime: number;
  late: number;
  lateRate: number;
  predictions: number;
  globalRisk: RiskLevel;
  lateTrend: { month: string; late: number; onTime: number }[];
  byRegion: { region: string; orders: number; late: number }[];
  byShipping: { type: string; lateRate: number }[];
  distribution: { name: string; value: number }[];
}

export interface PredictionInput {
  shippingType: ShippingType;
  distanceKm: number;
  estimatedTimeH: number;
  prepTimeH: number;
  items: number;
  weightKg: number;
  region: Region;
  priority: Priority;
  weekday: string;
  logisticLoad: number;
}

export interface PredictionFactor {
  feature: string;
  contribution: number;
}

export interface PredictionResultData {
  label: "ENTREGA TARDÍA" | "ENTREGA A TIEMPO";
  probability: number;
  risk: RiskLevel;
  factors: PredictionFactor[];
}

export interface AnalyticsData {
  lateByRegion: { region: string; lateRate: number }[];
  lateByShipping: { type: string; lateRate: number }[];
  lateByDistance: { bucket: string; lateRate: number }[];
  lateByPrepTime: { bucket: string; lateRate: number }[];
  ordersDistribution: { name: string; value: number }[];
  temporalTrend: { month: string; orders: number; lateRate: number }[];
  riskDrivers: { variable: string; impact: number }[];
}

export interface ModelInfo {
  name: string;
  version: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  rocAuc: number;
  trainedAt: string;
  records: number;
  classDistribution: { name: string; value: number }[];
  featureImportance: { feature: string; importance: number }[];
}
