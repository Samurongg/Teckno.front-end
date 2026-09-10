import { useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import type { Department, PredictionInput, Priority, ShippingType, TransportMode } from "@/types";
import { PRIORITIES, SHIPPING_TYPES, WEEKDAYS } from "@/lib/mock-data";
import { DEPARTMENTS, DEPARTMENT_LOGISTICS, referenceDistance } from "@/lib/peru-logistics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function estimatedHours(distanceKm: number, shippingType: ShippingType): number {
  if (shippingType === "Mismo Día") return 24;
  if (shippingType === "Express") return Math.min(144, (Math.ceil(distanceKm / 550) + 1) * 24);
  return Math.min(240, (Math.ceil(distanceKm / 320) + 2) * 24);
}

const DEFAULT_DEPARTMENT: Department = "Arequipa";
const DEFAULT_DISTANCE = referenceDistance(DEFAULT_DEPARTMENT);
const DEFAULTS: PredictionInput = {
  shippingType: "Estándar",
  distanceKm: DEFAULT_DISTANCE,
  estimatedTimeH: estimatedHours(DEFAULT_DISTANCE, "Estándar"),
  prepTimeH: 6,
  items: 4,
  weightKg: 8,
  department: DEFAULT_DEPARTMENT,
  transportMode: "Terrestre",
  priority: "Media",
  weekday: "Miércoles",
  logisticLoad: 65,
};

export function PredictionForm({
  onSubmit,
  loading,
}: {
  onSubmit: (input: PredictionInput) => void;
  loading: boolean;
}) {
  const [form, setForm] = useState<PredictionInput>(DEFAULTS);
  const logistics = DEPARTMENT_LOGISTICS[form.department];

  const set = <K extends keyof PredictionInput>(key: K, value: PredictionInput[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const changeDepartment = (department: Department) => {
    const config = DEPARTMENT_LOGISTICS[department];
    const distanceKm = referenceDistance(department);
    const shippingType =
      config.maxDistanceKm <= 180
        ? form.shippingType
        : form.shippingType === "Mismo Día"
          ? "Estándar"
          : form.shippingType;
    setForm((current) => ({
      ...current,
      department,
      distanceKm,
      shippingType,
      estimatedTimeH: estimatedHours(distanceKm, shippingType),
      transportMode: config.transportModes[0],
    }));
  };

  const changeShipping = (shippingType: ShippingType) =>
    setForm((current) => ({
      ...current,
      shippingType,
      estimatedTimeH: estimatedHours(current.distanceKm, shippingType),
    }));

  const num = (key: keyof PredictionInput, label: string, step = 1) => (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Input
        type="number"
        step={step}
        min={key === "estimatedTimeH" || key === "items" ? 1 : 0.1}
        value={form[key] as number}
        onChange={(event) => set(key, Number(event.target.value) as never)}
      />
    </div>
  );

  const shippingOptions = SHIPPING_TYPES.filter(
    (shipping) => shipping !== "Mismo Día" || logistics.maxDistanceKm <= 180,
  );

  return (
    <form
      className="panel space-y-5 p-5"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(form);
      }}
    >
      <div>
        <h2 className="text-sm font-semibold">Características del pedido</h2>
        <p className="text-xs text-muted-foreground">
          Centro operativo: Lima. La zona y la distancia se derivan del destino nacional.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs">Departamento de destino</Label>
          <Select
            value={form.department}
            onValueChange={(value) => changeDepartment(value as Department)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DEPARTMENTS.map((department) => (
                <SelectItem key={department} value={department}>
                  {department}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Zona logística</Label>
          <Input value={logistics.zone} readOnly aria-readonly="true" />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Modo de transporte</Label>
          <Select
            value={form.transportMode}
            onValueChange={(value) => set("transportMode", value as TransportMode)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {logistics.transportModes.map((mode) => (
                <SelectItem key={mode} value={mode}>
                  {mode}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Tipo de envío</Label>
          <Select
            value={form.shippingType}
            onValueChange={(value) => changeShipping(value as ShippingType)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {shippingOptions.map((shipping) => (
                <SelectItem key={shipping} value={shipping}>
                  {shipping}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Distancia logística desde Lima (km)</Label>
          <Input
            type="number"
            min={logistics.minDistanceKm}
            max={logistics.maxDistanceKm}
            step={1}
            value={form.distanceKm}
            onChange={(event) => set("distanceKm", Number(event.target.value))}
          />
          <p className="text-[11px] text-muted-foreground">
            Referencia para {form.department}: {logistics.minDistanceKm}–{logistics.maxDistanceKm}{" "}
            km.
          </p>
        </div>

        {num("estimatedTimeH", "Tiempo estimado (h)")}
        {num("prepTimeH", "Tiempo de preparación (h)", 0.5)}
        {num("items", "Cantidad de productos")}
        {num("weightKg", "Peso del pedido (kg)", 0.1)}

        <div className="space-y-1.5">
          <Label className="text-xs">Prioridad</Label>
          <Select
            value={form.priority}
            onValueChange={(value) => set("priority", value as Priority)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRIORITIES.map((priority) => (
                <SelectItem key={priority} value={priority}>
                  {priority}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Día de la semana</Label>
          <Select value={form.weekday} onValueChange={(value) => set("weekday", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {WEEKDAYS.map((day) => (
                <SelectItem key={day} value={day}>
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Carga logística</Label>
            <span className="text-xs font-medium text-primary">{form.logisticLoad}%</span>
          </div>
          <Slider
            value={[form.logisticLoad]}
            min={0}
            max={100}
            step={1}
            onValueChange={([value]) => set("logisticLoad", value ?? 0)}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={loading}>
          <Play className="size-4" />
          {loading ? "Procesando…" : "Realizar predicción"}
        </Button>
        <Button type="button" variant="outline" onClick={() => setForm(DEFAULTS)}>
          <RotateCcw className="size-4" /> Restablecer
        </Button>
      </div>
    </form>
  );
}
