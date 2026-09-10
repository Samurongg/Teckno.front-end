export type Department =
  | "Amazonas"
  | "Áncash"
  | "Apurímac"
  | "Arequipa"
  | "Ayacucho"
  | "Cajamarca"
  | "Callao"
  | "Cusco"
  | "Huancavelica"
  | "Huánuco"
  | "Ica"
  | "Junín"
  | "La Libertad"
  | "Lambayeque"
  | "Lima"
  | "Loreto"
  | "Madre de Dios"
  | "Moquegua"
  | "Pasco"
  | "Piura"
  | "Puno"
  | "San Martín"
  | "Tacna"
  | "Tumbes"
  | "Ucayali";

export type LogisticZone =
  | "Costa Norte"
  | "Costa Sur"
  | "Lima y Callao"
  | "Selva Centro-Sur"
  | "Selva Norte"
  | "Sierra Centro"
  | "Sierra Norte"
  | "Sierra Sur";

export type TransportMode = "Terrestre" | "Aéreo" | "Multimodal";

export type ShippingType = "Estándar" | "Express" | "Mismo Día";

export type DeliveryStatus = "A tiempo" | "Tardía";

export type RiskLevel = "BAJO" | "MEDIO" | "ALTO";

export type Priority = "Baja" | "Media" | "Alta";

export interface Order {
  id: string;
  date: string;
  department: Department;
  logisticZone: LogisticZone;
  transportMode: TransportMode;
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
  byDepartment: { department: string; orders: number; late: number }[];
  byZone: { zone: string; orders: number; late: number }[];
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
  department: Department;
  transportMode: TransportMode;
  priority: Priority;
  weekday: string;
  logisticLoad: number;
}

export interface PredictionResultData {
  label: "ENTREGA TARDÍA" | "ENTREGA A TIEMPO";
  probability: number;
  risk: RiskLevel;
}

export interface AnalyticsData {
  lateByDepartment: { department: string; lateRate: number }[];
  lateByZone: { zone: string; lateRate: number }[];
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
