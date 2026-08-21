import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Database } from "lucide-react";
import type { Order } from "@/types";
import { AppLayout } from "@/layouts/AppLayout";
import { LoadingState } from "@/components/common/States";
import { OrdersTable } from "@/components/orders/OrdersTable";
import { OrderDetails } from "@/components/orders/OrderDetails";

// ✅ CAMBIO AQUÍ: Importamos desde el nuevo módulo modularizado
import { getOrders } from "@/services/orders";

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
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });
  
  const [selected, setSelected] = useState<Order | null>(null);

  // ✅ Añadimos manejo de error por si FastAPI está apagado
  if (isError) {
    return (
      <AppLayout title="Pedidos" subtitle="Error de conexión">
        <div className="p-6 text-red-500">
          Ocurrió un error al cargar los pedidos desde la base de datos: {error.message}
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Pedidos"
      subtitle="Consulta analítica de pedidos provenientes de la fuente externa"
    >
      <div className="panel flex items-center gap-3 p-4 text-xs text-muted-foreground">
        <Database className="size-4 text-primary" />
        Datos sincronizados desde la base de datos SQLite de TecnoMarket. Esta vista no crea ni modifica pedidos.
      </div>

      {isLoading || !data ? (
        <LoadingState label="Cargando pedidos históricos desde la base de datos…" />
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