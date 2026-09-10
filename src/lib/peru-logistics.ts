import type { Department, LogisticZone, TransportMode } from "@/types";

export interface DepartmentLogistics {
  zone: LogisticZone;
  minDistanceKm: number;
  maxDistanceKm: number;
  transportModes: TransportMode[];
}

const LAND: TransportMode[] = ["Terrestre", "Aéreo"];
const LOCAL: TransportMode[] = ["Terrestre"];
const MIXED: TransportMode[] = ["Terrestre", "Multimodal", "Aéreo"];

export const DEPARTMENT_LOGISTICS: Record<Department, DepartmentLogistics> = {
  Amazonas: { zone: "Selva Norte", minDistanceKm: 900, maxDistanceKm: 1350, transportModes: MIXED },
  Áncash: { zone: "Costa Norte", minDistanceKm: 300, maxDistanceKm: 550, transportModes: LAND },
  Apurímac: { zone: "Sierra Sur", minDistanceKm: 700, maxDistanceKm: 1050, transportModes: LAND },
  Arequipa: { zone: "Costa Sur", minDistanceKm: 900, maxDistanceKm: 1150, transportModes: LAND },
  Ayacucho: { zone: "Sierra Sur", minDistanceKm: 500, maxDistanceKm: 750, transportModes: LAND },
  Cajamarca: {
    zone: "Sierra Norte",
    minDistanceKm: 750,
    maxDistanceKm: 1050,
    transportModes: LAND,
  },
  Callao: { zone: "Lima y Callao", minDistanceKm: 5, maxDistanceKm: 80, transportModes: LOCAL },
  Cusco: { zone: "Sierra Sur", minDistanceKm: 900, maxDistanceKm: 1250, transportModes: LAND },
  Huancavelica: {
    zone: "Sierra Centro",
    minDistanceKm: 400,
    maxDistanceKm: 650,
    transportModes: LAND,
  },
  Huánuco: { zone: "Sierra Centro", minDistanceKm: 350, maxDistanceKm: 600, transportModes: LAND },
  Ica: { zone: "Costa Sur", minDistanceKm: 220, maxDistanceKm: 380, transportModes: LAND },
  Junín: { zone: "Sierra Centro", minDistanceKm: 250, maxDistanceKm: 500, transportModes: LAND },
  "La Libertad": {
    zone: "Costa Norte",
    minDistanceKm: 520,
    maxDistanceKm: 720,
    transportModes: LAND,
  },
  Lambayeque: { zone: "Costa Norte", minDistanceKm: 700, maxDistanceKm: 880, transportModes: LAND },
  Lima: { zone: "Lima y Callao", minDistanceKm: 5, maxDistanceKm: 180, transportModes: LOCAL },
  Loreto: {
    zone: "Selva Norte",
    minDistanceKm: 1000,
    maxDistanceKm: 1800,
    transportModes: ["Aéreo", "Multimodal"],
  },
  "Madre de Dios": {
    zone: "Selva Centro-Sur",
    minDistanceKm: 1000,
    maxDistanceKm: 1500,
    transportModes: MIXED,
  },
  Moquegua: { zone: "Costa Sur", minDistanceKm: 1050, maxDistanceKm: 1250, transportModes: LAND },
  Pasco: { zone: "Sierra Centro", minDistanceKm: 250, maxDistanceKm: 450, transportModes: LAND },
  Piura: { zone: "Costa Norte", minDistanceKm: 850, maxDistanceKm: 1100, transportModes: LAND },
  Puno: { zone: "Sierra Sur", minDistanceKm: 1200, maxDistanceKm: 1550, transportModes: LAND },
  "San Martín": {
    zone: "Selva Norte",
    minDistanceKm: 900,
    maxDistanceKm: 1300,
    transportModes: MIXED,
  },
  Tacna: { zone: "Costa Sur", minDistanceKm: 1200, maxDistanceKm: 1450, transportModes: LAND },
  Tumbes: { zone: "Costa Norte", minDistanceKm: 1150, maxDistanceKm: 1400, transportModes: LAND },
  Ucayali: {
    zone: "Selva Centro-Sur",
    minDistanceKm: 700,
    maxDistanceKm: 1100,
    transportModes: MIXED,
  },
};

export const DEPARTMENTS = Object.keys(DEPARTMENT_LOGISTICS) as Department[];

export function referenceDistance(department: Department): number {
  const config = DEPARTMENT_LOGISTICS[department];
  return Math.round((config.minDistanceKm + config.maxDistanceKm) / 2);
}
