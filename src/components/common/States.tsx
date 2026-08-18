import { Inbox, Loader2 } from "lucide-react";

export function LoadingState({ label = "Cargando datos…" }: { label?: string }) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 text-muted-foreground">
      <Loader2 className="size-6 animate-spin text-primary" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function EmptyState({
  title = "Sin resultados",
  description = "Ajusta los filtros para ver más pedidos.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center gap-2 text-center">
      <div className="rounded-full bg-muted p-3 text-muted-foreground">
        <Inbox className="size-5" />
      </div>
      <p className="text-sm font-medium">{title}</p>
      <p className="max-w-xs text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
