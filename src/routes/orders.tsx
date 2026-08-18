import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Database } from "lucide-react";
import type { Order } from "@/types";
import { AppLayout } from "@/layouts/AppLayout";
import { LoadingState } from "@/components/common/States";
import { OrdersTable } from "@/components/orders/OrdersTable";
import { OrderDetails } from "@/components/orders/OrderDetails";
import { getOrders } from "@/services/api";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "Pedidos históricos — TecnoMarket Analytics" },
      {
        name: "description",
        content:
          "Consulta, filtra y analiza los pedidos históricos importados desde el sistema externo de TecnoMarket.",
      },
      { property: "og:title", content: "Pedidos — TecnoMarket Analytics" },
      {
        property: "og:description",
        content: "Exploración analítica de pedidos históricos y su riesgo de retraso.",
      },
    ],
  }),
  component: OrdersPage,
});

function OrdersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });
  const [selected, setSelected] = useState<Order | null>(null);

  return (
    <AppLayout
      title="Pedidos"
      subtitle="Consulta analítica de pedidos provenientes de la fuente externa"
    >
      <div className="panel flex items-center gap-3 p-4 text-xs text-muted-foreground">
        <Database className="size-4 text-primary" />
        Datos de solo lectura sincronizados desde el sistema de pedidos de
        TecnoMarket. Esta vista no crea ni modifica pedidos.
      </div>

      {isLoading || !data ? (
        <LoadingState label="Cargando pedidos históricos…" />
      ) : (
        <OrdersTable orders={data} onSelect={setSelected} />
      )}

      <OrderDetails
        order={selected}
        onOpenChange={(open) => !open && setSelected(null)}
      />
    </AppLayout>
  );
}
