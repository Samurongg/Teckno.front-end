import type { Order } from "@/types";
import { RiskBadge, StatusBadge } from "@/components/common/RiskBadge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-3">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}

export function OrderDetails({
  order,
  onOpenChange,
}: {
  order: Order | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={!!order} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        {order ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <span className="font-mono">{order.id}</span>
                <StatusBadge status={order.status} />
                <RiskBadge level={order.risk} />
              </DialogTitle>
              <DialogDescription>
                Pedido importado desde el sistema externo de TecnoMarket ·{" "}
                {order.date}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Row label="Región" value={order.region} />
              <Row label="Tipo de envío" value={order.shippingType} />
              <Row label="Prioridad" value={order.priority} />
              <Row label="Distancia" value={`${order.distanceKm} km`} />
              <Row label="Preparación" value={`${order.prepTimeH} h`} />
              <Row label="Productos" value={`${order.items} ítems`} />
              <Row label="Peso" value={`${order.weightKg} kg`} />
              <Row label="Carga logística" value={`${order.logisticLoad}%`} />
              <Row label="Score de riesgo" value={`${order.riskScore}/100`} />
            </div>

            <div className="rounded-lg border border-border p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Probabilidad estimada de retraso
                </span>
                <span className="font-semibold">{order.riskScore}%</span>
              </div>
              <Progress value={order.riskScore} className="mt-3" />
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
