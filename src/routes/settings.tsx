import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/layouts/AppLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Configuración — TecnoMarket Analytics" },
      {
        name: "description",
        content:
          "Parámetros de conexión con la API, umbrales de riesgo y alertas de la plataforma.",
      },
      { property: "og:title", content: "Configuración — TecnoMarket Analytics" },
      {
        property: "og:description",
        content: "Ajusta la fuente de datos y los umbrales del modelo.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <AppLayout
      title="Configuración"
      subtitle="Fuente de datos, umbrales del modelo y notificaciones"
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="panel space-y-4 p-5">
          <h2 className="text-sm font-semibold">Conexión con el backend</h2>
          <div className="space-y-1.5">
            <Label className="text-xs">URL base de la API (FastAPI)</Label>
            <Input defaultValue="http://localhost:8000" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Endpoint de predicción</Label>
            <Input defaultValue="/api/predict" />
          </div>
          <p className="text-xs text-muted-foreground">
            Mientras no exista backend, la plataforma opera con datos mock desde
            la capa de servicios.
          </p>
        </div>

        <div className="panel space-y-4 p-5">
          <h2 className="text-sm font-semibold">Umbrales y alertas</h2>
          <div className="space-y-1.5">
            <Label className="text-xs">Umbral de riesgo alto (%)</Label>
            <Input type="number" defaultValue={66} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Umbral de riesgo medio (%)</Label>
            <Input type="number" defaultValue={35} />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="text-sm font-medium">Alertas de riesgo alto</p>
              <p className="text-xs text-muted-foreground">
                Notificar al equipo de operaciones
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="text-sm font-medium">Reentrenamiento semanal</p>
              <p className="text-xs text-muted-foreground">
                Programado los domingos 04:00 UTC
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
