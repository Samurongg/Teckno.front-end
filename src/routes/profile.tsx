import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/layouts/AppLayout";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Perfil de usuario — TecnoMarket Analytics" },
      {
        name: "description",
        content:
          "Datos del analista, rol asignado y actividad reciente dentro de la plataforma.",
      },
      { property: "og:title", content: "Perfil — TecnoMarket Analytics" },
      {
        property: "og:description",
        content: "Rol, permisos y actividad del usuario en la plataforma analítica.",
      },
    ],
  }),
  component: ProfilePage,
});

const activity = [
  { label: "Predicción ejecutada", detail: "Pedido simulado · riesgo ALTO", time: "Hace 12 min" },
  { label: "Filtro guardado", detail: "Cusco · Envío estándar", time: "Hace 2 h" },
  { label: "Reporte exportado", detail: "Retrasos por región · Julio", time: "Ayer" },
];

function ProfilePage() {
  return (
    <AppLayout title="Perfil" subtitle="Información de la cuenta y actividad">
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="panel p-6 lg:col-span-1">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-primary text-xl font-semibold text-primary-foreground">
            AC
          </div>
          <p className="mt-4 text-lg font-semibold">Adriano Caycho</p>
          <p className="text-xs text-muted-foreground">
            Data Analyst · Operaciones y Logística
          </p>
          <dl className="mt-5 space-y-3 text-xs">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Rol</dt>
              <dd className="font-medium">Analista senior</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Equipo</dt>
              <dd className="font-medium">Business Intelligence</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Permisos</dt>
              <dd className="font-medium">Lectura + predicción</dd>
            </div>
          </dl>
        </div>

        <div className="panel p-6 lg:col-span-2">
          <h2 className="text-sm font-semibold">Actividad reciente</h2>
          <ul className="mt-4 space-y-3">
            {activity.map((a) => (
              <li
                key={a.label + a.time}
                className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3"
              >
                <div>
                  <p className="text-sm font-medium">{a.label}</p>
                  <p className="text-xs text-muted-foreground">{a.detail}</p>
                </div>
                <span className="text-xs text-muted-foreground">{a.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AppLayout>
  );
}
