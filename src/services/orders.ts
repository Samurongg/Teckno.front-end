import { request } from "./api";

export { getOrders } from "./api";

export async function getOrderById(orderId: string): Promise<unknown> {
  return request<unknown>(`/orders/${orderId}`);
}
