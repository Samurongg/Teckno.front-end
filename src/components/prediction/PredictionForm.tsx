import { useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import type { PredictionInput, Priority, Region, ShippingType } from "@/types";
import { PRIORITIES, REGIONS, SHIPPING_TYPES, WEEKDAYS } from "@/lib/mock-data";
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

const DEFAULTS: PredictionInput = {
  shippingType: "Estándar",
  distanceKm: 420,
  estimatedTimeH: 48,
  prepTimeH: 6,
  items: 4,
  weightKg: 8,
  region: "Arequipa",
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

  const set = <K extends keyof PredictionInput>(
    key: K,
    value: PredictionInput[K],
  ) => setForm((f) => ({ ...f, [key]: value }));

  const num = (key: keyof PredictionInput, label: string, step = 1) => (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Input
        type="number"
        step={step}
        min={0}
        value={form[key] as number}
        onChange={(e) => set(key, Number(e.target.value) as never)}
      />
    </div>
  );

  return (
    <form
      className="panel space-y-5 p-5"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
    >
      <div>
        <h2 className="text-sm font-semibold">Características del pedido</h2>
        <p className="text-xs text-muted-foreground">
          Los valores se envían al modelo mediante POST /api/predict.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs">Tipo de envío</Label>
          <Select
            value={form.shippingType}
            onValueChange={(v) => set("shippingType", v as ShippingType)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SHIPPING_TYPES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Región</Label>
          <Select
            value={form.region}
            onValueChange={(v) => set("region", v as Region)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {REGIONS.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {num("distanceKm", "Distancia (km)")}
        {num("estimatedTimeH", "Tiempo estimado (h)")}
        {num("prepTimeH", "Tiempo de preparación (h)", 0.5)}
        {num("items", "Cantidad de productos")}
        {num("weightKg", "Peso del pedido (kg)", 0.1)}

        <div className="space-y-1.5">
          <Label className="text-xs">Prioridad</Label>
          <Select
            value={form.priority}
            onValueChange={(v) => set("priority", v as Priority)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRIORITIES.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Día de la semana</Label>
          <Select
            value={form.weekday}
            onValueChange={(v) => set("weekday", v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {WEEKDAYS.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Carga logística</Label>
            <span className="text-xs font-medium text-primary">
              {form.logisticLoad}%
            </span>
          </div>
          <Slider
            value={[form.logisticLoad]}
            min={0}
            max={100}
            step={1}
            onValueChange={([v]) => set("logisticLoad", v ?? 0)}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={loading}>
          <Play className="size-4" />
          {loading ? "Procesando…" : "Realizar predicción"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setForm(DEFAULTS)}
        >
          <RotateCcw className="size-4" /> Restablecer
        </Button>
      </div>
    </form>
  );
}
