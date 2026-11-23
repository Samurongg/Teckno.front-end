import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/layouts/AppLayout";
import { API_BASE_URL } from "@/services/api";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Configuración — TecnoMarket Analytics" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <AppLayout title="Configuración" subtitle="Información de conexión y criterios de riesgo">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="panel space-y-4 p-5">
          <h2 className="text-sm font-semibold">Conexión con el backend</h2>
          <p className="text-sm">
            API: <span className="break-all">{API_BASE_URL}</span>
          </p>
          <p className="text-xs text-muted-foreground">
            La dirección se configura mediante VITE_API_BASE_URL al iniciar la aplicación. Si la API
            no está disponible, se mostrará un error de conexión.
          </p>
        </div>
        <div className="panel space-y-4 p-5">
          <h2 className="text-sm font-semibold">Niveles de riesgo</h2>
          <p className="text-sm">Alto: desde 70 %. Medio: desde 35 %. Bajo: menos de 35 %.</p>
          <p className="text-xs text-muted-foreground">
            Estos niveles los determina el backend. Las alertas y el reentrenamiento automático no
            están configurados desde esta pantalla.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
