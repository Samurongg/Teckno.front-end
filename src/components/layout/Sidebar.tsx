import { Link } from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  Boxes,
  BrainCircuit,
  LayoutDashboard,
  Settings,
  User,
} from "lucide-react";

const mainNav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/orders", label: "Pedidos", icon: Boxes },
  { to: "/prediction", label: "Predicción", icon: Activity },
  { to: "/analytics", label: "Analítica", icon: BarChart3 },
  { to: "/model", label: "Modelo ML", icon: BrainCircuit },
] as const;

const bottomNav = [
  { to: "/settings", label: "Configuración", icon: Settings },
  { to: "/profile", label: "Perfil", icon: User },
] as const;

const itemBase =
  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";
const itemActive =
  "bg-sidebar-accent text-sidebar-primary border-l-2 border-sidebar-primary";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex items-center gap-3 px-5 py-6">
        <div className="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <BrainCircuit className="size-5" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold">TecnoMarket</p>
          <p className="text-xs text-muted-foreground">Analytics Platform</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Plataforma
        </p>
        {mainNav.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={itemBase}
            activeProps={{ className: `${itemBase} ${itemActive}` }}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="flex flex-col gap-1 border-t border-sidebar-border px-3 py-4">
        {bottomNav.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={itemBase}
            activeProps={{ className: `${itemBase} ${itemActive}` }}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        ))}
        <div className="mt-3 rounded-lg border border-sidebar-border bg-sidebar-accent/40 p-3">
          <p className="text-xs font-medium">Modelo v2.4.1</p>
          <p className="text-xs text-muted-foreground">
            ROC-AUC 0.947 · activo
          </p>
        </div>
      </div>
    </aside>
  );
}
