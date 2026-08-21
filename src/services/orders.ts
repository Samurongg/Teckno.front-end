import { request } from "./api";

export async function getOrders(): Promise<any[]> {
  const response = await request<{ data: any[] }>("/orders?page_size=5000");
  
  // Normalizamos los campos en ambos formatos (snake_case y camelCase) para que OrdersTable no falle
  return (response.data || []).map((o) => ({
    ...o,
    id: o.order_id,
    orderId: o.order_id,
    date: o.fecha_pedido,
    shippingType: o.tipo_envio,
    distanceKm: o.distancia_km,
    prepTimeH: o.tiempo_preparacion_horas,
    itemCount: o.cantidad_productos,
    weightKg: o.peso_kg,
    logisticLoad: o.carga_logistica,
    dayOfWeek: o.dia_semana,
    isDelayed: o.entrega_tardia === 1,
    status: o.entrega_tardia === 1 ? "Tardío" : "A tiempo",
  }));
}

export async function getOrderById(orderId: string): Promise<any> {
  return request<any>(`/orders/${orderId}`);
}